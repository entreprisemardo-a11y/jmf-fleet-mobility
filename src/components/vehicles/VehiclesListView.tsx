import React, { useState, useEffect } from 'react';
import {
  Car,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  CheckCircle2,
  Wrench,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
  Eye,
  Download,
  Check,
} from 'lucide-react';
import { ApiClient } from '../../services/api.js';
import { localDb } from '../../services/localDb.js';
import { VehicleSummary } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';

interface VehiclesListViewProps {
  onSelectVehicle: (id: string) => void;
  onOpenNewVehicleModal?: () => void;
  currentSubView?: string;
  onNavigateSubView?: (subView: string) => void;
}

export const VehiclesListView: React.FC<VehiclesListViewProps> = ({
  onSelectVehicle,
  onOpenNewVehicleModal,
  currentSubView,
  onNavigateSubView,
}) => {
  const { company } = useAuth();
  const [vehicles, setVehicles] = useState<VehicleSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const FLEET_TABS = [
    { id: 'all', subViewId: 'fleet_all', label: 'Tous les véhicules', badge: 125, badgeColor: 'bg-sky-100 text-sky-800' },
    { id: 'active', subViewId: 'fleet_active', label: 'Véhicules actifs', badge: 115, badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'available', subViewId: 'fleet_available', label: 'Disponibles (Pool)', badge: 18, badgeColor: 'bg-indigo-100 text-indigo-800' },
    { id: 'maintenance', subViewId: 'fleet_maintenance', label: 'Immobilisés / Atelier', badge: 7, badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'retired', subViewId: 'fleet_retired', label: 'Réformés', badge: 3, badgeColor: 'bg-slate-200 text-slate-700' },
  ];

  // Synchronize status filter if navigated via specific sidebar subviews
  useEffect(() => {
    if (currentSubView === 'fleet_active') {
      setStatusFilter('active');
    } else if (currentSubView === 'fleet_available') {
      setStatusFilter('available');
    } else if (currentSubView === 'fleet_maintenance') {
      setStatusFilter('maintenance');
    } else if (currentSubView === 'fleet_retired') {
      setStatusFilter('retired');
    } else if (currentSubView === 'fleet_all' || currentSubView === 'fleet_list') {
      setStatusFilter('all');
    }
  }, [currentSubView]);

  const handleSelectTab = (tabId: string, subViewId: string) => {
    setStatusFilter(tabId);
    if (onNavigateSubView) {
      onNavigateSubView(subViewId);
    }
  };

  const loadVehicles = async () => {
    setIsLoading(true);
    try {
      const res = await ApiClient.getVehicles({
        search: searchQuery || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
      });
      setVehicles(res.data || []);
    } catch (e: any) {
      console.warn('Recovering vehicles locally:', e?.message || e);
      try {
        const fallback = localDb.getVehicles({
          search: searchQuery || undefined,
          status: statusFilter === 'all' ? undefined : statusFilter,
        });
        setVehicles(fallback.data || []);
      } catch {
        setVehicles([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, [company?.id, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadVehicles();
  };

  const handleExportCsv = () => {
    const headers = ['Immatriculation', 'Marque', 'Modèle', 'Type', 'Statut', 'Kilométrage', 'Chauffeur', 'Site'];
    const rows = vehicles.map(v => [
      v.registration_number,
      v.brand,
      v.model,
      v.vehicle_type || 'VP',
      v.status,
      `${v.current_mileage || 0} km`,
      v.driver?.name || 'Non assigné',
      company?.city || 'Cotonou'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `inventaire_flotte_${company?.name?.toLowerCase().replace(/\s+/g, '_') || 'jmf'}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage(`Inventaire exporté avec succès (${vehicles.length} véhicules)`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1680px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Flotte de véhicules</h1>
          <p className="text-xs text-slate-500">
            Inventaire opérationnel, état et affectations • <span className="font-semibold text-slate-700">{company?.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadVehicles}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Actualiser</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            title="Exporter l'inventaire en format CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Exporter CSV</span>
          </button>

          {onOpenNewVehicleModal && (
            <button
              onClick={onOpenNewVehicleModal}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 shadow-sm shadow-sky-600/20 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau véhicule</span>
            </button>
          )}
        </div>
      </div>

      {/* Toast confirmation */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par immatriculation, marque..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {FLEET_TABS.map((tab) => {
            const isSelected = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(tab.id, tab.subViewId)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs rounded-lg font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-sky-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : tab.badgeColor
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-category Context Banner */}
      <div className="bg-sky-50/70 border border-sky-100 rounded-xl px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-700">
        <div className="flex items-center gap-2">
          <Car className="w-4 h-4 text-sky-600 shrink-0" />
          <span>
            {statusFilter === 'active' && 'Affichage des véhicules actuellement en service régulier avec conducteurs assignés.'}
            {statusFilter === 'available' && 'Affichage des véhicules du pool disponibles pour réservation ou affectation immédiate.'}
            {statusFilter === 'maintenance' && 'Affichage des véhicules actuellement immobilisés ou en révision / réparation en atelier.'}
            {statusFilter === 'retired' && 'Affichage des véhicules réformés ou retirés du service actif (fin d’amortissement / vente).'}
            {statusFilter === 'all' && 'Affichage global de tous les véhicules du parc sans restriction de statut.'}
          </span>
        </div>
        <span className="font-semibold text-sky-800 bg-white px-2.5 py-0.5 rounded-md border border-sky-200 w-fit shrink-0">
          {vehicles.length} {vehicles.length > 1 ? 'véhicules affichés' : 'véhicule affiché'}
        </span>
      </div>

      {/* Table of Vehicles */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-500">Chargement des véhicules...</div>
        ) : vehicles.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Car className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">Aucun véhicule trouvé</h3>
            <p className="text-xs text-slate-400">Aucun véhicule ne correspond à ces critères dans cette entreprise.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200 font-bold">
                <tr>
                  <th className="py-3 px-4">Véhicule</th>
                  <th className="py-3 px-4">Immatriculation</th>
                  <th className="py-3 px-4">Conducteur</th>
                  <th className="py-3 px-4">Site</th>
                  <th className="py-3 px-4">Kilométrage</th>
                  <th className="py-3 px-4">Énergie</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {vehicles.map((v) => (
                  <tr
                    key={v.id}
                    onClick={() => onSelectVehicle(v.id)}
                    className="hover:bg-sky-50/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={v.main_photo || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=200'}
                          alt={v.model}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{v.brand} {v.model}</div>
                          <div className="text-[11px] text-slate-400">{v.vehicle_type} • {v.category || 'Standard'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-sky-700">{v.registration_number}</td>
                    <td className="py-3 px-4 font-medium">{v.driver ? v.driver.name : '—'}</td>
                    <td className="py-3 px-4 text-slate-500">{v.site ? v.site.name : 'Siège Cotonou'}</td>
                    <td className="py-3 px-4 font-mono">{v.current_mileage.toLocaleString('fr-FR')} km</td>
                    <td className="py-3 px-4">{v.energy_type}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        v.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        v.status === 'available' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                        v.status === 'maintenance' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        v.status === 'retired' ? 'bg-slate-100 text-slate-700 border border-slate-300' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {v.status === 'active' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {v.status === 'available' && <CheckCircle2 className="w-3 h-3 text-indigo-600" />}
                        {v.status === 'maintenance' && <Wrench className="w-3 h-3 text-amber-600" />}
                        {v.status === 'retired' && <Car className="w-3 h-3 text-slate-500" />}
                        {v.status === 'immobilized' && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                        {v.status === 'active' ? 'En service' :
                         v.status === 'available' ? 'Disponible (Pool)' :
                         v.status === 'maintenance' ? 'En atelier' :
                         v.status === 'retired' ? 'Réformé' : 'Immobilisé'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectVehicle(v.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-white"
                        title="Consulter"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
