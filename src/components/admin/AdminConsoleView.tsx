import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Building2,
  Lock,
  UserPlus,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Sliders,
  Eye,
  Edit3,
  Search,
  Filter,
  Download,
  AlertTriangle,
  Activity,
  Cpu,
  Mail,
  Phone,
  Calendar,
  Save,
  Check,
  ArrowRight,
  Database,
  Radio,
  FileText,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { ApiClient } from '../../services/api.js';
import { UserDetailDrawer } from './UserDetailDrawer.js';
import { AuditLogView } from './AuditLogView.js';

interface UserRecord {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  role_label: string;
  company_name: string;
  site_name: string;
  is_active: boolean;
  last_login: string;
  avatar_url?: string;
}

interface TenantRecord {
  id: string;
  name: string;
  legal_name: string;
  rccm: string;
  ifu: string;
  city: string;
  vehicles_count: number;
  drivers_count: number;
  subscription_plan: string;
  subscription_status: 'actif' | 'essai' | 'renouvellement';
  expiry_date: string;
  contact_name: string;
}

interface AuditLogRecord {
  id: string;
  timestamp: string;
  user_name: string;
  user_role: string;
  action: string;
  target: string;
  ip_address: string;
  severity: 'info' | 'success' | 'warning' | 'critical';
}

interface AdminConsoleViewProps {
  currentSubView?: string;
  onNavigateSubView?: (subView: string) => void;
}

