import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { Sidebar } from './components/layout/Sidebar.js';
import { TopBar } from './components/layout/TopBar.js';
import { DashboardShell } from './components/dashboard/DashboardShell.js';
import { VehiclesListView } from './components/vehicles/VehiclesListView.js';
import { VehicleDetailView } from './components/vehicles/VehicleDetailView.js';
import { VehicleRegistrationModal } from './components/vehicles/VehicleRegistrationModal.js';
import { PublicWebsiteView } from './components/public/PublicWebsiteView.js';
import { MobileAppPreview } from './components/mobile/MobileAppPreview.js';
import { LoginView } from './components/auth/LoginView.js';
import { MaintenanceView } from './components/maintenance/MaintenanceView.js';
import { FuelTrackingView } from './components/fuel/FuelTrackingView.js';
import { DocumentsComplianceView } from './components/documents/DocumentsComplianceView.js';
import { TelematicsView } from './components/telematics/TelematicsView.js';
import { DriversView } from './components/drivers/DriversView.js';
import { FinanceTcoView } from './components/finance/FinanceTcoView.js';
import { MissionOrdersView } from './components/missions/MissionOrdersView.js';
import { VehicleReservationsView } from './components/pool/VehicleReservationsView.js';
import { ProactiveAlertsCenterView } from './components/alerts/ProactiveAlertsCenterView.js';
import { CompanySettingsView } from './components/company/CompanySettingsView.js';
import { AdminConsoleView } from './components/admin/AdminConsoleView.js';
import { AuditLogView } from './components/admin/AuditLogView.js';
import { BillingView } from './components/billing/BillingView.js';
import { ReportsExportsView } from './components/reports/ReportsExportsView.js';
import { ConvoyManagementView } from './components/convoy/ConvoyManagementView.js';
import { ConvoyPublicFormView } from './components/convoy/ConvoyPublicFormView.js';
import { ChatView } from './components/chat/ChatView.js';
import { QuickChatDrawer } from './components/chat/QuickChatDrawer.js';
import { OfflineIndicator } from './components/common/OfflineIndicator.js';
import { useChat } from './hooks/useChat.js';
import { RefreshCw, Car, Wrench, Fuel, FileText, Smartphone, Globe, LayoutDashboard, ShieldCheck, Truck, MessageSquare, UserPlus, LogIn } from 'lucide-react';

function AppContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [mode, setMode] = useState<'platform' | 'public'>('platform');
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [currentView, setCurrentView] = useState<string>('admin_console');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('veh_peugeot_3008');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isNewVehicleModalOpen, setIsNewVehicleModalOpen] = useState<boolean>(false);

  const chat = useChat(user);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center space-y-4 text-white">
        <RefreshCw className="w-10 h-10 text-sky-500 animate-spin" />
        <p className="text-sm font-semibold tracking-wide">Initialisation de JMF Fleet & Mobility...</p>
      </div>
    );
  }

  // Public website view
  if (mode === 'public') {
    return (
      <PublicWebsiteView
        onGoToApp={(tab) => {
          if (tab) setAuthTab(tab);
          setMode('platform');
        }}
      />
    );
  }

  // If not authenticated, display login screen
  if (!isAuthenticated) {
    return (
      <LoginView
        initialTab={authTab}
        onGoToPublic={() => setMode('public')}
        onSuccess={() => setMode('platform')}
      />
    );
  }

  const handleSelectVehicle = (id: string) => {
    setSelectedVehicleId(id);
    setCurrentView('vehicle_detail');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Application Mode Switcher Bar */}
      <div className="bg-[#081020] text-slate-400 text-xs px-4 py-1.5 flex items-center justify-between border-b border-slate-800 z-30">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold text-slate-300">JMF Mobilité • Environnement Opérationnel</span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-[10px] text-sky-400 font-mono">Tenant actif: {user?.role}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-2 py-0.5 rounded-sm text-[11px] font-bold transition-colors flex items-center gap-1 ${
              currentView === 'dashboard' ? 'bg-sky-600 text-white' : 'hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3 h-3" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setCurrentView('admin_console')}
            className={`px-2 py-0.5 rounded-sm text-[11px] font-bold transition-colors flex items-center gap-1 ${
              currentView.startsWith('admin_') || currentView === 'settings_rbac'
                ? 'bg-indigo-600 text-white'
                : 'hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Administration</span>
          </button>
          <button
            onClick={() => setCurrentView('convoy_management')}
            className={`px-2 py-0.5 rounded-sm text-[11px] font-bold transition-colors flex items-center gap-1 ${
              currentView.startsWith('convoy') ? 'bg-amber-600 text-white' : 'hover:text-white'
            }`}
          >
            <Truck className="w-3 h-3" />
            <span>Convoyage</span>
          </button>
          <button
            onClick={() => setCurrentView('mobile_preview')}
            className={`px-2 py-0.5 rounded-sm text-[11px] font-bold transition-colors flex items-center gap-1 ${
              currentView === 'mobile_preview' ? 'bg-sky-600 text-white' : 'hover:text-white'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>App Conducteur</span>
          </button>
          <button
            onClick={() => {
              setAuthTab('register');
              setCurrentView('auth_portal');
            }}
            className={`px-2 py-0.5 rounded-sm text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer ${
              currentView === 'auth_portal'
                ? 'bg-sky-600 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <UserPlus className="w-3 h-3 text-sky-400" />
            <span>Connexion & Enregistrement</span>
          </button>
          <button
            onClick={() => setMode('public')}
            className="px-2 py-0.5 rounded-sm text-[11px] font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Globe className="w-3 h-3" />
            <span>Site Public</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar Navigation */}
        <Sidebar
          currentView={currentView}
          onNavigate={(view) => {
            setCurrentView(view);
          }}
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
          {/* Top Bar */}
          <TopBar
            onToggleMobileMenu={() => setIsSidebarOpen(!isSidebarOpen)}
            onNavigatePublicWebsite={() => setMode('public')}
            onNavigateView={(view) => setCurrentView(view)}
          />

          {/* Dynamic Route View */}
          <main className="flex-1 pb-16">
            {currentView === 'dashboard' && (
              <DashboardShell
                onSelectVehicle={handleSelectVehicle}
                onNavigateView={(view) => setCurrentView(view)}
              />
            )}

            {(currentView.startsWith('fleet_') || currentView === 'fleet_list' || currentView === 'fleet') && (
              <VehiclesListView
                currentSubView={currentView}
                onSelectVehicle={handleSelectVehicle}
                onOpenNewVehicleModal={() => setIsNewVehicleModalOpen(true)}
                onNavigateSubView={(subView) => setCurrentView(subView)}
              />
            )}

            {currentView === 'vehicle_detail' && (
              <VehicleDetailView
                vehicleId={selectedVehicleId}
                onBack={() => setCurrentView('fleet_all')}
              />
            )}

            {currentView === 'mobile_preview' && (
              <MobileAppPreview />
            )}

            {/* Modular Views for all sidebar sections */}
            {(currentView.startsWith('maintenance') || currentView === 'maintenance') && (
              <MaintenanceView
                currentSubView={currentView}
                onNavigateSubView={(subView) => setCurrentView(subView)}
              />
            )}

            {(currentView.startsWith('fuel') || currentView === 'fuel') && (
              <FuelTrackingView
                currentSubView={currentView}
                onNavigateSubView={(subView) => setCurrentView(subView)}
              />
            )}

            {(currentView.startsWith('docs_') || currentView === 'documents') && (
              <DocumentsComplianceView
                currentSubView={currentView}
                onNavigateSubView={(subView) => setCurrentView(subView)}
              />
            )}

            {(currentView.startsWith('telematics') || currentView === 'telematics') && (
              <TelematicsView
                currentSubView={currentView}
                onNavigateSubView={(subView) => setCurrentView(subView)}
              />
            )}

            {(currentView.startsWith('drivers') || currentView === 'drivers') && (
              <DriversView
                currentSubView={currentView}
                onNavigateSubView={(subView) => setCurrentView(subView)}
              />
            )}

            {(currentView.startsWith('mission_') || currentView === 'missions') && (
              <MissionOrdersView />
            )}

            {currentView === 'convoy_public_form' && (
              <div className="bg-slate-50 min-h-screen py-4">
                <ConvoyPublicFormView
                  onBack={() => setCurrentView('convoy_management')}
                />
              </div>
            )}

            {(currentView === 'convoy_management' || (currentView.startsWith('convoy_') && currentView !== 'convoy_public_form')) && (
              <ConvoyManagementView
                onNavigateView={(view) => setCurrentView(view)}
                onOpenNewForm={() => setCurrentView('convoy_public_form')}
              />
            )}

            {(currentView.startsWith('pool_') || currentView === 'reservations' || currentView === 'pool') && (
              <VehicleReservationsView />
            )}

            {(currentView === 'proactive_alerts' || currentView.startsWith('alerts_') || currentView === 'alerts') && (
              <ProactiveAlertsCenterView />
            )}

            {(currentView.startsWith('finance') || currentView === 'finance') && (
              <FinanceTcoView
                currentSubView={currentView}
                onNavigateSubView={(subView) => setCurrentView(subView)}
              />
            )}

            {(currentView.startsWith('reports') || currentView === 'reports') && (
              <ReportsExportsView
                currentSubView={currentView}
                onNavigateSubView={(subView) => setCurrentView(subView)}
              />
            )}

            {(currentView.startsWith('billing') || currentView === 'billing') && (
              <BillingView
                currentSubView={currentView}
                onNavigateSubView={(subView) => setCurrentView(subView)}
              />
            )}

            {(currentView === 'audit_logs' || currentView === 'admin_audit') && (
              <AuditLogView
                currentSubView={currentView}
                onNavigateSubView={(subView) => setCurrentView(subView)}
              />
            )}

            {(currentView === 'admin_console' || (currentView.startsWith('admin_') && currentView !== 'admin_audit') || currentView === 'settings_rbac') && (
              <AdminConsoleView
                currentSubView={currentView}
                onNavigateSubView={(subView) => setCurrentView(subView)}
              />
            )}

            {(currentView.startsWith('company') || currentView === 'settings_general') && (
              <CompanySettingsView
                currentSubView={currentView}
                onNavigateSubView={(subView) => setCurrentView(subView)}
              />
            )}

            {currentView === 'chat' && (
              <ChatView
                chat={chat}
                currentUser={user}
                onNavigateVehicle={(vehId) => {
                  setSelectedVehicleId(vehId);
                  setCurrentView('vehicle_detail');
                }}
                onNavigateConvoy={() => setCurrentView('convoy_management')}
              />
            )}

            {currentView === 'auth_portal' && (
              <div className="p-4 sm:p-6 max-w-4xl mx-auto">
                <div className="mb-4 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1.5 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs"
                  >
                    ← Retour au tableau de bord
                  </button>
                  <span className="text-xs text-slate-500 font-medium">
                    Session active : <strong className="text-slate-800">{user?.first_name} {user?.last_name}</strong> ({user?.role})
                  </span>
                </div>
                <LoginView
                  initialTab="register"
                  onSuccess={() => setCurrentView('dashboard')}
                />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Floating Instant Chat Widget (available across all views except full chat) */}
      {currentView !== 'chat' && (
        <QuickChatDrawer
          chat={chat}
          currentUser={user}
          onOpenFullChat={() => setCurrentView('chat')}
        />
      )}

      {/* Vehicle Registration Modal */}
      <VehicleRegistrationModal
        isOpen={isNewVehicleModalOpen}
        onClose={() => setIsNewVehicleModalOpen(false)}
        onVehicleCreated={() => {
          setCurrentView('fleet_list');
        }}
      />

      {/* PWA Offline Connectivity Status Banner */}
      <OfflineIndicator />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
