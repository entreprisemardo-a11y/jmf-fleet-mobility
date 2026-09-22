export type RoleId = 
  | 'SUPER_ADMIN_JMF'
  | 'COMPANY_ADMIN'
  | 'FLEET_MANAGER'
  | 'MAINTENANCE_MANAGER'
  | 'FINANCE_MANAGER'
  | 'DRIVER'
  | 'CLIENT'
  | 'AUDITOR';

export interface Role {
  id: RoleId;
  name: string;
  description: string;
  is_system: boolean;
}

export interface Permission {
  id: string;
  name: string;
  module: string;
  description?: string;
}

export interface Company {
  id: string;
  name: string;
  legal_name?: string;
  registration_number?: string;
  tax_number?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country: string;
  currency: string; // XOF, EUR, etc.
  timezone: string;
  logo_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Site {
  id: string;
  company_id: string;
  name: string;
  code?: string;
  city?: string;
  address?: string;
  is_headquarters: boolean;
  created_at: string;
}

export interface Department {
  id: string;
  company_id: string;
  name: string;
  code?: string;
}

export interface CostCenter {
  id: string;
  company_id: string;
  name: string;
  code?: string;
  budget_allocated: number;
}

export interface User {
  id: string;
  company_id: string | null; // null for SUPER_ADMIN_JMF
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  phone?: string;
  role_id: RoleId;
  site_id?: string;
  avatar_url?: string;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PersonalAccessToken {
  id: string;
  user_id: string;
  name: string;
  token_hash: string;
  abilities: string[];
  last_used_at?: string;
  expires_at?: string;
  created_at: string;
}

export interface Driver {
  id: string;
  company_id: string;
  user_id?: string;
  first_name: string;
  last_name: string;
  matricule?: string;
  phone?: string;
  email?: string;
  license_number?: string;
  license_category?: string;
  license_issued_at?: string;
  license_expires_at?: string;
  status: 'active' | 'suspended' | 'on_leave';
  created_at: string;
}

export type VehicleStatus = 'active' | 'maintenance' | 'immobilized' | 'retired' | 'available';

export interface Vehicle {
  id: string;
  company_id: string;
  site_id?: string;
  cost_center_id?: string;
  current_driver_id?: string;
  registration_number: string;
  vin?: string;
  brand: string;
  model: string;
  version?: string;
  vehicle_type: 'VP' | 'VUL' | 'Poids lourd' | 'Bus' | 'Moto';
  category?: string; // SUV, Berline, Fourgon, etc.
  color?: string;
  year?: number;
  first_registration_date?: string;
  country: string;
  energy_type: 'Diesel' | 'Essence' | 'Électrique' | 'Hybride';
  current_mileage: number;
  fuel_level_percent: number;
  status: VehicleStatus;
  acquisition_mode: 'LLD' | 'Achat comptant' | 'Crédit-bail' | 'Location court terme';
  purchase_value: number;
  monthly_lease: number;
  supplier?: string;
  main_photo?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface VehicleAssignment {
  id: string;
  vehicle_id: string;
  driver_id: string;
  start_at: string;
  end_at?: string;
  mileage_start?: number;
  mileage_end?: number;
  condition_start?: string;
  created_at: string;
}

export interface DocumentRecord {
  id: string;
  company_id: string;
  vehicle_id?: string;
  driver_id?: string;
  type: 'insurance' | 'technical_inspection' | 'registration_card' | 'vignette' | 'contract' | 'driver_license';
  reference: string;
  issuer?: string;
  issued_at?: string;
  expires_at?: string;
  file_url?: string;
  status: 'valid' | 'expiring_soon' | 'expired';
  created_at: string;
}

export interface WorkOrder {
  id: string;
  company_id: string;
  vehicle_id: string;
  title: string;
  intervention_type: string;
  scheduled_date: string;
  completed_date?: string;
  mileage_at_intervention?: number;
  workshop_name?: string;
  cost: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
}

export interface FuelEntry {
  id: string;
  company_id: string;
  vehicle_id: string;
  driver_id?: string;
  date: string;
  station_name: string;
  fuel_type: string;
  liters: number;
  price_per_liter: number;
  amount: number;
  mileage: number;
  receipt_url?: string;
  created_at: string;
}

export interface Alert {
  id: string;
  company_id: string;
  vehicle_id?: string;
  driver_id?: string;
  type: 'DANGER' | 'WARNING' | 'INFO' | 'SUCCESS';
  category: 'insurance' | 'inspection' | 'maintenance' | 'license' | 'fuel' | 'breakdown';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ActivityLogChange {
  field: string;
  old_value: any;
  new_value: any;
}

export interface ActivityLog {
  id: string;
  company_id: string | null;
  company_name?: string;
  user_id?: string;
  user_name?: string;
  user_role?: string;
  entity_type: string; // 'user' | 'invoice' | 'company' | 'vehicle' | 'security' | 'role_permission'
  entity_id?: string;
  action: string;
  description: string;
  severity?: 'info' | 'success' | 'warning' | 'critical';
  compliance_tag?: 'ROLE_CHANGE' | 'INVOICE_MODIFICATION' | 'PASSWORD_RESET' | 'USER_CREATION' | 'INVOICE_CREATION' | 'ACCESS_CONTROL' | 'SECURITY' | 'VEHICLE_MANAGEMENT' | string;
  ip_address?: string;
  user_agent?: string;
  changes?: ActivityLogChange[];
  hash_checksum?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export type ConvoyStatus = 
  | 'NEW'               // Nouvelle demande
  | 'ANALYZING'         // En cours d'analyse
  | 'QUOTE_SENT'        // Devis envoyé
  | 'ACCEPTED'          // Acceptée
  | 'PLANNED'           // Planifiée
  | 'IN_PROGRESS'       // En cours
  | 'COMPLETED'         // Terminée
  | 'REJECTED'          // Refusée
  | 'CANCELLED';        // Annulée

export interface ConvoyTimelineItem {
  id: string;
  status: ConvoyStatus;
  label: string;
  note?: string;
  author: string;
  created_at: string;
}

export interface ConvoyRequest {
  id: string;
  reference: string; // ex: JMF-CONV-2026-000001
  company_id: string | null;
  user_id: string | null; // Associated customer user if registered/linked
  status: ConvoyStatus;

