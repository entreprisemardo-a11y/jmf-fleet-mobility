import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Car,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Filter,
  User,
  Key,
  MapPin,
  Check,
  X,
  ChevronRight,
  ShieldCheck,
  Gauge,
  Fuel,
  ArrowRight,
  FileText,
  FileCheck,
  CalendarDays,
  Sparkles,
} from 'lucide-react';
import { generateMissionOrderPdf, MissionOrder } from '../../utils/pdfMissionGenerator.js';

export interface PoolVehicle {
  id: string;
  reg: string;
  model: string;
  category: 'Berline Affaires' | 'SUV Tout-Terrain' | 'Utilitaire Fourgon' | 'Navette Minibus';
  energy: string;
  seats: number;
  odometer: number;
  fuelLevel: string;
  location: string;
  status: 'AVAILABLE' | 'IN_USE' | 'RESERVED' | 'MAINTENANCE';
}

export interface Reservation {
  id: string;
  code: string;
  employeeName: string;
  employeeDepartment: string;
  employeePhone: string;
  vehicleId: string;
  vehicleReg: string;
  vehicleModel: string;
  withDriver: boolean;
  driverName?: string;
  destination: string;
  purpose: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  status: 'PENDING_APPROVAL' | 'CONFIRMED' | 'IN_USE' | 'COMPLETED' | 'REJECTED';
  startKm?: number;
  returnKm?: number;
  fuelStart?: string;
  fuelEnd?: string;
  notes?: string;
  createdAt: string;
}

const INITIAL_POOL_VEHICLES: PoolVehicle[] = [
  {
    id: 'pool_1',
    reg: 'BJ-1234-CD',
    model: 'Peugeot 3008 Allure',
    category: 'Berline Affaires',
    energy: 'Essence Super',
    seats: 5,
    odometer: 56780,
    fuelLevel: '85%',
    location: 'Siège Marina Cotonou',
    status: 'AVAILABLE',
  },
  {
    id: 'pool_2',
    reg: 'BJ-7890-KL',
    model: 'Hyundai Santa Fe Premium',
    category: 'SUV Tout-Terrain',
    energy: 'Diesel',
    seats: 7,
    odometer: 42100,
    fuelLevel: '95%',
    location: 'Siège Marina Cotonou',
    status: 'RESERVED',
  },
  {
    id: 'pool_3',
    reg: 'BJ-9012-GH',
    model: 'Toyota Hilux 4x4 Double Cabine',
    category: 'SUV Tout-Terrain',
    energy: 'Diesel',
    seats: 5,
    odometer: 24300,
    fuelLevel: '70%',
    location: 'Dépôt GDIZ Glo-Djigbé',
    status: 'IN_USE',
  },
  {
    id: 'pool_4',
    reg: 'BJ-5678-EF',
    model: 'Renault Master Fourgon 13m3',
    category: 'Utilitaire Fourgon',
    energy: 'Diesel',
    seats: 3,
    odometer: 112400,
    fuelLevel: '60%',
    location: 'Base Logistique Akpakpa',
    status: 'AVAILABLE',
  },
  {
    id: 'pool_5',
    reg: 'BJ-2345-AB',
    model: 'Toyota HiAce Minibus 15 places',
    category: 'Navette Minibus',
    energy: 'Diesel',
    seats: 15,
    odometer: 89300,
    fuelLevel: '90%',
    location: 'Siège Marina Cotonou',
    status: 'AVAILABLE',
  },
];

