import React, { useState, useEffect } from 'react';
import {
  Car,
  CheckCircle2,
  Wrench,
  AlertTriangle,
  FileX2,
  FileCheck,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  MapPin,
  Fuel,
  ShieldAlert,
  ChevronRight,
  Navigation,
  RefreshCw,
  Info,
  Truck,
  Compass,
  ArrowRight,
  Activity,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { ApiClient } from '../../services/api.js';
import { DashboardData } from '../../types/index.js';

interface DashboardShellProps {
  onSelectVehicle?: (id: string) => void;
  onNavigateView?: (view: string) => void;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  onSelectVehicle,
  onNavigateView,
}) => {
  const { user, company } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await ApiClient.getDashboardKpis();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des indicateurs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [company?.id]);

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <RefreshCw className="w-8 h-8 text-sky-600 animate-spin" />
        <div className="text-sm font-medium text-slate-600">Chargement des données de votre flotte...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-800">Erreur de chargement</h3>
        <p className="text-sm text-slate-600">{error || 'Données introuvables'}</p>
        <button
          onClick={fetchDashboard}
          className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const { kpis, statusDistribution, costBreakdown, fuelWeeklyConsumption, upcomingMaintenance, alertCategoriesCount, recentActivities, telematics, operationalSummary } = data;

  const activeMissionsCount = operationalSummary?.activeMissionsCount ?? kpis.activeMissions ?? 2;
  const maintenanceCount = operationalSummary?.maintenanceCount ?? kpis.maintenanceVehicles ?? 7;
  const pendingConvoysCount = operationalSummary?.pendingConvoysCount ?? kpis.pendingConvoys ?? 3;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1680px] mx-auto">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Bonjour {user?.first_name || 'Jean'} {user?.last_name || 'KOUASSI'}</span>
            <span className="text-2xl">👋</span>
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Voici la vue d’ensemble de votre flotte • <span className="font-semibold text-slate-700">{company?.name || 'Société Cliente SARL'}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateView && onNavigateView('proactive_alerts')}
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 shadow-xs transition-all cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>Alertes & Relances (12)</span>
          </button>
          <button
            onClick={() => onNavigateView && onNavigateView('pool_reservations')}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-xs transition-all cursor-pointer"
          >
            <Car className="w-3.5 h-3.5 text-sky-600" />
            <span>Pool Partagé</span>
          </button>
          <button
            onClick={() => onNavigateView && onNavigateView('mission_orders')}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-xs transition-all cursor-pointer"
          >
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ordres de mission (PDF)</span>
          </button>
          <button
            onClick={fetchDashboard}
            className="p-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-xs transition-all cursor-pointer"
            title="Actualiser les indicateurs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          </button>
          <button
            onClick={() => onNavigateView && onNavigateView('fleet_all')}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 shadow-sm shadow-sky-600/20 transition-all cursor-pointer"
          >
            <Car className="w-4 h-4" />
            <span>Flotte</span>
          </button>
        </div>
      </div>

      {/* TOP-LEVEL SUMMARY SECTION: Critical Operations KPIs with Data Visualization Cards */}
      <section id="critical-operations-summary" aria-label="Synthèse opérationnelle prioritaire" className="space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
            </span>
            <h2 className="text-xs font-black text-slate-900 tracking-wider uppercase flex items-center gap-2">
              <span>Opérations Critiques & Priorités du Jour</span>
            </h2>
            <span className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-full">
              Flux temps réel
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Mis à jour en continu</span>
            </span>
          </div>
        </div>

        {/* The 3 Critical KPI Data Visualization Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
          {/* CARD 1: Active Missions */}
          <div
            id="kpi-card-active-missions"
            className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-sm hover:border-emerald-300/80 transition-all p-5 flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                      Missions Actives
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">Déplacements flotte en direct</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  En transit
                </span>
              </div>

              {/* Big Metric Display & Trend */}
              <div className="py-3 flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                      {activeMissionsCount}
                    </span>
                    <span className="text-xs font-bold text-slate-500">ordres en cours</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Sur 4 programmés aujourd’hui</p>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50/80 px-2 py-1 rounded-md border border-emerald-100/80">
                  +1 départ à 14h
                </span>
              </div>

              {/* Data Visualization 1: Route Trajectories & Progress */}
              <div className="space-y-2 my-2">
                {/* Mission Trajectory 1 */}
                <div className="bg-slate-50/90 p-2.5 rounded-lg border border-slate-200/70 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      Cotonou ➔ Parakou
                    </span>
                    <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                      65% • Bohicon
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: '65%' }} />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500">
                    <span className="truncate">Hilux 4x4 • BJ-9012-GH (P. Dossou)</span>
                    <span className="font-semibold text-slate-700 shrink-0">1 150 km</span>
                  </div>
                </div>

                {/* Mission Trajectory 2 */}
                <div className="bg-slate-50/90 p-2.5 rounded-lg border border-slate-200/70 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      Cotonou ➔ GDIZ Glo-Djigbé
                    </span>
                    <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                      85% • Calavi
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: '85%' }} />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500">
                    <span className="truncate">Iveco Frigo • BJ-3456-IJ (K. Aman)</span>
                    <span className="font-semibold text-slate-700 shrink-0">110 km</span>
                  </div>
                </div>
              </div>

              {/* Data Visualization 2: 7-day Activity Sparkline */}
              <div className="pt-3 pb-1 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Cadence 7j (Moy. 3.2 / j)</span>
                </div>
                {/* SVG Sparkline */}
                <div className="w-24 h-6">
                  <svg viewBox="0 0 70 20" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="missionSparkGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <polygon points="0,20 0,14 11,8 23,12 35,4 47,8 58,2 70,10 70,20" fill="url(#missionSparkGradient)" />
                    <polyline points="0,14 11,8 23,12 35,4 47,8 58,2 70,10" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="58" cy="2" r="2.5" fill="#10B981" />
                  </svg>
                </div>
              </div>

              {/* Operational Chips */}
              <div className="grid grid-cols-3 gap-1.5 pt-2 text-[10px] font-semibold text-slate-600 text-center">
                <div className="bg-slate-50 py-1 px-1.5 rounded border border-slate-100">
                  <div className="text-slate-900 font-bold">1 260 km</div>
                  <div className="text-slate-400 font-normal">en transit</div>
                </div>
                <div className="bg-slate-50 py-1 px-1.5 rounded border border-slate-100">
                  <div className="text-slate-900 font-bold">145 L</div>
                  <div className="text-slate-400 font-normal">carburant</div>
                </div>
                <div className="bg-slate-50 py-1 px-1.5 rounded border border-slate-100">
                  <div className="text-emerald-700 font-bold">100%</div>
                  <div className="text-slate-400 font-normal">conforme</div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              id="btn-navigate-missions"
              onClick={() => onNavigateView && onNavigateView('mission_orders')}
              className="mt-4 w-full py-2.5 px-3 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Consulter les ordres de mission</span>
              <ArrowRight className="w-3.5 h-3.5 ml-auto text-emerald-600" />
            </button>
          </div>

          {/* CARD 2: Vehicles in Maintenance */}
          <div
            id="kpi-card-vehicles-maintenance"
            className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-sm hover:border-amber-300/80 transition-all p-5 flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                      Véhicules en Maintenance
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">Atelier, immobilisations & révisions</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Atelier
                </span>
              </div>

              {/* Big Metric Display & Trend */}
              <div className="py-3 flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                      {maintenanceCount}
                    </span>
                    <span className="text-xs font-bold text-slate-500">véhicules immobilisés</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Soit 5.6% de l'effectif global de la flotte</p>
                </div>
                <span className="text-[11px] font-bold text-rose-700 bg-rose-50/80 px-2 py-1 rounded-md border border-rose-100/80">
                  1 critique
                </span>
              </div>

              {/* Data Visualization 1: Segmented Severity Stacked Bar */}
              <div className="space-y-1.5 my-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-700">Répartition de la charge atelier</span>
                  <span className="text-[10px] font-semibold text-slate-500">7 interventions</span>
                </div>
                {/* Horizontal Segmented Bar */}
                <div className="w-full h-3 bg-slate-100 rounded-full flex overflow-hidden p-0.5 gap-0.5">
                  <div className="h-full bg-rose-500 rounded-l-full transition-all" style={{ width: '14%' }} title="1 Urgent (14%)" />
                  <div className="h-full bg-amber-500 transition-all" style={{ width: '29%' }} title="2 En cours atelier (29%)" />
                  <div className="h-full bg-sky-500 rounded-r-full transition-all" style={{ width: '57%' }} title="4 Planifiés (57%)" />
                </div>
                {/* Legend tags */}
                <div className="grid grid-cols-3 gap-1 text-[10px] font-semibold pt-1">
                  <div className="flex items-center gap-1 text-rose-700 bg-rose-50/60 px-1.5 py-0.5 rounded border border-rose-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                    <span className="truncate">1 Urgent</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-700 bg-amber-50/60 px-1.5 py-0.5 rounded border border-amber-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="truncate">2 Atelier</span>
                  </div>
                  <div className="flex items-center gap-1 text-sky-700 bg-sky-50/60 px-1.5 py-0.5 rounded border border-sky-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                    <span className="truncate">4 Planifiés</span>
                  </div>
                </div>
              </div>

              {/* Data Visualization 2: Priority Workshop Tickets */}
              <div className="space-y-1.5 mt-2.5">
                <div className="bg-slate-50/90 p-2 rounded-lg border border-slate-200/70 flex items-center justify-between text-[11px]">
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-slate-900 truncate">BJ-5678-EF • Freins & Disques</div>
                    <div className="text-[10px] text-rose-600 font-medium">Urgent • Immobilisation CFAO</div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                    Aujourd’hui
                  </span>
                </div>

                <div className="bg-slate-50/90 p-2 rounded-lg border border-slate-200/70 flex items-center justify-between text-[11px]">
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-slate-900 truncate">BJ-3456-IJ • Remplacement frigo</div>
                    <div className="text-[10px] text-amber-600 font-medium">En cours • Sortie estimée &lt; 24h</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 shrink-0">
                    Sous 24h
                  </span>
                </div>
              </div>

              {/* Operational Chips */}
              <div className="grid grid-cols-3 gap-1.5 pt-3 text-[10px] font-semibold text-slate-600 text-center">
                <div className="bg-slate-50 py-1 px-1.5 rounded border border-slate-100">
                  <div className="text-slate-900 font-bold">1.8 j</div>
                  <div className="text-slate-400 font-normal">durée moy.</div>
                </div>
                <div className="bg-slate-50 py-1 px-1.5 rounded border border-slate-100">
                  <div className="text-slate-900 font-bold">850 km</div>
                  <div className="text-slate-400 font-normal">échéance min.</div>
                </div>
                <div className="bg-slate-50 py-1 px-1.5 rounded border border-slate-100">
                  <div className="text-amber-700 font-bold">1.85M</div>
                  <div className="text-slate-400 font-normal">FCFA engagé</div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              id="btn-navigate-maintenance"
              onClick={() => onNavigateView && onNavigateView('maintenance')}
              className="mt-4 w-full py-2.5 px-3 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Wrench className="w-3.5 h-3.5 text-amber-600" />
              <span>Gérer les entretiens & ordres de travaux</span>
              <ArrowRight className="w-3.5 h-3.5 ml-auto text-amber-600" />
            </button>
          </div>

          {/* CARD 3: Pending Convoy Requests */}
          <div
            id="kpi-card-pending-convoys"
            className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-sm hover:border-indigo-300/80 transition-all p-5 flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                      Demandes de Convoyage
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">Transferts & cotations clients</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  En attente
                </span>
              </div>

              {/* Big Metric Display & Trend */}
              <div className="py-3 flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                      {pendingConvoysCount}
                    </span>
                    <span className="text-xs font-bold text-slate-500">dossiers à qualifier</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">2 requêtes urgentes reçues &lt; 24h</p>
                </div>
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50/80 px-2 py-1 rounded-md border border-indigo-100/80">
                  Délai moy. 1h45
                </span>
              </div>

              {/* Data Visualization 1: Funnel Pipeline Connected Steps */}
              <div className="space-y-1.5 my-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-700">Progression du pipeline de traitement</span>
                  <span className="text-[10px] font-semibold text-indigo-600">3 actifs</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <div className="bg-indigo-50/90 border border-indigo-200/70 p-2 rounded-lg text-center">
                    <div className="text-sm font-black text-indigo-900">2</div>
                    <div className="text-[10px] font-bold text-indigo-700">Nouvelles</div>
                    <div className="text-[9px] text-indigo-500">À analyser</div>
                  </div>
                  <div className="bg-sky-50/90 border border-sky-200/70 p-2 rounded-lg text-center">
                    <div className="text-sm font-black text-sky-900">1</div>
                    <div className="text-[10px] font-bold text-sky-700">Chiffrage</div>
                    <div className="text-[9px] text-sky-500">Calcul péages</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2 rounded-lg text-center opacity-80">
                    <div className="text-sm font-black text-slate-700">0</div>
                    <div className="text-[10px] font-bold text-slate-600">Devis transmis</div>
                    <div className="text-[9px] text-slate-400">Accord client</div>
                  </div>
                </div>
              </div>

              {/* Data Visualization 2: Mode Breakdown Bar & Next Route */}
              <div className="space-y-1.5 mt-2.5">
                <div className="bg-slate-50/90 p-2 rounded-lg border border-slate-200/70 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-600">
                    <span>Chauffeur dédié (67%)</span>
                    <span>Porte-char plateau (33%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full flex overflow-hidden">
                    <div className="h-full bg-indigo-600" style={{ width: '67%' }} />
                    <div className="h-full bg-cyan-500" style={{ width: '33%' }} />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-700 pt-0.5">
                    <span className="font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      Cotonou ➔ Lomé
                    </span>
                    <span className="text-slate-500">Toyota Prado • 24/09</span>
                  </div>
                </div>
              </div>

              {/* Operational Chips */}
              <div className="grid grid-cols-3 gap-1.5 pt-3 text-[10px] font-semibold text-slate-600 text-center">
                <div className="bg-slate-50 py-1 px-1.5 rounded border border-slate-100">
                  <div className="text-slate-900 font-bold">~1.42M</div>
                  <div className="text-slate-400 font-normal">FCFA volume</div>
                </div>
                <div className="bg-slate-50 py-1 px-1.5 rounded border border-slate-100">
                  <div className="text-slate-900 font-bold">2</div>
                  <div className="text-slate-400 font-normal">chauffeurs dispo</div>
                </div>
                <div className="bg-slate-50 py-1 px-1.5 rounded border border-slate-100">
                  <div className="text-indigo-700 font-bold">100%</div>
                  <div className="text-slate-400 font-normal">assuré</div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              id="btn-navigate-convoys"
              onClick={() => onNavigateView && onNavigateView('convoy_management')}
              className="mt-4 w-full py-2.5 px-3 text-xs font-bold text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Truck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Traiter les demandes de convoyage</span>
              <ArrowRight className="w-3.5 h-3.5 ml-auto text-indigo-600" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Top 6 KPI Cards matching approved mockup */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* KPI 1: Total véhicules */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-lg bg-sky-50 text-sky-600">
              <Car className="w-5 h-5" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{kpis.totalVehicles}</span>
          </div>
          <div className="mt-3">
            <div className="text-xs font-bold text-slate-800">Total véhicules</div>
            <div className="text-[11px] text-slate-500">Parc total</div>
          </div>
        </div>

        {/* KPI 2: Véhicules actifs */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-emerald-700">{kpis.activeVehicles}</span>
          </div>
          <div className="mt-3">
            <div className="text-xs font-bold text-slate-800">Véhicules actifs</div>
            <div className="text-[11px] text-emerald-600 font-medium">En exploitation</div>
          </div>
        </div>

        {/* KPI 3: En maintenance */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-amber-700">{kpis.maintenanceVehicles}</span>
          </div>
          <div className="mt-3">
            <div className="text-xs font-bold text-slate-800">En maintenance</div>
            <div className="text-[11px] text-amber-600 font-medium">Atelier / Maintenance</div>
          </div>
        </div>

        {/* KPI 4: Immobilisés */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-rose-700">{kpis.immobilizedVehicles}</span>
          </div>
          <div className="mt-3">
            <div className="text-xs font-bold text-slate-800">Immobilisés</div>
            <div className="text-[11px] text-rose-600 font-medium">En panne</div>
          </div>
        </div>

        {/* KPI 5: Documents expirés */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600">
              <FileX2 className="w-5 h-5" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-purple-700">{kpis.expiredDocuments}</span>
          </div>
          <div className="mt-3">
            <div className="text-xs font-bold text-slate-800">Documents expirés</div>
            <div className="text-[11px] text-purple-600 font-medium">Non conformes</div>
          </div>
        </div>

        {/* KPI 6: À échéance 30j */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-amber-700">{kpis.expiringSoonDocuments}</span>
          </div>
          <div className="mt-3">
            <div className="text-xs font-bold text-slate-800">À échéance</div>
            <div className="text-[11px] text-amber-600 font-medium">Prochains 30 jours</div>
          </div>
        </div>
      </div>

      {/* 3. Middle Row: Status Donut, Operating Costs Donut, Real-Time Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Répartition des véhicules par statut */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-extrabold text-slate-900 tracking-wider uppercase">
              Répartition des véhicules par statut
            </h2>
            <button
              onClick={() => onNavigateView && onNavigateView('fleet_all')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              <span>Voir le détail</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="py-6 flex items-center justify-center">
            {/* SVG Donut Chart */}
            <div className="relative w-44 h-44">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#E2E8F0" strokeWidth="12" />
                {/* Actifs: 92% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="12"
                  strokeDasharray="219 238"
                  strokeDashoffset="0"
                />
                {/* En maintenance: 6% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="12"
                  strokeDasharray="14 238"
                  strokeDashoffset="-219"
                />
                {/* Immobilisés: 2% */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="12"
                  strokeDasharray="5 238"
                  strokeDashoffset="-233"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-slate-900">{kpis.totalVehicles}</span>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Total</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            {statusDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-semibold">{item.count} ({item.percent}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Coûts d'exploitation */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-extrabold text-slate-900 tracking-wider uppercase">
              Coûts d’exploitation (Mai 2026)
            </h2>
            <button
              onClick={() => onNavigateView && onNavigateView('finance_cost_per_vehicle')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              <span>Voir le détail</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="py-6 flex items-center justify-center">
            {/* SVG Donut Chart */}
            <div className="relative w-44 h-44">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#E2E8F0" strokeWidth="12" />
                {/* Carburant 50% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#0284C7" strokeWidth="12" strokeDasharray="119 238" strokeDashoffset="0" />
                {/* Maintenance 26% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#10B981" strokeWidth="12" strokeDasharray="62 238" strokeDashoffset="-119" />
                {/* Pneus 8% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#8B5CF6" strokeWidth="12" strokeDasharray="19 238" strokeDashoffset="-181" />
                {/* Assurances 11% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#0EA5E9" strokeWidth="12" strokeDasharray="26 238" strokeDashoffset="-200" />
                {/* Autres 5% */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#94A3B8" strokeWidth="12" strokeDasharray="12 238" strokeDashoffset="-226" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                <span className="text-sm font-black text-slate-900 leading-tight">28 450 000</span>
                <span className="text-[10px] font-bold text-slate-600 uppercase">FCFA</span>
              </div>
            </div>
          </div>

          {/* Cost Legend */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {costBreakdown.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span>{c.name}</span>
                </div>
                <span className="font-semibold text-slate-800">
                  {c.amount.toLocaleString('fr-FR')} FCFA ({c.percent}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Véhicules en circulation (Temps réel) - Cotonou interactive map */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-extrabold text-slate-900 tracking-wider uppercase">
                Véhicules en circulation (Temps réel)
              </h2>
            </div>
            <button
              onClick={() => onNavigateView && onNavigateView('telematics_live')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              <span>Carte complète</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Map Container (Cotonou coastal area styling) */}
          <div className="relative my-3 h-52 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 select-none">
            {/* Map styling representation of Cotonou and coastal lagoon */}
            <div className="absolute inset-0 bg-[#E0EDF4]">
              {/* Atlantic ocean */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#BCE0F5] border-t border-[#A2D2EE] flex items-end justify-center pb-1">
                <span className="text-[10px] font-bold tracking-widest text-[#0284C7]/50 uppercase">Océan Atlantique</span>
              </div>
              {/* Lake Nokoué / Lagoon */}
              <div className="absolute top-0 right-4 w-32 h-20 bg-[#C8E7F8] rounded-bl-full opacity-80" />
              {/* Main Roads network */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Coastal highway */}
                <path d="M 0 145 Q 150 140 350 145" stroke="#FFFFFF" strokeWidth="6" fill="none" />
                <path d="M 0 145 Q 150 140 350 145" stroke="#F59E0B" strokeWidth="2.5" fill="none" />
                {/* North route towards Abomey-Calavi */}
                <path d="M 120 145 L 80 0" stroke="#FFFFFF" strokeWidth="5" fill="none" />
                <path d="M 120 145 L 80 0" stroke="#FBBF24" strokeWidth="2" fill="none" />
                {/* Port bypass */}
                <path d="M 220 145 L 260 60" stroke="#FFFFFF" strokeWidth="4" fill="none" />
                <path d="M 220 145 L 260 60" stroke="#CBD5E1" strokeWidth="2" fill="none" />
              </svg>

              {/* Landmark Labels */}
              <div className="absolute top-3 left-4 text-[10px] font-bold text-slate-700 bg-white/80 px-2 py-0.5 rounded-sm shadow-2xs">
                ABOMEY-CALAVI
              </div>
              <div className="absolute bottom-20 left-10 text-[10px] font-bold text-slate-700 bg-white/80 px-2 py-0.5 rounded-sm shadow-2xs">
                AÉROPORT CADJÈHOUN
              </div>
              <div className="absolute bottom-20 right-6 text-[10px] font-bold text-slate-700 bg-white/80 px-2 py-0.5 rounded-sm shadow-2xs">
                PORT DE COTONOU
              </div>

              {/* Vehicle Markers */}
              {/* Moving vehicle 1 */}
              <div
                className="absolute top-16 left-28 p-1.5 bg-emerald-600 text-white rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform"
                title="Peugeot 3008 (BJ-1234-CD) • En mouvement 45 km/h"
                onClick={() => onSelectVehicle && onSelectVehicle('veh_peugeot_3008')}
              >
                <Car className="w-3.5 h-3.5" />
              </div>
              {/* Moving vehicle 2 */}
              <div
                className="absolute bottom-24 right-20 p-1.5 bg-emerald-600 text-white rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform"
                title="Renault Master (BJ-5678-EF) • En mouvement 32 km/h"
                onClick={() => onSelectVehicle && onSelectVehicle('veh_renault_master')}
              >
                <Car className="w-3.5 h-3.5" />
              </div>
              {/* Stopped vehicle (Atelier CFAO) */}
              <div
                className="absolute top-24 right-32 p-1.5 bg-rose-600 text-white rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform"
                title="Iveco Daily (BJ-7890-KL) • Arrêté / Panne"
                onClick={() => onSelectVehicle && onSelectVehicle('veh_iveco_daily')}
              >
                <MapPin className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Floating Top Badge: 32 véhicules en circulation */}
            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs border border-slate-200 px-3 py-1.5 rounded-lg shadow-md flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-[11px] font-bold text-slate-800">
                {telematics.circulatingCount} véhicules en circulation
              </div>
            </div>
          </div>

          {/* Mandated Note: Explicit Demonstration Mode indicator */}
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600">
            <Info className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span className="truncate">Télématique active en mode Démo • Prête pour boîtiers GPS réels</span>
          </div>
        </div>
      </div>

      {/* 4. Secondary Row: 4 Metric Cards with month-over-month trend indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Kilométrage total */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Kilométrage total</span>
            <Navigation className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-slate-900">56 780 km</div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px]">
            <span className="flex items-center font-bold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12%
            </span>
            <span className="text-slate-600">vs mois précédent</span>
          </div>
        </div>

        {/* Carburant consommé */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Carburant consommé</span>
            <Fuel className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-slate-900">6 450 L</div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px]">
            <span className="flex items-center font-bold text-emerald-600">
              <ArrowDownRight className="w-3.5 h-3.5" /> -8%
            </span>
            <span className="text-slate-600">vs mois précédent</span>
          </div>
        </div>

        {/* Conso moyenne */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Conso. moyenne</span>
            <TrendingUp className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-slate-900">14,2 L/100 km</div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px]">
            <span className="flex items-center font-bold text-emerald-600">
              <ArrowDownRight className="w-3.5 h-3.5" /> -6%
            </span>
            <span className="text-slate-600">vs mois précédent</span>
          </div>
        </div>

        {/* Coût moyen / km */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Coût moyen / km</span>
            <span className="font-bold text-amber-600">FCFA</span>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-slate-900">508 FCFA/km</div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px]">
            <span className="flex items-center font-bold text-rose-600">
              <ArrowUpRight className="w-3.5 h-3.5" /> +4%
            </span>
            <span className="text-slate-600">vs mois précédent</span>
          </div>
        </div>
      </div>

      {/* 5. Third Row: Maintenance à venir, Consommation carburant bars, Alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table: Maintenance à venir */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-extrabold text-slate-900 tracking-wider uppercase">
              Maintenance à venir
            </h2>
            <button
              onClick={() => onNavigateView && onNavigateView('maintenance_schedule')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              <span>Voir tout</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto my-3">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-slate-600 border-b border-slate-100 font-bold">
                  <th className="pb-2">Véhicule</th>
                  <th className="pb-2">Intervention</th>
                  <th className="pb-2">Échéance</th>
                  <th className="pb-2">Km restants</th>
                  <th className="pb-2">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {upcomingMaintenance.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 font-bold text-sky-700">{row.vehicle_registration}</td>
                    <td className="py-2.5 font-medium">{row.intervention}</td>
                    <td className="py-2.5 text-slate-500">{row.due_date}</td>
                    <td className="py-2.5 text-slate-500 font-mono">{row.remaining_km} km</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bar Chart: Consommation carburant (Mai 2026) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-extrabold text-slate-900 tracking-wider uppercase">
              Consommation carburant (Mai 2026)
            </h2>
            <button
              onClick={() => onNavigateView && onNavigateView('fuel_consumption')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              <span>Voir tout</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="py-4 flex-1 flex flex-col justify-end">
            {/* Responsive Bars */}
            <div className="flex items-end justify-between gap-4 h-48 px-2 pt-6">
              {fuelWeeklyConsumption.map((item) => {
                const maxLit = 20000;
                const heightPct = Math.round((item.liters / maxLit) * 100);
                return (
                  <div key={item.week} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.liters.toLocaleString('fr-FR')}L
                    </span>
                    <div className="w-full bg-slate-100 rounded-t-lg overflow-hidden h-36 flex items-end">
                      <div
                        className="w-full bg-sky-600 group-hover:bg-sky-500 rounded-t-lg transition-all duration-300"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{item.week}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-slate-500 font-medium">
              <span className="w-3 h-3 rounded-xs bg-sky-600" />
              <span>Litres consommés par semaine</span>
            </div>
          </div>
        </div>

        {/* List: Alertes */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-extrabold text-slate-900 tracking-wider uppercase">
              Alertes de conformité & sécurité
            </h2>
            <button
              onClick={() => onNavigateView && onNavigateView('proactive_alerts')}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              <span>Centre d'Alertes</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 my-3">
            {alertCategoriesCount.map((alt, idx) => (
              <div
                key={idx}
                onClick={() => onNavigateView && onNavigateView('proactive_alerts')}
                className="flex items-start justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer"
              >
                <div className="flex items-start gap-2.5">
                  <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                    alt.type === 'danger' ? 'bg-rose-100 text-rose-600' :
                    alt.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                    'bg-emerald-100 text-emerald-600'
                  }`}>
                    {alt.type === 'danger' ? <ShieldAlert className="w-4 h-4" /> :
                     alt.type === 'warning' ? <Clock className="w-4 h-4" /> :
                     <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{alt.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{alt.label}</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    alt.type === 'danger' ? 'bg-rose-100 text-rose-700' :
                    alt.type === 'warning' ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {alt.count} {alt.count > 1 ? 'véhicules' : 'véhicule'}
                  </span>
                  <div className="text-[10px] text-slate-600 mt-1">{alt.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Bottom Banner: Activité récente matching approved mockup */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-xs font-extrabold text-slate-900 tracking-wider uppercase">
            Activité récente de la flotte
          </h2>
          <span className="text-xs font-semibold text-slate-500">Flux temps réel</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
          {recentActivities.map((act) => (
            <div key={act.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 hover:bg-white hover:border-slate-300 transition-all">
              <div className="text-xs font-bold text-slate-800 truncate">{act.action}</div>
              <div className="text-[11px] text-slate-600 mt-1 line-clamp-2">{act.description}</div>
              <div className="text-[10px] text-slate-600 mt-2 font-medium">Récemment</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
