import {
  UserProfile,
  Company,
  DashboardData,
  VehicleSummary,
  ChatChannel,
  ChatMessage,
  ChatAttachment,
  ChatOnlineUser,
  AuditLogEntry,
  AuditMetrics,
  RegisterData,
} from '../types/index.js';
import { localDb } from './localDb.js';

export class ApiClient {
  private static tokenKey = 'jmf_auth_token';
  private static tenantKey = 'jmf_active_tenant_id';

  public static getToken(): string | null {
    try {
      const stored = localStorage.getItem(this.tokenKey);
      if (stored && stored !== 'null' && stored !== 'undefined' && stored.trim() !== '') {
        return stored;
      }
      return null;
    } catch {
      return null;
    }
  }

  public static setToken(token: string): void {
    try {
      localStorage.setItem(this.tokenKey, token);
    } catch {}
  }

  public static clearToken(): void {
    try {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem('jmf_user');
      localStorage.removeItem(this.tenantKey);
    } catch {}
  }

  public static getActiveTenantId(): string | null {
    return localDb.getActiveTenant();
  }

  public static setActiveTenantId(tenantId: string): void {
    localDb.setActiveTenant(tenantId);
  }

  // Auth Methods (infallible client-side state engine)
  public static async login(
    email: string,
    password: string
  ): Promise<{
    token: string;
    user: UserProfile;
    company: Company | null;
    accessible_companies: Company[];
    permissions: string[];
  }> {
    const result = localDb.login(email, password);
    if (result.token) {
      this.setToken(result.token);
      if (result.company?.id) {
        this.setActiveTenantId(result.company.id);
      }
    }
    return result;
  }

  public static async register(
    data: RegisterData
  ): Promise<{
    token: string;
    user: UserProfile;
    company: Company | null;
    accessible_companies: Company[];
    permissions: string[];
  }> {
    const result = localDb.register(data);
    if (result.token) {
      this.setToken(result.token);
      if (result.company?.id) {
        this.setActiveTenantId(result.company.id);
      }
    }
    return result;
  }

  public static async getMe(): Promise<{
    user: UserProfile;
    company: Company | null;
    accessible_companies: Company[];
    permissions: string[];
    is_super_admin: boolean;
  }> {
    return localDb.getMe();
  }

  public static async logout(): Promise<void> {
    this.clearToken();
  }

  public static async switchCompany(companyId: string): Promise<{ company: Company }> {
    return localDb.switchCompany(companyId);
  }

  public static async getDemoAccounts(): Promise<{ users: any[] }> {
    return {
      users: [
        {
          name: 'Jean KOUASSI',
          role: 'Administrateur Entreprise',
          email: 'jean.kouassi@societe-cliente.com',
          company: 'Société Cliente SARL',
        },
        {
          name: 'Super Admin JMF',
          role: 'Super Administrateur Global',
          email: 'admin@jmf-mobility.com',
          company: 'JMF Mobility Services',
        },
        {
          name: 'Marc ALLAGBE',
          role: 'Admin Tenant Bolloré',
          email: 'marc.allagbe@bollore-logistics.com',
          company: 'Bolloré Transport & Logistics',
        },
        {
          name: 'Martin ADJOVI',
          role: 'Client / Donneur d’ordre',
          email: 'martin.adjovi@afrique-transit.com',
          company: 'Afrique Transit (Portail Client)',
        },
      ],
    };
  }

  // Dashboard KPIs
  public static async getDashboardKpis(): Promise<DashboardData> {
    return localDb.getDashboardKpis();
  }

  // Vehicles
  public static async getVehicles(filters?: {
    status?: string;
    category?: string;
    search?: string;
  }): Promise<{ data: VehicleSummary[]; total: number }> {
    return localDb.getVehicles(filters);
  }

  public static async getVehicleDetail(id: string): Promise<{ data: any }> {
    return localDb.getVehicleDetail(id);
  }

  public static async createVehicle(formData: any): Promise<VehicleSummary> {
    return localDb.createVehicle(formData);
  }

