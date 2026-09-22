import { Router, Response } from 'express';
import { db } from '../db/database.js';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.js';
import { ChatChannel, ChatMessage } from '../db/types.js';
import { broadcastNewMessage, getOnlineUsersList } from '../chat/chatServer.js';

export const chatRouter = Router();

// GET /api/chat/channels - List all channels and direct conversations
chatRouter.get('/channels', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const database = db.getDb();
  const channels = database.chat_channels || [];
  const messages = database.chat_messages || [];

  // Calculate unread count & last message for each channel
  const enrichedChannels = channels.map(c => {
    const channelMessages = messages.filter(m => m.channel_id === c.id);
    const lastMsg = channelMessages[channelMessages.length - 1] || null;

    return {
      ...c,
      last_message: lastMsg,
      message_count: channelMessages.length,
    };
  });

  // Also build direct contacts list (drivers & fleet managers)
  const drivers = (database.drivers || []).map(d => ({
    id: `direct_${d.id}`,
    name: `${d.first_name} ${d.last_name}`,
    role: 'CONDUCTEUR',
    type: 'direct' as const,
    phone: d.phone,
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    description: `Conducteur de flotte`,
    company_id: d.company_id,
  }));

  const staff = (database.users || [])
    .filter(u => u.id !== req.user?.id)
    .map(u => ({
      id: `direct_${u.id}`,
      name: `${u.first_name} ${u.last_name}`,
      role: u.role_id,
      type: 'direct' as const,
      phone: u.phone,
      avatar_url: u.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      description: u.role_id === 'SUPER_ADMIN_JMF' ? 'Superviseur Opérations JMF' : 'Gestionnaire Entreprise',
      company_id: u.company_id,
    }));

  return res.json({
    success: true,
    channels: enrichedChannels,
    direct_contacts: [...staff, ...drivers],
  });
});

// GET /api/chat/messages/:channelId - List messages for a specific channel
chatRouter.get('/messages/:channelId', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const { channelId } = req.params;
  const database = db.getDb();
  const allMessages = database.chat_messages || [];

  const messages = allMessages.filter(m => m.channel_id === channelId);

  return res.json({
    success: true,
    channelId,
    messages,
    count: messages.length,
  });
});

// POST /api/chat/messages - Send a new message
chatRouter.post('/messages', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const { channel_id, content, attachment } = req.body;

  if (!channel_id || !content || !content.trim()) {
    return res.status(400).json({ error: 'Le canal et le contenu du message sont obligatoires.' });
  }

  const user = req.user!;
  const newMsg: ChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    channel_id,
    sender_id: user.id,
    sender_name: `${user.first_name} ${user.last_name}`,
    sender_role: user.role_id,
    sender_avatar: user.avatar_url,
    company_id: user.company_id,
    content: content.trim(),
    attachment,
    created_at: new Date().toISOString(),
  };

  const database = db.getDb();
  if (!database.chat_messages) database.chat_messages = [];
  database.chat_messages.push(newMsg);

  // If this was a direct channel that doesn't exist yet, register it
  if (channel_id.startsWith('direct_') && (!database.chat_channels || !database.chat_channels.some(c => c.id === channel_id))) {
    if (!database.chat_channels) database.chat_channels = [];
    database.chat_channels.push({
      id: channel_id,
      name: req.body.recipient_name || 'Conversation privée',
      type: 'direct',
      company_id: user.company_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  await db.save();

  // Broadcast to WebSocket clients
  broadcastNewMessage(newMsg);

  return res.status(201).json({
    success: true,
    data: newMsg,
  });
});

// POST /api/chat/channels - Create a new channel
chatRouter.post('/channels', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const { name, description, type } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Le nom du canal est obligatoire.' });
  }

  const database = db.getDb();
  if (!database.chat_channels) database.chat_channels = [];

  const cleanId = `chan_${name.trim().toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now().toString(36)}`;
  const newChannel: ChatChannel = {
    id: cleanId,
    name: name.trim(),
    description: description?.trim() || '',
    type: type || 'channel',
    company_id: req.user?.company_id || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  database.chat_channels.push(newChannel);
  await db.save();

  return res.status(201).json({
    success: true,
    data: newChannel,
  });
});

// GET /api/chat/online-users - Get online users list
chatRouter.get('/online-users', authenticate, (req: AuthenticatedRequest, res: Response) => {
  return res.json({
    success: true,
    online_users: getOnlineUsersList(),
  });
});

// GET /api/chat/resources - Quick searchable resources to attach
chatRouter.get('/resources', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const database = db.getDb();
  
  const vehicles = (database.vehicles || []).map(v => ({
    id: v.id,
    title: `${v.brand} ${v.model} (${v.registration_number})`,
    subtitle: `${v.vehicle_type} • Statut: ${v.status} • ${v.current_mileage.toLocaleString('fr-FR')} km`,
    type: 'vehicle' as const,
  }));

  const convoys = (database.convoy_requests || []).map(c => ({
    id: c.reference,
    title: `Mission Convoyage ${c.reference}`,
    subtitle: `${c.vehicle_brand} ${c.vehicle_model} • De: ${c.pickup_city} à: ${c.delivery_city}`,
    type: 'convoy' as const,
  }));

  return res.json({
    success: true,
    vehicles,
    convoys,
  });
});
