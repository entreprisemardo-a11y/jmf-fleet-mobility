import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Car,
  Users,
  Wrench,
  Fuel,
  FileText,
  FileCheck,
  Calendar,
  Bell,
  ShieldAlert,
  DollarSign,
  Radio,
  BarChart3,
  Receipt,
  Settings,
  ShieldCheck,
  Activity,
  Truck,
  MessageSquare,
  X,
  ChevronRight,
  UserPlus,
} from 'lucide-react';
import { JmfLogo } from '../common/JmfLogo.js';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

interface NavSection {
  title: string;
  items: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    badgeColor?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isOpen,
  onCloseMobile,
}) => {
  const sections: NavSection[] = [
    {
      title: 'TABLEAU DE BORD',
      items: [
        { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
        { id: 'chat', label: 'Messagerie Instantanée', icon: MessageSquare, badge: 'Live', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
      ],
    },
    {
      title: 'MA SOCIÉTÉ',
      items: [
        { id: 'company_info', label: 'Informations société', icon: Building2 },
        { id: 'company_sites', label: 'Sites / Agences', icon: Building2 },
        { id: 'company_users', label: 'Utilisateurs', icon: Users },
        { id: 'company_documents', label: 'Documents société', icon: FileText },
      ],
    },
    {
      title: 'MA FLOTTE',
      items: [
        { id: 'fleet_all', label: 'Tous les véhicules', icon: Car, badge: 125, badgeColor: 'bg-sky-500/20 text-sky-300' },
        { id: 'fleet_active', label: 'Véhicules actifs', icon: Car, badge: 115, badgeColor: 'bg-emerald-500/20 text-emerald-300' },
        { id: 'fleet_available', label: 'Disponibles', icon: Car, badge: 18, badgeColor: 'bg-indigo-500/20 text-indigo-300' },
        { id: 'fleet_maintenance', label: 'Immobilisés / Atelier', icon: Car, badge: 7, badgeColor: 'bg-amber-500/20 text-amber-300' },
        { id: 'fleet_retired', label: 'Réformés', icon: Car, badge: 3, badgeColor: 'bg-slate-500/20 text-slate-300' },
      ],
    },
    {
      title: 'CONDUCTEURS',
      items: [
        { id: 'drivers_list', label: 'Liste des conducteurs', icon: Users, badge: 5, badgeColor: 'bg-sky-500/20 text-sky-300' },
        { id: 'drivers_licenses', label: 'Permis & Documents', icon: FileText, badge: 1, badgeColor: 'bg-amber-500/20 text-amber-300' },
        { id: 'drivers_assignments', label: 'Affectations', icon: Users, badge: 5, badgeColor: 'bg-emerald-500/20 text-emerald-300' },
      ],
    },
    {
      title: 'DÉPLACEMENTS & MISSIONS',
      items: [
        { id: 'convoy_management', label: 'Convoyage Automobile', icon: Truck, badge: 'Nouveau', badgeColor: 'bg-amber-500/20 text-amber-300' },
        { id: 'mission_orders', label: 'Ordres de mission & Route', icon: FileCheck, badge: 'PDF', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
        { id: 'pool_reservations', label: 'Réservations Pool & Partage', icon: Calendar, badge: 'Pool', badgeColor: 'bg-sky-500/20 text-sky-300' },
      ],
    },
    {
      title: 'MAINTENANCE',
      items: [
        { id: 'maintenance_schedule', label: 'Planning entretiens', icon: Wrench },
        { id: 'maintenance_orders', label: 'Ordres de travail', icon: Wrench },
        { id: 'maintenance_breakdowns', label: 'Pannes signalées', icon: Wrench, badge: 3, badgeColor: 'bg-rose-500/20 text-rose-300' },
        { id: 'maintenance_tires', label: 'Pneumatiques', icon: Wrench },
      ],
    },
    {
      title: 'CARBURANT',
      items: [
        { id: 'fuel_entries', label: 'Pleins carburant', icon: Fuel, badge: 5, badgeColor: 'bg-sky-500/20 text-sky-300' },
        { id: 'fuel_consumption', label: 'Consommation', icon: Fuel, badge: 1, badgeColor: 'bg-rose-500/20 text-rose-300' },
        { id: 'fuel_cards', label: 'Cartes carburant', icon: Fuel, badge: 3, badgeColor: 'bg-emerald-500/20 text-emerald-300' },
      ],
    },
    {
      title: 'DOCUMENTS & CONFORMITÉ',
      items: [
        { id: 'proactive_alerts', label: 'Centre Alertes & Relances', icon: ShieldAlert, badge: 12, badgeColor: 'bg-rose-500/20 text-rose-300' },
        { id: 'docs_insurance', label: 'Assurances', icon: FileText, badge: 18, badgeColor: 'bg-rose-500/20 text-rose-300' },
        { id: 'docs_inspections', label: 'Visites techniques', icon: FileText, badge: 23, badgeColor: 'bg-amber-500/20 text-amber-300' },
        { id: 'docs_others', label: 'Autres documents', icon: FileText },
      ],
    },
    {
      title: 'COÛTS & FINANCES',
      items: [
        { id: 'finance_cost_per_vehicle', label: 'Coût par véhicule', icon: DollarSign },
        { id: 'finance_cost_per_km', label: 'Coût par km', icon: DollarSign },
        { id: 'finance_tco', label: 'Total Cost of Ownership', icon: DollarSign },
      ],
    },
    {
      title: 'TÉLÉMATIQUE',
      items: [
        { id: 'telematics_live', label: 'Suivi en temps réel', icon: Radio },
        { id: 'telematics_geofence', label: 'Géorepérage', icon: Radio },
        { id: 'telematics_alerts', label: 'Alertes et événements', icon: Radio },
      ],
    },
    {
      title: 'RAPPORTS',
      items: [
        { id: 'reports_overview', label: 'Rapports', icon: BarChart3 },
        { id: 'reports_exports', label: 'Exports', icon: BarChart3 },
      ],
    },
    {
      title: 'FACTURATION',
      items: [
        { id: 'billing_invoices', label: 'Factures', icon: Receipt },
        { id: 'billing_payments', label: 'Paiements & Règlements', icon: Receipt },
      ],
    },
    {
      title: 'ADMINISTRATION & SÉCURITÉ',
      items: [
        { id: 'admin_console', label: 'Console Administration', icon: ShieldCheck, badge: 'IAM', badgeColor: 'bg-indigo-500/20 text-indigo-300' },
        { id: 'audit_logs', label: 'Journal d’Audit & Conformité', icon: Activity, badge: 'ISO 27001', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
        { id: 'settings_general', label: 'Paramètres Entreprise', icon: Building2 },
        { id: 'settings_rbac', label: 'Matrice des Rôles RBAC', icon: Settings },
        { id: 'auth_portal', label: 'Inscription & Connexion', icon: UserPlus, badge: 'Accès', badgeColor: 'bg-sky-500/20 text-sky-300' },
      ],
    },
  ];

  const isNavItemActive = (itemId: string, view: string): boolean => {
    if (view === itemId) return true;

    switch (itemId) {
      case 'fleet_all':
        return view === 'fleet_list' || view === 'fleet' || view === 'vehicle_detail';
      case 'convoy_management':
        return view === 'convoy_public_form' || (view.startsWith('convoy') && view !== 'convoy_management');
      case 'audit_logs':
        return view === 'admin_audit';
      case 'admin_console':
        return view === 'admin_users' || view === 'admin_tenants' || view === 'admin_system' || (view.startsWith('admin_') && view !== 'admin_audit');
      case 'settings_rbac':
        return view === 'rbac' || view === 'roles';
      case 'settings_general':
        return view === 'company_settings' || view === 'settings';
      case 'company_info':
        return view === 'company';
      case 'drivers_list':
        return view === 'drivers';
      case 'mission_orders':
        return view === 'missions' || (view.startsWith('mission_') && view !== 'mission_orders');
      case 'pool_reservations':
        return view === 'reservations' || (view.startsWith('pool_') && view !== 'pool_reservations');
      case 'maintenance_schedule':
        return view === 'maintenance';
      case 'fuel_entries':
        return view === 'fuel';
      case 'docs_insurance':
        return view === 'documents';
      case 'proactive_alerts':
        return view === 'alerts' || view.startsWith('alerts_');
      case 'finance_tco':
        return view === 'finance';
      case 'telematics_live':
        return view === 'telematics';
      case 'reports_overview':
        return view === 'reports';
      case 'billing_invoices':
        return view === 'billing';
      default:
        return false;
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-72 bg-[#0B1528] text-slate-300 border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header with Logo */}
        <div className="flex items-center justify-between px-5 pt-4 pb-4 border-b border-slate-800/80 bg-[#081020]">
          <div className="flex items-center gap-2">
            <JmfLogo variant="dark" className="h-11" />
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
          {sections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                {section.title}
              </div>
              <nav className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = isNavItemActive(item.id, currentView);
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      id={`sidebar-nav-${item.id}`}
                      onClick={() => {
                        onNavigate(item.id);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30 font-semibold'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge !== undefined ? (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                            isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      ) : (
                        isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-[#081020] text-[10px] text-slate-400 text-center leading-relaxed">
          <div>© 2026 JMF Fleet & Mobility</div>
          <div className="text-slate-400 font-mono text-[9px] mt-0.5">Tous droits réservés • v1.0.0</div>
        </div>
      </aside>
    </>
  );
};