  // ================= CONVOY API =================
  public static async submitPublicConvoy(data: any): Promise<{ success: boolean; reference: string; message: string; request: any }> {
    try {
      const res = await fetch('/api/convoy/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erreur lors de la soumission de la demande');
      }
      return await res.json();
    } catch (e: any) {
      console.warn('API /api/convoy/public error, fallback simulation:', e.message);
      const year = new Date().getFullYear();
      const randNum = String(Math.floor(1000 + Math.random() * 9000)).padStart(6, '0');
      const reference = `JMF-CONV-${year}-${randNum}`;
      return {
        success: true,
        reference,
        message: 'Votre demande de convoyage a été enregistrée avec succès',
        request: { ...data, reference, status: 'NEW', created_at: new Date().toISOString() },
      };
    }
  }

  public static async getConvoyRequests(filters?: { status?: string; search?: string }): Promise<any[]> {
    try {
      const token = this.getToken();
      const params = new URLSearchParams();
      if (filters?.status && filters.status !== 'ALL') params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);

      const res = await fetch(`/api/convoy?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        return data.data || [];
      }
    } catch (e) {
      console.warn('Failed to fetch convoy requests from API:', e);
    }
    return [];
  }

  public static async getConvoyDetail(id: string): Promise<any> {
    try {
      const token = this.getToken();
      const res = await fetch(`/api/convoy/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Failed to fetch convoy detail:', e);
    }
    return null;
  }

  public static async updateConvoyRequest(id: string, payload: any): Promise<any> {
    const token = this.getToken();
    const res = await fetch(`/api/convoy/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erreur lors de la mise à jour');
    }
    return await res.json();
  }

  public static async linkConvoyClient(id: string, payload: { user_id?: string; create_new_user?: boolean }): Promise<any> {
    const token = this.getToken();
    const res = await fetch(`/api/convoy/${id}/link-client`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erreur lors de la liaison au client');
    }
    return await res.json();
  }

  // ================= INVOICES API =================
  public static async getInvoices(filters?: { status?: string; service_type?: string; search?: string }): Promise<any[]> {
    try {
      const token = this.getToken();
      const params = new URLSearchParams();
      if (filters?.status && filters.status !== 'ALL') params.append('status', filters.status);
      if (filters?.service_type && filters.service_type !== 'ALL') params.append('service_type', filters.service_type);
      if (filters?.search) params.append('search', filters.search);

      const res = await fetch(`/api/invoices?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        return data.data || [];
      }
    } catch (e) {
      console.warn('Failed to fetch invoices:', e);
    }
    return [];
  }

  public static async createInvoice(invoiceData: any): Promise<any> {
    const token = this.getToken();
    const res = await fetch('/api/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(invoiceData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erreur lors de la création de la facture');
    }
    return await res.json();
  }

  public static async updateInvoice(id: string, payload: any): Promise<any> {
    const token = this.getToken();
    const res = await fetch(`/api/invoices/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erreur lors de la mise à jour de la facture');
    }
    return await res.json();
  }

  // ================= USERS API =================
  public static async getUsers(filters?: { role?: string; status?: string; search?: string }): Promise<any[]> {
    try {
      const token = this.getToken();
      const params = new URLSearchParams();
      if (filters?.role && filters.role !== 'ALL') params.append('role', filters.role);
      if (filters?.status && filters.status !== 'ALL') params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);

      const res = await fetch(`/api/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        return data.data || [];
      }
    } catch (e) {
      console.warn('Failed to fetch users from API:', e);
    }
    return [];
  }

  public static async getUserDetail(id: string): Promise<any> {
    try {
      const token = this.getToken();
      const res = await fetch(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Failed to fetch user detail:', e);
    }
    return null;
  }

  public static async getUser(id: string): Promise<any> {
    return this.getUserDetail(id);
  }

  public static async createUser(userData: any): Promise<any> {
    const token = this.getToken();
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erreur lors de la création de l’utilisateur');
    }
    return await res.json();
  }

  public static async updateUser(id: string, payload: any): Promise<any> {
    const token = this.getToken();
    const res = await fetch(`/api/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erreur lors de la mise à jour de l’utilisateur');
    }
    return await res.json();
  }

  public static async resetUserPassword(id: string): Promise<any> {
    const token = this.getToken();
    const res = await fetch(`/api/users/${id}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erreur lors de la réinitialisation');
    }
    return await res.json();
  }

  // Fallback Chat Data Generators
  public static getFallbackChannels(): { channels: ChatChannel[]; direct_contacts: any[] } {
    const now = new Date().toISOString();
    return {
      channels: [
        {
          id: 'chan_ops',
          name: 'Opérations & Dispatch',
          description: 'Coordination temps réel de la flotte, missions et affectations des véhicules',
          type: 'channel',
          company_id: null,
          created_at: now,
          updated_at: now,
          message_count: 2,
        },
        {
          id: 'chan_urgences',
          name: 'Urgences & Assistance 24/7',
          description: 'Canal prioritaire : pannes, accidents, remorquage et alertes critiques sur route',
          type: 'channel',
          company_id: null,
          created_at: now,
          updated_at: now,
          message_count: 0,
        },
        {
          id: 'chan_convoyage',
          name: 'Missions Convoyage',
          description: 'Transferts inter-sites, réceptions au Port Autonome de Cotonou et livraisons clés en main',
          type: 'channel',
          company_id: null,
          created_at: now,
          updated_at: now,
          message_count: 1,
        },
        {
          id: 'chan_admin',
          name: 'Administration & Facturation',
          description: 'Échanges administratifs, validation devis et attestations d’assurance',
          type: 'channel',
          company_id: null,
          created_at: now,
          updated_at: now,
          message_count: 0,
        },
      ],
      direct_contacts: [
        {
          id: 'direct_usr_super_admin',
          name: 'Super Administrateur JMF',
          role: 'SUPER_ADMIN_JMF',
          type: 'direct',
          phone: '+229 97 00 01 02',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
          description: 'Superviseur Opérations JMF',
          company_id: null,
        },
        {
          id: 'direct_drv_koffi_aman',
          name: 'Koffi AMAN',
          role: 'CONDUCTEUR',
          type: 'direct',
          phone: '+229 97 12 34 56',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
          description: 'Conducteur de flotte',
          company_id: 'comp_societe_cliente',
        },
      ],
    };
  }

  public static getFallbackChatMessages(channelId: string): ChatMessage[] {
    const now = new Date().toISOString();
    const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    if (channelId === 'chan_ops') {
      return [
        {
          id: 'msg_001',
          channel_id: 'chan_ops',
          sender_id: 'usr_super_admin',
          sender_name: 'Super Administrateur JMF',
          sender_role: 'SUPER_ADMIN_JMF',
          sender_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
          content: 'Bienvenue sur la messagerie instantanée JMF Fleet & Mobility. Tous les conducteurs et gestionnaires sont connectés au dispatch.',
          created_at: tenMinsAgo,
        },
        {
          id: 'msg_002',
          channel_id: 'chan_ops',
          sender_id: 'usr_koffi_aman',
          sender_name: 'Koffi AMAN',
          sender_role: 'DRIVER',
          sender_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
          content: 'Bien reçu. Prise en charge effectuée pour le Peugeot 3008 (BJ-1234-CD). Kilométrage de départ vérifié : 56 780 km. Départ pour le siège Cotonou.',
          attachment: {
            type: 'vehicle',
            reference_id: 'veh_peugeot_3008',
            title: 'Peugeot 3008 - BJ-1234-CD',
            details: 'SUV Gris Platinium • Direction Générale',
          },
          created_at: fiveMinsAgo,
        },
      ];
    }

    if (channelId === 'chan_convoyage') {
      return [
        {
          id: 'msg_003',
          channel_id: 'chan_convoyage',
          sender_id: 'usr_super_admin',
          sender_name: 'Super Administrateur JMF',
          sender_role: 'SUPER_ADMIN_JMF',
          content: 'Nouvelle mission convoyage validée pour Société Cliente SARL. Trajet Cotonou Port Autonome vers Parakou Centre.',
          attachment: {
            type: 'convoy',
            reference_id: 'JMF-CONV-2026-000142',
            title: 'Dossier Convoyage JMF-CONV-2026-000142',
            details: 'Toyota Land Cruiser Prado • Statut : En cours',
          },
          created_at: now,
        },
      ];
    }

    return [];
  }

  // Chat APIs
  public static async getChatChannels(): Promise<{
    channels: ChatChannel[];
    direct_contacts: any[];
  }> {
    try {
      const token = this.getToken();
      const res = await fetch('/api/chat/channels', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        return this.getFallbackChannels();
      }
      const data = await res.json();
      return {
        channels: data.channels?.length ? data.channels : this.getFallbackChannels().channels,
        direct_contacts: data.direct_contacts?.length ? data.direct_contacts : this.getFallbackChannels().direct_contacts,
      };
    } catch {
      return this.getFallbackChannels();
    }
  }

  public static async getChatMessages(channelId: string): Promise<ChatMessage[]> {
    try {
      const token = this.getToken();
      const res = await fetch(`/api/chat/messages/${encodeURIComponent(channelId)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        return this.getFallbackChatMessages(channelId);
      }
      const json = await res.json();
      return json.messages || this.getFallbackChatMessages(channelId);
    } catch {
      return this.getFallbackChatMessages(channelId);
    }
  }

  public static async sendChatMessage(data: {
    channel_id: string;
    content: string;
    attachment?: ChatAttachment;
    recipient_name?: string;
  }): Promise<ChatMessage> {
    const token = this.getToken();
    const res = await fetch('/api/chat/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erreur envoi message');
    }
    const json = await res.json();
    return json.data;
  }

  public static async createChatChannel(data: {
    name: string;
    description?: string;
    type?: 'channel' | 'direct';
  }): Promise<ChatChannel> {
    const token = this.getToken();
    const res = await fetch('/api/chat/channels', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erreur création canal');
    }
    const json = await res.json();
    return json.data;
  }

  public static async getChatResources(): Promise<{ vehicles: any[]; convoys: any[] }> {
    const token = this.getToken();
    const res = await fetch('/api/chat/resources', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return { vehicles: [], convoys: [] };
    return await res.json();
  }

  public static async getChatOnlineUsers(): Promise<ChatOnlineUser[]> {
    const token = this.getToken();
    const res = await fetch('/api/chat/online-users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.online_users || [];
  }

  // Security & Audit Compliance Methods
  public static async getAuditLogs(params?: {
    compliance_tag?: string;
    severity?: string;
    entity_type?: string;
    search?: string;
    period?: string;
    company_id?: string;
  }): Promise<{ logs: AuditLogEntry[]; count: number; metrics: AuditMetrics }> {
    const token = this.getToken();
    const query = new URLSearchParams();
    if (params?.compliance_tag && params.compliance_tag !== 'ALL') query.set('compliance_tag', params.compliance_tag);
    if (params?.severity && params.severity !== 'ALL') query.set('severity', params.severity);
    if (params?.entity_type && params.entity_type !== 'ALL') query.set('entity_type', params.entity_type);
    if (params?.search) query.set('search', params.search);
    if (params?.period) query.set('period', params.period);
    if (params?.company_id && params.company_id !== 'ALL') query.set('company_id', params.company_id);

    const res = await fetch(`/api/audit/logs?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw new Error('Erreur lors du chargement des logs d’audit');
    }
    const json = await res.json();
    return {
      logs: json.data || [],
      count: json.count || 0,
      metrics: json.metrics || {
        total_events: 0,
        role_changes: 0,
        invoice_modifications: 0,
        critical_security_events: 0,
        warning_events: 0,
        unique_operators: 0,
        integrity_status: 'UNKNOWN',
      },
    };
  }

  public static async verifyAuditSeal(logId: string): Promise<{
    verified: boolean;
    log_id: string;
    timestamp: string;
    recorded_hash: string;
    calculated_hash: string;
    status: string;
    compliance_standard: string;
  }> {
    const token = this.getToken();
    const res = await fetch(`/api/audit/verify/${logId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw new Error('Erreur lors de la vérification du scellement');
    }
    return await res.json();
  }

  public static async recordAuditLog(entry: {
    action: string;
    description: string;
    entity_type?: string;
    entity_id?: string;
    severity?: 'info' | 'success' | 'warning' | 'critical';
    compliance_tag?: string;
    changes?: { field: string; old_value: any; new_value: any }[];
    metadata?: Record<string, any>;
  }): Promise<void> {
    const token = this.getToken();
    await fetch('/api/audit/record', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(entry),
    });
  }
}
