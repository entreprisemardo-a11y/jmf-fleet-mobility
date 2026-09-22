import React, { useState } from 'react';
import {
  FileCheck,
  Plus,
  Search,
  Calendar,
  MapPin,
  Car,
  User,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Shield,
  Fuel,
  Compass,
  X,
  QrCode,
  Check,
  Building,
  DollarSign,
  Share2,
} from 'lucide-react';
import { MissionOrder, generateMissionOrderPdf } from '../../utils/pdfMissionGenerator.js';

const INITIAL_MISSIONS: MissionOrder[] = [
  {
    id: 'odm_1',
    reference: 'ODM-2026-0842-JMF',
    companyName: 'Société Cliente SARL',
    vehicleReg: 'BJ-9012-GH',
    vehicleModel: 'Toyota Hilux 4x4 Double Cabine',
    vehicleFuelType: 'Diesel',
    insurancePolicy: 'POL-NSIA-2025-089',
    cnsrCertNumber: 'CNSR-COT-2025-4412',
    driverName: 'Pierre DOSSOU',
    driverPhone: '+229 97 12 34 56',
    driverLicenseNumber: 'PC-BEN-2018-9941',
    driverLicenseCategory: 'B, C',
    passengers: ['M. Paul MENSAH (Chef de projet)', 'Mme Sylvie KPATINVO (Ingénieur BTP)'],
    purpose: 'Supervision technique chantiers d’électrification et raccordement agro-industriel',
    departureCity: 'Cotonou (Siège Boulevard de la Marina)',
    destinationCity: 'Parakou & Natitingou',
    authorizedStops: 'Bohicon (Dépôt relais), Savè, Parakou, Djougou',
    startDate: '2026-09-22',
    startTime: '06:00',
    endDate: '2026-09-25',
    endTime: '18:00',
    startKm: 24300,
    estimatedKm: 1150,
    fuelAllowanceLiters: 120,
    fuelBudgetFcfa: 84000,
    tollBudgetFcfa: 12000,
    status: 'ACTIVE',
    authorizerName: 'Jean KOUASSI',
    authorizerRole: 'Directeur d’Exploitation Flotte',
    issuedAt: '2026-09-21 à 10:30',
  },
  {
    id: 'odm_2',
    reference: 'ODM-2026-0843-JMF',
    companyName: 'Société Cliente SARL',
    vehicleReg: 'BJ-3456-IJ',
    vehicleModel: 'Iveco Daily Frigo 3.5T',
    vehicleFuelType: 'Diesel',
    insurancePolicy: 'POL-NSIA-2025-112',
    cnsrCertNumber: 'CNSR-COT-2025-3891',
    driverName: 'Koffi AMAN',
    driverPhone: '+229 96 23 45 67',
    driverLicenseNumber: 'PC-BEN-2016-4321',
    driverLicenseCategory: 'B, C, D',
    passengers: ['M. Romain TOSSOU (Convoyeur produits frais)'],
    purpose: 'Acheminement logistique chaîne du froid vers zone industrielle Glo-Djigbé (GDIZ)',
    departureCity: 'Cotonou (Base Portuaire)',
    destinationCity: 'GDIZ Zone Franche Glo-Djigbé',
    authorizedStops: 'Calavi Kpota, Abomey-Calavi',
    startDate: '2026-09-21',
    startTime: '07:30',
    endDate: '2026-09-21',
    endTime: '17:00',
    startKm: 145600,
    estimatedKm: 110,
    fuelAllowanceLiters: 25,
    fuelBudgetFcfa: 17500,
    tollBudgetFcfa: 4000,
    status: 'ACTIVE',
    authorizerName: 'Michel HOUNGBO',
    authorizerRole: 'Responsable Logistique & Fret',
    issuedAt: '2026-09-21 à 06:45',
  },
  {
    id: 'odm_3',
    reference: 'ODM-2026-0844-JMF',
    companyName: 'Société Cliente SARL',
    vehicleReg: 'BJ-1234-CD',
    vehicleModel: 'Peugeot 3008 Allure',
    vehicleFuelType: 'Essence Super',
    insurancePolicy: 'POL-NSIA-2025-089',
    cnsrCertNumber: 'CNSR-COT-2025-4412',
    driverName: 'Marc AGBO',
    driverPhone: '+229 95 34 56 78',
    driverLicenseNumber: 'PC-BEN-2020-1123',
    driverLicenseCategory: 'B',
    passengers: ['Direction Générale (2 personnes)'],
    purpose: 'Rencontres institutionnelles Ministère du Cadre de Vie & Présidence à Porto-Novo',
    departureCity: 'Cotonou (Siège)',
    destinationCity: 'Porto-Novo (Capitale)',
    authorizedStops: 'Sèmè-Kpodji',
    startDate: '2026-09-23',
    startTime: '08:00',
    endDate: '2026-09-23',
    endTime: '18:30',
    startKm: 56780,
    estimatedKm: 85,
    fuelAllowanceLiters: 20,
    fuelBudgetFcfa: 14000,
    tollBudgetFcfa: 3000,
    status: 'APPROVED',
    authorizerName: 'Jean KOUASSI',
    authorizerRole: 'Directeur Général',
    issuedAt: '2026-09-20 à 16:00',
  },
  {
    id: 'odm_4',
    reference: 'ODM-2026-0840-JMF',
    companyName: 'Société Cliente SARL',
    vehicleReg: 'BJ-5678-EF',
    vehicleModel: 'Renault Master Fourgon 13m3',
    vehicleFuelType: 'Diesel',
    insurancePolicy: 'POL-NSIA-2025-095',
    cnsrCertNumber: 'CNSR-COT-2025-2244',
    driverName: 'Saliou BIO',
    driverPhone: '+229 94 45 67 89',
    driverLicenseNumber: 'PC-BEN-2015-7788',
    driverLicenseCategory: 'B, C',
    passengers: ['Équipe SAV Matériel (3 techniciens)'],
    purpose: 'Maintenance préventive parcs solaires et sous-stations Bohicon et Dassa',
    departureCity: 'Cotonou Akpakpa',
    destinationCity: 'Bohicon & Dassa-Zoumè',
    authorizedStops: 'Allada, Bohicon, Dassa',
    startDate: '2026-09-18',
    startTime: '06:00',
    endDate: '2026-09-19',
    endTime: '20:00',
    startKm: 111850,
    estimatedKm: 340,
    returnKm: 112210,
    fuelAllowanceLiters: 45,
    fuelBudgetFcfa: 31500,
    tollBudgetFcfa: 6000,
    status: 'COMPLETED',
    authorizerName: 'Jean KOUASSI',
    authorizerRole: 'Directeur d’Exploitation',
    issuedAt: '2026-09-17 à 14:15',
  },
];