const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res_1',
    code: 'RES-2026-0041',
    employeeName: 'Dr. Aurel HOUNNOU',
    employeeDepartment: 'Direction Administrative & Juridique',
    employeePhone: '+229 97 45 88 12',
    vehicleId: 'pool_2',
    vehicleReg: 'BJ-7890-KL',
    vehicleModel: 'Hyundai Santa Fe Premium',
    withDriver: true,
    driverName: 'Pierre DOSSOU',
    destination: 'Porto-Novo (Ministère de l’Énergie)',
    purpose: 'Signature d’avenants et séances de travail institutionnelles',
    startDate: '2026-09-22',
    startTime: '08:30',
    endDate: '2026-09-22',
    endTime: '17:00',
    status: 'CONFIRMED',
    startKm: 42100,
    fuelStart: '95%',
    createdAt: '2026-09-20 à 14:10',
  },
  {
    id: 'res_2',
    code: 'RES-2026-0042',
    employeeName: 'M. Paul MENSAH',
    employeeDepartment: 'Pôle Ingénierie & Grands Projets',
    employeePhone: '+229 96 11 22 33',
    vehicleId: 'pool_3',
    vehicleReg: 'BJ-9012-GH',
    vehicleModel: 'Toyota Hilux 4x4 Double Cabine',
    withDriver: true,
    driverName: 'Koffi AMAN',
    destination: 'Zone Franche Industrielle Glo-Djigbé (GDIZ)',
    purpose: 'Inspection d’avancement des travaux d’entrepôts logistiques',
    startDate: '2026-09-21',
    startTime: '07:00',
    endDate: '2026-09-21',
    endTime: '19:00',
    status: 'IN_USE',
    startKm: 24300,
    fuelStart: '70%',
    createdAt: '2026-09-19 à 09:30',
  },
  {
    id: 'res_3',
    code: 'RES-2026-0043',
    employeeName: 'Mme Clarisse SOGLO',
    employeeDepartment: 'Direction Commerciale & Partenariats',
    employeePhone: '+229 95 67 89 01',
    vehicleId: 'pool_1',
    vehicleReg: 'BJ-1234-CD',
    vehicleModel: 'Peugeot 3008 Allure',
    withDriver: false,
    destination: 'Port Autonome de Cotonou & Marina',
    purpose: 'Tournée clientèle transitaires et armateurs maritimes',
    startDate: '2026-09-23',
    startTime: '09:00',
    endDate: '2026-09-23',
    endTime: '16:00',
    status: 'PENDING_APPROVAL',
    createdAt: '2026-09-21 à 11:15',
  },
  {
    id: 'res_4',
    code: 'RES-2026-0039',
    employeeName: 'M. Félix TOSSOU',
    employeeDepartment: 'Audit Interne & Conformité',
    employeePhone: '+229 94 33 22 11',
    vehicleId: 'pool_1',
    vehicleReg: 'BJ-1234-CD',
    vehicleModel: 'Peugeot 3008 Allure',
    withDriver: false,
    destination: 'Ouidah & Grand-Popo',
    purpose: 'Contrôle inventaire et clôture de caisse agence régionale',
    startDate: '2026-09-19',
    startTime: '08:00',
    endDate: '2026-09-19',
    endTime: '18:00',
    status: 'COMPLETED',
    startKm: 56610,
    returnKm: 56780,
    fuelStart: '100%',
    fuelEnd: '85%',
    createdAt: '2026-09-18 à 15:45',
  },
];