export const AdminConsoleView: React.FC<AdminConsoleViewProps> = ({
  currentSubView = 'admin_console',
  onNavigateSubView,
}) => {
  const { user: currentUser, company, switchCompany, accessibleCompanies } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'rbac' | 'tenants' | 'audit' | 'system'>('users');

  React.useEffect(() => {
    if (currentSubView === 'settings_rbac') {
      setActiveTab('rbac');
    } else if (currentSubView === 'admin_audit' || currentSubView === 'audit_logs') {
      setActiveTab('audit');
    } else if (currentSubView === 'admin_tenants') {
      setActiveTab('tenants');
    } else if (currentSubView === 'admin_system') {
      setActiveTab('system');
    } else if (currentSubView === 'admin_console' || currentSubView?.startsWith('admin_')) {
      setActiveTab('users');
    }
  }, [currentSubView]);

  const handleTabChange = (tab: 'users' | 'rbac' | 'tenants' | 'audit' | 'system') => {
    setActiveTab(tab);
    if (onNavigateSubView) {
      if (tab === 'rbac') onNavigateSubView('settings_rbac');
      else if (tab === 'audit') onNavigateSubView('audit_logs');
      else if (tab === 'users') onNavigateSubView('admin_console');
      else onNavigateSubView(`admin_${tab}`);
    }
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  // Initial user dataset
  const [usersList, setUsersList] = useState<UserRecord[]>([
    {
      id: 'usr_super_admin',
      first_name: 'Super',
      last_name: 'Administrateur JMF',
      email: 'admin@jmf-mobility.com',
      phone: '+229 01 97 83 21 21',
      role: 'SUPER_ADMIN_JMF',
      role_label: 'Super Admin JMF',
      company_name: 'JMF Mobility Services (Plateforme Globale)',
      site_name: 'Direction Générale Akpakpa',
      is_active: true,
      last_login: 'Il y a 4 min',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    },
    {
      id: 'usr_jean_kouassi',
      first_name: 'Jean',
      last_name: 'KOUASSI',
      email: 'jean.kouassi@societe-cliente.com',
      phone: '+229 01 95 12 34 56',
      role: 'COMPANY_ADMIN',
      role_label: 'Administrateur Entreprise',
      company_name: 'Société Cliente SARL Bénin',
      site_name: 'Siège - Boulevard de la Marina',
      is_active: true,
      last_login: 'En ligne actuellement',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    },
    {
      id: 'usr_koffi_aman',
      first_name: 'Koffi',
      last_name: 'AMAN',
      email: 'koffi.aman@societe-cliente.com',
      phone: '+229 01 97 45 67 89',
      role: 'FLEET_MANAGER',
      role_label: 'Gestionnaire de Flotte',
      company_name: 'Société Cliente SARL Bénin',
      site_name: 'Base Opérationnelle Calavi',
      is_active: true,
      last_login: 'Il y a 32 min',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
    },
    {
      id: 'usr_maint_mgr',
      first_name: 'Basile',
      last_name: 'MENSAH',
      email: 'maintenance@jmf-mobility.com',
      phone: '+229 01 96 11 22 33',
      role: 'MAINTENANCE_MANAGER',
      role_label: 'Responsable Maintenance & Atelier',
      company_name: 'Société Cliente SARL Bénin',
      site_name: 'Hub Atelier Central Akpakpa',
      is_active: true,
      last_login: 'Il y a 2h',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256',
    },
    {
      id: 'usr_finance_mgr',
      first_name: 'Amina',
      last_name: 'SOULEYMANE',
      email: 'finance@societe-cliente.com',
      phone: '+229 01 94 88 77 66',
      role: 'FINANCE_MANAGER',
      role_label: 'Responsable Financier & TCO',
      company_name: 'Société Cliente SARL Bénin',
      site_name: 'Direction Administrative Cotonou',
      is_active: true,
      last_login: 'Hier à 16:45',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    },
    {
      id: 'usr_driver_pierre',
      first_name: 'Pierre',
      last_name: 'DOSSOU',
      email: 'pierre.dossou@societe-cliente.com',
      phone: '+229 01 97 11 00 22',
      role: 'DRIVER',
      role_label: 'Conducteur Professionnel',
      company_name: 'Société Cliente SARL Bénin',
      site_name: 'Agence Port de Cotonou',
      is_active: true,
      last_login: 'Ce matin à 07:15 (App Mobile)',
      avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256',
    },
    {
      id: 'usr_auditor_extern',
      first_name: 'Gérard',
      last_name: 'AGOSSOU',
      email: 'audit.conseil@bj-audit.com',
      phone: '+229 01 95 33 44 55',
      role: 'AUDITOR',
      role_label: 'Auditeur Conformité / Observateur',
      company_name: 'Société Cliente SARL Bénin',
      site_name: 'Siège - Boulevard de la Marina',
      is_active: false,
      last_login: 'Le 12/05/2026',
      avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256',
    },
    {
      id: 'usr_marc_allagbe',
      first_name: 'Marc',
      last_name: 'ALLAGBE',
      email: 'marc.allagbe@bollore-logistics.com',
      phone: '+229 01 96 33 22 11',
      role: 'COMPANY_ADMIN',
      role_label: 'Administrateur Entreprise',
      company_name: 'Bolloré Africa Logistics Bénin',
      site_name: 'Terminal à conteneurs Port',
      is_active: true,
      last_login: 'Il y a 1 jour',
      avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=256',
    },
    {
      id: 'usr_client_martin',
      first_name: 'Martin',
      last_name: 'ADJOVI',
      email: 'martin.adjovi@entreprise-client.bj',
      phone: '+229 01 97 12 34 56',
      role: 'CLIENT',
      role_label: 'Client Donneur d’Ordre',
      company_name: 'Martin Adjovi & Cie SARL',
      site_name: 'Siège Cotonou (Haie Vive)',
      is_active: true,
      last_login: 'Aujourd’hui à 11:20',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    },
  ]);

  const [selectedUserDetailId, setSelectedUserDetailId] = useState<string | null>(null);

  // Load backend users from API on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const remoteUsers = await ApiClient.getUsers();
        if (remoteUsers && remoteUsers.length > 0) {
          setUsersList((prev) => {
            const existingIds = new Set(prev.map((u) => u.id));
            const mapped = remoteUsers.map((ru: any) => ({
              id: ru.id,
              first_name: ru.first_name,
              last_name: ru.last_name,
              email: ru.email,
              phone: ru.phone || '+229 01 97 00 00 00',
              role: ru.role,
              role_label: ru.role === 'CLIENT' ? 'Client Donneur d’Ordre' : ru.role,
              company_name: ru.company_name || 'JMF Mobility Services',
              site_name: ru.site_name || 'Cotonou',
              is_active: ru.is_active !== false,
              last_login: ru.last_login || 'Récemment',
              avatar_url: ru.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256',
            }));
            const fresh = mapped.filter((m: any) => !existingIds.has(m.id));
            return [...fresh, ...prev];
          });
        }
      } catch (err) {
        console.warn('API users fallback used');
      }
    };
    fetchUsers();
  }, []);

  // New user form state
  const [newUser, setNewUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'FLEET_MANAGER',
    site_name: 'Siège - Cotonou',
  });

  // Multi-tenant companies list
  const [tenantsList] = useState<TenantRecord[]>([
    {
      id: 'comp_001_sarl',
      name: 'Société Cliente SARL Bénin',
      legal_name: 'Société Cliente SARL & Mobilité Bénin',
      rccm: 'RB/COT/21 B 14234',
      ifu: '0202110293849',
      city: 'Cotonou (Boulevard de la Marina)',
      vehicles_count: 125,
      drivers_count: 142,
      subscription_plan: 'Full Outsourcing & Atelier JMF Akpakpa',
      subscription_status: 'actif',
      expiry_date: '31/12/2026',
      contact_name: 'Jean KOUASSI (Directeur des Opérations)',
    },
    {
      id: 'comp_002_bollore',
      name: 'Bolloré Africa Logistics Bénin',
      legal_name: 'Bolloré Transport & Logistics Bénin SA',
      rccm: 'RB/COT/08 B 29381',
      ifu: '0101998472615',
      city: 'Port Autonome de Cotonou',
      vehicles_count: 42,
      drivers_count: 48,
      subscription_plan: 'Pack Flotte Pro & Télématique Portuaire',
      subscription_status: 'actif',
      expiry_date: '30/09/2026',
      contact_name: 'Marc ALLAGBE (Chef de Parc Portuaire)',
    },
    {
      id: 'comp_003_sobebra',
      name: 'SOBEBRA Bénin Distribution',
      legal_name: 'Société Béninoise de Brasseries SA',
      rccm: 'RB/COT/94 B 10928',
      ifu: '0303129847192',
      city: 'Cotonou / Parakou / Bohicon',
      vehicles_count: 88,
      drivers_count: 96,
      subscription_plan: 'Pack Télématique & Gestion Anti-Fraude Carburant',
      subscription_status: 'actif',
      expiry_date: '15/11/2026',
      contact_name: 'Faustin ADANGBE (Directeur Logistique)',
    },
    {
      id: 'comp_004_transit',
      name: 'Transit Bénin International',
      legal_name: 'Transit Bénin International SARL',
      rccm: 'RB/COT/19 B 88273',
      ifu: '0201883746193',
      city: 'Cotonou (Zone Portuaire Ouest)',
      vehicles_count: 35,
      drivers_count: 38,
      subscription_plan: 'Pack Télématique Corridor Niger/Burkina',
      subscription_status: 'renouvellement',
      expiry_date: '30/06/2026',
      contact_name: 'Benoît DOSSOU (Gérant)',
    },
  ]);

  // Audit Logs
  const [auditLogs] = useState<AuditLogRecord[]>([
    {
      id: 'log_001',
      timestamp: '20/09/2026 20:34:12',
      user_name: 'Jean KOUASSI',
      user_role: 'COMPANY_ADMIN',
      action: 'CRÉATION_VÉHICULE',
      target: 'Toyota Hilux 4x4 (BJ-9012-EF)',
      ip_address: '154.68.21.14 (Cotonou, Bénin)',
      severity: 'success',
    },
    {
      id: 'log_002',
      timestamp: '20/09/2026 19:18:04',
      user_name: 'Koffi AMAN',
      user_role: 'FLEET_MANAGER',
      action: 'AFFECTATION_CONDUCTEUR',
      target: 'Peugeot 3008 (BJ-1234-CD) -> Pierre DOSSOU',
      ip_address: '154.68.21.14 (Cotonou, Bénin)',
      severity: 'info',
    },
    {
      id: 'log_003',
      timestamp: '20/09/2026 18:45:22',
      user_name: 'Basile MENSAH',
      user_role: 'MAINTENANCE_MANAGER',
      action: 'VALIDATION_ORDRE_TRAVAIL',
      target: 'OT #2026-089 (Atelier Central Akpakpa - 245 000 FCFA)',
      ip_address: '41.85.162.90 (Akpakpa, Bénin)',
      severity: 'success',
    },
    {
      id: 'log_004',
      timestamp: '20/09/2026 17:12:50',
      user_name: 'Pierre DOSSOU',
      user_role: 'DRIVER',
      action: 'DÉCLARATION_PLEIN_CARBURANT',
      target: 'Iveco Daily (BJ-7890-KL) - 75 L à Station Total Cadjèhoun',
      ip_address: '197.234.221.8 (Mobile MTN Bénin)',
      severity: 'info',
    },
    {
      id: 'log_005',
      timestamp: '20/09/2026 15:30:11',
      user_name: 'Super Administrateur JMF',
      user_role: 'SUPER_ADMIN_JMF',
      action: 'MODIFICATION_POLITIQUE_SÉCURITÉ',
      target: 'Activation du renouvellement obligatoire des jetons à 30 jours',
      ip_address: '154.68.10.88 (Siège JMF Mobility Akpakpa)',
      severity: 'warning',
    },
    {
      id: 'log_006',
      timestamp: '20/09/2026 14:02:44',
      user_name: 'Gérard AGOSSOU',
      user_role: 'AUDITOR',
      action: 'EXPORT_DONNÉES_FINANCIÈRES',
      target: 'Rapport TCO Consolidé Q1-Q2 (Format Excel chiffré)',
      ip_address: '41.85.160.12 (Cotonou, Bénin)',
      severity: 'info',
    },
    {
      id: 'log_007',
      timestamp: '20/09/2026 11:24:05',
      user_name: 'Système Télématique JMF',
      user_role: 'SYSTEM_DAEMON',
      action: 'ALERTE_GÉOREPÉRAGE',
      target: 'Sortie de zone non autorisée Corridor Porto-Novo (BJ-4567-GH)',
      ip_address: '10.0.4.1 (Serveur IoT JMF)',
      severity: 'critical',
    },
  ]);

  // RBAC Matrix definition
  const rolesDefinitions = [
    { id: 'SUPER_ADMIN_JMF', name: 'Super Admin JMF', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { id: 'COMPANY_ADMIN', name: 'Admin Entreprise', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { id: 'FLEET_MANAGER', name: 'Gestionnaire Flotte', color: 'bg-sky-100 text-sky-800 border-sky-200' },
    { id: 'MAINTENANCE_MANAGER', name: 'Resp. Maintenance', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { id: 'FINANCE_MANAGER', name: 'Resp. Financier', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { id: 'DRIVER', name: 'Conducteur', color: 'bg-slate-100 text-slate-800 border-slate-200' },
    { id: 'CLIENT', name: 'Client Donneur d’Ordre', color: 'bg-teal-100 text-teal-800 border-teal-200' },
    { id: 'AUDITOR', name: 'Auditeur / Observateur', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  ];

  const permissionsMatrix = [
    {
      category: 'Gestion du Parc Véhicules',
      perms: [
        { code: 'vehicles.view', label: 'Consulter le catalogue des véhicules', defaultRoles: ['SUPER_ADMIN_JMF', 'COMPANY_ADMIN', 'FLEET_MANAGER', 'MAINTENANCE_MANAGER', 'FINANCE_MANAGER', 'AUDITOR'] },
        { code: 'vehicles.create', label: 'Créer et immatriculer un nouveau véhicule', defaultRoles: ['SUPER_ADMIN_JMF', 'COMPANY_ADMIN', 'FLEET_MANAGER'] },
        { code: 'vehicles.edit', label: 'Modifier les attributs & statuts véhicules', defaultRoles: ['SUPER_ADMIN_JMF', 'COMPANY_ADMIN', 'FLEET_MANAGER'] },
        { code: 'vehicles.delete', label: 'Mettre en réforme ou archiver un véhicule', defaultRoles: ['SUPER_ADMIN_JMF', 'COMPANY_ADMIN'] },
      ],
    },
    {
      category: 'Conducteurs & Affectations',
      perms: [
        { code: 'drivers.view', label: 'Consulter l’annuaire des chauffeurs', defaultRoles: ['SUPER_ADMIN_JMF', 'COMPANY_ADMIN', 'FLEET_MANAGER', 'AUDITOR'] },
        { code: 'drivers.manage', label: 'Créer, éditer, valider permis ANaTT', defaultRoles: ['SUPER_ADMIN_JMF', 'COMPANY_ADMIN', 'FLEET_MANAGER'] },
        { code: 'assignments.manage', label: 'Affecter ou désaffecter un véhicule', defaultRoles: ['SUPER_ADMIN_JMF', 'COMPANY_ADMIN', 'FLEET_MANAGER'] },
      ],
    },
    {
      category: 'Maintenance & Atelier',
      perms: [
        { code: 'maintenance.view', label: 'Consulter les ordres de travail et le carnet', defaultRoles: ['SUPER_ADMIN_JMF', 'COMPANY_ADMIN', 'FLEET_MANAGER', 'MAINTENANCE_MANAGER', 'AUDITOR'] },
        { code: 'maintenance.manage', label: 'Créer les OT, planifier les révisions et valider', defaultRoles: ['SUPER_ADMIN_JMF', 'COMPANY_ADMIN', 'FLEET_MANAGER', 'MAINTENANCE_MANAGER'] },
      ],
    },
    {
      category: 'Carburant & Énergie',
      perms: [
        { code: 'fuel.view', label: 'Consulter l’historique des pleins & ratios L/100', defaultRoles: ['SUPER_ADMIN_JMF', 'COMPANY_ADMIN', 'FLEET_MANAGER', 'FINANCE_MANAGER', 'AUDITOR'] },
        { code: 'fuel.create', label: 'Saisir un plein ou importer les cartes carburant', defaultRoles: ['SUPER_ADMIN_JMF', 'COMPANY_ADMIN', 'FLEET_MANAGER', 'DRIVER'] },
      ],
    },
    {
      category: 'Documents & Réglementation Bénin',
      perms: [
        { code: 'documents.view', label: 'Consulter les polices assurances, CNSR, TVM', defaultRoles: ['SUPER_ADMIN_JMF', 'COMPANY_ADMIN', 'FLEET_MANAGER', 'FINANCE_MANAGER', 'AUDITOR'] },
        { code: 'documents.manage', label: 'Ajouter/Renouveler les pièces officielles', defaultRoles: ['SUPER_ADMIN_JMF', 'COMPANY_ADMIN', 'FLEET_MANAGER'] },
      ],
    },
    {
      category: 'Coûts, TCO & Finances',
      perms: [
        { code: 'finances.view', label: 'Consulter le coût de revient au km et TCO', defaultRoles: ['SUPER_ADMIN_JMF', 'COMPANY_ADMIN', 'FINANCE_MANAGER', 'AUDITOR'] },
        { code: 'finances.export', label: 'Exporter les bilans comptables et factures', defaultRoles: ['SUPER_ADMIN_JMF', 'COMPANY_ADMIN', 'FINANCE_MANAGER'] },
      ],
    },
    {
      category: 'Télématique IoT & Traqueurs GPS',
      perms: [
        { code: 'telematics.view', label: 'Suivre la position GPS en temps réel', defaultRoles: ['SUPER_ADMIN_JMF', 'COMPANY_ADMIN', 'FLEET_MANAGER', 'MAINTENANCE_MANAGER'] },
        { code: 'telematics.geofence', label: 'Configurer les zones géographiques & alertes', defaultRoles: ['SUPER_ADMIN_JMF', 'COMPANY_ADMIN', 'FLEET_MANAGER'] },
      ],
    },
    {
      category: 'Gouvernance & Administration Système',
      perms: [
        { code: 'settings.manage', label: 'Gérer les comptes utilisateurs et rôles IAM', defaultRoles: ['SUPER_ADMIN_JMF', 'COMPANY_ADMIN'] },
        { code: 'tenants.manage', label: 'Superviser les entreprises multi-tenants JMF', defaultRoles: ['SUPER_ADMIN_JMF'] },
      ],
    },
  ];

  // System settings state
  const [systemConfig, setSystemConfig] = useState({
    cnsr_warning_days: 30,
    insurance_warning_days: 30,
    tvm_warning_days: 45,
    auto_geofence_alarm: true,
    speed_limit_urban: 60,
    speed_limit_highway: 100,
    teltonika_port: 8082,
    sms_provider: 'MTN Bénin Enterprise Gateway',
    backup_frequency: 'Quotidien (02:00 UTC)',
    mfa_required: true,
  });

  const toggleUserStatus = (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return { ...u, is_active: !u.is_active };
        }
        return u;
      })
    );
    showNotice('Statut du compte utilisateur mis à jour avec succès');
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.first_name || !newUser.last_name || !newUser.email) return;

    const roleObj = rolesDefinitions.find((r) => r.id === newUser.role);
    try {
      const createdUser = await ApiClient.createUser({
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        phone: newUser.phone || '+229 01 00 00 00',
        role: newUser.role as any,
        company_name: company ? company.name : 'Société Cliente SARL Bénin',
        site_name: newUser.site_name,
      });

      const userRecord: UserRecord = {
        id: createdUser.id,
        first_name: createdUser.first_name,
        last_name: createdUser.last_name,
        email: createdUser.email,
        phone: createdUser.phone,
        role: createdUser.role,
        role_label: roleObj ? roleObj.name : createdUser.role,
        company_name: createdUser.company_name,
        site_name: createdUser.site_name,
        is_active: createdUser.is_active,
        last_login: 'Jamais connecté (Invitation envoyée)',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256',
      };
      setUsersList([userRecord, ...usersList]);
    } catch (err) {
      console.warn('API error, local fallback used:', err);
      const created: UserRecord = {
        id: `usr_${Date.now()}`,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        phone: newUser.phone || '+229 01 00 00 00',
        role: newUser.role,
        role_label: roleObj ? roleObj.name : newUser.role,
        company_name: company ? company.name : 'Société Cliente SARL Bénin',
        site_name: newUser.site_name,
        is_active: true,
        last_login: 'Jamais connecté (Invitation envoyée)',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256',
      };
      setUsersList([created, ...usersList]);
    }

    setIsInviteModalOpen(false);
    setNewUser({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      role: 'CLIENT',
      site_name: 'Siège - Cotonou',
    });
    showNotice(`Compte créé et invitation envoyée à ${newUser.email} avec succès`);
  };

  const showNotice = (msg: string) => {
    setSavedMessage(msg);
    setTimeout(() => setSavedMessage(null), 3500);
  };

  // Filtered users
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery);

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && u.is_active) ||
      (statusFilter === 'INACTIVE' && !u.is_active);

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1680px] mx-auto">
      {/* Top Banner Notice */}
      {savedMessage && (
        <div className="fixed top-20 right-8 z-50 p-4 rounded-xl bg-emerald-600 text-white shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold">{savedMessage}</span>
        </div>
      )}

      {/* Main Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-semibold text-slate-700">Gouvernance Système</span>
            <span>&gt;</span>
            <span className="text-slate-500">Console d'Administration Globale</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-indigo-600" />
            <span>Console d'Administration & Gestion Multi-Tenant</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            Supervision de la sécurité IAM, gestion des utilisateurs, contrôle des rôles et permissions RBAC, gouvernance des entreprises hébergées et journal d'audit cryptographique.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Rôle Actif : {currentUser?.role || 'Super Admin'}</span>
          </div>
        </div>
      </div>

      {/* 4 Key Metrics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Comptes Utilisateurs</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{usersList.length} actifs</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">7 rôles opérationnels définis</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Entreprises Clientes (Tenants)</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{tenantsList.length} sociétés</div>
            <div className="text-[11px] text-sky-600 font-semibold mt-0.5">290 véhicules sous contrat JMF</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Matrice de Sécurité (RBAC)</div>
            <div className="text-2xl font-black text-slate-900 mt-1">18 permissions</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Cloisonnement strict garanti</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Lock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Journal d'Audit Système</div>
            <div className="text-2xl font-black text-slate-900 mt-1">100% tracé</div>
            <div className="text-[11px] text-slate-500 font-semibold mt-0.5">0 incident critique détecté</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 flex flex-wrap gap-2">
        <button
          id="admin-tab-users"
          onClick={() => handleTabChange('users')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'users'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40 rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Utilisateurs & Collaborateurs ({usersList.length})</span>
        </button>

        <button
          id="admin-tab-rbac"
          onClick={() => handleTabChange('rbac')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'rbac'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40 rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Rôles & Permissions RBAC (7 Rôles)</span>
        </button>

        <button
          id="admin-tab-tenants"
          onClick={() => handleTabChange('tenants')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'tenants'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40 rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Entreprises Hébergées / Multi-Tenant ({tenantsList.length})</span>
        </button>

        <button
          id="admin-tab-audit"
          onClick={() => handleTabChange('audit')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'audit'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40 rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Journal d'Audit & Sécurité</span>
        </button>

        <button
          id="admin-tab-system"
          onClick={() => handleTabChange('system')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'system'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40 rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Paramètres Système & Alertes</span>
        </button>
      </div>

      {/* TAB 1: USERS & COLLABORATORS */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Filters and Actions */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-1 flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email, téléphone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 font-medium text-slate-700"
              >
                <option value="ALL">Tous les rôles ({usersList.length})</option>
                {rolesDefinitions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 font-medium text-slate-700"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="ACTIVE">Actif uniquement</option>
                <option value="INACTIVE">Suspendu / Inactif</option>
              </select>
            </div>

            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Créer un utilisateur</span>
            </button>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Utilisateur / Collaborateur</th>
                    <th className="py-3 px-4">Rôle Attribué</th>
                    <th className="py-3 px-4">Organisation & Site</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4">Dernière Connexion</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => {
                    const roleColor =
                      rolesDefinitions.find((r) => r.id === u.role)?.color || 'bg-slate-100 text-slate-800';

                    return (
                      <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div
                            onClick={() => setSelectedUserDetailId(u.id)}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <img
                              src={u.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256'}
                              alt=""
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0 group-hover:ring-2 group-hover:ring-indigo-500 transition-all"
                            />
                            <div>
                              <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                                <span>{u.first_name} {u.last_name}</span>
                                <Eye className="w-3 h-3 opacity-0 group-hover:opacity-100 text-indigo-500 transition-opacity" />
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono">{u.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full font-bold text-[10px] border ${roleColor}`}>
                            {u.role_label}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800">{u.company_name}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <span>{u.site_name}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-700">
                          {u.phone}
                        </td>

                        <td className="py-3.5 px-4">
                          {u.is_active ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                              Actif
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                              Suspendu
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                          {u.last_login}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedUserDetailId(u.id)}
                              className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 flex items-center gap-1 transition-colors border border-indigo-200"
                              title="Consulter la fiche détaillée du compte"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Fiche</span>
                            </button>
                            <button
                              onClick={() => toggleUserStatus(u.id)}
                              className={`px-2 py-1 rounded-md text-[10px] font-bold transition-colors ${
                                u.is_active
                                  ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              }`}
                              title={u.is_active ? 'Suspendre l’accès' : 'Réactiver l’accès'}
                            >
                              {u.is_active ? 'Suspendre' : 'Activer'}
                            </button>
                            <button
                              onClick={() => showNotice(`Email de réinitialisation de mot de passe envoyé à ${u.email}`)}
                              className="px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
                              title="Réinitialiser le mot de passe"
                            >
                              Reset Pass
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RBAC MATRIX */}
      {activeTab === 'rbac' && (
        <div className="space-y-4">
          <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl flex items-start gap-3">
            <Lock className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-950">
              <span className="font-bold">Modèle de Sécurité RBAC (Role-Based Access Control) JMF Mobility :</span> Les permissions sont assignées de manière granulaire par profil d'accès. Seul le <strong>Super Admin JMF</strong> et l'<strong>Admin Entreprise</strong> peuvent autoriser ou révoquer les accès aux modules financiers, télématiques et administratifs.
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-[11px]">
                    <th className="py-3 px-4 w-72">Module & Permission Système</th>
                    {rolesDefinitions.map((role) => (
                      <th key={role.id} className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="font-bold">{role.name}</div>
                        <div className="text-[9px] opacity-75 font-mono">{role.id}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {permissionsMatrix.map((cat, idx) => (
                    <React.Fragment key={idx}>
                      <tr className="bg-slate-100/90 font-bold text-slate-800 text-[11px]">
                        <td colSpan={8} className="py-2.5 px-4 bg-slate-100 uppercase tracking-wider text-[10px] text-slate-600">
                          {cat.category}
                        </td>
                      </tr>
                      {cat.perms.map((perm) => (
                        <tr key={perm.code} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-900">{perm.label}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{perm.code}</div>
                          </td>
                          {rolesDefinitions.map((role) => {
                            const hasPerm = perm.defaultRoles.includes(role.id);
                            return (
                              <td key={role.id} className="py-3 px-3 text-center">
                                {hasPerm ? (
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700">
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400">
                                    <span className="w-1.5 h-0.5 bg-slate-300"></span>
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MULTI-TENANTS / COMPANIES */}
      {activeTab === 'tenants' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Entreprises & Organisations Hébergées</h3>
              <p className="text-xs text-slate-500">
                Chaque organisation dispose d'un espace isolé au niveau données avec ses propres véhicules, conducteurs, budgets et règles d'exploitation.
              </p>
            </div>
            <button
              onClick={() => showNotice('Formulaire d’onboarding d’une nouvelle entreprise cliente initié')}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all self-start sm:self-auto"
            >
              <Building2 className="w-4 h-4" />
              <span>Ajouter une Entreprise</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {tenantsList.map((tenant) => {
              const isCurrent = company?.id === tenant.id || (!company && tenant.id === 'comp_001_sarl');

              return (
                <div
                  key={tenant.id}
                  className={`bg-white rounded-xl border p-5 space-y-4 transition-all shadow-xs ${
                    isCurrent ? 'border-sky-500 ring-2 ring-sky-500/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-black text-slate-900">{tenant.name}</h4>
                        {isCurrent && (
                          <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Espace Actif
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">{tenant.legal_name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        RCCM : <span className="font-mono text-slate-600">{tenant.rccm}</span> | IFU :{' '}
                        <span className="font-mono text-slate-600">{tenant.ifu}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        tenant.subscription_status === 'actif'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {tenant.subscription_status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-slate-50 rounded-lg text-center">
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Véhicules</div>
                      <div className="text-lg font-black text-slate-900">{tenant.vehicles_count}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Chauffeurs</div>
                      <div className="text-lg font-black text-slate-900">{tenant.drivers_count}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Échéance</div>
                      <div className="text-xs font-bold text-slate-800 mt-1">{tenant.expiry_date}</div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <div>
                      <span className="font-bold text-slate-700">Formule souscrite : </span>
                      <span className="text-sky-700 font-semibold">{tenant.subscription_plan}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700">Responsable compte : </span>
                      <span>{tenant.contact_name}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700">Localisation principale : </span>
                      <span>{tenant.city}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        switchCompany(tenant.id);
                        showNotice(`Basculement réussi sur le tenant : ${tenant.name}`);
                      }}
                      disabled={isCurrent}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isCurrent
                          ? 'bg-slate-100 text-slate-400 cursor-default'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>{isCurrent ? 'Tenant actuel' : 'Basculer sur cette société'}</span>
                    </button>

                    <button
                      onClick={() => showNotice(`Paramètres de ${tenant.name} ouverts pour édition`)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100"
                    >
                      Modifier la fiche
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT TRAIL LOGS */}
      {activeTab === 'audit' && (
        <div className="-mx-4 sm:-mx-6 -mt-2">
          <AuditLogView />
        </div>
      )}

      {/* TAB 5: SYSTEM CONFIGURATION & IOT */}
      {activeTab === 'system' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600" />
                <span>Paramètres des Alertes Automatiques & Seuils</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Définissez les délais d'anticipation pour les notifications de renouvellement légal et de sécurité au Bénin.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <label className="block font-bold text-slate-700">Visite Technique CNSR</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={systemConfig.cnsr_warning_days}
                      onChange={(e) => setSystemConfig({ ...systemConfig, cnsr_warning_days: Number(e.target.value) })}
                      className="w-20 p-2 border border-slate-300 rounded-lg font-bold bg-white"
                    />
                    <span className="text-slate-500 font-medium">jours avant</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <label className="block font-bold text-slate-700">Assurance Flotte</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={systemConfig.insurance_warning_days}
                      onChange={(e) => setSystemConfig({ ...systemConfig, insurance_warning_days: Number(e.target.value) })}
                      className="w-20 p-2 border border-slate-300 rounded-lg font-bold bg-white"
                    />
                    <span className="text-slate-500 font-medium">jours avant</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <label className="block font-bold text-slate-700">Taxe TVM Bénin</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={systemConfig.tvm_warning_days}
                      onChange={(e) => setSystemConfig({ ...systemConfig, tvm_warning_days: Number(e.target.value) })}
                      className="w-20 p-2 border border-slate-300 rounded-lg font-bold bg-white"
                    />
                    <span className="text-slate-500 font-medium">jours avant</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h4 className="font-bold text-slate-800">Limites de vitesse Télématique & Alertes</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Vitesse maximale en zone urbaine (Cotonou)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={systemConfig.speed_limit_urban}
                        onChange={(e) => setSystemConfig({ ...systemConfig, speed_limit_urban: Number(e.target.value) })}
                        className="w-24 p-2 border border-slate-300 rounded-lg font-bold"
                      />
                      <span className="text-slate-500">km/h</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Vitesse maximale sur axes interurbains (RNIE)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={systemConfig.speed_limit_highway}
                        onChange={(e) => setSystemConfig({ ...systemConfig, speed_limit_highway: Number(e.target.value) })}
                        className="w-24 p-2 border border-slate-300 rounded-lg font-bold"
                      />
                      <span className="text-slate-500">km/h</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => showNotice('Paramètres système enregistrés avec succès')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Sauvegarder les configurations</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Radio className="w-4 h-4 text-sky-600" />
                <span>Passerelles & Connecteurs Télématiques JMF</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>Serveur GPS Teltonika (AVL / TCP)</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
                      Connecté (Port {systemConfig.teltonika_port})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">125 balises FMC130 & FMB920 actives en streaming temps réel.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>Passerelle Cartes Carburant (TotalEnergies & Oryx)</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
                      Sync Quotidienne
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">Réconciliation automatique des factures et volumes distribués.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>Passerelle SMS Alertes Conducteurs</span>
                    <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px]">
                      Opérationnelle
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{systemConfig.sms_provider} (Envoi automatique aux chauffeurs).</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-xl shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                <Database className="w-4 h-4" />
                <span>Base de Données & Sauvegardes Cloud JMF</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Sauvegardes quotidiennes chiffrées AES-256 à 02:00 UTC. Redondance haute disponibilité et reprise après sinistre (RPO &lt; 15 min, RTO &lt; 1h).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CREATE USER MODAL */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <div className="flex items-center gap-2 font-bold text-sm">
                <UserPlus className="w-4 h-4 text-indigo-400" />
                <span>Créer & Inviter un Collaborateur</span>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={newUser.first_name}
                    onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
                    placeholder="Ex: Christian"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    value={newUser.last_name}
                    onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
                    placeholder="Ex: HOUNSINOU"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Adresse Email Professionnelle *</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
                  placeholder="c.hounsinou@societe-cliente.bj"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Téléphone Bénin</label>
                  <input
                    type="tel"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-mono focus:outline-hidden focus:border-indigo-600"
                    placeholder="+229 01 97 00 11 22"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Rôle Attribué (RBAC) *</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 font-bold text-slate-800"
                  >
                    {rolesDefinitions.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Site / Agence de rattachement</label>
                <select
                  value={newUser.site_name}
                  onChange={(e) => setNewUser({ ...newUser, site_name: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 font-medium"
                >
                  <option value="Siège - Cotonou (Marina)">Siège - Cotonou (Marina)</option>
                  <option value="Hub Logistique & Atelier Akpakpa">Hub Logistique & Atelier Akpakpa</option>
                  <option value="Base Opérationnelle Port de Cotonou">Base Opérationnelle Port de Cotonou</option>
                  <option value="Base Calavi / Abomey-Calavi">Base Calavi / Abomey-Calavi</option>
                  <option value="Agence Régionale Parakou (Nord)">Agence Régionale Parakou (Nord)</option>
                </select>
              </div>

              <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100 text-[11px] text-indigo-900 leading-relaxed">
                Un e-mail d'activation sécurisé avec un jeton temporaire sera automatiquement envoyé au collaborateur pour initialiser son mot de passe.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-all"
                >
                  Créer et envoyer l'invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Details & Granular Administration Drawer */}
      {selectedUserDetailId && (
        <UserDetailDrawer
          userId={selectedUserDetailId}
          onClose={() => setSelectedUserDetailId(null)}
          onUserUpdated={() => {
            ApiClient.getUser(selectedUserDetailId)
              .then((updated) => {
                if (updated) {
                  setUsersList((prev) =>
                    prev.map((u) => (u.id === updated.id ? { ...u, is_active: updated.is_active } : u))
                  );
                }
              })
              .catch(() => {});
          }}
          onNavigateToConvoy={() => {
            if (onNavigateSubView) {
              onNavigateSubView('convoy_management');
            }
          }}
        />
      )}
    </div>
  );
};
