import React, { useState, useEffect } from 'react';
import {
  Radio,
  MapPin,
  Navigation,
  Activity,
  Car,
  AlertTriangle,
  Clock,
  BatteryCharging,
  Wifi,
  Shield,
  Search,
  Plus,
  Lock,
  Unlock,
  Bell,
  CheckCircle2,
  X,
  Gauge,
  Sliders,
  Compass,
} from 'lucide-react';

interface VehicleTracker {
  id: string;
  reg: string;
  model: string;
  driver: string;
  speed_kmh: number;
  status: 'MOVING' | 'IDLE' | 'STOPPED';
  location_name: string;
  lat: number;
  lng: number;
  last_ping: string;
  fuel_percent: number;
  ignition: boolean;
  geofence: string;
}

interface GeofenceZone {
  id: string;
  name: string;
  type: 'CIRCULAR' | 'CORRIDOR' | 'RESTRICTED';
  location_desc: string;
  radius_m: number;
  speed_limit_kmh: number;
  active_vehicles_inside: number;
  alert_on_exit: boolean;
  alert_on_entry: boolean;
}

interface TelematicsAlertEvent {
  id: string;
  timestamp: string;
  vehicle_reg: string;
  vehicle_model: string;
  driver_name: string;
  type: 'SPEEDING' | 'HARSH_BRAKING' | 'GEOFENCE_BREACH' | 'BATTERY_TAMPER' | 'AFTER_HOURS_USE';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  description: string;
  location: string;
  status: 'PENDING' | 'ACKNOWLEDGED';
}

const TRACKED_VEHICLES: VehicleTracker[] = [
  {
    id: 't_1',
    reg: 'BJ-1234-CD',
    model: 'Peugeot 3008',
    driver: 'Pierre DOSSOU',
    speed_kmh: 48,
    status: 'MOVING',
    location_name: 'Boulevard de la Marina, Face Présidence, Cotonou',
    lat: 6.357,
    lng: 2.435,
    last_ping: 'Il y a 12 sec',
    fuel_percent: 65,
    ignition: true,
    geofence: 'Zone Centre-Ville / Marina',
  },
  {
    id: 't_2',
    reg: 'BJ-5678-EF',
    model: 'Renault Master',
    driver: 'Koffi AMAN',
    speed_kmh: 0,
    status: 'IDLE',
    location_name: 'Terminal Conteneurs, Port Autonome de Cotonou',
    lat: 6.368,
    lng: 2.428,
    last_ping: 'Il y a 45 sec',
    fuel_percent: 40,
    ignition: true,
    geofence: 'Zone Portuaire Sécurisée',
  },
  {
    id: 't_3',
    reg: 'BJ-9012-GH',
    model: 'Toyota Hilux 4x4',
    driver: 'Mathieu KPADONOU',
    speed_kmh: 64,
    status: 'MOVING',
    location_name: 'Carrefour de l’Étoile Rouge vers Sainte Rita, Cotonou',
    lat: 6.375,
    lng: 2.415,
    last_ping: 'Il y a 8 sec',
    fuel_percent: 85,
    ignition: true,
    geofence: 'Corridor Urbain RNIE 1',
  },
  {
    id: 't_4',
    reg: 'BJ-7890-KL',
    model: 'Hyundai Santa Fe',
    driver: 'Jean KOUASSI',
    speed_kmh: 0,
    status: 'STOPPED',
    location_name: 'Parking Direction Générale, Ganhi, Cotonou',
    lat: 6.348,
    lng: 2.408,
    last_ping: 'Il y a 3 min',
    fuel_percent: 70,
    ignition: false,
    geofence: 'Siège Social',
  },
  {
    id: 't_5',
    reg: 'BJ-3456-IJ',
    model: 'Iveco Daily Frigo',
    driver: 'Michel HOUNGBO',
    speed_kmh: 0,
    status: 'STOPPED',
    location_name: 'Atelier Central JMF Mobility, Akpakpa',
    lat: 6.362,
    lng: 2.448,
    last_ping: 'Il y a 5 min',
    fuel_percent: 20,
    ignition: false,
    geofence: 'Atelier & Hub Gardiennage',
  },
];

