import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { DatabaseSchema } from './types.js';
import { generateSeedData } from './seeds.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

class DatabaseService {
  private data: DatabaseSchema;
  private isLoaded: boolean = false;

  constructor() {
    this.data = generateSeedData();
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
        this.ensureCollections();
        this.isLoaded = true;
      } else {
        this.data = generateSeedData();
        this.ensureCollections();
        this.persistSync();
        this.isLoaded = true;
      }
    } catch (err) {
      console.warn('Could not read persistent DB file, using in-memory seed:', err);
      this.data = generateSeedData();
      this.ensureCollections();
      this.isLoaded = true;
    }
  }

  private ensureCollections() {
    if (!this.data.convoy_requests) this.data.convoy_requests = [];
    if (!this.data.invoices) this.data.invoices = [];
    if (!this.data.email_logs) this.data.email_logs = [];
    if (!this.data.activity_logs) this.data.activity_logs = [];
    if (!this.data.chat_channels || this.data.chat_channels.length === 0) {
      const now = new Date().toISOString();
      this.data.chat_channels = [
        {
          id: 'chan_ops',
          name: 'Opérations & Dispatch',
          description: 'Coordination temps réel de la flotte, missions et affectations des véhicules',
          type: 'channel',
          company_id: null,
          created_at: now,
          updated_at: now,
        },
        {
          id: 'chan_urgences',
          name: 'Urgences & Assistance 24/7',
          description: 'Canal prioritaire : pannes, accidents, remorquage et alertes critiques sur route',
          type: 'channel',
          company_id: null,
          created_at: now,
          updated_at: now,
        },
        {
          id: 'chan_convoyage',
          name: 'Missions Convoyage',
          description: 'Transferts inter-sites, réceptions au Port Autonome de Cotonou et livraisons clés en main',
          type: 'channel',
          company_id: null,
          created_at: now,
          updated_at: now,
        },
        {
          id: 'chan_admin',
          name: 'Administration & Facturation',
          description: 'Échanges administratifs, validation devis et attestations d’assurance',
          type: 'channel',
          company_id: null,
          created_at: now,
          updated_at: now,
        },
      ];
    }
    if (!this.data.chat_messages || this.data.chat_messages.length === 0) {
      const now = new Date().toISOString();
      const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      this.data.chat_messages = [
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
  }

  private persistSync() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving DB to disk:', err);
    }
  }

  public getDb(): DatabaseSchema {
    if (!this.isLoaded) {
      this.init();
    }
    return this.data;
  }

  public async save(): Promise<void> {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        await fs.promises.mkdir(DATA_DIR, { recursive: true });
      }
      await fs.promises.writeFile(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Async DB save failed:', err);
    }
  }

  // Reset to initial seeds (useful for test suites or demo resets)
  public resetToSeeds(): void {
    this.data = generateSeedData();
    this.persistSync();
  }

  // Helper to generate UUIDs
  public generateId(prefix: string = 'id'): string {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  // Generate unique Convoy Reference: JMF-CONV-2026-000001
  public generateConvoyReference(): string {
    const year = new Date().getFullYear();
    const existing = this.getDb().convoy_requests;
    const nextSeq = existing.length + 1;
    let ref = `JMF-CONV-${year}-${String(nextSeq).padStart(6, '0')}`;
    let attempt = 0;
    while (existing.some(r => r.reference === ref)) {
      attempt++;
      ref = `JMF-CONV-${year}-${String(nextSeq + attempt).padStart(6, '0')}`;
    }
    return ref;
  }

  // Generate unique Invoice Number: FAC-JMF-2026-09-090
  public generateInvoiceNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const existing = this.getDb().invoices;
    const nextSeq = existing.length + 1;
    let invNum = `FAC-JMF-${year}-${month}-${String(nextSeq).padStart(3, '0')}`;
    let attempt = 0;
    while (existing.some(i => i.invoice_number === invNum)) {
      attempt++;
      invNum = `FAC-JMF-${year}-${month}-${String(nextSeq + attempt).padStart(3, '0')}`;
    }
    return invNum;
  }

  // Audit activity logger with cryptographic integrity seal & compliance tags
  public logActivity(params: {
    company_id: string | null;
    company_name?: string;
    user_id?: string;
    user_name?: string;
    user_role?: string;
    entity_type: string;
    entity_id?: string;
    action: string;
    description: string;
    severity?: 'info' | 'success' | 'warning' | 'critical';
    compliance_tag?: string;
    ip_address?: string;
    user_agent?: string;
    changes?: { field: string; old_value: any; new_value: any }[];
    metadata?: Record<string, any>;
  }): void {
    const db = this.getDb();
    const id = this.generateId('act');
    const timestamp = new Date().toISOString();

    // Auto-resolve user name and role if missing
    let resolvedUserName = params.user_name;
    let resolvedUserRole = params.user_role;
    if (params.user_id && (!resolvedUserName || !resolvedUserRole)) {
      const u = db.users?.find((usr) => usr.id === params.user_id);
      if (u) {
        resolvedUserName = `${u.first_name} ${u.last_name}`;
        resolvedUserRole = u.role_id;
      }
    }

    // Auto-resolve company name if missing
    let resolvedCompanyName = params.company_name;
    if (params.company_id && !resolvedCompanyName) {
      const c = db.companies?.find((cmp) => cmp.id === params.company_id);
      if (c) resolvedCompanyName = c.name;
    }

    // Compute cryptographic tamper-evident SHA-256 seal
    const sealPayload = `${id}|${timestamp}|${params.user_id || 'system'}|${params.action}|${params.entity_type}|${params.entity_id || ''}|${params.description}`;
    const hashChecksum = crypto.createHash('sha256').update(sealPayload).digest('hex');

    db.activity_logs.unshift({
      id,
      company_id: params.company_id,
      company_name: resolvedCompanyName,
      user_id: params.user_id,
      user_name: resolvedUserName || 'Système / Super Admin',
      user_role: resolvedUserRole || 'SUPER_ADMIN_JMF',
      entity_type: params.entity_type,
      entity_id: params.entity_id,
      action: params.action,
      description: params.description,
      severity: params.severity || 'info',
      compliance_tag: params.compliance_tag,
      ip_address: params.ip_address || '197.234.221.14 (Cotonou, Bénin)',
      user_agent: params.user_agent,
      changes: params.changes,
      hash_checksum: hashChecksum,
      metadata: params.metadata,
      created_at: timestamp,
    });

    this.save();
  }

  // Multi-Tenant Query Scoper
  // CRITICAL: A non-super-admin user can ONLY access entities belonging to their company_id!
  public scopeByCompany<T extends { company_id: string | null }>(
    items: T[],
    userCompanyId: string | null,
    isSuperAdmin: boolean,
    targetCompanyId?: string | null
  ): T[] {
    // If user is super admin and requests a specific company filter
    if (isSuperAdmin) {
      if (targetCompanyId) {
        return items.filter(item => item.company_id === targetCompanyId);
      }
      return items;
    }

    // Standard Tenant Isolation: strictly match the user's company
    if (!userCompanyId) {
      return [];
    }

    return items.filter(item => item.company_id === userCompanyId);
  }
}

export const db = new DatabaseService();
