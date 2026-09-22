import { useState, useEffect, useRef, useCallback } from 'react';
import { ApiClient } from '../services/api.js';
import { ChatChannel, ChatMessage, ChatAttachment, ChatOnlineUser, UserProfile } from '../types/index.js';

export interface UseChatReturn {
  channels: ChatChannel[];
  directContacts: any[];
  activeChannelId: string;
  activeChannel: ChatChannel | undefined;
  messages: ChatMessage[];
  onlineUsers: ChatOnlineUser[];
  typingUsers: string[];
  isConnected: boolean;
  isLoading: boolean;
  resources: { vehicles: any[]; convoys: any[] };
  switchChannel: (channelId: string) => void;
  sendMessage: (content: string, attachment?: ChatAttachment) => Promise<void>;
  sendTyping: (isTyping: boolean) => void;
  createChannel: (name: string, description?: string) => Promise<ChatChannel>;
  startDirectConversation: (contact: { id: string; name: string; avatar_url?: string; role?: string }) => void;
  refreshChannels: () => Promise<void>;
}

export function useChat(currentUser: UserProfile | null): UseChatReturn {
  const [channels, setChannels] = useState<ChatChannel[]>([]);
  const [directContacts, setDirectContacts] = useState<any[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string>('chan_ops');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<ChatOnlineUser[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [resources, setResources] = useState<{ vehicles: any[]; convoys: any[] }>({ vehicles: [], convoys: [] });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);
  const typingTimeoutRef = useRef<any>(null);
  const activeChannelIdRef = useRef<string>(activeChannelId);

  activeChannelIdRef.current = activeChannelId;

  // Load initial channels, contacts and resources
  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [channelsData, resourcesData, onlineData] = await Promise.all([
        ApiClient.getChatChannels().catch(() => ({ channels: [], direct_contacts: [] })),
        ApiClient.getChatResources().catch(() => ({ vehicles: [], convoys: [] })),
        ApiClient.getChatOnlineUsers().catch(() => []),
      ]);

      setChannels(channelsData.channels || []);
      setDirectContacts(channelsData.direct_contacts || []);
      setResources(resourcesData);
      if (onlineData.length > 0) {
        setOnlineUsers(onlineData);
      }
    } catch (err) {
      console.error('Failed to load chat data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load messages for the current active channel
  const loadChannelMessages = useCallback(async (channelId: string) => {
    if (!channelId) return;
    try {
      const msgs = await ApiClient.getChatMessages(channelId);
      setMessages(msgs || []);
    } catch (err) {
      console.warn(`Notice loading messages for ${channelId}:`, err);
    }
  }, []);

  // Setup and maintain WebSocket connection
  const connectWebSocket = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const token = ApiClient.getToken() || '';
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/chat?token=${encodeURIComponent(token)}&channel=${encodeURIComponent(activeChannelIdRef.current)}`;

    try {
      const socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        setIsConnected(true);
        // Switch to current channel in socket
        socket.send(JSON.stringify({
          type: 'join_channel',
          channelId: activeChannelIdRef.current,
        }));
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case 'connection_established': {
              if (data.onlineUsers && Array.isArray(data.onlineUsers)) {
                setOnlineUsers(data.onlineUsers);
              }
              break;
            }

            case 'presence_update': {
              if (data.onlineUsers && Array.isArray(data.onlineUsers)) {
                setOnlineUsers(data.onlineUsers);
              }
              break;
            }

            case 'new_message': {
              const incomingMsg: ChatMessage = data.message;
              if (incomingMsg.channel_id === activeChannelIdRef.current) {
                // Idempotent insertion by ID
                setMessages(prev => {
                  if (prev.some(m => m.id === incomingMsg.id)) {
                    return prev;
                  }
                  return [...prev, incomingMsg];
                });
              }

              // Update last message in channels list
              setChannels(prev => prev.map(c => {
                if (c.id === incomingMsg.channel_id) {
                  return {
                    ...c,
                    last_message: incomingMsg,
                    unread_count: c.id === activeChannelIdRef.current ? 0 : (c.unread_count || 0) + 1,
                  };
                }
                return c;
              }));
              break;
            }

            case 'user_typing': {
              if (data.channelId === activeChannelIdRef.current && data.user?.id !== currentUser?.id) {
                const name = data.user?.name || 'Un interlocuteur';
                if (data.isTyping) {
                  setTypingUsers(prev => prev.includes(name) ? prev : [...prev, name]);
                } else {
                  setTypingUsers(prev => prev.filter(u => u !== name));
                }
              }
              break;
            }

            case 'pong':
              break;
          }
        } catch (e) {
          console.warn('Malformed WS message received:', e);
        }
      };

      socket.onclose = () => {
        setIsConnected(false);
        wsRef.current = null;
        // Auto-reconnect with exponential backoff / jitter
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 3000);
      };

      socket.onerror = () => {
        setIsConnected(false);
      };
    } catch (e) {
      console.warn('WS initialization error:', e);
    }
  }, [currentUser?.id]);

  // Initial mount
  useEffect(() => {
    loadInitialData();
    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [loadInitialData, connectWebSocket]);

  // When active channel changes or user logs in, load messages & update socket room
  useEffect(() => {
    loadChannelMessages(activeChannelId);
    setTypingUsers([]);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'join_channel',
        channelId: activeChannelId,
      }));
    }
  }, [activeChannelId, currentUser?.id, loadChannelMessages]);

  const switchChannel = useCallback((channelId: string) => {
    setActiveChannelId(channelId);
    // Reset unread count for this channel
    setChannels(prev => prev.map(c => c.id === channelId ? { ...c, unread_count: 0 } : c));
  }, []);

  const sendTyping = useCallback((isTyping: boolean) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'typing',
        channelId: activeChannelIdRef.current,
        isTyping,
      }));
    }
  }, []);

  const sendMessage = useCallback(async (content: string, attachment?: ChatAttachment) => {
    if (!content.trim()) return;

    const channelId = activeChannelIdRef.current;
    const tempId = `temp_${Date.now()}`;
    const optimisticMsg: ChatMessage = {
      id: tempId,
      channel_id: channelId,
      sender_id: currentUser?.id || 'usr_current',
      sender_name: currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'Moi',
      sender_role: currentUser?.role || 'SUPER_ADMIN_JMF',
      sender_avatar: currentUser?.avatar_url,
      company_id: currentUser?.company_id || null,
      content: content.trim(),
      attachment,
      created_at: new Date().toISOString(),
    };

    // Optimistic UI update
    setMessages(prev => [...prev, optimisticMsg]);

    // Send via WebSocket if open, else fallback to REST
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'send_message',
        channelId,
        content: content.trim(),
        attachment,
      }));
    } else {
      try {
        const savedMsg = await ApiClient.sendChatMessage({
          channel_id: channelId,
          content,
          attachment,
        });
        // Reconcile optimistic message
        setMessages(prev => prev.map(m => m.id === tempId ? savedMsg : m));
      } catch (err) {
        console.error('Failed to send message via REST:', err);
      }
    }
  }, [currentUser]);

  const createChannel = useCallback(async (name: string, description?: string) => {
    const newChan = await ApiClient.createChatChannel({ name, description });
    setChannels(prev => [...prev, newChan]);
    setActiveChannelId(newChan.id);
    return newChan;
  }, []);

  const startDirectConversation = useCallback((contact: { id: string; name: string; avatar_url?: string; role?: string }) => {
    const directId = contact.id.startsWith('direct_') ? contact.id : `direct_${contact.id}`;
    
    // Check if channel already in channels
    const existing = channels.find(c => c.id === directId);
    if (!existing) {
      const directChannel: ChatChannel = {
        id: directId,
        name: contact.name,
        description: `Discussion directe avec ${contact.name} (${contact.role || 'Personnel'})`,
        type: 'direct',
        unread_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setChannels(prev => [...prev, directChannel]);
    }

    setActiveChannelId(directId);
  }, [channels]);

  const activeChannel = channels.find(c => c.id === activeChannelId) || 
    directContacts.find(c => c.id === activeChannelId) ||
    {
      id: activeChannelId,
      name: activeChannelId.startsWith('direct_') ? 'Conversation Directe' : activeChannelId,
      type: (activeChannelId.startsWith('direct_') ? 'direct' : 'channel') as 'direct' | 'channel',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

  return {
    channels,
    directContacts,
    activeChannelId,
    activeChannel,
    messages,
    onlineUsers,
    typingUsers,
    isConnected,
    isLoading,
    resources,
    switchChannel,
    sendMessage,
    sendTyping,
    createChannel,
    startDirectConversation,
    refreshChannels: loadInitialData,
  };
}