const INITIAL_GEOFENCES: GeofenceZone[] = [
  {
    id: 'geo_1',
    name: 'Zone Portuaire Sécurisée (PAC)',
    type: 'CIRCULAR',
    location_desc: 'Port Autonome de Cotonou & quais fret',
    radius_m: 2500,
    speed_limit_kmh: 30,
    active_vehicles_inside: 1,
    alert_on_exit: true,
    alert_on_entry: false,
  },
  {
    id: 'geo_2',
    name: 'Corridor Urbain RNIE 1 (Cotonou - Calavi)',
    type: 'CORRIDOR',
    location_desc: 'Axe routier national principal',
    radius_m: 5000,
    speed_limit_kmh: 70,
    active_vehicles_inside: 2,
    alert_on_exit: true,
    alert_on_entry: false,
  },
  {
    id: 'geo_3',
    name: 'Siège Social & Parking Direction (Ganhi)',
    type: 'CIRCULAR',
    location_desc: 'Bâtiment central & stationnement cadres',
    radius_m: 350,
    speed_limit_kmh: 20,
    active_vehicles_inside: 1,
    alert_on_exit: false,
    alert_on_entry: true,
  },
  {
    id: 'geo_4',
    name: 'Atelier Central & Hub Akpakpa',
    type: 'RESTRICTED',
    location_desc: 'Base technique & parcage sécurisé de nuit',
    radius_m: 800,
    speed_limit_kmh: 25,
    active_vehicles_inside: 1,
    alert_on_exit: true,
    alert_on_entry: false,
  },
];

const INITIAL_EVENTS: TelematicsAlertEvent[] = [
  {
    id: 'evt_1',
    timestamp: '2026-09-21 17:15',
    vehicle_reg: 'BJ-9012-GH',
    vehicle_model: 'Toyota Hilux 4x4',
    driver_name: 'Mathieu KPADONOU',
    type: 'SPEEDING',
    severity: 'WARNING',
    description: 'Excès de vitesse détecté : 84 km/h en zone urbaine limitée à 60 km/h.',
    location: 'Carrefour de l’Étoile Rouge, Cotonou',
    status: 'PENDING',
  },
  {
    id: 'evt_2',
    timestamp: '2026-09-21 16:40',
    vehicle_reg: 'BJ-5678-EF',
    vehicle_model: 'Renault Master',
    driver_name: 'Koffi AMAN',
    type: 'HARSH_BRAKING',
    severity: 'WARNING',
    description: 'Freinage d’urgence violent (-4.2 m/s²) détecté par l’accéléromètre 3 axes.',
    location: 'Sortie sud Quai Portuaire',
    status: 'ACKNOWLEDGED',
  },
  {
    id: 'evt_3',
    timestamp: '2026-09-21 14:10',
    vehicle_reg: 'BJ-3456-IJ',
    vehicle_model: 'Iveco Daily Frigo',
    driver_name: 'Michel HOUNGBO',
    type: 'GEOFENCE_BREACH',
    severity: 'CRITICAL',
    description: 'Sortie de zone autorisée vers zone non agréée hors mission.',
    location: 'Axe Akpakpa PK3',
    status: 'ACKNOWLEDGED',
  },
];

interface TelematicsViewProps {
  currentSubView?: string;
  onNavigateSubView?: (subView: string) => void;
}

