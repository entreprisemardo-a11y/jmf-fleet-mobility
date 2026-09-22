import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  PieChart,
  Download,
  Calendar,
  CreditCard,
  Building2,
  FileSpreadsheet,
  ArrowUpRight,
  CheckCircle2,
  Car,
  Filter,
  Search,
  Gauge,
  Calculator,
  ArrowRight,
  FileText,
  AlertTriangle,
} from 'lucide-react';

interface FinanceTcoViewProps {
  currentSubView?: string;
  onNavigateSubView?: (subView: string) => void;
}

interface VehicleCostDetail {
  reg: string;
  model: string;
  driver: string;
  total_km: number;
  fuel_cost: number;
  maintenance_cost: number;
  insurance_taxes_cost: number;
  tires_cost: number;
  total_cost: number;
  cost_per_km: number;
  efficiency_rating: 'EXCELLENT' | 'NORMAL' | 'ELEVÉ';
}

const VEHICLE_COSTS: VehicleCostDetail[] = [
  {
    reg: 'BJ-1234-CD',
    model: 'Peugeot 3008 Allure',
    driver: 'Pierre DOSSOU',
    total_km: 56780,
    fuel_cost: 2150000,
    maintenance_cost: 980000,
    insurance_taxes_cost: 620000,
    tires_cost: 460000,
    total_cost: 4210000,
    cost_per_km: 480,
    efficiency_rating: 'EXCELLENT',
  },
  {
    reg: 'BJ-5678-EF',
    model: 'Renault Master dCi',
    driver: 'Koffi AMAN',
    total_km: 112400,
    fuel_cost: 2950000,
    maintenance_cost: 1320000,
    insurance_taxes_cost: 590000,
    tires_cost: 560000,
    total_cost: 5420000,
    cost_per_km: 560,
    efficiency_rating: 'NORMAL',
  },
  {
    reg: 'BJ-9012-GH',
    model: 'Toyota Hilux 4x4',
    driver: 'Mathieu KPADONOU',
    total_km: 24300,
    fuel_cost: 1890000,
    maintenance_cost: 840000,
    insurance_taxes_cost: 680000,
    tires_cost: 480000,
    total_cost: 3890000,
    cost_per_km: 495,
    efficiency_rating: 'EXCELLENT',
  },
  {
    reg: 'BJ-3456-IJ',
    model: 'Iveco Daily 35S16 Frigo',
    driver: 'Michel HOUNGBO',
    total_km: 145600,
    fuel_cost: 3650000,
    maintenance_cost: 1850000,
    insurance_taxes_cost: 710000,
    tires_cost: 640000,
    total_cost: 6850000,
    cost_per_km: 742,
    efficiency_rating: 'ELEVÉ',
  },
  {
    reg: 'BJ-7890-KL',
    model: 'Hyundai Santa Fe 2.2',
    driver: 'Jean KOUASSI',
    total_km: 42100,
    fuel_cost: 1920000,
    maintenance_cost: 820000,
    insurance_taxes_cost: 540000,
    tires_cost: 340000,
    total_cost: 3620000,
    cost_per_km: 440,
    efficiency_rating: 'EXCELLENT',
  },
];

