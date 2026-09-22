import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Paperclip,
  Hash,
  User,
  Plus,
  Search,
  Phone,
  Truck,
  Car,
  AlertTriangle,
  CheckCircle2,
  X,
  Users,
  Radio,
  FileText,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import { UseChatReturn } from '../../hooks/useChat.js';
import { ChatAttachment, UserProfile } from '../../types/index.js';

interface ChatViewProps {
  chat: UseChatReturn;
  currentUser: UserProfile | null;
  onNavigateVehicle?: (vehicleId: string) => void;
  onNavigateConvoy?: (convoyId: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  chat,
  currentUser,
  onNavigateVehicle,
  onNavigateConvoy,
}) => {
  const {
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
  } = chat;

  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<ChatAttachment | undefined>(undefined);
  const [showNewChannelModal, setShowNewChannelModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDesc, setNewChannelDesc] = useState('');
  const [showRightPanel, setShowRightPanel] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<any>(null);

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);

    // Send typing notification
    sendTyping(true);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      sendTyping(false);
    }, 2000);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() && !selectedAttachment) return;

    const content = inputMessage.trim() || `[Pièce jointe : ${selectedAttachment?.title}]`;
    const attachmentToSend = selectedAttachment;

    setInputMessage('');
    setSelectedAttachment(undefined);
    setShowAttachMenu(false);
    sendTyping(false);

    await sendMessage(content, attachmentToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCreateChannelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;
    await createChannel(newChannelName.trim(), newChannelDesc.trim());
    setNewChannelName('');
    setNewChannelDesc('');
    setShowNewChannelModal(false);
  };

  // Quick operational templates
  const quickTemplates = [
    {
      label: '⚠️ Signalement incident',
      text: 'Incident signalé sur route : véhicule immobilisé. Demande de prise en charge et assistance dépannage en cours.',
    },
    {
      label: '🚚 Mission démarrée',
      text: 'Prise en charge effectuée avec succès. Début du trajet de convoyage. Horodatage et kilométrage validés.',
    },
    {
      label: '⛽ Plein de carburant',
      text: 'Ravitaillement carburant effectué en station agréée. Bon de caisse conservé pour télétransmission.',
    },
    {
      label: '📍 Position confirmée',
      text: 'Point d’étape intermédiaire atteint. Conditions de circulation fluides, itinéraire conforme.',
    },
  ];

  // Filter channels and direct contacts
  const filteredChannels = channels.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContacts = directContacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isUserOnline = (userIdOrId: string) => {
    const cleanId = userIdOrId.replace('direct_', '');
    return onlineUsers.some(u => u.id === cleanId || u.id === userIdOrId);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-100 overflow-hidden">
      {/* 1. LEFT SIDEBAR: Channels & Direct Contacts */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
        {/* Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900 leading-tight">Messagerie & Dispatch</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  <span className="text-[11px] font-semibold text-slate-500">
                    {isConnected ? 'Connecté en direct' : 'Connexion...'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowNewChannelModal(true)}
              title="Créer un nouveau canal"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Search bar */}
          <div className="mt-3 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher canal ou contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {/* Public / Group Channels */}
          <div className="p-3">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center justify-between">
              <span>Canaux Opérations</span>
              <span className="text-slate-400 font-normal">{filteredChannels.length}</span>
            </div>

            <div className="space-y-1">
              {filteredChannels.map((chan) => {
                const isActive = activeChannelId === chan.id;
                const isUrgent = chan.id.includes('urgence');

                return (
                  <button
                    key={chan.id}
                    onClick={() => switchChannel(chan.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl transition flex items-start gap-2.5 ${
                      isActive
                        ? 'bg-amber-50 text-amber-950 font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isUrgent
                          ? 'bg-red-100 text-red-600'
                          : isActive
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isUrgent ? <AlertTriangle className="w-3.5 h-3.5" /> : <Hash className="w-3.5 h-3.5" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs truncate font-bold">{chan.name}</span>
                        {chan.unread_count ? (
                          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-500 text-white">
                            {chan.unread_count}
                          </span>
                        ) : null}
                      </div>
                      {chan.last_message ? (
                        <p className="text-[11px] text-slate-400 truncate mt-0.5 font-normal">
                          {chan.last_message.sender_name.split(' ')[0]}: {chan.last_message.content}
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-400 truncate mt-0.5 font-normal">
                          {chan.description}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Direct Contacts: Drivers & Staff */}
          <div className="p-3">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center justify-between">
              <span>Conducteurs & Équipe</span>
              <span className="text-slate-400 font-normal">{filteredContacts.length}</span>
            </div>

            <div className="space-y-1">
              {filteredContacts.map((contact) => {
                const isActive = activeChannelId === contact.id;
                const online = isUserOnline(contact.id);

                return (
                  <button
                    key={contact.id}
                    onClick={() => startDirectConversation(contact)}
                    className={`w-full text-left px-3 py-2 rounded-xl transition flex items-center gap-2.5 ${
                      isActive
                        ? 'bg-amber-50 text-amber-950 font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={contact.avatar_url}
                        alt={contact.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256';
                        }}
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                          online ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                        title={online ? 'En ligne' : 'Hors ligne'}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs truncate font-bold">{contact.name}</span>
                        {online && (
                          <span className="text-[10px] text-emerald-600 font-semibold">En ligne</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {contact.role === 'DRIVER' || contact.role === 'CONDUCTEUR'
                          ? 'Conducteur en mission'
                          : contact.description || contact.role}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. CENTER PANEL: Messages & Input */}
      <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
        {/* Channel Header */}
        <div className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold">
              {activeChannel?.type === 'direct' ? (
                <User className="w-5 h-5 text-amber-600" />
              ) : (
                <Hash className="w-5 h-5 text-amber-600" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-slate-900">
                  {activeChannel?.name || 'Canal de discussion'}
                </h1>
                {activeChannel?.type === 'direct' && isUserOnline(activeChannel.id) && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    En ligne
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 truncate max-w-md">
                {activeChannel?.description || 'Échanges en temps réel avec l’équipe de gestion'}
              </p>
            </div>
          </div>

          {/* Actions on active channel */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRightPanel(!showRightPanel)}
              className={`p-2 rounded-lg border transition ${
                showRightPanel
                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Informations du canal"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
              Chargement des messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Aucun message pour le moment</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Soyez le premier à envoyer un message ou une consigne opérationnelle dans ce canal.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine =
                msg.sender_id === currentUser?.id ||
                msg.sender_name === `${currentUser?.first_name} ${currentUser?.last_name}` ||
                msg.id.startsWith('temp_');

              const isDriver = msg.sender_role === 'DRIVER' || msg.sender_role === 'CONDUCTEUR';
              const isAdmin = msg.sender_role === 'SUPER_ADMIN_JMF' || msg.sender_role === 'COMPANY_ADMIN';

              const formattedTime = new Date(msg.created_at).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-2xl ${isMine ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <img
                    src={
                      msg.sender_avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
                    }
                    alt={msg.sender_name}
                    className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-slate-200 mt-0.5"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256';
                    }}
                  />

                  <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                    {/* Header info */}
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-xs font-bold text-slate-800">{msg.sender_name}</span>
                      <span
                        className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md ${
                          isAdmin
                            ? 'bg-amber-100 text-amber-800'
                            : isDriver
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isAdmin ? 'Superviseur' : isDriver ? 'Conducteur' : msg.sender_role}
                      </span>
                      <span className="text-[10px] text-slate-400">{formattedTime}</span>
                    </div>

                    {/* Bubble */}
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                        isMine
                          ? 'bg-amber-600 text-white rounded-tr-none'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap select-text">{msg.content}</p>

                      {/* Attachment Card if present */}
                      {msg.attachment && (
                        <div
                          className={`mt-2.5 p-3 rounded-xl border flex items-center gap-3 transition cursor-pointer ${
                            isMine
                              ? 'bg-amber-700/60 border-amber-500/40 text-white'
                              : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                          }`}
                          onClick={() => {
                            if (msg.attachment?.type === 'vehicle' && onNavigateVehicle) {
                              onNavigateVehicle(msg.attachment.reference_id);
                            } else if (msg.attachment?.type === 'convoy' && onNavigateConvoy) {
                              onNavigateConvoy(msg.attachment.reference_id);
                            }
                          }}
                        >
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isMine ? 'bg-white/20 text-white' : 'bg-amber-500/10 text-amber-600'
                            }`}
                          >
                            {msg.attachment.type === 'vehicle' ? (
                              <Car className="w-5 h-5" />
                            ) : msg.attachment.type === 'convoy' ? (
                              <Truck className="w-5 h-5" />
                            ) : (
                              <FileText className="w-5 h-5" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-xs truncate">{msg.attachment.title}</div>
                            {msg.attachment.details && (
                              <div
                                className={`text-[11px] truncate mt-0.5 ${
                                  isMine ? 'text-amber-100' : 'text-slate-500'
                                }`}
                              >
                                {msg.attachment.details}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Live Typing indicator */}
          {typingUsers.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic px-2 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>
                {typingUsers.join(', ')} {typingUsers.length === 1 ? 'est en train d’écrire...' : 'sont en train d’écrire...'}
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          {/* Quick operational template chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-2 scrollbar-none">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 flex-shrink-0 mr-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Modèles :
            </span>
            {quickTemplates.map((tpl, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setInputMessage(tpl.text)}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 hover:bg-amber-50 hover:text-amber-900 border border-slate-200 whitespace-nowrap transition"
              >
                {tpl.label}
              </button>
            ))}
          </div>

          {/* Selected Attachment Preview */}
          {selectedAttachment && (
            <div className="mb-2 p-2 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center gap-2 truncate">
                <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
                  {selectedAttachment.type === 'vehicle' ? <Car className="w-3.5 h-3.5" /> : <Truck className="w-3.5 h-3.5" />}
                </div>
                <span className="font-bold truncate">{selectedAttachment.title}</span>
                <span className="text-amber-700 text-[11px] truncate">({selectedAttachment.details})</span>
              </div>
              <button
                onClick={() => setSelectedAttachment(undefined)}
                className="p-1 hover:bg-amber-100 rounded-lg text-amber-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Attachment Selector Dropdown */}
          {showAttachMenu && (
            <div className="mb-2 p-3 bg-white border border-slate-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto divide-y divide-slate-100">
              <div className="pb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Rattacher un Véhicule du Parc
                </span>
                <div className="space-y-1">
                  {resources.vehicles.slice(0, 5).map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        setSelectedAttachment({
                          type: 'vehicle',
                          reference_id: v.id,
                          title: v.title,
                          details: v.subtitle,
                        });
                        setShowAttachMenu(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-xs hover:bg-slate-50 flex items-center justify-between"
                    >
                      <span className="font-semibold text-slate-800">{v.title}</span>
                      <span className="text-[10px] text-slate-400">{v.subtitle}</span>
                    </button>
                  ))}
                </div>
              </div>

              {resources.convoys.length > 0 && (
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Rattacher une Mission de Convoyage
                  </span>
                  <div className="space-y-1">
                    {resources.convoys.slice(0, 5).map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setSelectedAttachment({
                            type: 'convoy',
                            reference_id: c.id,
                            title: c.title,
                            details: c.subtitle,
                          });
                          setShowAttachMenu(false);
                        }}
                        className="w-full text-left px-2 py-1.5 rounded-lg text-xs hover:bg-slate-50 flex items-center justify-between"
                      >
                        <span className="font-semibold text-slate-800">{c.title}</span>
                        <span className="text-[10px] text-slate-400">{c.subtitle}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSend} className="flex items-end gap-2">
            <button
              type="button"
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className={`p-2.5 rounded-xl border transition ${
                showAttachMenu || selectedAttachment
                  ? 'bg-amber-50 border-amber-300 text-amber-600'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
              }`}
              title="Attacher un véhicule ou un dossier convoyage"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Rédiger un message (Entrée pour envoyer, Maj+Entrée pour saut de ligne)..."
                rows={1}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white resize-none max-h-32"
              />
            </div>

            <button
              type="submit"
              disabled={!inputMessage.trim() && !selectedAttachment}
              className="p-2.5 bg-amber-500 text-white rounded-xl hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm font-bold flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* 3. RIGHT SIDEBAR: Channel Details & Fast Actions (Toggleable) */}
      {showRightPanel && (
        <div className="w-72 bg-white border-l border-slate-200 flex flex-col flex-shrink-0 p-5 overflow-y-auto">
          <div className="text-center pb-4 border-b border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2 font-bold">
              {activeChannel?.type === 'direct' ? (
                <User className="w-7 h-7" />
              ) : (
                <Hash className="w-7 h-7" />
              )}
            </div>
            <h3 className="text-sm font-black text-slate-900">{activeChannel?.name}</h3>
            <p className="text-xs text-slate-500 mt-1">{activeChannel?.description}</p>
          </div>

          {/* Quick Actions */}
          <div className="py-4 border-b border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Actions rapides
            </span>

            <a
              href="tel:+22921314500"
              className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Appeler le Dispatch (24/7)</span>
            </a>

            <button
              onClick={() => {
                setInputMessage('⚠️ ALERTE DÉPANNAGE IMMÉDIAT : Panne constatée sur le véhicule. Demande d’intervention d’urgence.');
              }}
              className="w-full px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition text-left"
            >
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Déclencher alerte dépannage</span>
            </button>
          </div>

          {/* Participants in channel / online drivers */}
          <div className="py-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Utilisateurs actifs ({onlineUsers.length})
            </span>

            <div className="space-y-2">
              {onlineUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-2.5">
                  <div className="relative">
                    <img
                      src={
                        user.avatar_url ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
                      }
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-800 truncate">{user.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{user.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NEW CHANNEL MODAL */}
      {showNewChannelModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900">Créer un nouveau canal</h3>
              <button
                onClick={() => setShowNewChannelModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateChannelSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nom du canal <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex : Tournées Calavi, Chantiers Nord"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description / Objet opérationnel
                </label>
                <textarea
                  rows={3}
                  placeholder="Objectif du canal, affectation des chauffeurs..."
                  value={newChannelDesc}
                  onChange={(e) => setNewChannelDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewChannelModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 rounded-xl transition shadow-xs"
                >
                  Créer le canal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
