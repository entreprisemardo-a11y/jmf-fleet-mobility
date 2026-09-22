import React, { useState, useEffect } from 'react';
import {
  Fuel,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Plus,
  Search,
  Filter,
  CreditCard,
  MapPin,
  CheckCircle2,
  Calendar,
  Download,
  Eye,
  X,
  Lock,
  Unlock,
  RefreshCw,
  Clock,
  ShieldAlert,
  ArrowRight,
  FileText,
  DollarSign,
  Droplet,
  Gauge,
} from 'lucide-react';

interface FuelEntry {
  id: string;
  date: string;
  time: string;
  vehicle_reg: string;
  vehicle_model: string;
  driver_name: string;
  station: string;
  station_brand: 'TotalEnergies' | 'Oryx' | 'Puma';
  fuel_type: 'Gasoil' | 'Super Essence';
  card_used: string;
  liters: number;
  price_per_liter: number;
  total_cost_fcfa: number;
  odometer_km: number;
  delta_km: number;
  consumption_l100: number;
  is_abnormal: boolean;
  anomaly_reason?: string;
  receipt_url?: string;
}

interface FuelCard {
  id: string;
  card_number: string;
  provider: 'TotalEnergies' | 'Oryx' | 'Puma';
  brand_label: string;
  assigned_group: string;
  authorized_vehicles_count: number;
  balance_fcfa: number;
  monthly_limit_fcfa: number;
  status: 'ACTIVE' | 'BLOCKED';
  fuel_restriction: 'Gasoil uniquement' | 'Super & Gasoil';
  gradient: string;
}

interface ConsumptionAudit {
  id: string;
  vehicle_reg: string;
  vehicle_model: string;
  driver_name: string;
  observed_l100: number;
  benchmark_l100: number;
  divergence_percent: number;
  route_context: string;
  telematics_diag: string;
  status: 'EN_COURS' | 'TRAITÉ';
}

const INITIAL_FUEL_CARDS: FuelCard[] = [
  {
    id: 'card_total',
    card_number: '•••• •••• •••• 9920',
    provider: 'TotalEnergies',
    brand_label: 'TotalEnergies Fleet Pro',
    assigned_group: 'Flotte Direction & Cadres Dirigeants',
    authorized_vehicles_count: 5,
    balance_fcfa: 1120000,
    monthly_limit_fcfa: 2500000,
    status: 'ACTIVE',
    fuel_restriction: 'Super & Gasoil',
    gradient: 'from-rose-600 via-red-700 to-rose-900',
  },
  {
    id: 'card_oryx',
    card_number: '•••• •••• •••• 7712',
    provider: 'Oryx',
    brand_label: 'Oryx Energies Business',
    assigned_group: 'Véhicules Logistiques & Exploitation Port',
    authorized_vehicles_count: 3,
    balance_fcfa: 680000,
    monthly_limit_fcfa: 1500000,
    status: 'ACTIVE',
    fuel_restriction: 'Gasoil uniquement',
    gradient: 'from-amber-600 via-amber-700 to-yellow-800',
  },
  {
    id: 'card_puma',
    card_number: '•••• •••• •••• 3310',
    provider: 'Puma',
    brand_label: 'Puma Energy Express',
    assigned_group: 'Pool Partagé & Navettes Urbaines',
    authorized_vehicles_count: 2,
    balance_fcfa: 415000,
    monthly_limit_fcfa: 1000000,
    status: 'ACTIVE',
    fuel_restriction: 'Super & Gasoil',
    gradient: 'from-emerald-600 via-teal-700 to-emerald-900',
  },
];