export const FinanceTcoView: React.FC<FinanceTcoViewProps> = ({
  currentSubView,
  onNavigateSubView,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'vehicle' | 'km' | 'tco'>('vehicle');
  const [search, setSearch] = useState<string>('');

  // Simulation calculator
  const [simKm, setSimKm] = useState<string>('850');
  const [simVehicleReg, setSimVehicleReg] = useState<string>('BJ-9012-GH');

  useEffect(() => {
    if (currentSubView === 'finance_cost_per_vehicle') {
      setActiveTab('vehicle');
    } else if (currentSubView === 'finance_cost_per_km') {
      setActiveTab('km');
    } else if (currentSubView === 'finance_tco' || currentSubView === 'finance' || currentSubView?.startsWith('reports')) {
      setActiveTab('tco');
    }
  }, [currentSubView]);

  const handleSubTabSwitch = (tab: 'vehicle' | 'km' | 'tco') => {
    setActiveTab(tab);
    if (onNavigateSubView) {
      if (tab === 'vehicle') onNavigateSubView('finance_cost_per_vehicle');
      else if (tab === 'km') onNavigateSubView('finance_cost_per_km');
      else onNavigateSubView('finance_tco');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const costCategories = [
    { name: 'Carburant (Diesel & Super)', amount: 14225000, percent: 50, color: 'bg-sky-600' },
    { name: 'Maintenance & Pièces détachées', amount: 7397000, percent: 26, color: 'bg-emerald-500' },
    { name: 'Assurances Tous Risques & CNSR', amount: 3129500, percent: 11, color: 'bg-indigo-500' },
    { name: 'Pneumatiques (Remplacement & Géométrie)', amount: 2276000, percent: 8, color: 'bg-amber-500' },
    { name: 'Péages Corridors, Vignettes TVM & Divers', amount: 1422500, percent: 5, color: 'bg-slate-400' },
  ];

  const handleExportCsv = () => {
    const headers = ['Immatriculation', 'Modele', 'Chauffeur', 'Km_Cumule', 'Carburant_FCFA', 'Maintenance_FCFA', 'Assurance_FCFA', 'Pneus_FCFA', 'Total_FCFA', 'Cout_par_Km'];
    const rows = VEHICLE_COSTS.map(v => [
      v.reg,
      `"${v.model}"`,
      `"${v.driver}"`,
      v.total_km,
      v.fuel_cost,
      v.maintenance_cost,
      v.insurance_taxes_cost,
      v.tires_cost,
      v.total_cost,
      v.cost_per_km
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `analyse_financiere_flotte_jmf_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Rapport analytique financier exporté au format CSV !');
  };

  const filteredVehicles = VEHICLE_COSTS.filter(v =>
    v.reg.toLowerCase().includes(search.toLowerCase()) ||
    v.model.toLowerCase().includes(search.toLowerCase()) ||
    v.driver.toLowerCase().includes(search.toLowerCase())
  );

  const selectedSimVehicle = VEHICLE_COSTS.find(v => v.reg === simVehicleReg) || VEHICLE_COSTS[0];
  const simulatedCost = Math.round((parseInt(simKm) || 0) * selectedSimVehicle.cost_per_km);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1680px] mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Coûts & Finances</span>
            <span>&gt;</span>
            <span className="font-semibold text-slate-700">
              {activeTab === 'vehicle' && 'Coût par Véhicule (Ventilation détaillée)'}
              {activeTab === 'km' && 'Coût au Kilomètre (Benchmark & Rentabilité)'}
              {activeTab === 'tco' && 'Total Cost of Ownership (TCO Global Flotte)'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-sky-600" />
            <span>
              {activeTab === 'vehicle' && 'Analyse des Coûts par Véhicule'}
              {activeTab === 'km' && 'Indice de Coût au Kilomètre (FCFA / km)'}
              {activeTab === 'tco' && 'Total Cost of Ownership (TCO) & Budget'}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeTab === 'vehicle' && 'Suivi individuel des postes de dépenses : carburant, pièces d’usure, assurances et pneumatiques.'}
            {activeTab === 'km' && 'Performance kilométrique réelle par véhicule, calcul du coût de revient et simulateur de mission.'}
            {activeTab === 'tco' && 'Consolidation financière globale, répartition analytique et pilotage du budget annuel.'}
          </p>
        </div>

        {/* 3 Sub-tabs matching the sidebar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto">
            <button
              onClick={() => handleSubTabSwitch('vehicle')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'vehicle' ? 'bg-white text-sky-700 shadow-xs ring-1 ring-sky-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Coût par véhicule
            </button>
            <button
              onClick={() => handleSubTabSwitch('km')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'km' ? 'bg-white text-sky-700 shadow-xs ring-1 ring-sky-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Coût par km
            </button>
            <button
              onClick={() => handleSubTabSwitch('tco')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'tco' ? 'bg-white text-sky-700 shadow-xs ring-1 ring-sky-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Total Cost of Ownership
            </button>
          </div>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span>Exporter CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Dépenses Exploitation (Cumul)</span>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            28 450 000 <span className="text-xs text-slate-500">FCFA</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>-4.2% d'économies vs budget</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Coût moyen au kilomètre</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            508 <span className="text-xs text-slate-500">FCFA / km</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Benchmark régional : 580 FCFA/km</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Poste principal</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-600 mt-2">Carburant (50%)</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">14 225 000 FCFA sur l'année</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Véhicule le plus efficient</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">440 <span className="text-xs text-slate-500">FCFA/km</span></div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Hyundai Santa Fe (BJ-7890-KL)</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VUE 1 : COÛT PAR VÉHICULE */}
      {/* ========================================================================= */}
      {activeTab === 'vehicle' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filtrer par immatriculation ou chauffeur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-sky-500 bg-slate-50"
              />
            </div>
            <div className="text-xs text-slate-500">
              Ventilation analytique sur <span className="font-bold text-slate-800">{filteredVehicles.length} véhicules</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Véhicule & Chauffeur</th>
                    <th className="py-3 px-4">Carburant</th>
                    <th className="py-3 px-4">Entretien Atelier</th>
                    <th className="py-3 px-4">Assurance & Taxes</th>
                    <th className="py-3 px-4">Pneumatiques</th>
                    <th className="py-3 px-4">Total Dépenses</th>
                    <th className="py-3 px-4">Coût / Km</th>
                    <th className="py-3 px-4 text-right">Ventilation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredVehicles.map((v) => {
                    const fuelPct = Math.round((v.fuel_cost / v.total_cost) * 100);
                    const maintPct = Math.round((v.maintenance_cost / v.total_cost) * 100);
                    const insPct = Math.round((v.insurance_taxes_cost / v.total_cost) * 100);
                    const tiresPct = 100 - fuelPct - maintPct - insPct;

                    return (
                      <tr key={v.reg} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-sky-800">{v.reg}</div>
                          <div className="text-[11px] text-slate-500">{v.model}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{v.driver}</div>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                          {v.fuel_cost.toLocaleString('fr-FR')} FCFA
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-700">
                          {v.maintenance_cost.toLocaleString('fr-FR')} FCFA
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-600">
                          {v.insurance_taxes_cost.toLocaleString('fr-FR')} FCFA
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-600">
                          {v.tires_cost.toLocaleString('fr-FR')} FCFA
                        </td>

                        <td className="py-3.5 px-4 font-mono font-black text-slate-900 text-sm">
                          {v.total_cost.toLocaleString('fr-FR')} FCFA
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-sky-700">{v.cost_per_km} FCFA/km</div>
                          <div className="text-[10px] text-slate-400">{v.total_km.toLocaleString('fr-FR')} km</div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="w-28 h-2 rounded-full overflow-hidden flex ml-auto shadow-inner">
                            <div style={{ width: `${fuelPct}%` }} className="bg-sky-500" title={`Carburant ${fuelPct}%`} />
                            <div style={{ width: `${maintPct}%` }} className="bg-emerald-500" title={`Maintenance ${maintPct}%`} />
                            <div style={{ width: `${insPct}%` }} className="bg-indigo-500" title={`Assurance ${insPct}%`} />
                            <div style={{ width: `${tiresPct}%` }} className="bg-amber-500" title={`Pneus ${tiresPct}%`} />
                          </div>
                          <div className="text-[9px] text-slate-400 mt-1 font-mono">{fuelPct}% carb • {maintPct}% maint</div>
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

      {/* ========================================================================= */}
      {/* VUE 2 : COÛT AU KILOMÈTRE & SIMULATEUR */}
      {/* ========================================================================= */}
      {activeTab === 'km' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Efficiency Matrix */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                <span>Matrice de Rentabilité au Kilomètre (Classement d'Efficience)</span>
                <span className="text-xs text-emerald-600 font-semibold">Moyenne Flotte : 508 FCFA / km</span>
              </h3>

              <div className="space-y-3">
                {VEHICLE_COSTS.map((v) => {
                  const percentOfAvg = Math.round((v.cost_per_km / 508) * 100);
                  const isHigh = v.cost_per_km > 600;

                  return (
                    <div key={v.reg} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                      <div className="min-w-[140px]">
                        <div className="font-mono font-bold text-slate-900 text-xs">{v.reg}</div>
                        <div className="text-[11px] text-slate-500 truncate">{v.model}</div>
                      </div>

                      <div className="flex-1 max-w-xs">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-medium text-slate-600">{v.cost_per_km} FCFA/km</span>
                          <span className={isHigh ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                            {percentOfAvg}% de la moyenne
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isHigh ? 'bg-rose-500' : v.cost_per_km < 500 ? 'bg-emerald-500' : 'bg-sky-500'}`}
                            style={{ width: `${Math.min(100, (v.cost_per_km / 800) * 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-right min-w-[110px]">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          v.efficiency_rating === 'EXCELLENT'
                            ? 'bg-emerald-100 text-emerald-800'
                            : v.efficiency_rating === 'NORMAL'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {v.efficiency_rating === 'EXCELLENT' ? 'Très Rentable' : v.efficiency_rating === 'NORMAL' ? 'Standard' : 'Coût Élevé'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Trip Cost Calculator */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-sky-600" />
                <h3 className="text-sm font-bold text-slate-900">Simulateur de Coût de Mission</h3>
              </div>
              <p className="text-xs text-slate-500">
                Estimation instantanée du coût de revient complet d'un trajet ou ordre de mission.
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Véhicule affecté</label>
                  <select
                    value={simVehicleReg}
                    onChange={(e) => setSimVehicleReg(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 font-medium"
                  >
                    {VEHICLE_COSTS.map((v) => (
                      <option key={v.reg} value={v.reg}>
                        {v.reg} • {v.model} ({v.cost_per_km} FCFA/km)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Distance aller-retour (Km)</label>
                  <input
                    type="number"
                    value={simKm}
                    onChange={(e) => setSimKm(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-mono font-bold"
                  />
                  <div className="flex gap-2 mt-1.5">
                    <button onClick={() => setSimKm('120')} className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] text-slate-600">
                      Cotonou-Porto-Novo (120km)
                    </button>
                    <button onClick={() => setSimKm('850')} className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] text-slate-600">
                      Cotonou-Parakou (850km)
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 space-y-1">
                  <div className="text-[11px] text-sky-700 font-medium">Coût de revient estimé :</div>
                  <div className="text-2xl font-black text-sky-950 font-mono">
                    {simulatedCost.toLocaleString('fr-FR')} FCFA
                  </div>
                  <div className="text-[10px] text-sky-600">
                    Inclut carburant, usure pneus, amortissement et quote-part révision.
                  </div>
                </div>

                <button
                  onClick={() => showToast(`Simulation de ${simKm} km (${simulatedCost.toLocaleString('fr-FR')} FCFA) enregistrée.`)}
                  className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Intégrer à l'ordre de mission
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VUE 3 : TOTAL COST OF OWNERSHIP (GLOBAL) */}
      {/* ========================================================================= */}
      {activeTab === 'tco' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Breakdown bar visual */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Répartition Analytique Globale des Dépenses de la Flotte</h3>
            
            {/* Visual progress bar */}
            <div className="w-full h-4 rounded-full overflow-hidden flex shadow-inner">
              <div style={{ width: '50%' }} className="bg-sky-600" title="Carburant 50%" />
              <div style={{ width: '26%' }} className="bg-emerald-500" title="Maintenance 26%" />
              <div style={{ width: '11%' }} className="bg-indigo-500" title="Assurances 11%" />
              <div style={{ width: '8%' }} className="bg-amber-500" title="Pneumatiques 8%" />
              <div style={{ width: '5%' }} className="bg-slate-400" title="Divers 5%" />
            </div>

            {/* Legend */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
              {costCategories.map((c, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${c.color}`} />
                    <span className="text-xs font-bold text-slate-800">{c.percent}%</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1 font-medium truncate">{c.name}</div>
                  <div className="text-xs font-mono font-bold text-slate-900 mt-0.5">
                    {c.amount.toLocaleString('fr-FR')} FCFA
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Consolidated Ranking Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Synthèse TCO Consolidée</h3>
              <span className="text-xs text-slate-500">Données auditées exercice 2026</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Véhicule</th>
                    <th className="py-3 px-4">Kilométrage</th>
                    <th className="py-3 px-4">TCO Cumulé (FCFA)</th>
                    <th className="py-3 px-4">Coût / Km</th>
                    <th className="py-3 px-4">Performance Rentabilité</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {VEHICLE_COSTS.map((v) => (
                    <tr key={v.reg} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-900">{v.reg}</div>
                        <div className="text-[11px] text-slate-500">{v.model}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">{v.total_km.toLocaleString('fr-FR')} km</td>
                      <td className="py-3.5 px-4 font-mono font-black text-slate-900">
                        {v.total_cost.toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-sky-700">
                        {v.cost_per_km} FCFA / km
                      </td>
                      <td className="py-3.5 px-4">
                        {v.cost_per_km < 500 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Excellent (Économe)
                          </span>
                        ) : v.cost_per_km < 650 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                            Dans les normes
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            Coût élevé (À auditer)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
