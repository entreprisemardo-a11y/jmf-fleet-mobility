import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Maximize2,
  ChevronDown,
  Hash,
  User,
} from 'lucide-react';
import { UseChatReturn } from '../../hooks/useChat.js';
import { UserProfile } from '../../types/index.js';

interface QuickChatDrawerProps {
  chat: UseChatReturn;
  currentUser: UserProfile | null;
  onOpenFullChat: () => void;
}

export const QuickChatDrawer: React.FC<QuickChatDrawerProps> = ({
  chat,
  currentUser,
  onOpenFullChat,
}) => {
  const {
    channels,
    activeChannelId,
    activeChannel,
    messages,
    isConnected,
    switchChannel,
    sendMessage,
  } = chat;

  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [showChannelDropdown, setShowChannelDropdown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const totalUnread = channels.reduce((acc, c) => acc + (c.unread_count || 0), 0);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const content = inputMessage.trim();
    setInputMessage('');
    await sendMessage(content);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group flex items-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 active:translate-y-0 font-bold text-xs"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            <span
              className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ring-2 ring-amber-500 ${
                isConnected ? 'bg-emerald-400' : 'bg-amber-300'
              }`}
            />
          </div>
          <span>Chat Opérations</span>

          {totalUnread > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-white text-amber-600">
              {totalUnread}
            </span>
          )}
        </button>
      )}

      {/* Floating Mini Chat Window */}
      {isOpen && (
        <div className="w-96 h-[480px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between flex-shrink-0">
            <div className="relative">
              <button
                onClick={() => setShowChannelDropdown(!showChannelDropdown)}
                className="flex items-center gap-1.5 text-xs font-black hover:text-amber-400 transition"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="truncate max-w-[180px]">
                  {activeChannel?.name || 'Canal'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {/* Channel switcher dropdown */}
              {showChannelDropdown && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Changer de canal
                  </div>
                  {channels.map((chan) => (
                    <button
                      key={chan.id}
                      onClick={() => {
                        switchChannel(chan.id);
                        setShowChannelDropdown(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 flex items-center justify-between font-semibold"
                    >
                      <span className="truncate">{chan.name}</span>
                      {chan.unread_count ? (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-amber-500 text-white font-bold">
                          {chan.unread_count}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenFullChat();
                }}
                title="Agrandir en plein écran"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Réduire"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mini Messages Feed */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50 text-xs">
            {messages.map((msg) => {
              const isMine =
                msg.sender_id === currentUser?.id ||
                msg.sender_name === `${currentUser?.first_name} ${currentUser?.last_name}` ||
                msg.id.startsWith('temp_');

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-slate-400 mb-0.5 px-1 font-semibold">
                    {msg.sender_name.split(' ')[0]}
                  </span>
                  <div
                    className={`p-2.5 rounded-2xl max-w-[85%] leading-relaxed ${
                      isMine
                        ? 'bg-amber-500 text-white rounded-tr-none font-medium'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    {msg.attachment && (
                      <div className="mt-1.5 p-1.5 bg-black/10 rounded-lg text-[10px]">
                        📎 {msg.attachment.title}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Mini Input */}
          <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Écrire un message..."
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white rounded-xl transition flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