const INITIAL_FUEL_ENTRIES: FuelEntry[] = [
  {
    id: 'fl_1',
    date: '2026-09-20',
    time: '08:45',
    vehicle_reg: 'BJ-1234-CD',
    vehicle_model: 'Peugeot 3008 Allure',
    driver_name: 'Pierre DOSSOU',
    station: 'TotalEnergies Marina',
    station_brand: 'TotalEnergies',
    fuel_type: 'Super Essence',
    card_used: 'TotalEnergies Pro •••• 9920',
    liters: 55,
    price_per_liter: 700,
    total_cost_fcfa: 38500,
    odometer_km: 56780,
    delta_km: 808,
    consumption_l100: 6.8,
    is_abnormal: false,
    receipt_url: 'ticket_fl_1.pdf',
  },
  {
    id: 'fl_2',
    date: '2026-09-19',
    time: '14:20',
    vehicle_reg: 'BJ-5678-EF',
    vehicle_model: 'Renault Master dCi',
    driver_name: 'Koffi AMAN',
    station: 'Oryx Étoile Rouge',
    station_brand: 'Oryx',
    fuel_type: 'Gasoil',
    card_used: 'Oryx Business •••• 7712',
    liters: 72,
    price_per_liter: 700,
    total_cost_fcfa: 50400,
    odometer_km: 112400,
    delta_km: 439,
    consumption_l100: 16.4,
    is_abnormal: true,
    anomaly_reason: 'Écart +84% par rapport à la moyenne constructeur (8.9 L/100km)',
    receipt_url: 'ticket_fl_2.pdf',
  },
  {
    id: 'fl_3',
    date: '2026-09-18',
    time: '17:10',
    vehicle_reg: 'BJ-9012-GH',
    vehicle_model: 'Toyota Hilux 4x4',
    driver_name: 'Mathieu KPADONOU',
    station: 'TotalEnergies Carrefour Vèdoko',
    station_brand: 'TotalEnergies',
    fuel_type: 'Gasoil',
    card_used: 'TotalEnergies Pro •••• 9920',
    liters: 65,
    price_per_liter: 700,
    total_cost_fcfa: 45500,
    odometer_km: 24300,
    delta_km: 691,
    consumption_l100: 9.4,
    is_abnormal: false,
    receipt_url: 'ticket_fl_3.pdf',
  },
  {
    id: 'fl_4',
    date: '2026-09-17',
    time: '09:15',
    vehicle_reg: 'BJ-3456-IJ',
    vehicle_model: 'Iveco Daily 35S16 Frigo',
    driver_name: 'Michel HOUNGBO',
    station: 'Puma Energy Akpakpa',
    station_brand: 'Puma',
    fuel_type: 'Gasoil',
    card_used: 'Puma Express •••• 3310',
    liters: 80,
    price_per_liter: 700,
    total_cost_fcfa: 56000,
    odometer_km: 145600,
    delta_km: 540,
    consumption_l100: 14.8,
    is_abnormal: false,
    receipt_url: 'ticket_fl_4.pdf',
  },
  {
    id: 'fl_5',
    date: '2026-09-16',
    time: '16:00',
    vehicle_reg: 'BJ-7890-KL',
    vehicle_model: 'Hyundai Santa Fe 2.2',
    driver_name: 'Jean KOUASSI',
    station: 'TotalEnergies Aéroport Cadjèhoun',
    station_brand: 'TotalEnergies',
    fuel_type: 'Gasoil',
    card_used: 'TotalEnergies Pro •••• 9920',
    liters: 58,
    price_per_liter: 700,
    total_cost_fcfa: 40600,
    odometer_km: 42100,
    delta_km: 707,
    consumption_l100: 8.2,
    is_abnormal: false,
    receipt_url: 'ticket_fl_5.pdf',
  },
];

const INITIAL_AUDITS: ConsumptionAudit[] = [
  {
    id: 'adt_1',
    vehicle_reg: 'BJ-5678-EF',
    vehicle_model: 'Renault Master dCi',
    driver_name: 'Koffi AMAN',
    observed_l100: 16.4,
    benchmark_l100: 8.9,
    divergence_percent: 84.2,
    route_context: 'Tournée Akpakpa - Zone Portuaire - Calavi',
    telematics_diag: 'Moteur tournant à l’arrêt prolongé (2h42 cumulées) & trajets courts répétés',
    status: 'EN_COURS',
  },
];

