export type RoleId = 
  | 'SUPER_ADMIN_JMF'
  | 'COMPANY_ADMIN'
  | 'FLEET_MANAGER'
  | 'MAINTENANCE_MANAGER'
  | 'FINANCE_MANAGER'
  | 'DRIVER'
  | 'CLIENT'
  | 'AUDITOR';

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: RoleId;
  avatar_url?: string;
  company_id: string | null;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  company_name?: string;
  role?: RoleId;
  fleet_size?: string;
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
  currency: string;
  timezone: string;
  logo_url?: string;
  is_active: boolean;
}

export interface Site {
  id: string;
  company_id: string;
  name: string;
  code?: string;
  city?: string;
  address?: string;
  is_headquarters: boolean;
}

export interface VehicleSummary {
  id: string;
  company_id: string;
  registration_number: string;
  vin?: string;
  brand: string;
  model: string;
  version?: string;
  vehicle_type: 'VP' | 'VUL' | 'Poids lourd' | 'Bus' | 'Moto';
  category?: string;
  color?: string;
  year?: number;
  energy_type: 'Diesel' | 'Essence' | 'Électrique' | 'Hybride';
  current_mileage: number;
  fuel_level_percent: number;
  status: 'active' | 'maintenance' | 'immobilized' | 'retired' | 'available';
  acquisition_mode: string;
  purchase_value: number;
  monthly_lease: number;
  supplier?: string;
  main_photo?: string;
  driver?: { id: string; name: string; phone?: string } | null;
  site?: { id: string; name: string } | null;
}

export interface DashboardKpis {
  totalVehicles: number;
  activeVehicles: number;
  maintenanceVehicles: number;
  immobilizedVehicles: number;
  retiredVehicles: number;
  expiredDocuments: number;
  expiringSoonDocuments: number;
  totalMileage: number;
  totalFuelLiters: number;
  avgConsumptionL100: number;
  avgCostPerKm: number;
  totalOperatingCosts: number;
  activeMissions?: number;
  pendingConvoys?: number;
}

export interface StatusDistributionItem {
  name: string;
  count: number;
  percent: number;
  color: string;
}

export interface CostBreakdownItem {
  name: string;
  amount: number;
  percent: number;
  color: string;
}

export interface FuelWeeklyItem {
  week: string;
  liters: number;
}

export interface UpcomingMaintenanceItem {
  id: string;
  vehicle_registration: string;
  intervention: string;
  due_date: string;
  remaining_km: number;
  status: string;
}

export interface AlertCategoryItem {
  type: string;
  icon: string;
  title: string;
  count: number;
  label: string;
  date: string;
}

export interface RecentActivityItem {
  id: string;
  action: string;
  description: string;
  time: string;
}

export interface TelematicsVehicle {
  id: string;
  registration: string;
  model: string;
  lat: number;
  lng: number;
  speed: number;
  status: 'moving' | 'stopped' | 'idle';
  location: string;
}

export interface OperationalMissionSummaryItem {
  id: string;
  reference: string;
  vehicleReg: string;
  vehicleModel: string;
  driverName: string;
  destinationCity: string;
  departureCity: string;
  estimatedKm: number;
  status: 'ACTIVE' | 'APPROVED' | 'COMPLETED';
}

export interface OperationalSummaryData {
  activeMissionsCount: number;
  activeMissions: OperationalMissionSummaryItem[];
  maintenanceCount: number;
  maintenanceBreakdown: {
    urgent: number;
    inProgress: number;
    scheduled: number;
  };
  pendingConvoysCount: number;
  pendingConvoysBreakdown: {
    newRequests: number;
    analyzing: number;
    quoteSent: number;
  };
}

export interface DashboardData {
  company: Company | null;
  kpis: DashboardKpis;
  statusDistribution: StatusDistributionItem[];
  costBreakdown: CostBreakdownItem[];
  fuelWeeklyConsumption: FuelWeeklyItem[];
  upcomingMaintenance: UpcomingMaintenanceItem[];
  alertCategoriesCount: AlertCategoryItem[];
  recentActivities: RecentActivityItem[];
  operationalSummary?: OperationalSummaryData;
  telematics: {
    isDemoMode: boolean;
    provider: string;
    circulatingCount: number;
    vehicles: TelematicsVehicle[];
  };
}

