import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Calendar,
  Bell,
  ChevronDown,
  Building,
  LogOut,
  User,
  ShieldCheck,
  ExternalLink,
  Check,
  MessageSquare,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { PWAInstallButton } from '../common/PWAInstallButton.js';

interface TopBarProps {
  onToggleMobileMenu: () => void;
  onNavigatePublicWebsite?: () => void;
  onNavigateView?: (view: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onToggleMobileMenu,
  onNavigatePublicWebsite,
  onNavigateView,
}) => {
  const { user, company, accessibleCompanies, logout, switchCompany, login } = useAuth();
  const [showCompanyMenu, setShowCompanyMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const companyMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (companyMenuRef.current && !companyMenuRef.current.contains(event.target as Node)) {
        setShowCompanyMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setShowNotificationMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQuickRoleSwitch = async (email: string, pass: string) => {
    setShowUserMenu(false);
    await login(email, pass);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white border-b border-slate-200/80 shadow-xs">
      {/* Left section: Hamburger & Tenant Selector */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 -ml-2 text-slate-600 rounded-lg hover:bg-slate-100 lg:hidden"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Company / Tenant Selector Dropdown */}
        <div className="relative" ref={companyMenuRef}>
          <button
            onClick={() => setShowCompanyMenu(!showCompanyMenu)}
            className="flex items-center gap-2.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200 transition-colors"
          >
            <Building className="w-4 h-4 text-sky-600 shrink-0" />
            <span className="max-w-[160px] sm:max-w-[200px] truncate">
              {company ? company.name : 'JMF Mobility Services (Global)'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          </button>

          {/* Tenant Switcher Dropdown */}
          {showCompanyMenu && (
            <div className="absolute left-0 mt-1.5 w-72 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase text-slate-600 tracking-wider">
                Entreprises accessibles (Multi-tenant)
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                {accessibleCompanies.map((c) => {
                  const isSelected = company?.id === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        switchCompany(c.id);
                        setShowCompanyMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-left text-xs transition-colors hover:bg-slate-50 ${
                        isSelected ? 'bg-sky-50 font-semibold text-sky-700' : 'text-slate-700'
                      }`}
                    >
                      <div className="truncate">
                        <div className="truncate">{c.name}</div>
                        <div className="text-[10px] text-slate-600 truncate">{c.city}, {c.country} • {c.currency}</div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-sky-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center section: Global Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un véhicule, un conducteur, une immatriculation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right section: Date period, Notifications, Signature, User profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* PWA In-App Install Prompt */}
        <PWAInstallButton variant="compact" />

        {/* Date Period Indicator */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>01/05/2026 - 31/05/2026</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </div>

        {/* Instant Chat Dispatch Button */}
        <button
          onClick={() => onNavigateView?.('chat')}
          className="relative p-2 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          title="Messagerie instantanée & Dispatch"
          aria-label="Messagerie instantanée"
        >
          <MessageSquare className="w-4 h-4 text-amber-600" />
          <span className="absolute top-1 right-1 flex items-center justify-center w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={() => setShowNotificationMenu(!showNotificationMenu)}
            className="relative p-2 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-rose-500 rounded-full">
              12
            </span>
          </button>

          {/* Notifications Dropdown */}
          {showNotificationMenu && (
            <div className="absolute right-0 mt-1.5 w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Alertes & Notifications</span>
                <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">12 actives</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 text-xs">
                <div className="p-3 hover:bg-slate-50 transition-colors">
                  <div className="font-semibold text-rose-600">Assurance expirée (3 véhicules)</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">Iveco Daily BJ-7890-KL et 2 autres non conformes.</div>
                  <div className="text-[10px] text-slate-400 mt-1">Aujourd’hui</div>
                </div>
                <div className="p-3 hover:bg-slate-50 transition-colors">
                  <div className="font-semibold text-amber-600">Visite technique à échéance (6 véhicules)</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">Échéance dans moins de 30 jours (Peugeot 3008 BJ-1234-CD).</div>
                  <div className="text-[10px] text-slate-400 mt-1">Aujourd’hui</div>
                </div>
                <div className="p-3 hover:bg-slate-50 transition-colors">
                  <div className="font-semibold text-amber-600">Maintenance en retard (4 véhicules)</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">Entretiens et révisions périodiques dépassés.</div>
                  <div className="text-[10px] text-slate-400 mt-1">Hier</div>
                </div>
              </div>

              <div className="p-2 border-t border-slate-100 bg-slate-50 rounded-b-xl">
                <button
                  onClick={() => {
                    setShowNotificationMenu(false);
                    onNavigateView?.('proactive_alerts');
                  }}
                  className="w-full py-1.5 px-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-center text-[11px] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Ouvrir le Centre d'Alertes & Relances</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Official Slogan/Signature */}
        <div className="hidden 2xl:flex items-center pr-2 text-right">
          <div className="italic text-[11px] font-semibold tracking-wide bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
            « Votre mobilité, notre performance ! »
          </div>
        </div>

        {/* User Profile */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1 text-left rounded-lg hover:bg-slate-100 transition-colors"
          >
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256'}
              alt={user ? `${user.first_name} ${user.last_name}` : 'Utilisateur'}
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
            />
            <div className="hidden sm:block text-left leading-tight">
              <div className="text-xs font-bold text-slate-800">
                {user ? `${user.first_name} ${user.last_name}` : 'Jean KOUASSI'}
              </div>
              <div className="text-[10px] text-slate-500">
                {user?.role === 'SUPER_ADMIN_JMF' ? 'Super Admin JMF' : 'Administrateur'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-1.5 w-72 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <div className="text-xs font-bold text-slate-900">{user?.first_name} {user?.last_name}</div>
                <div className="text-[11px] text-slate-500">{user?.email}</div>
                <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-100 text-sky-700">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Rôle: {user?.role}</span>
                </div>
              </div>

              {/* Fast Role Switchers for testing */}
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-600 tracking-wider">
                Changer d'utilisateur (Test & Évaluation)
              </div>
              <div className="px-2 space-y-0.5 text-xs">
                <button
                  onClick={() => handleQuickRoleSwitch('jean.kouassi@societe-cliente.com', 'jmf2026')}
                  className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-100 flex items-center justify-between text-slate-700"
                >
                  <span>Jean KOUASSI (Admin SARL)</span>
                  {user?.email === 'jean.kouassi@societe-cliente.com' && <Check className="w-3.5 h-3.5 text-sky-600" />}
                </button>
                <button
                  onClick={() => handleQuickRoleSwitch('admin@jmf-mobility.com', 'admin123')}
                  className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-100 flex items-center justify-between text-slate-700"
                >
                  <span>Super Admin JMF (Global)</span>
                  {user?.email === 'admin@jmf-mobility.com' && <Check className="w-3.5 h-3.5 text-sky-600" />}
                </button>
                <button
                  onClick={() => handleQuickRoleSwitch('koffi.aman@societe-cliente.com', 'jmf2026')}
                  className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-100 flex items-center justify-between text-slate-700"
                >
                  <span>Koffi AMAN (Fleet Manager)</span>
                  {user?.email === 'koffi.aman@societe-cliente.com' && <Check className="w-3.5 h-3.5 text-sky-600" />}
                </button>
                <button
                  onClick={() => handleQuickRoleSwitch('pierre.dossou@societe-cliente.com', 'jmf2026')}
                  className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-100 flex items-center justify-between text-slate-700"
                >
                  <span>Pierre DOSSOU (Conducteur)</span>
                  {user?.email === 'pierre.dossou@societe-cliente.com' && <Check className="w-3.5 h-3.5 text-sky-600" />}
                </button>
                <button
                  onClick={() => handleQuickRoleSwitch('marc.allagbe@bollore-logistics.com', 'bollore2026')}
                  className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-100 flex items-center justify-between text-slate-700"
                >
                  <span>Marc ALLAGBE (Admin Bolloré)</span>
                  {user?.email === 'marc.allagbe@bollore-logistics.com' && <Check className="w-3.5 h-3.5 text-sky-600" />}
                </button>
              </div>

              <div className="my-1.5 border-t border-slate-100"></div>

              {onNavigateView && (
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigateView('auth_portal');
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-sky-700 hover:bg-sky-50 flex items-center gap-2 font-medium"
                >
                  <UserPlus className="w-4 h-4 text-sky-600" />
                  <span>S'enregistrer / Nouvelle flotte</span>
                </button>
              )}

              {onNavigatePublicWebsite && (
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigatePublicWebsite();
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                  <span>Voir le site public JMF</span>
                </button>
              )}

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                }}
                className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