export const TelematicsView: React.FC<TelematicsViewProps> = ({
  currentSubView,
  onNavigateSubView,
}) => {
  const [vehicles, setVehicles] = useState<VehicleTracker[]>(TRACKED_VEHICLES);
  const [geofences, setGeofences] = useState<GeofenceZone[]>(INITIAL_GEOFENCES);
  const [events, setEvents] = useState<TelematicsAlertEvent[]>(INITIAL_EVENTS);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleTracker>(TRACKED_VEHICLES[0]);
  const [search, setSearch] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'live' | 'geofence' | 'alerts'>('live');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal new geofence
  const [isAddGeofenceOpen, setIsAddGeofenceOpen] = useState(false);
  const [newGeofence, setNewGeofence] = useState({
    name: '',
    location_desc: '',
    radius_m: '1000',
    speed_limit_kmh: '50',
    type: 'CIRCULAR' as GeofenceZone['type'],
  });

  useEffect(() => {
    if (currentSubView === 'telematics_geofence' || currentSubView === 'telematics_geofencing') {
      setActiveTab('geofence');
    } else if (currentSubView === 'telematics_alerts' || currentSubView === 'telematics_events') {
      setActiveTab('alerts');
    } else if (currentSubView === 'telematics_live' || currentSubView === 'telematics') {
      setActiveTab('live');
    }
  }, [currentSubView]);

  const handleSubTabSwitch = (tab: 'live' | 'geofence' | 'alerts') => {
    setActiveTab(tab);
    if (onNavigateSubView) {
      if (tab === 'geofence') onNavigateSubView('telematics_geofence');
      else if (tab === 'alerts') onNavigateSubView('telematics_alerts');
      else onNavigateSubView('telematics_live');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAcknowledgeEvent = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'ACKNOWLEDGED' } : e))
    );
    showToast('Événement télématique acquitté et consigné.');
  };

  const handleAddGeofence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGeofence.name) return;

    const created: GeofenceZone = {
      id: `geo_${Date.now()}`,
      name: newGeofence.name,
      type: newGeofence.type,
      location_desc: newGeofence.location_desc || 'Zone personnalisée Cotonou',
      radius_m: parseInt(newGeofence.radius_m) || 1000,
      speed_limit_kmh: parseInt(newGeofence.speed_limit_kmh) || 50,
      active_vehicles_inside: 0,
      alert_on_exit: true,
      alert_on_entry: false,
    };

    setGeofences([...geofences, created]);
    setIsAddGeofenceOpen(false);
    showToast(`Zone de géorepérage "${created.name}" activée avec succès !`);
  };

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.reg.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.driver.toLowerCase().includes(search.toLowerCase())
  );

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
            <span>Télématique</span>
            <span>&gt;</span>
            <span className="font-semibold text-slate-700">
              {activeTab === 'live' && 'Suivi en Temps Réel GPS & Télémétrie'}
              {activeTab === 'geofence' && 'Géorepérage (Geofencing) & Zones Sécurisées'}
              {activeTab === 'alerts' && 'Alertes Télématiques & Événements Capteurs'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Radio className="w-6 h-6 text-sky-600 animate-pulse" />
            <span>
              {activeTab === 'live' && 'Suivi de Flotte en Temps Réel'}
              {activeTab === 'geofence' && 'Zones de Géorepérage & Corridors'}
              {activeTab === 'alerts' && 'Journal des Alertes & Événements IoT'}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeTab === 'live' && 'Passerelle connectée JMF IoT Gateway • Balises 4G/GPS actives sur 5 véhicules.'}
            {activeTab === 'geofence' && 'Surveillance des limites géographiques autorisées, du port de Cotonou et des corridors nationaux.'}
            {activeTab === 'alerts' && 'Détection des excès de vitesse, freinages d’urgence et tentatives de sabotage batterie.'}
          </p>
        </div>

        {/* 3 Sub-tabs matching the sidebar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto">
            <button
              onClick={() => handleSubTabSwitch('live')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'live' ? 'bg-white text-sky-700 shadow-xs ring-1 ring-sky-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Suivi en temps réel
            </button>
            <button
              onClick={() => handleSubTabSwitch('geofence')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'geofence' ? 'bg-white text-sky-700 shadow-xs ring-1 ring-sky-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Géorepérage ({geofences.length})
            </button>
            <button
              onClick={() => handleSubTabSwitch('alerts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'alerts' ? 'bg-white text-rose-700 shadow-xs ring-1 ring-rose-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Alertes et événements ({events.length})
            </button>
          </div>

          {activeTab === 'geofence' ? (
            <button
              onClick={() => setIsAddGeofenceOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Créer une zone</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Passerelle Connectée (5/5)
            </span>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VUE 1 : SUIVI EN TEMPS RÉEL */}
      {/* ========================================================================= */}
      {activeTab === 'live' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
          {/* Left: Vehicle Selector */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher par immat, modèle ou chauffeur..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-sky-500 bg-slate-50"
                />
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {filteredVehicles.map((v) => {
                  const isSelected = selectedVehicle.id === v.id;
                  return (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVehicle(v)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-50/80 border-sky-400 shadow-xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-slate-900">{v.reg}</span>
                          <span className="text-[11px] text-slate-500 truncate max-w-[120px]">{v.model}</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            v.status === 'MOVING'
                              ? 'bg-emerald-100 text-emerald-800'
                              : v.status === 'IDLE'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {v.status === 'MOVING' ? `${v.speed_kmh} km/h` : v.status === 'IDLE' ? 'Ralenti' : 'Arrêté'}
                        </span>
                      </div>

                      <div className="mt-2 text-[11px] text-slate-600 truncate">{v.location_name}</div>
                      <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Chauffeur : {v.driver}</span>
                        <span className="font-mono">{v.last_ping}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: GPS Radar Visualizer */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-[#0B1528] rounded-2xl p-6 border border-slate-800 shadow-lg text-white relative overflow-hidden min-h-[420px] flex flex-col justify-between">
              {/* Top Map HUD */}
              <div className="flex items-center justify-between z-10 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold tracking-tight">Zone Cotonou & Corridors Sud Bénin</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      GPS: {selectedVehicle.lat.toFixed(4)}° N, {selectedVehicle.lng.toFixed(4)}° E • {selectedVehicle.location_name}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800 text-sky-300 font-mono border border-slate-700">
                    GEOFENCE : {selectedVehicle.geofence}
                  </span>
                </div>
              </div>

              {/* Radar Graphical Representation */}
              <div className="my-8 relative flex items-center justify-center">
                <div className="w-80 h-80 rounded-full border border-sky-500/20 flex items-center justify-center">
                  <div className="w-56 h-56 rounded-full border border-sky-500/30 flex items-center justify-center">
                    <div className="w-36 h-36 rounded-full border border-sky-500/40 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-sky-500 shadow-lg shadow-sky-500/50 animate-ping" />
                    </div>
                  </div>
                </div>

                {/* Selected vehicle on radar */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-500 text-white font-mono text-xs font-black shadow-lg shadow-sky-500/50">
                    <Car className="w-3.5 h-3.5" />
                    <span>{selectedVehicle.reg}</span>
                  </div>
                  <div className="text-[11px] font-bold text-sky-200 mt-1">
                    {selectedVehicle.speed_kmh} km/h • {selectedVehicle.status === 'MOVING' ? 'En circulation' : selectedVehicle.status === 'IDLE' ? 'Ralenti moteur' : 'Stationné'}
                  </div>
                </div>
              </div>

              {/* Bottom HUD Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80 z-10">
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Conducteur affecté</div>
                  <div className="text-xs font-bold text-slate-200 mt-0.5 truncate">{selectedVehicle.driver}</div>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Vitesse télématique</div>
                  <div className="text-xs font-bold text-emerald-400 font-mono mt-0.5">
                    {selectedVehicle.speed_kmh} km/h
                  </div>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Jauge réservoir</div>
                  <div className="text-xs font-bold text-sky-400 font-mono mt-0.5">
                    {selectedVehicle.fuel_percent} %
                  </div>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Contact d'allumage</div>
                  <div className="text-xs font-bold text-slate-200 mt-0.5">
                    {selectedVehicle.ignition ? '🟢 Moteur Allumé' : '🔴 Moteur Coupé'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VUE 2 : GÉOREPÉRAGE (GEOFENCING) */}
      {/* ========================================================================= */}
      {activeTab === 'geofence' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {geofences.map((zone) => (
              <div key={zone.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    zone.type === 'RESTRICTED'
                      ? 'bg-rose-100 text-rose-800'
                      : zone.type === 'CORRIDOR'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-sky-100 text-sky-800'
                  }`}>
                    {zone.type === 'RESTRICTED' ? 'Zone Sensible' : zone.type === 'CORRIDOR' ? 'Corridor Routier' : 'Périmètre Circulaire'}
                  </span>
                  <MapPin className="w-4 h-4 text-slate-400" />
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{zone.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{zone.location_desc}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Rayon / Périmètre</span>
                    <span className="font-mono font-bold text-slate-800">{zone.radius_m} m</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Vitesse max</span>
                    <span className="font-mono font-bold text-slate-800">{zone.speed_limit_kmh} km/h</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-[11px] text-slate-500">
                    <span className="font-bold text-slate-900">{zone.active_vehicles_inside}</span> véhicule(s) dans la zone
                  </span>
                  <button
                    onClick={() => showToast(`Zone ${zone.name} paramétrée et synchronisée.`)}
                    className="text-sky-600 hover:text-sky-800 font-bold text-[11px] cursor-pointer"
                  >
                    Modifier
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Historical Geofence breaches */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Registre des Franchissements de Zones et Entrées/Sorties</h3>
              <span className="text-xs text-slate-500">Surveillance continue 24h/24</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase">
                  <tr>
                    <th className="py-3 px-4">Horodatage</th>
                    <th className="py-3 px-4">Véhicule</th>
                    <th className="py-3 px-4">Conducteur</th>
                    <th className="py-3 px-4">Zone Concernée</th>
                    <th className="py-3 px-4">Événement</th>
                    <th className="py-3 px-4 text-right">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono text-slate-600">21/09 16:55</td>
                    <td className="py-3 px-4 font-mono font-bold text-sky-800">BJ-1234-CD</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">Pierre DOSSOU</td>
                    <td className="py-3 px-4 text-slate-700">Zone Centre-Ville / Marina</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Entrée de zone conforme
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400 font-mono text-[10px]">Validé auto</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono text-slate-600">21/09 14:10</td>
                    <td className="py-3 px-4 font-mono font-bold text-sky-800">BJ-3456-IJ</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">Michel HOUNGBO</td>
                    <td className="py-3 px-4 text-slate-700">Atelier & Hub Akpakpa</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                        Sortie non planifiée (Alerte)
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-amber-600 font-bold text-[10px]">Justification reçue</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VUE 3 : ALERTES ET ÉVÉNEMENTS */}
      {/* ========================================================================= */}
      {activeTab === 'alerts' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Journal des Alertes Télématiques en Temps Réel</h3>
              <span className="text-xs text-slate-500">Transmis par balises GPS 4G LTE</span>
            </div>

            <div className="divide-y divide-slate-100">
              {events.map((evt) => (
                <div key={evt.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      evt.severity === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-xs text-sky-900">{evt.vehicle_reg}</span>
                        <span className="text-xs font-semibold text-slate-700">{evt.vehicle_model}</span>
                        <span className="text-xs text-slate-400">• Chauffeur : {evt.driver_name}</span>
                        <span className="text-[10px] font-mono text-slate-400">({evt.timestamp})</span>
                      </div>

                      <p className="text-xs text-slate-800 font-medium">{evt.description}</p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{evt.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {evt.status === 'PENDING' ? (
                      <button
                        onClick={() => handleAcknowledgeEvent(evt.id)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Acquitter
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Traité</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Geofence */}
      {isAddGeofenceOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-sky-600" />
                <span>Créer une Zone de Géorepérage</span>
              </h3>
              <button onClick={() => setIsAddGeofenceOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGeofence} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nom de la zone</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Zone Industrielle Ouidah"
                  value={newGeofence.name}
                  onChange={(e) => setNewGeofence({ ...newGeofence, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Type de zone</label>
                <select
                  value={newGeofence.type}
                  onChange={(e) => setNewGeofence({ ...newGeofence, type: e.target.value as any })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50"
                >
                  <option value="CIRCULAR">Périmètre Circulaire (Rayon standard)</option>
                  <option value="CORRIDOR">Corridor Routier National</option>
                  <option value="RESTRICTED">Zone Restreinte / Sensible</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Rayon (mètres)</label>
                  <input
                    type="number"
                    value={newGeofence.radius_m}
                    onChange={(e) => setNewGeofence({ ...newGeofence, radius_m: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Vitesse max (km/h)</label>
                  <input
                    type="number"
                    value={newGeofence.speed_limit_kmh}
                    onChange={(e) => setNewGeofence({ ...newGeofence, speed_limit_kmh: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddGeofenceOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold shadow-sm cursor-pointer"
                >
                  Enregistrer la zone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