export const VehicleReservationsView: React.FC = () => {
  const [vehicles, setVehicles] = useState<PoolVehicle[]>(INITIAL_POOL_VEHICLES);
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [activeTab, setActiveTab] = useState<'RESERVATIONS' | 'POOL_VEHICLES' | 'WEEK_PLANNING'>('RESERVATIONS');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'ACTIVE' | 'CONFIRMED' | 'COMPLETED'>('ALL');
  const [search, setSearch] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal states
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  // New Booking Form
  const [bookingForm, setBookingForm] = useState({
    employeeName: '',
    employeeDepartment: 'Direction Commerciale',
    employeePhone: '+229 ',
    vehicleId: 'pool_1',
    withDriver: false,
    destination: '',
    purpose: '',
    startDate: new Date().toISOString().split('T')[0],
    startTime: '08:30',
    endDate: new Date().toISOString().split('T')[0],
    endTime: '17:30',
  });

  // Check-out form state
  const [checkOutKm, setCheckOutKm] = useState<number>(0);
  const [checkOutFuel, setCheckOutFuel] = useState<string>('85%');

  // Check-in form state
  const [checkInKm, setCheckInKm] = useState<number>(0);
  const [checkInFuel, setCheckInFuel] = useState<string>('75%');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Actions
  const handleApprove = (resId: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === resId ? { ...r, status: 'CONFIRMED' } : r))
    );
    showToast('Réservation approuvée et confirmée !');
  };

  const handleReject = (resId: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === resId ? { ...r, status: 'REJECTED' } : r))
    );
    showToast('Réservation refusée.');
  };

  const handleOpenCheckOut = (res: Reservation) => {
    setSelectedReservation(res);
    const v = vehicles.find((veh) => veh.id === res.vehicleId);
    setCheckOutKm(v?.odometer || 50000);
    setCheckOutFuel(v?.fuelLevel || '80%');
    setIsCheckOutModalOpen(true);
  };

  const handleConfirmCheckOut = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReservation) return;

    // Update reservation
    setReservations((prev) =>
      prev.map((r) =>
        r.id === selectedReservation.id
          ? {
              ...r,
              status: 'IN_USE',
              startKm: checkOutKm,
              fuelStart: checkOutFuel,
            }
          : r
      )
    );

    // Update vehicle status
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === selectedReservation.vehicleId ? { ...v, status: 'IN_USE' } : v
      )
    );

    setIsCheckOutModalOpen(false);
    showToast(`Clés remises à ${selectedReservation.employeeName}. Véhicule en circulation.`);
  };

  const handleOpenCheckIn = (res: Reservation) => {
    setSelectedReservation(res);
    setCheckInKm((res.startKm || 50000) + 65);
    setCheckInFuel('70%');
    setIsCheckInModalOpen(true);
  };

  const handleConfirmCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReservation) return;

    // Update reservation
    setReservations((prev) =>
      prev.map((r) =>
        r.id === selectedReservation.id
          ? {
              ...r,
              status: 'COMPLETED',
              returnKm: checkInKm,
              fuelEnd: checkInFuel,
            }
          : r
      )
    );

    // Update vehicle status and odometer
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === selectedReservation.vehicleId
          ? { ...v, status: 'AVAILABLE', odometer: checkInKm, fuelLevel: checkInFuel }
          : v
      )
    );

    setIsCheckInModalOpen(false);
    showToast(`Véhicule restitué et inspecté. Réintégré au pool disponible.`);
  };

  const handleGenerateMissionPdfFromReservation = (res: Reservation) => {
    const mission: MissionOrder = {
      id: `m_${res.id}`,
      reference: `ODM-2026-${res.code.replace('RES-2026-', '')}`,
      companyName: 'SOCIÉTÉ COMMERCIALE DU BÉNIN (SOCOB-SARL)',
      vehicleReg: res.vehicleReg,
      vehicleModel: res.vehicleModel,
      vehicleFuelType: 'Essence Super / Diesel',
      insurancePolicy: 'POL-NSIA-2026-9812A',
      cnsrCertNumber: 'CNSR-COT-2026-4421',
      driverName: res.withDriver && res.driverName ? res.driverName : res.employeeName,
      driverPhone: res.employeePhone,
      driverLicenseNumber: 'ANaTT-BJ-2019-8834',
      driverLicenseCategory: 'B (Tourisme)',
      passengers: res.withDriver ? [res.employeeName] : [],
      purpose: res.purpose,
      departureCity: 'Cotonou',
      destinationCity: res.destination,
      authorizedStops: 'Selon feuille de route et exigences opérationnelles',
      startDate: res.startDate,
      startTime: res.startTime,
      endDate: res.endDate,
      endTime: res.endTime,
      startKm: res.startKm || 50000,
      estimatedKm: 180,
      returnKm: res.returnKm,
      fuelAllowanceLiters: 35,
      fuelBudgetFcfa: 25000,
      tollBudgetFcfa: 4000,
      status: res.status === 'COMPLETED' ? 'COMPLETED' : 'APPROVED',
      authorizerName: 'M. Jean KOUASSI',
      authorizerRole: 'Directeur d’Exploitation & Flotte JMF',
      issuedAt: `${new Date().toLocaleDateString('fr-FR')} à Cotonou`,
    };

    generateMissionOrderPdf(mission);
    showToast(`Ordre de mission officiel PDF émis pour ${res.employeeName} !`);
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.employeeName || !bookingForm.destination || !bookingForm.purpose) {
      showToast('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const targetVehicle = vehicles.find((v) => v.id === bookingForm.vehicleId) || vehicles[0];
    const newRes: Reservation = {
      id: `res_${Date.now()}`,
      code: `RES-2026-00${Math.floor(50 + Math.random() * 50)}`,
      employeeName: bookingForm.employeeName,
      employeeDepartment: bookingForm.employeeDepartment,
      employeePhone: bookingForm.employeePhone,
      vehicleId: targetVehicle.id,
      vehicleReg: targetVehicle.reg,
      vehicleModel: targetVehicle.model,
      withDriver: bookingForm.withDriver,
      driverName: bookingForm.withDriver ? 'Chauffeur JMF affecté' : undefined,
      destination: bookingForm.destination,
      purpose: bookingForm.purpose,
      startDate: bookingForm.startDate,
      startTime: bookingForm.startTime,
      endDate: bookingForm.endDate,
      endTime: bookingForm.endTime,
      status: 'CONFIRMED',
      createdAt: `${new Date().toISOString().split('T')[0]} à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
    };

    setReservations([newRes, ...reservations]);
    setIsNewBookingModalOpen(false);
    showToast(`Réservation ${newRes.code} confirmée pour ${newRes.employeeName} !`);
  };

  const filteredReservations = reservations.filter((r) => {
    const matchesSearch =
      r.code.toLowerCase().includes(search.toLowerCase()) ||
      r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      r.vehicleReg.toLowerCase().includes(search.toLowerCase()) ||
      r.destination.toLowerCase().includes(search.toLowerCase()) ||
      r.purpose.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PENDING' && r.status === 'PENDING_APPROVAL') ||
      (statusFilter === 'ACTIVE' && r.status === 'IN_USE') ||
      (statusFilter === 'CONFIRMED' && r.status === 'CONFIRMED') ||
      (statusFilter === 'COMPLETED' && r.status === 'COMPLETED');

    return matchesSearch && matchesStatus;
  });

  const availableVehiclesCount = vehicles.filter((v) => v.status === 'AVAILABLE').length;
  const inUseCount = reservations.filter((r) => r.status === 'IN_USE').length;
  const pendingCount = reservations.filter((r) => r.status === 'PENDING_APPROVAL').length;
  const confirmedCount = reservations.filter((r) => r.status === 'CONFIRMED').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1680px] mx-auto">
      {/* Toast */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Déplacements & Missions</span>
            <span>&gt;</span>
            <span className="font-semibold text-slate-700">Pool de Véhicules & Réservations</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-sky-600" />
            <span>Réservations Pool Véhicules & Car-Sharing</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Planning de mutualisation des véhicules de service, gestion des départs / retours et remise des clés
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsNewBookingModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-sky-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Réserver un véhicule</span>
          </button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Véhicules pool disponibles</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-2">
            {availableVehiclesCount} <span className="text-xs text-slate-400 font-normal">/ {vehicles.length}</span>
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">Prêts pour départ immédiat</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">En cours d'utilisation</span>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
              <Key className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-sky-700 mt-2">{inUseCount}</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Clés remises aux agents</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Réservations confirmées</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-700 mt-2">{confirmedCount}</div>
          <div className="text-[11px] text-indigo-600 mt-1 font-medium">À venir dans les prochains jours</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">En attente de validation</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-700 mt-2">{pendingCount}</div>
          <div className="text-[11px] text-amber-700 mt-1 font-medium">
            {pendingCount > 0 ? 'Demandes à arbitrer' : 'Toutes demandes traitées'}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('RESERVATIONS')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'RESERVATIONS'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Planning des Réservations</span>
        </button>

        <button
          onClick={() => setActiveTab('POOL_VEHICLES')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'POOL_VEHICLES'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Parc Pool Partagé ({vehicles.length})</span>
        </button>
      </div>

      {/* TAB 1: RESERVATIONS LIST */}
      {activeTab === 'RESERVATIONS' && (
        <div className="space-y-4">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher collaborateur, véhicule, destination, motif..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Toutes ({reservations.length})
              </button>
              <button
                onClick={() => setStatusFilter('PENDING')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === 'PENDING' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                En attente ({pendingCount})
              </button>
              <button
                onClick={() => setStatusFilter('ACTIVE')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === 'ACTIVE' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                En cours ({inUseCount})
              </button>
              <button
                onClick={() => setStatusFilter('CONFIRMED')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === 'CONFIRMED' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Confirmées ({confirmedCount})
              </button>
              <button
                onClick={() => setStatusFilter('COMPLETED')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === 'COMPLETED' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Clôturées
              </button>
            </div>
          </div>

          {/* Reservations List */}
          <div className="space-y-3">
            {filteredReservations.map((res) => {
              const isPending = res.status === 'PENDING_APPROVAL';
              const isConfirmed = res.status === 'CONFIRMED';
              const isInUse = res.status === 'IN_USE';
              const isCompleted = res.status === 'COMPLETED';

              return (
                <div
                  key={res.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 hover:border-slate-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                        {res.code}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isPending
                            ? 'bg-amber-100 text-amber-800'
                            : isConfirmed
                            ? 'bg-indigo-100 text-indigo-800'
                            : isInUse
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isPending
                          ? 'En attente de validation'
                          : isConfirmed
                          ? 'Confirmée • Clés à remettre'
                          : isInUse
                          ? 'En circulation'
                          : 'Restitué • Mission terminée'}
                      </span>
                      {res.withDriver && (
                        <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                          Avec chauffeur JMF
                        </span>
                      )}
                      {!res.withDriver && (
                        <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          Conduite autonome
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs text-slate-600">
                      <div>
                        <strong className="text-slate-900 font-bold">{res.employeeName}</strong> ({res.employeeDepartment})
                      </div>
                      <div className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span>{res.destination}</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 italic">
                      « {res.purpose} »
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                      <div className="flex items-center gap-1 font-medium text-slate-800">
                        <Car className="w-3.5 h-3.5 text-slate-400" />
                        <span>{res.vehicleModel}</span>
                        <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-100">
                          {res.vehicleReg}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {res.startDate} ({res.startTime}) <ArrowRight className="inline w-3 h-3 mx-0.5 text-slate-400" /> {res.endDate} ({res.endTime})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions depending on state */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                    {isPending && (
                      <>
                        <button
                          onClick={() => handleApprove(res.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approuver</span>
                        </button>
                        <button
                          onClick={() => handleReject(res.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Refuser</span>
                        </button>
                      </>
                    )}

                    {isConfirmed && (
                      <button
                        onClick={() => handleOpenCheckOut(res)}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>Remettre les clés (Départ)</span>
                      </button>
                    )}

                    {isInUse && (
                      <button
                        onClick={() => handleOpenCheckIn(res)}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Restitution (Retour clés)</span>
                      </button>
                    )}

                    {isCompleted && (
                      <div className="text-right text-[11px] text-slate-500">
                        <div className="font-semibold text-emerald-700">Clôturé & Conforme</div>
                        <div className="font-mono text-[10px]">
                          {res.startKm?.toLocaleString('fr-FR')} ➔ {res.returnKm?.toLocaleString('fr-FR')} km
                        </div>
                      </div>
                    )}

                    {!isPending && (
                      <button
                        onClick={() => handleGenerateMissionPdfFromReservation(res)}
                        className="flex items-center gap-1.5 px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer border border-slate-200"
                        title="Télécharger l'ordre de mission officiel réglementaire en PDF"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Ordre de Mission (PDF)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: POOL VEHICLES PARK */}
      {activeTab === 'POOL_VEHICLES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((v) => {
            const isAvail = v.status === 'AVAILABLE';
            const isReserved = v.status === 'RESERVED';
            const isInUse = v.status === 'IN_USE';

            return (
              <div
                key={v.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider block">
                        {v.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">{v.model}</h3>
                      <div className="font-mono text-xs font-bold text-slate-700 mt-1">{v.reg}</div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isAvail
                          ? 'bg-emerald-100 text-emerald-800'
                          : isReserved
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      {isAvail ? 'Disponible' : isReserved ? 'Réservé' : 'En mission'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 block font-semibold">Compteur</span>
                      <span className="font-mono font-bold text-slate-800">{v.odometer.toLocaleString('fr-FR')} km</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <span className="text-[10px] text-slate-400 block font-semibold">Niveau réservoir</span>
                      <span className="font-bold text-emerald-700">{v.fuelLevel}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 flex items-center gap-1.5 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{v.location}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">Capacité : {v.seats} places</span>
                  <button
                    onClick={() => {
                      setBookingForm((prev) => ({ ...prev, vehicleId: v.id }));
                      setIsNewBookingModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold rounded-lg transition-colors border border-sky-200 cursor-pointer"
                  >
                    Réserver
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: New Booking Request */}
      {isNewBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full my-6 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-sky-600" />
                <span>Demande de Réservation de Véhicule de Service</span>
              </h3>
              <button
                onClick={() => setIsNewBookingModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Nom du collaborateur</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: M. Paul MENSAH"
                    value={bookingForm.employeeName}
                    onChange={(e) => setBookingForm({ ...bookingForm, employeeName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Département / Direction</label>
                  <select
                    value={bookingForm.employeeDepartment}
                    onChange={(e) => setBookingForm({ ...bookingForm, employeeDepartment: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                  >
                    <option value="Direction Commerciale">Direction Commerciale</option>
                    <option value="Direction Technique & BTP">Direction Technique & BTP</option>
                    <option value="Audit & Contrôle de Gestion">Audit & Contrôle de Gestion</option>
                    <option value="Ressources Humaines">Ressources Humaines</option>
                    <option value="Direction Générale">Direction Générale</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Véhicule souhaité du pool</label>
                <select
                  value={bookingForm.vehicleId}
                  onChange={(e) => setBookingForm({ ...bookingForm, vehicleId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                >
                  {vehicles.map((veh) => (
                    <option key={veh.id} value={veh.id}>
                      {veh.model} ({veh.reg}) • {veh.category} - {veh.status === 'AVAILABLE' ? '✅ Disponible' : '⚠️ En cours'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Destination prévue</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Cotonou Port, GDIZ, Porto-Novo..."
                    value={bookingForm.destination}
                    onChange={(e) => setBookingForm({ ...bookingForm, destination: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Téléphone de contact</label>
                  <input
                    type="text"
                    required
                    placeholder="+229 97 00 00 00"
                    value={bookingForm.employeePhone}
                    onChange={(e) => setBookingForm({ ...bookingForm, employeePhone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Motif du déplacement</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Séance de travail client et visite de chantier"
                  value={bookingForm.purpose}
                  onChange={(e) => setBookingForm({ ...bookingForm, purpose: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Départ (Date & Heure)</label>
                  <div className="flex gap-1.5">
                    <input
                      type="date"
                      required
                      value={bookingForm.startDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, startDate: e.target.value })}
                      className="w-2/3 px-2.5 py-2 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                    />
                    <input
                      type="time"
                      required
                      value={bookingForm.startTime}
                      onChange={(e) => setBookingForm({ ...bookingForm, startTime: e.target.value })}
                      className="w-1/3 px-2 py-2 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Retour (Date & Heure)</label>
                  <div className="flex gap-1.5">
                    <input
                      type="date"
                      required
                      value={bookingForm.endDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, endDate: e.target.value })}
                      className="w-2/3 px-2.5 py-2 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                    />
                    <input
                      type="time"
                      required
                      value={bookingForm.endTime}
                      onChange={(e) => setBookingForm({ ...bookingForm, endTime: e.target.value })}
                      className="w-1/3 px-2 py-2 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bookingForm.withDriver}
                    onChange={(e) => setBookingForm({ ...bookingForm, withDriver: e.target.checked })}
                    className="w-4 h-4 text-sky-600 rounded border-slate-300"
                  />
                  <span className="font-bold text-slate-800">Assigner un chauffeur professionnel JMF</span>
                </label>
                <p className="text-[11px] text-slate-500 pl-6">
                  Si décoché, le collaborateur assurera lui-même la conduite et doit présenter son permis ANaTT valide lors de la remise des clés.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewBookingModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Valider la réservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Check-out (Handover of keys) */}
      {isCheckOutModalOpen && selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-sky-600" />
                <span>Remise des Clés • Départ Mission</span>
              </h3>
              <button
                onClick={() => setIsCheckOutModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmCheckOut} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-[11px] text-slate-500">Bénéficiaire :</div>
                <div className="font-bold text-slate-900">{selectedReservation.employeeName}</div>
                <div className="text-slate-600">
                  {selectedReservation.vehicleModel} • <strong className="font-mono">{selectedReservation.vehicleReg}</strong>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Index kilométrique au départ</label>
                <input
                  type="number"
                  required
                  value={checkOutKm}
                  onChange={(e) => setCheckOutKm(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 text-xs focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Niveau carburant départ</label>
                <select
                  value={checkOutFuel}
                  onChange={(e) => setCheckOutFuel(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                >
                  <option value="100%">100% (Plein complet)</option>
                  <option value="85%">85% (3/4+)</option>
                  <option value="75%">75% (3/4)</option>
                  <option value="50%">50% (Moitié)</option>
                </select>
              </div>

              <div className="p-3 bg-sky-50 rounded-xl text-sky-800 text-[11px] space-y-1">
                <div className="font-bold">Contrôle visuel de départ :</div>
                <div>Extincteur en place, trousse de secours et documents de bord vérifiés (Assurance + CNSR).</div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCheckOutModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Confirmer la remise des clés
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Check-in (Key return & inspection) */}
      {isCheckInModalOpen && selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Restitution des Clés • Fin de Mission</span>
              </h3>
              <button
                onClick={() => setIsCheckInModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmCheckIn} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-[11px] text-slate-500">Mission : {selectedReservation.code}</div>
                <div className="font-bold text-slate-900">{selectedReservation.employeeName}</div>
                <div className="text-slate-600">
                  {selectedReservation.vehicleModel} ({selectedReservation.vehicleReg})
                </div>
                <div className="text-[11px] text-slate-500 pt-1">
                  Km départ : <strong className="font-mono">{selectedReservation.startKm?.toLocaleString('fr-FR')} km</strong>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Index kilométrique au retour</label>
                <input
                  type="number"
                  required
                  min={selectedReservation.startKm || 0}
                  value={checkInKm}
                  onChange={(e) => setCheckInKm(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 text-xs focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Niveau carburant retour</label>
                <select
                  value={checkInFuel}
                  onChange={(e) => setCheckInFuel(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                >
                  <option value="100%">100% (Plein refait)</option>
                  <option value="85%">85%</option>
                  <option value="75%">75%</option>
                  <option value="50%">50%</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] space-y-1">
                <div className="font-bold">Distance totale parcourue pendant la réservation :</div>
                <div className="text-base font-black text-emerald-700 font-mono">
                  {Math.max(0, checkInKm - (selectedReservation.startKm || 0)).toLocaleString('fr-FR')} km
                </div>
                <div>Le véhicule sera instantanément marqué comme disponible pour les autres collaborateurs.</div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCheckInModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Clôturer et réintégrer au pool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