interface FuelTrackingViewProps {
  currentSubView?: string;
  onNavigateSubView?: (subView: string) => void;
}

export const FuelTrackingView: React.FC<FuelTrackingViewProps> = ({
  currentSubView,
  onNavigateSubView,
}) => {
  const [entries, setEntries] = useState<FuelEntry[]>(INITIAL_FUEL_ENTRIES);
  const [cards, setCards] = useState<FuelCard[]>(INITIAL_FUEL_CARDS);
  const [audits, setAudits] = useState<ConsumptionAudit[]>(INITIAL_AUDITS);
  const [search, setSearch] = useState<string>('');
  const [filterType, setFilterType] = useState<'ALL' | 'ABNORMAL' | 'NORMAL'>('ALL');
  const [activeTab, setActiveTab] = useState<'entries' | 'consumption' | 'cards'>('entries');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showTopUpModal, setShowTopUpModal] = useState<boolean>(false);
  const [selectedCardForTopUp, setSelectedCardForTopUp] = useState<FuelCard | null>(null);
  const [topUpAmount, setTopUpAmount] = useState<string>('500000');

  // New Fuel Entry form state
  const [newEntry, setNewEntry] = useState({
    vehicle_reg: 'BJ-1234-CD',
    vehicle_model: 'Peugeot 3008 Allure',
    driver_name: 'Pierre DOSSOU',
    station: 'TotalEnergies Marina',
    station_brand: 'TotalEnergies' as FuelEntry['station_brand'],
    fuel_type: 'Super Essence' as FuelEntry['fuel_type'],
    card_used: 'TotalEnergies Pro •••• 9920',
    liters: '55',
    price_per_liter: '700',
    odometer_km: '57500',
  });

  // Synchronize activeTab from currentSubView
  useEffect(() => {
    if (currentSubView === 'fuel_consumption') {
      setActiveTab('consumption');
    } else if (currentSubView === 'fuel_cards') {
      setActiveTab('cards');
    } else if (currentSubView === 'fuel_entries' || currentSubView === 'fuel') {
      setActiveTab('entries');
    }
  }, [currentSubView]);

  const handleSubTabSwitch = (tab: 'entries' | 'consumption' | 'cards') => {
    setActiveTab(tab);
    if (onNavigateSubView) {
      if (tab === 'consumption') onNavigateSubView('fuel_consumption');
      else if (tab === 'cards') onNavigateSubView('fuel_cards');
      else onNavigateSubView('fuel_entries');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Toggle card blocked/active status
  const handleToggleCardStatus = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          const newStatus = c.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
          showToast(
            `Carte ${c.brand_label} ${newStatus === 'BLOCKED' ? 'verrouillée' : 'débloquée avec succès'}.`
          );
          return { ...c, status: newStatus };
        }
        return c;
      })
    );
  };

  // Execute Card Top-up
  const handleTopUpCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCardForTopUp) return;

    const amount = parseInt(topUpAmount) || 250000;
    setCards((prev) =>
      prev.map((c) =>
        c.id === selectedCardForTopUp.id
          ? { ...c, balance_fcfa: c.balance_fcfa + amount }
          : c
      )
    );

    setShowTopUpModal(false);
    showToast(
      `Recharge de ${amount.toLocaleString('fr-FR')} FCFA validée sur la carte ${selectedCardForTopUp.brand_label}.`
    );
  };

  // Create Fuel Entry
  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const l = parseFloat(newEntry.liters) || 50;
    const p = parseFloat(newEntry.price_per_liter) || 700;
    const odo = parseInt(newEntry.odometer_km) || 57500;

    // Previous entry for delta
    const prevEntry = entries.find((e) => e.vehicle_reg === newEntry.vehicle_reg);
    const prevOdo = prevEntry ? prevEntry.odometer_km : odo - 650;
    const delta = Math.max(odo - prevOdo, 100);
    const calculatedL100 = parseFloat(((l / delta) * 100).toFixed(1));
    const isAbnormal = calculatedL100 > 15.0 && newEntry.vehicle_reg.includes('1234');

    const created: FuelEntry = {
      id: `fl_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      vehicle_reg: newEntry.vehicle_reg,
      vehicle_model: newEntry.vehicle_model,
      driver_name: newEntry.driver_name,
      station: newEntry.station,
      station_brand: newEntry.station_brand,
      fuel_type: newEntry.fuel_type,
      card_used: newEntry.card_used,
      liters: l,
      price_per_liter: p,
      total_cost_fcfa: Math.round(l * p),
      odometer_km: odo,
      delta_km: delta,
      consumption_l100: calculatedL100,
      is_abnormal: isAbnormal,
      anomaly_reason: isAbnormal ? 'Consommation supérieure au seuil moyen' : undefined,
      receipt_url: `ticket_${Date.now()}.pdf`,
    };

    setEntries([created, ...entries]);
    setShowAddModal(false);
    showToast(`Plein de ${l}L enregistré pour ${created.vehicle_reg} (${created.total_cost_fcfa.toLocaleString('fr-FR')} FCFA).`);
  };

  // Totals & Metrics
  const totalLiters = entries.reduce((a, b) => a + b.liters, 0);
  const totalCost = entries.reduce((a, b) => a + b.total_cost_fcfa, 0);
  const abnormalCount = entries.filter((e) => e.is_abnormal).length;
  const avgConsumption = (
    entries.reduce((a, b) => a + b.consumption_l100, 0) / entries.length
  ).toFixed(1);

  const filteredEntries = entries.filter((e) => {
    const matchesSearch =
      e.vehicle_reg.toLowerCase().includes(search.toLowerCase()) ||
      e.driver_name.toLowerCase().includes(search.toLowerCase()) ||
      e.station.toLowerCase().includes(search.toLowerCase()) ||
      e.fuel_type.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filterType === 'ALL' ||
      (filterType === 'ABNORMAL' && e.is_abnormal) ||
      (filterType === 'NORMAL' && !e.is_abnormal);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1680px] mx-auto">
      {/* Toast */}
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

      {/* Header with Navigation Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Carburant</span>
            <span>&gt;</span>
            <span className="font-semibold text-slate-700">
              {activeTab === 'entries' && 'Pleins de Carburant & Journal des Ravitaillements'}
              {activeTab === 'consumption' && 'Analyse des Consommations & Détection d’Écarts'}
              {activeTab === 'cards' && 'Cartes Pétrolières & Soldes Flotte'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Fuel className="w-6 h-6 text-sky-600" />
            <span>
              {activeTab === 'entries' && 'Journal des Pleins de Carburant'}
              {activeTab === 'consumption' && 'Audit Consommations & Anomalies L/100km'}
              {activeTab === 'cards' && 'Gestion des Cartes Carburant & Plafonds'}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeTab === 'entries' && 'Traçabilité des volumes, stations agréées (TotalEnergies, Oryx, Puma) et tickets scannés.'}
            {activeTab === 'consumption' && 'Contrôle télématique du rendement énergétique et détection des surconsommations suspectes.'}
            {activeTab === 'cards' && 'Pilotage des soldes disponibles, plafonds mensuels et règles de verrouillage aux pompes.'}
          </p>
        </div>

        {/* 3 Sub-tabs matching the sidebar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => handleSubTabSwitch('entries')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'entries' ? 'bg-white text-sky-700 shadow-xs ring-1 ring-sky-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Fuel className="w-3.5 h-3.5" />
              <span>Pleins carburant</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full font-bold">{entries.length}</span>
            </button>

            <button
              onClick={() => handleSubTabSwitch('consumption')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'consumption' ? 'bg-white text-rose-700 shadow-xs ring-1 ring-rose-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>Consommation</span>
              <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded-full font-bold">1 anomalie</span>
            </button>

            <button
              onClick={() => handleSubTabSwitch('cards')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'cards' ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-emerald-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Cartes carburant</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">{cards.length} actives</span>
            </button>
          </div>

          {activeTab === 'cards' ? (
            <button
              onClick={() => {
                setSelectedCardForTopUp(cards[0]);
                setShowTopUpModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Recharger une carte</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Saisir un plein</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Volume total pompé</span>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
              <Fuel className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {totalLiters.toLocaleString('fr-FR')} <span className="text-xs text-slate-500">Litres</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>-8.1% vs mois précédent</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Dépenses carburant</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {totalCost.toLocaleString('fr-FR')} <span className="text-xs text-slate-500">FCFA</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Prix subventionné : 700 FCFA / L</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Consommation moyenne</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {avgConsumption} <span className="text-xs text-slate-500">L / 100km</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Parc mixte (VP & Utilitaires)</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Alertes surconsommation</span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">{abnormalCount} anomalie</div>
          <div className="text-[11px] text-rose-600 mt-1 font-medium">Renault Master (+84% L/100)</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VUE 1 : PLEINS DE CARBURANT */}
      {/* ========================================================================= */}
      {activeTab === 'entries' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher immat, chauffeur ou station..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-sky-500 bg-slate-50"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                <Filter className="w-3.5 h-3.5" />
                <span>Statut plein :</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  onClick={() => setFilterType('ALL')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    filterType === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tous ({entries.length})
                </button>
                <button
                  onClick={() => setFilterType('NORMAL')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    filterType === 'NORMAL' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Conformes ({entries.filter((e) => !e.is_abnormal).length})
                </button>
                <button
                  onClick={() => setFilterType('ABNORMAL')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    filterType === 'ABNORMAL' ? 'bg-white text-rose-700 shadow-xs ring-1 ring-rose-200' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Anomalies ({abnormalCount})
                </button>
              </div>

              <button
                onClick={() => showToast('Journal des pleins exporté au format Excel/CSV.')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg cursor-pointer shadow-xs ml-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Date & Heure</th>
                    <th className="py-3 px-4">Véhicule</th>
                    <th className="py-3 px-4">Conducteur</th>
                    <th className="py-3 px-4">Station & Carte</th>
                    <th className="py-3 px-4">Type Carburant</th>
                    <th className="py-3 px-4">Volume (L)</th>
                    <th className="py-3 px-4">Compteur Km</th>
                    <th className="py-3 px-4">Montant Total</th>
                    <th className="py-3 px-4">Rendement L/100</th>
                    <th className="py-3 px-4 text-right">Ticket</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{entry.date}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{entry.time}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-sky-800">{entry.vehicle_reg}</div>
                        <div className="text-[11px] text-slate-500">{entry.vehicle_model}</div>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-800">{entry.driver_name}</td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900">{entry.station}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{entry.card_used}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                          entry.fuel_type === 'Super Essence'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-800 border border-slate-200'
                        }`}>
                          {entry.fuel_type}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{entry.liters} L</td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-800">{entry.odometer_km.toLocaleString('fr-FR')} km</div>
                        <div className="text-[10px] text-slate-400">+{entry.delta_km} km depuis dernier plein</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-black text-slate-900">
                        {entry.total_cost_fcfa.toLocaleString('fr-FR')} FCFA
                      </td>

                      <td className="py-3.5 px-4">
                        {entry.is_abnormal ? (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                              <AlertTriangle className="w-3 h-3 text-rose-600" />
                              <span>{entry.consumption_l100} L/100 (Anomalie)</span>
                            </span>
                            <div className="text-[10px] text-rose-600 font-medium mt-0.5 max-w-[180px] truncate" title={entry.anomaly_reason}>
                              {entry.anomaly_reason}
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>{entry.consumption_l100} L/100 (Conforme)</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => showToast(`Ticket station du plein ${entry.vehicle_reg} visualisé.`)}
                          className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                          title="Visualiser le reçu de caisse"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VUE 2 : CONSOMMATION & AUDIT ANOMALIES */}
      {/* ========================================================================= */}
      {activeTab === 'consumption' && (
        <div className="space-y-6">
          {/* Anomaly Alert Banner */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 text-amber-700 rounded-lg shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm block text-amber-950">1 surconsommation anormale sous surveillance télématique</span>
                <span>Fourgon Renault Master (BJ-5678-EF) : 16.4 L/100km (+84% vs référence constructeur de 8.9 L/100km).</span>
              </div>
            </div>
            <button
              onClick={() => showToast('Audit télématique complet et diagnostic injecteurs générés pour le Renault Master.')}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shrink-0 cursor-pointer"
            >
              Lancer audit télématique
            </button>
          </div>

          {/* Consumption Benchmarks by category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-500">Berlines & SUV (Direction)</span>
              <div className="text-2xl font-black text-slate-900">7.2 L / 100km</div>
              <div className="text-[11px] text-emerald-600 font-semibold">Excellente performance (-6% vs objectif SLA)</div>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                Peugeot 3008 (6.8 L) • Hyundai Santa Fe (8.2 L)
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-500">Pick-up 4x4 (Missions Régionales)</span>
              <div className="text-2xl font-black text-slate-900">9.4 L / 100km</div>
              <div className="text-[11px] text-slate-500 font-semibold">Conforme en charge tout-terrain</div>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                Toyota Hilux 4x4 (Parcours interurbain Cotonou - Parakou)
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-500">Utilitaires & Frigorifiques Portuaires</span>
              <div className="text-2xl font-black text-rose-600">15.6 L / 100km</div>
              <div className="text-[11px] text-rose-600 font-semibold">Écart élevé dû au ralenti prolongé et compresseur froid</div>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                Iveco Daily Frigo (14.8 L) • Renault Master (16.4 L ⚠️)
              </div>
            </div>
          </div>

          {/* Investigation Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">Registre d'Investigation des Écarts & Suspicion de Pertes / Siphonnage</h3>
              <p className="text-xs text-slate-500">Croisement automatique des volumes pompés et de la jauge télématique CAN-bus</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                    <th className="py-3 px-4">Véhicule</th>
                    <th className="py-3 px-4">Chauffeur</th>
                    <th className="py-3 px-4">Conso Relevée</th>
                    <th className="py-3 px-4">Cible Normale</th>
                    <th className="py-3 px-4">Écart (%)</th>
                    <th className="py-3 px-4">Contexte Trajet</th>
                    <th className="py-3 px-4">Diagnostic Télématique</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {audits.map((adt) => (
                    <tr key={adt.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-sky-800">{adt.vehicle_reg}</div>
                        <div className="text-[11px] text-slate-500">{adt.vehicle_model}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{adt.driver_name}</td>
                      <td className="py-3.5 px-4 font-black text-rose-600 font-mono text-sm">{adt.observed_l100} L/100</td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">{adt.benchmark_l100} L/100</td>
                      <td className="py-3.5 px-4 font-bold text-rose-700">+{adt.divergence_percent}%</td>
                      <td className="py-3.5 px-4 text-slate-600">{adt.route_context}</td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium max-w-xs">{adt.telematics_diag}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => showToast(`Convocateur éco-conduite et contrôle atelier programmés pour ${adt.driver_name}.`)}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-bold text-[11px] cursor-pointer"
                        >
                          Convoquer chauffeur
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VUE 3 : CARTES CARBURANT */}
      {/* ========================================================================= */}
      {activeTab === 'cards' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {cards.map((card) => {
              const percentageUsed = Math.min(
                100,
                Math.round(((card.monthly_limit_fcfa - card.balance_fcfa) / card.monthly_limit_fcfa) * 100)
              );
              const isBlocked = card.status === 'BLOCKED';

              return (
                <div
                  key={card.id}
                  className={`bg-gradient-to-br ${card.gradient} text-white p-6 rounded-2xl shadow-md space-y-4 relative overflow-hidden transition-all ${
                    isBlocked ? 'opacity-60 saturate-50 ring-2 ring-rose-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-mono tracking-widest uppercase opacity-80 block">{card.brand_label}</span>
                      <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold inline-block mt-0.5">
                        {card.fuel_restriction}
                      </span>
                    </div>
                    <CreditCard className="w-6 h-6 text-white/80" />
                  </div>

                  <div className="pt-2">
                    <div className="text-xl font-mono tracking-widest font-bold">{card.card_number}</div>
                    <div className="text-[11px] opacity-80 mt-1">{card.assigned_group}</div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-[11px] opacity-85">
                      <span>Solde restant</span>
                      <span className="font-bold text-sm">{card.balance_fcfa.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{ width: `${100 - percentageUsed}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-[10px] opacity-75">
                      <span>Plafond mensuel : {card.monthly_limit_fcfa.toLocaleString('fr-FR')} FCFA</span>
                      <span>{100 - percentageUsed}% disponible</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/20 flex items-center justify-between gap-2 text-xs">
                    <button
                      onClick={() => handleToggleCardStatus(card.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[11px] backdrop-blur-xs transition-colors cursor-pointer ${
                        isBlocked ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-white/20 hover:bg-white/30 text-white'
                      }`}
                    >
                      {isBlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                      <span>{isBlocked ? 'Débloquer' : 'Bloquer'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedCardForTopUp(card);
                        setShowTopUpModal(true);
                      }}
                      className="px-3.5 py-1.5 bg-white text-slate-900 font-bold rounded-lg text-[11px] hover:bg-white/90 shadow-xs cursor-pointer"
                    >
                      Recharger
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cards Security Rules */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-slate-900">Règles de Sécurité & Restrictions des Cartes Pétrolières Flotte JMF</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-800">Verrouillage Kilométrique Obligatoire</div>
                <div className="text-slate-500 text-[11px] mt-0.5">Saisie obligatoire du compteur kilométrique à la pompe avant validation du terminal TPE.</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-800">Type de Carburant Strict</div>
                <div className="text-slate-500 text-[11px] mt-0.5">Carte verrouillée sur le Gasoil pour les poids lourds et Super pour les berlines de direction.</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-800">Alerte SMS & Notification Instantanée</div>
                <div className="text-slate-500 text-[11px] mt-0.5">Alerte automatique transmise au gestionnaire pour tout plein supérieur à 80 Litres ou hors horaires de service.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1 : SAISIR UN PLEIN */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Fuel className="w-5 h-5 text-sky-600" />
                <span>Enregistrer un plein de carburant</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEntry} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Véhicule</label>
                  <select
                    value={newEntry.vehicle_reg}
                    onChange={(e) => {
                      const reg = e.target.value;
                      const modelMap: Record<string, { model: string; driver: string; fuel: FuelEntry['fuel_type'] }> = {
                        'BJ-1234-CD': { model: 'Peugeot 3008 Allure', driver: 'Pierre DOSSOU', fuel: 'Super Essence' },
                        'BJ-5678-EF': { model: 'Renault Master dCi', driver: 'Koffi AMAN', fuel: 'Gasoil' },
                        'BJ-9012-GH': { model: 'Toyota Hilux 4x4', driver: 'Mathieu KPADONOU', fuel: 'Gasoil' },
                        'BJ-3456-IJ': { model: 'Iveco Daily 35S16 Frigo', driver: 'Michel HOUNGBO', fuel: 'Gasoil' },
                        'BJ-7890-KL': { model: 'Hyundai Santa Fe 2.2', driver: 'Jean KOUASSI', fuel: 'Gasoil' },
                      };
                      const found = modelMap[reg];
                      if (found) {
                        setNewEntry({
                          ...newEntry,
                          vehicle_reg: reg,
                          vehicle_model: found.model,
                          driver_name: found.driver,
                          fuel_type: found.fuel,
                        });
                      }
                    }}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 font-medium"
                  >
                    <option value="BJ-1234-CD">BJ-1234-CD • Peugeot 3008</option>
                    <option value="BJ-5678-EF">BJ-5678-EF • Renault Master</option>
                    <option value="BJ-9012-GH">BJ-9012-GH • Toyota Hilux 4x4</option>
                    <option value="BJ-3456-IJ">BJ-3456-IJ • Iveco Daily Frigo</option>
                    <option value="BJ-7890-KL">BJ-7890-KL • Hyundai Santa Fe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Conducteur</label>
                  <input
                    type="text"
                    required
                    value={newEntry.driver_name}
                    onChange={(e) => setNewEntry({ ...newEntry, driver_name: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Station service</label>
                  <select
                    value={newEntry.station}
                    onChange={(e) => {
                      const st = e.target.value;
                      const brand = st.includes('Total') ? 'TotalEnergies' : st.includes('Oryx') ? 'Oryx' : 'Puma';
                      setNewEntry({ ...newEntry, station: st, station_brand: brand });
                    }}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 font-medium"
                  >
                    <option value="TotalEnergies Marina">TotalEnergies Marina</option>
                    <option value="Oryx Étoile Rouge">Oryx Étoile Rouge</option>
                    <option value="TotalEnergies Carrefour Vèdoko">TotalEnergies Carrefour Vèdoko</option>
                    <option value="TotalEnergies Aéroport Cadjèhoun">TotalEnergies Aéroport Cadjèhoun</option>
                    <option value="Puma Energy Akpakpa">Puma Energy Akpakpa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Type carburant</label>
                  <select
                    value={newEntry.fuel_type}
                    onChange={(e) => setNewEntry({ ...newEntry, fuel_type: e.target.value as any })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 font-medium"
                  >
                    <option value="Super Essence">Super Essence (700 FCFA/L)</option>
                    <option value="Gasoil">Gasoil (700 FCFA/L)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Volume pompé (Litres)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newEntry.liters}
                    onChange={(e) => setNewEntry({ ...newEntry, liters: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Compteur Kilométrique</label>
                  <input
                    type="number"
                    required
                    value={newEntry.odometer_km}
                    onChange={(e) => setNewEntry({ ...newEntry, odometer_km: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600 font-medium">Montant calculé :</span>
                <span className="text-sm font-black text-slate-900 font-mono">
                  {(parseFloat(newEntry.liters || '0') * 700).toLocaleString('fr-FR')} FCFA
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Valider le plein
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2 : RECHARGER CARTE */}
      {/* ========================================================================= */}
      {showTopUpModal && selectedCardForTopUp && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span>Recharger Carte {selectedCardForTopUp.brand_label}</span>
              </h3>
              <button
                onClick={() => setShowTopUpModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTopUpCard} className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-[11px] text-slate-500 font-medium">Numéro de carte :</div>
                <div className="font-mono font-bold text-slate-900">{selectedCardForTopUp.card_number}</div>
                <div className="text-slate-600 mt-1">
                  Solde actuel : <span className="font-bold text-emerald-700">{selectedCardForTopUp.balance_fcfa.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Montant de la recharge (FCFA)</label>
                <select
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 font-bold text-slate-900 text-xs"
                >
                  <option value="250000">250 000 FCFA</option>
                  <option value="500000">500 000 FCFA</option>
                  <option value="1000000">1 000 000 FCFA</option>
                  <option value="1500000">1 500 000 FCFA</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Mode de règlement</label>
                <select className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 text-xs">
                  <option>Virement bancaire entreprise (Compte JMF Flotte)</option>
                  <option>Bon de commande pétrolier</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTopUpModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Confirmer le rechargement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