export const MissionOrdersView: React.FC = () => {
  const [missions, setMissions] = useState<MissionOrder[]>(INITIAL_MISSIONS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'APPROVED' | 'COMPLETED'>('ALL');
  const [selectedMission, setSelectedMission] = useState<MissionOrder | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCloseMissionModalOpen, setIsCloseMissionModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for creating a mission
  const [newMissionForm, setNewMissionForm] = useState({
    vehicleReg: 'BJ-9012-GH',
    vehicleModel: 'Toyota Hilux 4x4 Double Cabine',
    vehicleFuelType: 'Diesel',
    driverName: 'Pierre DOSSOU',
    driverPhone: '+229 97 12 34 56',
    driverLicenseNumber: 'PC-BEN-2018-9941',
    driverLicenseCategory: 'B, C',
    passengers: '',
    purpose: '',
    departureCity: 'Cotonou (Siège)',
    destinationCity: 'Parakou',
    authorizedStops: 'Bohicon, Dassa',
    startDate: new Date().toISOString().split('T')[0],
    startTime: '07:00',
    endDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    endTime: '18:00',
    startKm: 24300,
    estimatedKm: 850,
    fuelAllowanceLiters: 90,
    fuelBudgetFcfa: 63000,
    tollBudgetFcfa: 8000,
    authorizerName: 'Jean KOUASSI',
    authorizerRole: 'Directeur d’Exploitation Flotte',
  });

  // State for closing a mission
  const [closeReturnKm, setCloseReturnKm] = useState<number>(0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDownloadPdf = (mission: MissionOrder) => {
    generateMissionOrderPdf(mission);
    showToast(`Ordre de mission ${mission.reference} généré et téléchargé en PDF !`);
  };

  const handleOpenPreview = (mission: MissionOrder) => {
    setSelectedMission(mission);
    setIsPreviewModalOpen(true);
  };

  const handlePrintDocument = () => {
    window.print();
  };

  const handleCreateMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMissionForm.purpose || !newMissionForm.destinationCity) {
      showToast('Veuillez spécifier l’objet de mission et la destination.');
      return;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newMission: MissionOrder = {
      id: `odm_${Date.now()}`,
      reference: `ODM-2026-${randomNum}-JMF`,
      companyName: 'Société Cliente SARL',
      vehicleReg: newMissionForm.vehicleReg,
      vehicleModel: newMissionForm.vehicleModel,
      vehicleFuelType: newMissionForm.vehicleFuelType,
      insurancePolicy: 'POL-NSIA-2025-089',
      cnsrCertNumber: 'CNSR-COT-2025-4412',
      driverName: newMissionForm.driverName,
      driverPhone: newMissionForm.driverPhone,
      driverLicenseNumber: newMissionForm.driverLicenseNumber,
      driverLicenseCategory: newMissionForm.driverLicenseCategory,
      passengers: newMissionForm.passengers
        ? newMissionForm.passengers.split(',').map((p) => p.trim())
        : [],
      purpose: newMissionForm.purpose,
      departureCity: newMissionForm.departureCity,
      destinationCity: newMissionForm.destinationCity,
      authorizedStops: newMissionForm.authorizedStops,
      startDate: newMissionForm.startDate,
      startTime: newMissionForm.startTime,
      endDate: newMissionForm.endDate,
      endTime: newMissionForm.endTime,
      startKm: Number(newMissionForm.startKm),
      estimatedKm: Number(newMissionForm.estimatedKm),
      fuelAllowanceLiters: Number(newMissionForm.fuelAllowanceLiters),
      fuelBudgetFcfa: Number(newMissionForm.fuelBudgetFcfa),
      tollBudgetFcfa: Number(newMissionForm.tollBudgetFcfa),
      status: 'APPROVED',
      authorizerName: newMissionForm.authorizerName,
      authorizerRole: newMissionForm.authorizerRole,
      issuedAt: `${new Date().toISOString().split('T')[0]} à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
    };

    setMissions([newMission, ...missions]);
    setIsCreateModalOpen(false);
    showToast(`Ordre de mission ${newMission.reference} créé avec succès !`);
  };

  const handleOpenCloseMission = (mission: MissionOrder) => {
    setSelectedMission(mission);
    setCloseReturnKm(mission.startKm + mission.estimatedKm);
    setIsCloseMissionModalOpen(true);
  };

  const handleConfirmCloseMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMission) return;

    const updated = missions.map((m) => {
      if (m.id === selectedMission.id) {
        return {
          ...m,
          status: 'COMPLETED' as const,
          returnKm: closeReturnKm,
        };
      }
      return m;
    });

    setMissions(updated);
    setIsCloseMissionModalOpen(false);
    showToast(`Mission ${selectedMission.reference} clôturée. Véhicule réintégré au pool disponible.`);
  };

  const filteredMissions = missions.filter((m) => {
    const matchesSearch =
      m.reference.toLowerCase().includes(search.toLowerCase()) ||
      m.vehicleReg.toLowerCase().includes(search.toLowerCase()) ||
      m.driverName.toLowerCase().includes(search.toLowerCase()) ||
      m.destinationCity.toLowerCase().includes(search.toLowerCase()) ||
      m.purpose.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = missions.filter((m) => m.status === 'ACTIVE').length;
  const approvedCount = missions.filter((m) => m.status === 'APPROVED').length;
  const completedCount = missions.filter((m) => m.status === 'COMPLETED').length;
  const totalKmAllowed = missions.reduce((acc, m) => acc + m.estimatedKm, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1680px] mx-auto">
      {/* Toast Alert */}
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
            <span>Exploitation & Déplacements</span>
            <span>&gt;</span>
            <span className="font-semibold text-slate-700">Ordres de Mission & Fiches de Route</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-sky-600" />
            <span>Ordres de Mission & Fiches de Route Officielles</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Autorisations de circulation interurbaine sur les corridors du Bénin, conformité Police Républicaine, péages et frais de route
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-sky-600/20 transition-all self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Émettre un Ordre de Mission</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Missions en cours (sur route)</span>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-sky-700 mt-2">{activeCount}</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Véhicules en circulation</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Programmées & Validées</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-700 mt-2">{approvedCount}</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Départs prévus dans les 48h</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Distance cumulée autorisée</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {totalKmAllowed.toLocaleString('fr-FR')} <span className="text-xs text-slate-500">km</span>
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">Corridors RNIE 1 & RNIE 2</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Missions clôturées avec succès</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-2">{completedCount}</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Rapports et tickets archivés</div>
        </div>
      </div>

      {/* Filters and search bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par N° d'ordre, immatriculation, destination, chauffeur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              statusFilter === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tous ({missions.length})
          </button>
          <button
            onClick={() => setStatusFilter('ACTIVE')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              statusFilter === 'ACTIVE'
                ? 'bg-sky-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            En route ({activeCount})
          </button>
          <button
            onClick={() => setStatusFilter('APPROVED')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              statusFilter === 'APPROVED'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Prêts / Validés ({approvedCount})
          </button>
          <button
            onClick={() => setStatusFilter('COMPLETED')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
              statusFilter === 'COMPLETED'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Clôturés ({completedCount})
          </button>
        </div>
      </div>

      {/* Mission Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMissions.map((mission) => {
          const isOngoing = mission.status === 'ACTIVE';
          const isApproved = mission.status === 'APPROVED';
          const isCompleted = mission.status === 'COMPLETED';

          return (
            <div
              key={mission.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header Card */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                        {mission.reference}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isOngoing
                            ? 'bg-sky-100 text-sky-800'
                            : isApproved
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isOngoing ? 'En cours de route' : isApproved ? 'Autorisé & Prêt' : 'Mission terminée'}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1">
                      {mission.purpose}
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {mission.startDate}
                  </span>
                </div>

                {/* Trajectory Route */}
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span className="truncate max-w-[130px] sm:max-w-[180px]">{mission.departureCity}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mx-1" />
                    <div className="flex items-center gap-1.5 font-bold text-sky-700">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate max-w-[130px] sm:max-w-[180px]">{mission.destinationCity}</span>
                    </div>
                  </div>
                  {mission.authorizedStops && (
                    <div className="text-[11px] text-slate-500 pl-5">
                      <span className="font-semibold text-slate-600">Escales autorisées :</span> {mission.authorizedStops}
                    </div>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg border border-slate-100 bg-white">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Véhicule assigné</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Car className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span className="font-mono font-bold text-slate-900">{mission.vehicleReg}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block truncate">{mission.vehicleModel}</span>
                  </div>

                  <div className="p-2.5 rounded-lg border border-slate-100 bg-white">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Conducteur désigné</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <User className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span className="font-bold text-slate-900 truncate">{mission.driverName}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block font-mono">{mission.driverLicenseNumber}</span>
                  </div>
                </div>

                {/* Logistics & Route Allowances */}
                <div className="flex items-center justify-between text-[11px] px-1 py-1 text-slate-600 bg-sky-50/40 rounded-lg">
                  <div className="flex items-center gap-1">
                    <Fuel className="w-3.5 h-3.5 text-amber-600" />
                    <span>Dotation : <strong>{mission.fuelAllowanceLiters}L</strong> ({mission.fuelBudgetFcfa.toLocaleString('fr-FR')} F)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-sky-600" />
                    <span>Distance : <strong>~{mission.estimatedKm} km</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenPreview(mission)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    title="Voir et imprimer le document légal A4"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                    <span>Aperçu A4</span>
                  </button>

                  <button
                    onClick={() => handleDownloadPdf(mission)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold rounded-lg transition-colors border border-sky-200/60 cursor-pointer"
                    title="Télécharger l'Ordre de Mission au format PDF"
                  >
                    <Download className="w-3.5 h-3.5 text-sky-600" />
                    <span>PDF Officiel</span>
                  </button>
                </div>

                {isOngoing && (
                  <button
                    onClick={() => handleOpenCloseMission(mission)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Clôturer retour</span>
                  </button>
                )}
                {isCompleted && (
                  <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Retour validé ({mission.returnKm?.toLocaleString('fr-FR')} km)</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal 1: Formal A4 Mission Order Viewer / Printable Document */}
      {isPreviewModalOpen && selectedMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-6 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50/80 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-sky-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Document Officiel • Ordre de Mission {selectedMission.reference}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintDocument}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimer format A4</span>
                </button>
                <button
                  onClick={() => handleDownloadPdf(selectedMission)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger PDF</span>
                </button>
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* A4 Sheet Content (Printable Layout) */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-100 flex justify-center">
              <div
                id="printable-mission-order"
                className="bg-white w-full max-w-[760px] p-8 sm:p-10 border border-slate-300 shadow-lg text-slate-800 space-y-6 text-xs"
              >
                {/* Official State Header */}
                <div className="text-center space-y-1 pb-3">
                  <div className="font-bold text-[13px] tracking-wide text-slate-900">
                    RÉPUBLIQUE DU BÉNIN
                  </div>
                  <div className="text-[10px] text-slate-600 uppercase font-semibold">
                    Ministère du Cadre de Vie et des Transports en charge du Développement Durable
                  </div>
                  <div className="text-[9px] text-slate-500">
                    Direction des Transports Terrestres • Centre National de Sécurité Routière (CNSR)
                  </div>
                  {/* Subtle Tricolor Bar */}
                  <div className="flex h-1 w-48 mx-auto mt-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 flex-1" />
                    <div className="bg-amber-400 flex-1" />
                    <div className="bg-rose-600 flex-1" />
                  </div>
                </div>

                {/* Title Banner */}
                <div className="bg-slate-900 text-white p-3 rounded-lg text-center space-y-0.5">
                  <div className="text-sm font-black tracking-wide uppercase">
                    ORDRE DE MISSION DE CIRCULATION INTERURBAINE
                  </div>
                  <div className="text-[10px] text-sky-300 font-mono">
                    RÉFÉRENCE LÉGALE : {selectedMission.reference} • DÉLIVRÉ LE {selectedMission.issuedAt}
                  </div>
                </div>

                {/* Section 1: Entreprise & Donneur d'Ordre */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-100 px-3 py-1 font-bold text-slate-800 text-[11px] border-b border-slate-200">
                    1. ORGANISME ÉMETTEUR & SOCIÉTÉ MANDATAIRE
                  </div>
                  <div className="p-3 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500">Entreprise exploitante :</span>{' '}
                      <strong className="text-slate-900">{selectedMission.companyName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Opérateur délégué :</span>{' '}
                      <strong className="text-sky-700">JMF FLEET & MOBILITY SERVICES BÉNIN</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Autorisé par :</span>{' '}
                      <strong>{selectedMission.authorizerName}</strong> ({selectedMission.authorizerRole})
                    </div>
                    <div>
                      <span className="text-slate-500">Conformité réglementaire :</span>{' '}
                      <span className="text-emerald-700 font-bold">CIRCULATION EN RÈGLE</span>
                    </div>
                  </div>
                </div>

                {/* Section 2: Véhicule */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-100 px-3 py-1 font-bold text-slate-800 text-[11px] border-b border-slate-200">
                    2. IDENTITÉ DU VÉHICULE (AGRÉÉ ANaTT / CNSR)
                  </div>
                  <div className="p-3 grid grid-cols-3 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500">Immatriculation :</span>{' '}
                      <strong className="font-mono text-slate-900 text-xs block">{selectedMission.vehicleReg}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Marque & Modèle :</span>{' '}
                      <strong className="text-slate-900 block">{selectedMission.vehicleModel}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Énergie :</span>{' '}
                      <strong className="text-slate-900 block">{selectedMission.vehicleFuelType}</strong>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-slate-100">
                      <span className="text-slate-500">Police d'assurance Tous Risques :</span>{' '}
                      <strong className="text-slate-800">{selectedMission.insurancePolicy} (NSIA Bénin)</strong>
                    </div>
                    <div className="pt-1 border-t border-slate-100">
                      <span className="text-slate-500">Certificat CNSR :</span>{' '}
                      <strong className="text-slate-800">{selectedMission.cnsrCertNumber}</strong>
                    </div>
                  </div>
                </div>

                {/* Section 3: Conducteur et Passagers */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-100 px-3 py-1 font-bold text-slate-800 text-[11px] border-b border-slate-200">
                    3. CONDUCTEUR PRINCIPAL & PASSAGERS AUTORISÉS
                  </div>
                  <div className="p-3 space-y-2 text-[11px]">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-500">Nom du Chauffeur :</span>{' '}
                        <strong className="text-slate-900">{selectedMission.driverName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Téléphone mobile :</span>{' '}
                        <strong className="text-slate-900">{selectedMission.driverPhone}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Permis de conduire :</span>{' '}
                        <strong className="font-mono text-slate-900">
                          {selectedMission.driverLicenseNumber} (Cat. {selectedMission.driverLicenseCategory})
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Validité permis :</span>{' '}
                        <span className="text-emerald-700 font-semibold">Vérifié & Conforme ANaTT</span>
                      </div>
                    </div>
                    <div className="pt-1.5 border-t border-slate-100">
                      <span className="text-slate-500">Passagers autorisés :</span>{' '}
                      <span className="text-slate-800 font-medium">
                        {selectedMission.passengers && selectedMission.passengers.length > 0
                          ? selectedMission.passengers.join(', ')
                          : 'Aucun accompagnateur déclaré'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section 4: Itinéraire et Objet */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-100 px-3 py-1 font-bold text-slate-800 text-[11px] border-b border-slate-200">
                    4. DÉTAILS DE LA MISSION & ITINÉRAIRE AUTORISÉ
                  </div>
                  <div className="p-3 space-y-2 text-[11px]">
                    <div>
                      <span className="text-slate-500">Motif du déplacement :</span>{' '}
                      <strong className="text-slate-900">{selectedMission.purpose}</strong>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                      <div>
                        <span className="text-slate-500">Ville de départ :</span>{' '}
                        <strong className="text-slate-800">{selectedMission.departureCity}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Destination finale :</span>{' '}
                        <strong className="text-sky-800">{selectedMission.destinationCity}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Escales autorisées :</span>{' '}
                        <span className="text-slate-700">{selectedMission.authorizedStops || 'Direct'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Période de validité :</span>{' '}
                        <strong className="text-slate-800">
                          Du {selectedMission.startDate} ({selectedMission.startTime}) au {selectedMission.endDate} ({selectedMission.endTime})
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 5: Relevé Kilométrique & Dotation */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-100 px-3 py-1 font-bold text-slate-800 text-[11px] border-b border-slate-200">
                    5. RELEVÉ KILOMÉTRIQUE & DOTATION CARBURANT / PÉAGE
                  </div>
                  <div className="p-3 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500">Index compteur départ :</span>{' '}
                      <strong className="font-mono text-slate-900">{selectedMission.startKm.toLocaleString('fr-FR')} km</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Distance estimée :</span>{' '}
                      <strong className="text-slate-900">~{selectedMission.estimatedKm.toLocaleString('fr-FR')} km</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Dotation carburant allouée :</span>{' '}
                      <strong className="text-amber-700">
                        {selectedMission.fuelAllowanceLiters} Litres ({selectedMission.fuelBudgetFcfa.toLocaleString('fr-FR')} FCFA)
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Frais de péages & passages :</span>{' '}
                      <strong>{selectedMission.tollBudgetFcfa.toLocaleString('fr-FR')} FCFA</strong>
                    </div>
                  </div>
                </div>

                {/* Official Signatures & Stamp */}
                <div className="grid grid-cols-3 gap-3 pt-2 text-[10px]">
                  <div className="border border-slate-200 p-2.5 rounded-lg h-24 flex flex-col justify-between">
                    <span className="font-bold text-slate-700">LE CONDUCTEUR</span>
                    <span className="text-slate-400 italic">Lu et pris engagement</span>
                    <span className="font-medium text-slate-900">{selectedMission.driverName}</span>
                  </div>

                  <div className="border border-slate-200 p-2.5 rounded-lg h-24 flex flex-col justify-between">
                    <span className="font-bold text-slate-700">VISA CONTRÔLES / PÉAGE</span>
                    <span className="text-slate-400 italic">Cachet de passage corridor</span>
                    <span className="text-[9px] text-slate-400">Police / Gendarmerie</span>
                  </div>

                  <div className="border border-sky-300 bg-sky-50/40 p-2.5 rounded-lg h-24 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sky-900">DIRECTION / JMF MOBILITÉ</span>
                      <Shield className="w-3.5 h-3.5 text-sky-600" />
                    </div>
                    <div className="text-center font-bold text-sky-700 text-[10px]">
                      VALIDÉ & SIGNÉ ÉLECTRONIQUEMENT
                    </div>
                    <div className="text-[8px] font-mono text-slate-500 truncate">
                      SHA256: JMF-{selectedMission.reference}
                    </div>
                  </div>
                </div>

                {/* Footer disclaimer */}
                <div className="text-[9px] text-slate-400 text-center pt-2 border-t border-slate-200">
                  Document certifié JMF Fleet & Mobility Bénin • Valable uniquement avec les pièces originales du véhicule (Carte grise ANaTT, Police NSIA et Attestation CNSR).
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Create a New Mission Order */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full my-6 p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-sky-600" />
                <span>Émettre un Ordre de Mission Officiel</span>
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMission} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Objet / Motif précis de la mission</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Livraison d'urgence et installation d'équipements solaires"
                  value={newMissionForm.purpose}
                  onChange={(e) => setNewMissionForm({ ...newMissionForm, purpose: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Véhicule assigné</label>
                  <select
                    value={newMissionForm.vehicleReg}
                    onChange={(e) => {
                      const reg = e.target.value;
                      const models: Record<string, { model: string; fuel: string; km: number }> = {
                        'BJ-9012-GH': { model: 'Toyota Hilux 4x4 Double Cabine', fuel: 'Diesel', km: 24300 },
                        'BJ-3456-IJ': { model: 'Iveco Daily Frigo 3.5T', fuel: 'Diesel', km: 145600 },
                        'BJ-1234-CD': { model: 'Peugeot 3008 Allure', fuel: 'Essence Super', km: 56780 },
                        'BJ-5678-EF': { model: 'Renault Master Fourgon 13m3', fuel: 'Diesel', km: 112400 },
                        'BJ-7890-KL': { model: 'Hyundai Santa Fe Premium', fuel: 'Diesel', km: 42100 },
                      };
                      const selected = models[reg] || { model: 'Véhicule Flotte', fuel: 'Diesel', km: 50000 };
                      setNewMissionForm({
                        ...newMissionForm,
                        vehicleReg: reg,
                        vehicleModel: selected.model,
                        vehicleFuelType: selected.fuel,
                        startKm: selected.km,
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                  >
                    <option value="BJ-9012-GH">BJ-9012-GH (Toyota Hilux 4x4)</option>
                    <option value="BJ-3456-IJ">BJ-3456-IJ (Iveco Daily Frigo)</option>
                    <option value="BJ-1234-CD">BJ-1234-CD (Peugeot 3008)</option>
                    <option value="BJ-5678-EF">BJ-5678-EF (Renault Master)</option>
                    <option value="BJ-7890-KL">BJ-7890-KL (Hyundai Santa Fe)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Chauffeur titulaire</label>
                  <select
                    value={newMissionForm.driverName}
                    onChange={(e) => {
                      const name = e.target.value;
                      const driverMap: Record<string, { phone: string; lic: string; cat: string }> = {
                        'Pierre DOSSOU': { phone: '+229 97 12 34 56', lic: 'PC-BEN-2018-9941', cat: 'B, C' },
                        'Koffi AMAN': { phone: '+229 96 23 45 67', lic: 'PC-BEN-2016-4321', cat: 'B, C, D' },
                        'Marc AGBO': { phone: '+229 95 34 56 78', lic: 'PC-BEN-2020-1123', cat: 'B' },
                        'Saliou BIO': { phone: '+229 94 45 67 89', lic: 'PC-BEN-2015-7788', cat: 'B, C' },
                        'Jean KOUASSI': { phone: '+229 97 00 11 22', lic: 'PC-BEN-2012-0044', cat: 'B' },
                      };
                      const data = driverMap[name] || { phone: '+229 97 00 00 00', lic: 'PC-BEN-2022-0000', cat: 'B' };
                      setNewMissionForm({
                        ...newMissionForm,
                        driverName: name,
                        driverPhone: data.phone,
                        driverLicenseNumber: data.lic,
                        driverLicenseCategory: data.cat,
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                  >
                    <option value="Pierre DOSSOU">Pierre DOSSOU (Permis B, C)</option>
                    <option value="Koffi AMAN">Koffi AMAN (Permis B, C, D)</option>
                    <option value="Marc AGBO">Marc AGBO (Permis B)</option>
                    <option value="Saliou BIO">Saliou BIO (Permis B, C)</option>
                    <option value="Jean KOUASSI">Jean KOUASSI (Permis B)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Passagers / Collaborateurs autorisés</label>
                <input
                  type="text"
                  placeholder="Ex: M. Paul MENSAH, Dr. KOUDA (séparés par une virgule)"
                  value={newMissionForm.passengers}
                  onChange={(e) => setNewMissionForm({ ...newMissionForm, passengers: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Ville de départ</label>
                  <input
                    type="text"
                    required
                    value={newMissionForm.departureCity}
                    onChange={(e) => setNewMissionForm({ ...newMissionForm, departureCity: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Destination principale</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Parakou, GDIZ, Malanville, Bohicon..."
                    value={newMissionForm.destinationCity}
                    onChange={(e) => setNewMissionForm({ ...newMissionForm, destinationCity: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Escales et villes étapes autorisées</label>
                <input
                  type="text"
                  placeholder="Ex: Allada, Bohicon, Dassa, Savè"
                  value={newMissionForm.authorizedStops}
                  onChange={(e) => setNewMissionForm({ ...newMissionForm, authorizedStops: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Date & heure départ</label>
                  <div className="flex gap-1.5">
                    <input
                      type="date"
                      required
                      value={newMissionForm.startDate}
                      onChange={(e) => setNewMissionForm({ ...newMissionForm, startDate: e.target.value })}
                      className="w-2/3 px-2.5 py-2 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                    />
                    <input
                      type="time"
                      required
                      value={newMissionForm.startTime}
                      onChange={(e) => setNewMissionForm({ ...newMissionForm, startTime: e.target.value })}
                      className="w-1/3 px-2 py-2 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Date & heure retour estimé</label>
                  <div className="flex gap-1.5">
                    <input
                      type="date"
                      required
                      value={newMissionForm.endDate}
                      onChange={(e) => setNewMissionForm({ ...newMissionForm, endDate: e.target.value })}
                      className="w-2/3 px-2.5 py-2 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                    />
                    <input
                      type="time"
                      required
                      value={newMissionForm.endTime}
                      onChange={(e) => setNewMissionForm({ ...newMissionForm, endTime: e.target.value })}
                      className="w-1/3 px-2 py-2 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Distance estimée (km)</label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={newMissionForm.estimatedKm}
                    onChange={(e) => {
                      const km = Number(e.target.value) || 0;
                      const liters = Math.round(km * 0.1);
                      setNewMissionForm({
                        ...newMissionForm,
                        estimatedKm: km,
                        fuelAllowanceLiters: liters,
                        fuelBudgetFcfa: liters * 700,
                      });
                    }}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:border-sky-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Carburant alloué (L)</label>
                  <input
                    type="number"
                    min="5"
                    required
                    value={newMissionForm.fuelAllowanceLiters}
                    onChange={(e) => {
                      const liters = Number(e.target.value) || 0;
                      setNewMissionForm({
                        ...newMissionForm,
                        fuelAllowanceLiters: liters,
                        fuelBudgetFcfa: liters * 700,
                      });
                    }}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:border-sky-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Budget péages (FCFA)</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    required
                    value={newMissionForm.tollBudgetFcfa}
                    onChange={(e) =>
                      setNewMissionForm({
                        ...newMissionForm,
                        tollBudgetFcfa: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:border-sky-500 bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Valider et générer l’Ordre de Mission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Close mission (record return odometer) */}
      {isCloseMissionModalOpen && selectedMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Clôturer le retour de mission</span>
              </h3>
              <button
                onClick={() => setIsCloseMissionModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmCloseMission} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="text-[11px] text-slate-500">Ordre de mission :</div>
                <div className="font-bold text-slate-900 font-mono">{selectedMission.reference}</div>
                <div className="text-slate-600">
                  {selectedMission.vehicleReg} • {selectedMission.driverName}
                </div>
                <div className="text-[11px] text-slate-500 pt-1">
                  Km départ : <strong className="font-mono">{selectedMission.startKm.toLocaleString('fr-FR')} km</strong>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Kilométrage compteur au retour</label>
                <input
                  type="number"
                  required
                  min={selectedMission.startKm}
                  value={closeReturnKm}
                  onChange={(e) => setCloseReturnKm(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:border-sky-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] space-y-1">
                <div className="font-bold">Distance totale parcourue :</div>
                <div className="text-base font-black text-emerald-700 font-mono">
                  {Math.max(0, closeReturnKm - selectedMission.startKm).toLocaleString('fr-FR')} km
                </div>
                <div>Le véhicule sera automatiquement marqué comme disponible au pool.</div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCloseMissionModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Confirmer la clôture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