  // Section 1: Vehicle info
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_year: number;
  vehicle_plate?: string;
  is_registered: boolean;
  vehicle_color: string;
  vehicle_condition: 'good' | 'medium' | 'breakdown' | 'damaged' | 'non_running' | 'other';
  condition_details?: string;
  photos?: string[];
  requires_flatbed: boolean; // non roulant transport adapté

  // Section 2: Convoy info
  pickup_address: string;
  pickup_city: string;
  pickup_country: string;
  delivery_address: string;
  delivery_city: string;
  delivery_country: string;
  desired_date: string;
  desired_time: string;
  convoy_type: 'individual' | 'company' | 'warehouse_transfer' | 'agency_transfer' | 'client_delivery' | 'garage_transfer' | 'other';
  convoy_mode: 'driver' | 'flatbed' | 'to_be_determined';
  access_instructions?: string;

  // Section 3: Requester info
  client_name: string;
  client_company?: string;
  client_email: string;
  client_phone: string;
  client_country: string;

  // Section 4: Additional info
  special_instructions?: string;
  privacy_accepted: boolean;

  // Operational & Admin fields
  internal_notes?: string;
  assigned_driver_id?: string;
  quote_amount?: number;
  invoice_id?: string;
  timeline: ConvoyTimelineItem[];

  created_at: string;
  updated_at: string;
}

export type InvoiceStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface InvoiceItemBreakdown {
  label: string;
  qty: number;
  unit_price: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoice_number: string; // FAC-JMF-2026-09-090
  emef_code: string;      // DGI-BJ-20260921-99812-MECeF
  company_id: string;
  user_id?: string | null;
  period: string;
  issue_date: string;
  due_date: string;
  service_type: 
    | 'fleet_management' 
    | 'maintenance' 
    | 'storage_guard' 
    | 'rental' 
    | 'convoy' 
    | 'vehicle_sale' 
    | 'training' 
    | 'other';
  reference_mission?: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number; // e.g. 18 for 18% VAT (TVA Bénin)
  discount: number;
  amount_ht: number;
  amount_tva: number;
  amount_ttc: number;
  currency: string; // FCFA, EUR
  status: InvoiceStatus;
  payment_method?: string;
  payment_date?: string;
  transaction_ref?: string;
  pdf_url?: string;
  items_breakdown: InvoiceItemBreakdown[];
  created_at: string;
  updated_at: string;
}

export interface EmailLog {
  id: string;
  to: string;
  recipient_name?: string;
  subject: string;
  body: string;
  type: 'CONVOY_CONFIRMATION' | 'JMF_INTERNAL_ALERT' | 'PASSWORD_RESET' | 'INVOICE_NOTIFICATION';
  status: 'sent' | 'failed' | 'queued';
  error_message?: string;
  retry_count: number;
  created_at: string;
  sent_at?: string;
}

export interface ChatAttachment {
  type: 'vehicle' | 'convoy' | 'location' | 'document' | 'alert';
  reference_id: string;
  title: string;
  details?: string;
}

export interface ChatChannel {
  id: string;
  name: string;
  description?: string;
  type: 'channel' | 'direct';
  company_id?: string | null;
  members?: string[];
  unread_count?: number;
  message_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  channel_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: string;
  sender_avatar?: string;
  company_id?: string | null;
  content: string;
  attachment?: ChatAttachment;
  created_at: string;
}

export interface ChatOnlineUser {
  id: string;
  name: string;
  role: string;
  avatar_url?: string;
  company_id?: string | null;
  status: 'online' | 'busy' | 'away';
  last_seen?: string;
}

export interface DatabaseSchema {
  companies: Company[];
  sites: Site[];
  departments: Department[];
  cost_centers: CostCenter[];
  roles: Role[];
  permissions: Permission[];
  role_permissions: { role_id: RoleId; permission_id: string }[];
  users: User[];
  personal_access_tokens: PersonalAccessToken[];
  drivers: Driver[];
  vehicles: Vehicle[];
  vehicle_assignments: VehicleAssignment[];
  documents: DocumentRecord[];
  work_orders: WorkOrder[];
  fuel_entries: FuelEntry[];
  alerts: Alert[];
  activity_logs: ActivityLog[];
  convoy_requests: ConvoyRequest[];
  invoices: Invoice[];
  email_logs: EmailLog[];
  chat_channels?: ChatChannel[];
  chat_messages?: ChatMessage[];
}
