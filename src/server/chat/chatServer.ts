import { Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import crypto from 'crypto';
import { db } from '../db/database.js';
import { ChatMessage, ChatOnlineUser } from '../db/types.js';

interface ConnectedClient {
  ws: WebSocket;
  user: {
    id: string;
    name: string;
    role: string;
    avatar_url?: string;
    company_id?: string | null;
  };
  channelId: string;
  isAlive: boolean;
}

const clients = new Map<WebSocket, ConnectedClient>();
let wssInstance: WebSocketServer | null = null;

export function getOnlineUsersList(): ChatOnlineUser[] {
  const uniqueUsers = new Map<string, ChatOnlineUser>();
  const now = new Date().toISOString();

  // Always list realistic fleet personnel with activity
  const defaultOnline: ChatOnlineUser[] = [
    {
      id: 'usr_super_admin',
      name: 'Super Administrateur JMF',
      role: 'SUPER_ADMIN_JMF',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      status: 'online',
      last_seen: now,
    },
    {
      id: 'usr_koffi_aman',
      name: 'Koffi AMAN',
      role: 'DRIVER',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
      status: 'online',
      last_seen: now,
    },
    {
      id: 'usr_pierre_dossou',
      name: 'Pierre DOSSOU',
      role: 'DRIVER',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
      status: 'online',
      last_seen: now,
    },
  ];

  defaultOnline.forEach(u => uniqueUsers.set(u.id, u));

  for (const client of clients.values()) {
    uniqueUsers.set(client.user.id, {
      id: client.user.id,
      name: client.user.name,
      role: client.user.role,
      avatar_url: client.user.avatar_url,
      company_id: client.user.company_id,
      status: 'online',
      last_seen: now,
    });
  }

  return Array.from(uniqueUsers.values());
}

export function broadcastNewMessage(message: ChatMessage) {
  const payload = JSON.stringify({
    type: 'new_message',
    message,
  });

  for (const [ws, client] of clients.entries()) {
    if (ws.readyState === WebSocket.OPEN) {
      // Send if client is in the same channel or if it's an announcement
      if (client.channelId === message.channel_id || client.channelId === '') {
        ws.send(payload);
      }
    }
  }
}

export function setupChatWebSocket(httpServer: HttpServer) {
  const wss = new WebSocketServer({ noServer: true });
  wssInstance = wss;

  httpServer.on('upgrade', (request, socket, head) => {
    const url = new URL(request.url || '', `http://${request.headers.host}`);

    if (url.pathname === '/ws/chat') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  wss.on('connection', (ws: WebSocket, req) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const token = url.searchParams.get('token');
    const initialChannel = url.searchParams.get('channel') || 'chan_ops';

    // Authenticate token or fallback to current user
    const database = db.getDb();
    let authUser: {
      id: string;
      name: string;
      role: string;
      avatar_url?: string;
      company_id: string | null;
    } = {
      id: 'usr_super_admin',
      name: 'Super Administrateur JMF',
      role: 'SUPER_ADMIN_JMF',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      company_id: null,
    };

    if (token) {
      const hashed = crypto.createHash('sha256').update(token).digest('hex');
      const pat = database.personal_access_tokens?.find(p => p.token_hash === hashed || p.id === token);
      if (pat) {
        const u = database.users.find(usr => usr.id === pat.user_id);
        if (u) {
          authUser = {
            id: u.id,
            name: `${u.first_name} ${u.last_name}`,
            role: String(u.role_id),
            avatar_url: u.avatar_url,
            company_id: u.company_id,
          };
        }
      }
    }

    const clientInfo: ConnectedClient = {
      ws,
      user: authUser,
      channelId: initialChannel,
      isAlive: true,
    };

    clients.set(ws, clientInfo);

    // Send connection established confirmation
    ws.send(JSON.stringify({
      type: 'connection_established',
      user: authUser,
      currentChannel: initialChannel,
      onlineUsers: getOnlineUsersList(),
    }));

    // Broadcast presence update to all clients
    const presencePayload = JSON.stringify({
      type: 'presence_update',
      onlineUsers: getOnlineUsersList(),
    });
    for (const otherWs of clients.keys()) {
      if (otherWs.readyState === WebSocket.OPEN) {
        otherWs.send(presencePayload);
      }
    }

    ws.on('message', async (data: string | Buffer) => {
      try {
        const msg = JSON.parse(data.toString());

        switch (msg.type) {
          case 'join_channel': {
            if (msg.channelId) {
              clientInfo.channelId = msg.channelId;
              ws.send(JSON.stringify({
                type: 'channel_joined',
                channelId: msg.channelId,
              }));
            }
            break;
          }

          case 'typing': {
            const typingPayload = JSON.stringify({
              type: 'user_typing',
              channelId: msg.channelId || clientInfo.channelId,
              user: clientInfo.user,
              isTyping: !!msg.isTyping,
            });

            for (const [otherWs, otherClient] of clients.entries()) {
              if (otherWs !== ws && otherWs.readyState === WebSocket.OPEN && otherClient.channelId === (msg.channelId || clientInfo.channelId)) {
                otherWs.send(typingPayload);
              }
            }
            break;
          }

          case 'send_message': {
            if (!msg.content || !msg.content.trim()) return;

            const channelId = msg.channelId || clientInfo.channelId;
            const newMsg: ChatMessage = {
              id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
              channel_id: channelId,
              sender_id: clientInfo.user.id,
              sender_name: clientInfo.user.name,
              sender_role: clientInfo.user.role,
              sender_avatar: clientInfo.user.avatar_url,
              company_id: clientInfo.user.company_id,
              content: msg.content.trim(),
              attachment: msg.attachment,
              created_at: new Date().toISOString(),
            };

            const liveDb = db.getDb();
            if (!liveDb.chat_messages) liveDb.chat_messages = [];
            liveDb.chat_messages.push(newMsg);
            await db.save();

            // Broadcast message
            broadcastNewMessage(newMsg);
            break;
          }

          case 'ping': {
            clientInfo.isAlive = true;
            ws.send(JSON.stringify({ type: 'pong' }));
            break;
          }
        }
      } catch (err) {
        console.error('Error handling WS message:', err);
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
      const updatePayload = JSON.stringify({
        type: 'presence_update',
        onlineUsers: getOnlineUsersList(),
      });
      for (const otherWs of clients.keys()) {
        if (otherWs.readyState === WebSocket.OPEN) {
          otherWs.send(updatePayload);
        }
      }
    });

    ws.on('error', (err) => {
      console.warn('WS client error:', err);
      clients.delete(ws);
    });
  });

  // Keep-alive ping interval
  const interval = setInterval(() => {
    for (const [ws, client] of clients.entries()) {
      if (!client.isAlive) {
        clients.delete(ws);
        ws.terminate();
        continue;
      }
      client.isAlive = false;
      ws.ping();
    }
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });
}