export type ConvoyStatus = 
  | 'NEW'
  | 'ANALYZING'
  | 'QUOTE_SENT'
  | 'ACCEPTED'
  | 'PLANNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED';

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
  reference: string;
  company_id: string | null;
  user_id: string | null;
  status: ConvoyStatus;

  // Vehicle info
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_year: number;
  vehicle_plate?: string;
  is_registered: boolean;
  vehicle_color: string;
  vehicle_condition: 'good' | 'medium' | 'breakdown' | 'damaged' | 'non_running' | 'other';
  condition_details?: string;
  photos?: string[];
  requires_flatbed: boolean;

  // Convoy info
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

  // Requester info
  client_name: string;
  client_company?: string;
  client_email: string;
  client_phone: string;
  client_country: string;

  special_instructions?: string;
  privacy_accepted: boolean;

  internal_notes?: string;
  assigned_driver_id?: string;
  assigned_driver?: { id: string; first_name: string; last_name: string; phone: string } | null;
  quote_amount?: number;
  price_estimated?: number;
  invoice_id?: string;
  linked_invoice?: any;
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
  invoice_number: string;
  emef_code: string;
  company_id: string;
  user_id?: string | null;
  client_name?: string;
  client_email?: string;
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
  tax_rate: number;
  discount: number;
  amount_ht: number;
  amount_tva: number;
  amount_ttc: number;
  currency: string;
  status: InvoiceStatus;
  payment_method?: string;
  payment_date?: string;
  transaction_ref?: string;
  pdf_url?: string;
  items_breakdown: InvoiceItemBreakdown[];
  created_at: string;
  updated_at: string;
}

export interface UserDetailInfo {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  site_name?: string;
  role: string;
  role_label?: string;
  is_active: boolean;
  avatar_url?: string;
  created_at?: string;
  last_login?: string;
}

export interface UserDetailSheet {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: RoleId;
  role_label: string;
  company: Company | null;
  site?: any;
  is_active: boolean;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  vehicles: any[];
  invoices: Invoice[];
  convoys: ConvoyRequest[];
  documents: any[];
  permissions: any[];
  history: any[];
  user: UserDetailInfo;
}

export interface ChatAttachment {
  type: 'vehicle' | 'convoy' | 'location' | 'document' | 'alert';
  reference_id: string;
  title: string;
  details?: string;
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

export interface ChatChannel {
  id: string;
  name: string;
  description?: string;
  type: 'channel' | 'direct';
  company_id?: string | null;
  members?: string[];
  unread_count?: number;
  message_count?: number;
  last_message?: ChatMessage;
  created_at: string;
  updated_at: string;
}

export interface ChatOnlineUser {
  id: string;
  name: string;
  role: string;
  company_id?: string | null;
  avatar_url?: string;
  last_seen: string;
}

export interface AuditLogChange {
  field: string;
  old_value: any;
  new_value: any;
}

export interface AuditLogEntry {
  id: string;
  company_id: string | null;
  company_name?: string;
  user_id?: string;
  user_name: string;
  user_role: string;
  entity_type: string;
  entity_id?: string;
  action: string;
  description: string;
  severity: 'info' | 'success' | 'warning' | 'critical';
  compliance_tag?: 'ROLE_CHANGE' | 'INVOICE_MODIFICATION' | 'PASSWORD_RESET' | 'ACCOUNT_STATUS' | 'USER_UPDATE' | 'INVOICE_CREATION' | 'FLEET_OPERATION' | string;
  ip_address?: string;
  user_agent?: string;
  changes?: AuditLogChange[];
  hash_checksum?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface AuditMetrics {
  total_events: number;
  role_changes: number;
  invoice_modifications: number;
  critical_security_events: number;
  warning_events: number;
  unique_operators: number;
  integrity_status: string;
}
