import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  Car,
  Award,
  ShieldCheck,
  AlertCircle,
  FileCheck,
  Calendar,
  X,
  CheckCircle2,
  FileText,
  Download,
  Upload,
  RefreshCw,
  Clock,
  ArrowRightLeft,
  UserCheck,
  Building,
  Check,
  AlertTriangle,
  FileBadge,
  Eye,
} from 'lucide-react';

interface DriverItem {
  id: string;
  matricule: string;
  name: string;
  phone: string;
  email: string;
  site: string;
  license_number: string;
  license_category: string;
  license_issued_at: string;
  license_expiry: string;
  medical_check_date: string;
  medical_check_valid: boolean;
  assigned_vehicle_reg: string;
  assigned_vehicle_model: string;
  assigned_vehicle_type: string;
  assignment_type: 'FONCTION' | 'SERVICE' | 'POOL';
  assignment_date: string;
  eco_score: number;
  total_trips: number;
  status: 'ACTIVE' | 'ON_LEAVE' | 'SUSPENDED';
}

interface VehicleAssignment {
  id: string;
  vehicle_reg: string;
  vehicle_model: string;
  vehicle_category: string;
  driver_id: string;
  driver_name: string;
  driver_phone: string;
  assignment_type: 'Véhicule de Fonction' | 'Véhicule de Service' | 'Navette Logistique' | 'Pool Partagé';
  site: string;
  start_date: string;
  start_mileage: number;
  handover_inspection_signed: boolean;
  status: 'ACTIF' | 'CLÔTURÉ';
}

interface AssignmentHistoryItem {
  id: string;
  date: string;
  vehicle_reg: string;
  vehicle_model: string;
  previous_driver: string;
  new_driver: string;
  mileage: number;
  reason: string;
  handover_officer: string;
}

const INITIAL_DRIVERS: DriverItem[] = [
  {
    id: 'drv_1',
    matricule: 'CHAUF-001',
    name: 'Pierre DOSSOU',
    phone: '+229 97 12 34 56',
    email: 'p.dossou@societe-cliente.bj',
    site: 'Siège Administratif (Marina)',
    license_number: 'PC-BEN-2018-9941',
    license_category: 'B, C',
    license_issued_at: '2018-06-20',
    license_expiry: '2028-06-20',
    medical_check_date: '2025-11-10',
    medical_check_valid: true,
    assigned_vehicle_reg: 'BJ-1234-CD',
    assigned_vehicle_model: 'Peugeot 3008 Allure',
    assigned_vehicle_type: 'SUV VP',
    assignment_type: 'FONCTION',
    assignment_date: '2023-03-15',
    eco_score: 92,
    total_trips: 412,
    status: 'ACTIVE',
  },
  {
    id: 'drv_2',
    matricule: 'CHAUF-002',
    name: 'Koffi AMAN',
    phone: '+229 96 23 45 67',
    email: 'k.aman@societe-cliente.bj',
    site: 'Agence Port de Cotonou',
    license_number: 'PC-BEN-2016-4321',
    license_category: 'B, C, D',
    license_issued_at: '2016-04-12',
    license_expiry: '2027-04-12',
    medical_check_date: '2025-08-14',
    medical_check_valid: true,
    assigned_vehicle_reg: 'BJ-5678-EF',
    assigned_vehicle_model: 'Renault Master Fourgon',
    assigned_vehicle_type: 'Utilitaire VUL',
    assignment_type: 'SERVICE',
    assignment_date: '2023-01-20',
    eco_score: 78,
    total_trips: 589,
    status: 'ACTIVE',
  },
  {
    id: 'drv_3',
    matricule: 'CHAUF-003',
    name: 'Mathieu KPADONOU',
    phone: '+229 95 34 56 78',
    email: 'm.kpadonou@societe-cliente.bj',
    site: 'Hub Logistique Akpakpa',
    license_number: 'PC-BEN-2020-1120',
    license_category: 'B',
    license_issued_at: '2020-11-05',
    license_expiry: '2030-11-05',
    medical_check_date: '2025-12-02',
    medical_check_valid: true,
    assigned_vehicle_reg: 'BJ-9012-GH',
    assigned_vehicle_model: 'Toyota Hilux 4x4 Légende',
    assigned_vehicle_type: 'Pick-up Tout-Terrain',
    assignment_type: 'SERVICE',
    assignment_date: '2024-02-01',
    eco_score: 88,
    total_trips: 290,
    status: 'ACTIVE',
  },
  {
    id: 'drv_4',
    matricule: 'CHAUF-004',
    name: 'Michel HOUNGBO',
    phone: '+229 97 45 67 89',
    email: 'm.houngbo@societe-cliente.bj',
    site: 'Base Opérationnelle Portuaire',
    license_number: 'PC-BEN-2015-8832',
    license_category: 'B, C, E',
    license_issued_at: '2015-10-15',
    license_expiry: '2026-10-15',
    medical_check_date: '2025-05-18',
    medical_check_valid: true,
    assigned_vehicle_reg: 'BJ-3456-IJ',
    assigned_vehicle_model: 'Iveco Daily 35S16 Frigo',
    assigned_vehicle_type: 'Fourgon Frigorifique',
    assignment_type: 'SERVICE',
    assignment_date: '2022-09-10',
    eco_score: 85,
    total_trips: 640,
    status: 'ACTIVE',
  },
  {
    id: 'drv_5',
    matricule: 'CHAUF-005',
    name: 'Jean KOUASSI',
    phone: '+229 97 00 11 22',
    email: 'direction@societe-cliente.bj',
    site: 'Direction Générale (Marina)',
    license_number: 'PC-BEN-2012-0044',
    license_category: 'B',
    license_issued_at: '2012-03-10',
    license_expiry: '2029-03-10',
    medical_check_date: '2026-01-15',
    medical_check_valid: true,
    assigned_vehicle_reg: 'BJ-7890-KL',
    assigned_vehicle_model: 'Hyundai Santa Fe Executive',
    assigned_vehicle_type: 'SUV Direction',
    assignment_type: 'FONCTION',
    assignment_date: '2023-06-01',
    eco_score: 95,
    total_trips: 180,
    status: 'ACTIVE',
  },
];

const INITIAL_ASSIGNMENTS: VehicleAssignment[] = [
  {
    id: 'asg_1',
    vehicle_reg: 'BJ-1234-CD',
    vehicle_model: 'Peugeot 3008 Allure Pack',
    vehicle_category: 'SUV Direction',
    driver_id: 'drv_1',
    driver_name: 'Pierre DOSSOU',
    driver_phone: '+229 97 12 34 56',
    assignment_type: 'Véhicule de Fonction',
    site: 'Siège Administratif (Marina)',
    start_date: '2023-03-15',
    start_mileage: 15400,
    handover_inspection_signed: true,
    status: 'ACTIF',
  },
  {
    id: 'asg_2',
    vehicle_reg: 'BJ-5678-EF',
    vehicle_model: 'Renault Master dCi 135',
    vehicle_category: 'Fourgon Utilitaire',
    driver_id: 'drv_2',
    driver_name: 'Koffi AMAN',
    driver_phone: '+229 96 23 45 67',
    assignment_type: 'Navette Logistique',
    site: 'Agence Port de Cotonou',
    start_date: '2023-01-20',
    start_mileage: 22800,
    handover_inspection_signed: true,
    status: 'ACTIF',
  },
  {
    id: 'asg_3',
    vehicle_reg: 'BJ-9012-GH',
    vehicle_model: 'Toyota Hilux 4x4 Légende',
    vehicle_category: 'Pick-up Exploitation',
    driver_id: 'drv_3',
    driver_name: 'Mathieu KPADONOU',
    driver_phone: '+229 95 34 56 78',
    assignment_type: 'Véhicule de Service',
    site: 'Hub Logistique Akpakpa',
    start_date: '2024-02-01',
    start_mileage: 5200,
    handover_inspection_signed: true,
    status: 'ACTIF',
  },
  {
    id: 'asg_4',
    vehicle_reg: 'BJ-3456-IJ',
    vehicle_model: 'Iveco Daily 35S16 Frigo',
    vehicle_category: 'Frigorifique Température Dirigée',
    driver_id: 'drv_4',
    driver_name: 'Michel HOUNGBO',
    driver_phone: '+229 97 45 67 89',
    assignment_type: 'Véhicule de Service',
    site: 'Base Opérationnelle Portuaire',
    start_date: '2022-09-10',
    start_mileage: 38400,
    handover_inspection_signed: true,
    status: 'ACTIF',
  },
  {
    id: 'asg_5',
    vehicle_reg: 'BJ-7890-KL',
    vehicle_model: 'Hyundai Santa Fe Executive',
    vehicle_category: 'SUV Direction Générale',
    driver_id: 'drv_5',
    driver_name: 'Jean KOUASSI',
    driver_phone: '+229 97 00 11 22',
    assignment_type: 'Véhicule de Fonction',
    site: 'Direction Générale (Marina)',
    start_date: '2023-06-01',
    start_mileage: 8200,
    handover_inspection_signed: true,
    status: 'ACTIF',
  },
];

const INITIAL_ASSIGNMENT_HISTORY: AssignmentHistoryItem[] = [
  {
    id: 'hist_1',
    date: '2026-02-01',
    vehicle_reg: 'BJ-9012-GH',
    vehicle_model: 'Toyota Hilux 4x4',
    previous_driver: 'Koffi AMAN',
    new_driver: 'Mathieu KPADONOU',
    mileage: 24100,
    reason: 'Réaffectation suite à réorganisation des tournées Calavi',
    handover_officer: 'Atelier Central JMF',
  },
  {
    id: 'hist_2',
    date: '2025-11-15',
    vehicle_reg: 'BJ-4567-MN',
    vehicle_model: 'Suzuki Vitara',
    previous_driver: 'Pierre DOSSOU',
    new_driver: 'Pool Véhicules Déplacements (Libre)',
    mileage: 11800,
    reason: 'Basculement vers le Pool Partagé Direction',
    handover_officer: 'Gestionnaire de Flotte',
  },
  {
    id: 'hist_3',
    date: '2025-08-10',
    vehicle_reg: 'BJ-1234-CD',
    vehicle_model: 'Peugeot 3008',
    previous_driver: 'Véhicule Neuf CFAO',
    new_driver: 'Pierre DOSSOU',
    mileage: 15400,
    reason: 'Attribution initiale véhicule de fonction',
    handover_officer: 'Blandine HOUNSINOU (RH)',
  },
];

interface DriversViewProps {
  currentSubView?: string;
  onNavigateSubView?: (subView: string) => void;
}

export const DriversView: React.FC<DriversViewProps> = ({
  currentSubView,
  onNavigateSubView,
}) => {
  const [drivers, setDrivers] = useState<DriverItem[]>(INITIAL_DRIVERS);
  const [assignments, setAssignments] = useState<VehicleAssignment[]>(INITIAL_ASSIGNMENTS);
  const [assignmentHistory, setAssignmentHistory] = useState<AssignmentHistoryItem[]>(INITIAL_ASSIGNMENT_HISTORY);
  const [search, setSearch] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'list' | 'licenses' | 'assignments'>('list');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isAddDriverModalOpen, setIsAddDriverModalOpen] = useState<boolean>(false);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState<boolean>(false);
  const [isNewAssignmentModalOpen, setIsNewAssignmentModalOpen] = useState<boolean>(false);
  const [selectedAssignment, setSelectedAssignment] = useState<VehicleAssignment | null>(null);

  // Form state: New Driver
  const [newDriverForm, setNewDriverForm] = useState({
    name: '',
    matricule: `CHAUF-00${drivers.length + 1}`,
    phone: '+229 ',
    email: '',
    site: 'Siège Administratif (Marina)',
    license_number: '',
    license_category: 'B, C',
    license_issued_at: '2022-01-10',
    license_expiry: '2032-01-10',
    assigned_vehicle_reg: 'BJ-4567-MN (Suzuki Vitara - Disponible)',
  });

  // Form state: Reassign Vehicle
  const [reassignForm, setReassignForm] = useState({
    new_driver_id: '',
    reason: 'Permutation de planning et affectation opérationnelle',
    handover_inspection: true,
  });

  // Form state: New Assignment
  const [newAssignmentForm, setNewAssignmentForm] = useState({
    vehicle_reg: 'BJ-4567-MN',
    vehicle_model: 'Suzuki Vitara AllGrip',
    driver_id: 'drv_1',
    assignment_type: 'Véhicule de Service' as VehicleAssignment['assignment_type'],
    site: 'Siège Administratif (Marina)',
    start_mileage: 12400,
  });

  // Synchronize activeTab from currentSubView
  useEffect(() => {
    if (currentSubView === 'drivers_licenses') {
      setActiveTab('licenses');
    } else if (currentSubView === 'drivers_assignments') {
      setActiveTab('assignments');
    } else if (currentSubView === 'drivers_list' || currentSubView === 'drivers') {
      setActiveTab('list');
    }
  }, [currentSubView]);

  const handleSubTabSwitch = (tab: 'list' | 'licenses' | 'assignments') => {
    setActiveTab(tab);
    if (onNavigateSubView) {
      if (tab === 'licenses') onNavigateSubView('drivers_licenses');
      else if (tab === 'assignments') onNavigateSubView('drivers_assignments');
      else onNavigateSubView('drivers_list');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handle Add Driver
  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriverForm.name || !newDriverForm.phone || !newDriverForm.license_number) {
      showToast('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const created: DriverItem = {
      id: `drv_${Date.now()}`,
      matricule: newDriverForm.matricule || `CHAUF-00${drivers.length + 1}`,
      name: newDriverForm.name,
      phone: newDriverForm.phone,
      email: newDriverForm.email || `${newDriverForm.name.toLowerCase().replace(/\s+/g, '.')}@societe-cliente.bj`,
      site: newDriverForm.site,
      license_number: newDriverForm.license_number,
      license_category: newDriverForm.license_category,
      license_issued_at: newDriverForm.license_issued_at,
      license_expiry: newDriverForm.license_expiry,
      medical_check_date: new Date().toISOString().split('T')[0],
      medical_check_valid: true,
      assigned_vehicle_reg: 'BJ-4567-MN',
      assigned_vehicle_model: 'Suzuki Vitara AllGrip',
      assigned_vehicle_type: 'SUV Pool & Missions',
      assignment_type: 'POOL',
      assignment_date: new Date().toISOString().split('T')[0],
      eco_score: 88,
      total_trips: 0,
      status: 'ACTIVE',
    };

    setDrivers([created, ...drivers]);
    setIsAddDriverModalOpen(false);
    showToast(`Conducteur ${created.name} enregistré avec succès (Permis ${created.license_number}).`);
  };

  // Open Reassign Modal
  const handleOpenReassign = (assignment: VehicleAssignment) => {
    setSelectedAssignment(assignment);
    const availableDriver = drivers.find((d) => d.id !== assignment.driver_id);
    setReassignForm({
      new_driver_id: availableDriver ? availableDriver.id : '',
      reason: 'Réattribution d’affectation de flotte',
      handover_inspection: true,
    });
    setIsReassignModalOpen(true);
  };

  // Execute Reassignment
  const handleExecuteReassignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment || !reassignForm.new_driver_id) {
      showToast('Veuillez sélectionner un nouveau conducteur.');
      return;
    }

    const targetDriver = drivers.find((d) => d.id === reassignForm.new_driver_id);
    if (!targetDriver) return;

    const oldDriverName = selectedAssignment.driver_name;
    const vehicleReg = selectedAssignment.vehicle_reg;

    // Update assignments state
    setAssignments((prev) =>
      prev.map((asg) =>
        asg.id === selectedAssignment.id
          ? {
              ...asg,
              driver_id: targetDriver.id,
              driver_name: targetDriver.name,
              driver_phone: targetDriver.phone,
              start_date: new Date().toISOString().split('T')[0],
            }
          : asg
      )
    );

    // Update driver vehicle association
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id === targetDriver.id) {
          return {
            ...d,
            assigned_vehicle_reg: vehicleReg,
            assigned_vehicle_model: selectedAssignment.vehicle_model,
          };
        }
        return d;
      })
    );

    // Add entry to assignment history
    const historyItem: AssignmentHistoryItem = {
      id: `hist_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      vehicle_reg: vehicleReg,
      vehicle_model: selectedAssignment.vehicle_model,
      previous_driver: oldDriverName,
      new_driver: targetDriver.name,
      mileage: selectedAssignment.start_mileage + 450,
      reason: reassignForm.reason,
      handover_officer: 'Superviseur Flotte JMF',
    };
    setAssignmentHistory([historyItem, ...assignmentHistory]);

    setIsReassignModalOpen(false);
    showToast(`Véhicule ${vehicleReg} réaffecté avec succès à ${targetDriver.name} !`);
  };

  // Release vehicle to pool
  const handleReleaseToPool = (assignment: VehicleAssignment) => {
    setAssignments((prev) => prev.filter((a) => a.id !== assignment.id));

    const historyItem: AssignmentHistoryItem = {
      id: `hist_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      vehicle_reg: assignment.vehicle_reg,
      vehicle_model: assignment.vehicle_model,
      previous_driver: assignment.driver_name,
      new_driver: 'Restitution au Pool Libre',
      mileage: assignment.start_mileage + 320,
      reason: 'Fin d’affectation et mise à disposition en pool de réservation',
      handover_officer: 'Atelier Central Cotonou',
    };
    setAssignmentHistory([historyItem, ...assignmentHistory]);

    showToast(`Véhicule ${assignment.vehicle_reg} libéré et restitué au pool disponible.`);
  };

  // Submit New Assignment
  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const drv = drivers.find((d) => d.id === newAssignmentForm.driver_id);
    if (!drv) return;

    const newAsg: VehicleAssignment = {
      id: `asg_${Date.now()}`,
      vehicle_reg: newAssignmentForm.vehicle_reg,
      vehicle_model: newAssignmentForm.vehicle_model,
      vehicle_category: 'Véhicule de Flotte',
      driver_id: drv.id,
      driver_name: drv.name,
      driver_phone: drv.phone,
      assignment_type: newAssignmentForm.assignment_type,
      site: newAssignmentForm.site,
      start_date: new Date().toISOString().split('T')[0],
      start_mileage: Number(newAssignmentForm.start_mileage),
      handover_inspection_signed: true,
      status: 'ACTIF',
    };

    setAssignments([newAsg, ...assignments]);
    setIsNewAssignmentModalOpen(false);
    showToast(`Nouvelle affectation validée pour ${drv.name} sur ${newAsg.vehicle_reg}.`);
  };

  // Filtered drivers for search
  const filteredDrivers = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.matricule.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search) ||
      d.license_number.toLowerCase().includes(search.toLowerCase()) ||
      d.assigned_vehicle_reg.toLowerCase().includes(search.toLowerCase())
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

      {/* Header with Navigation Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Conducteurs</span>
            <span>&gt;</span>
            <span className="font-semibold text-slate-700">
              {activeTab === 'list' && 'Liste des Conducteurs & Chauffeurs'}
              {activeTab === 'licenses' && 'Permis ANaTT & Conformité Médicale'}
              {activeTab === 'assignments' && 'Matrice des Affectations & Passations'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-sky-600" />
            <span>
              {activeTab === 'list' && 'Liste des Conducteurs & Éco-Conduite'}
              {activeTab === 'licenses' && 'Permis de Conduire ANaTT & Visites Médicales'}
              {activeTab === 'assignments' && 'Matrice des Affectations de Véhicules'}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeTab === 'list' && 'Répertoire des chauffeurs, coordonnées, scores de conduite et statuts opérationnels.'}
            {activeTab === 'licenses' && 'Suivi de validité des permis ANaTT Bénin, catégories de conduite et aptitudes médicales.'}
            {activeTab === 'assignments' && 'Gestion nominative des véhicules attribués, états des lieux de remise et passations.'}
          </p>
        </div>

        {/* 3 Sub-tabs navigation matching the sidebar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => handleSubTabSwitch('list')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'list' ? 'bg-white text-sky-700 shadow-xs ring-1 ring-sky-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Liste conducteurs</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full font-bold">{drivers.length}</span>
            </button>

            <button
              onClick={() => handleSubTabSwitch('licenses')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'licenses' ? 'bg-white text-sky-700 shadow-xs ring-1 ring-sky-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileBadge className="w-3.5 h-3.5" />
              <span>Permis & Documents</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-bold">1 alerte</span>
            </button>

            <button
              onClick={() => handleSubTabSwitch('assignments')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'assignments' ? 'bg-white text-sky-700 shadow-xs ring-1 ring-sky-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Affectations</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">{assignments.length} actives</span>
            </button>
          </div>

          {activeTab === 'assignments' ? (
            <button
              onClick={() => setIsNewAssignmentModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Nouvelle affectation</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAddDriverModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau conducteur</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VUE 1 : LISTE DES CONDUCTEURS */}
      {/* ========================================================================= */}
      {activeTab === 'list' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Chauffeurs enregistrés</span>
                <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{drivers.length}</div>
              <div className="text-[11px] text-emerald-600 font-medium">100% opérationnels</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Score éco-conduite moyen</span>
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-emerald-600 mt-2">87.6 / 100</div>
              <div className="text-[11px] text-slate-500 mt-1">Conduite souple & économique</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Permis à renouveler &lt; 6 mois</span>
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-amber-600 mt-2">1</div>
              <div className="text-[11px] text-amber-600 font-medium">Michel HOUNGBO (Oct. 2026)</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Affectations actives</span>
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                  <Car className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-indigo-600 mt-2">{assignments.length}</div>
              <div className="text-[11px] text-slate-500 mt-1">Tous les chauffeurs sont équipés</div>
            </div>
          </div>

          {/* Search bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, matricule, téléphone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-sky-500 bg-slate-50"
              />
            </div>
            <div className="text-xs text-slate-500 font-medium">
              <span className="font-bold text-slate-900">{filteredDrivers.length}</span> conducteur(s) affiché(s)
            </div>
          </div>

          {/* Drivers cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredDrivers.map((d) => (
              <div
                key={d.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4 hover:border-sky-200 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-base border-2 border-white shadow-xs">
                      {d.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{d.name}</h3>
                        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600">
                          {d.matricule}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <Phone className="w-3 h-3 text-sky-600" />
                        <span>{d.phone}</span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Actif
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-lg">
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Permis ANaTT</span>
                    <span className="font-bold text-slate-800 font-mono text-[11px]">{d.license_category}</span>
                    <span className="text-[10px] text-slate-500 block truncate">{d.license_number}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg">
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Score éco</span>
                    <span className="font-black text-emerald-600 text-sm">{d.eco_score} / 100</span>
                    <span className="text-[10px] text-slate-500 block">{d.total_trips} trajets</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <Car className="w-3.5 h-3.5 text-sky-600" />
                    <span className="font-mono font-bold text-slate-900">{d.assigned_vehicle_reg}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600 truncate max-w-[140px]">{d.assigned_vehicle_model}</span>
                  </div>
                  <button
                    onClick={() => handleSubTabSwitch('assignments')}
                    className="text-xs font-semibold text-sky-600 hover:text-sky-800 cursor-pointer"
                  >
                    Voir affectation &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VUE 2 : PERMIS & DOCUMENTS */}
      {/* ========================================================================= */}
      {activeTab === 'licenses' && (
        <div className="space-y-6">
          {/* Summary Alert Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-700 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm block text-amber-950">1 permis ANaTT arrive à échéance dans moins de 6 mois</span>
                <span>Michel HOUNGBO (Permis B, C, E • N° PC-BEN-2015-8832) expire le 15/10/2026. Prévoir le renouvellement auprès de l'ANaTT.</span>
              </div>
            </div>
            <button
              onClick={() => showToast('Dossier de renouvellement ANaTT pré-rempli envoyé par email au conducteur.')}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shrink-0 cursor-pointer self-start sm:self-auto"
            >
              Initier renouvellement
            </button>
          </div>

          {/* Licenses & Compliance Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Registre des Permis de Conduire & Aptitudes Médicales</h3>
                <p className="text-xs text-slate-500">Conformité réglementaire des chauffeurs auprès de l’Agence Nationale des Transports Terrestres (ANaTT)</p>
              </div>
              <button
                onClick={() => showToast('Rapport de conformité des permis exporté en PDF avec succès.')}
                className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exporter registre ANaTT (PDF)</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Conducteur</th>
                    <th className="py-3 px-4">N° Permis ANaTT</th>
                    <th className="py-3 px-4">Catégories</th>
                    <th className="py-3 px-4">Délivré le</th>
                    <th className="py-3 px-4">Échéance Permis</th>
                    <th className="py-3 px-4">Visite Médicale</th>
                    <th className="py-3 px-4">Statut Validité</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {drivers.map((d) => {
                    const isExpiringSoon = d.license_expiry.startsWith('2026');
                    return (
                      <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs">
                              {d.name.split(' ').map((n) => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{d.name}</div>
                              <div className="text-[11px] text-slate-400 font-mono">{d.matricule} • {d.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-sky-800">{d.license_number}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                            Cat. {d.license_category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{d.license_issued_at}</td>
                        <td className="py-3 px-4">
                          <span className={`font-semibold ${isExpiringSoon ? 'text-amber-700 font-bold' : 'text-slate-800'}`}>
                            {d.license_expiry}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Apte ({d.medical_check_date})</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {isExpiringSoon ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              <AlertCircle className="w-3 h-3 text-amber-600" />
                              <span>Échéance &lt; 6 mois</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Conforme ANaTT</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => showToast(`Permis scanné de ${d.name} visualisé.`)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-slate-100 cursor-pointer"
                              title="Visualiser le scan du permis"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => showToast(`Téléchargement de l'attestation de conduite ANaTT pour ${d.name}.`)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-slate-100 cursor-pointer"
                              title="Télécharger l'attestation"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
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
      {/* VUE 3 : AFFECTATIONS */}
      {/* ========================================================================= */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          {/* Assignment KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Affectations actives</span>
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <Car className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{assignments.length}</div>
              <div className="text-[11px] text-emerald-600 font-medium">100% de la flotte opérationnelle</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Véhicules de fonction (DG)</span>
                <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-sky-600 mt-2">2</div>
              <div className="text-[11px] text-slate-500 mt-1">Attributions nominatives permanentes</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Véhicules de service & navettes</span>
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-indigo-600 mt-2">3</div>
              <div className="text-[11px] text-slate-500 mt-1">Tournées logistiques & portuaires</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Véhicules disponibles en pool</span>
                <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-purple-600 mt-2">2</div>
              <div className="text-[11px] text-purple-700 font-medium">Suzuki Vitara & Toyota Corolla</div>
            </div>
          </div>

          {/* Active Assignments Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Matrice des Affectations Flotte en Cours</h3>
                <p className="text-xs text-slate-500">Véhicules attribués nominativement, états des lieux de remise et gestion des passations</p>
              </div>
              <button
                onClick={() => setIsNewAssignmentModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Affecter un véhicule</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Véhicule</th>
                    <th className="py-3 px-4">Conducteur titulaire</th>
                    <th className="py-3 px-4">Type attribution</th>
                    <th className="py-3 px-4">Site d'attache</th>
                    <th className="py-3 px-4">Date effet</th>
                    <th className="py-3 px-4">Km au départ</th>
                    <th className="py-3 px-4">État des lieux</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assignments.map((asg) => (
                    <tr key={asg.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-sky-50 text-sky-700 rounded-lg shrink-0">
                            <Car className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-mono font-bold text-sky-800 text-xs">{asg.vehicle_reg}</div>
                            <div className="text-[11px] text-slate-500 font-medium">{asg.vehicle_model}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[11px]">
                            {asg.driver_name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{asg.driver_name}</div>
                            <div className="text-[10px] text-slate-400">{asg.driver_phone}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          asg.assignment_type === 'Véhicule de Fonction'
                            ? 'bg-purple-50 text-purple-800 border border-purple-200'
                            : 'bg-sky-50 text-sky-800 border border-sky-200'
                        }`}>
                          {asg.assignment_type}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-600">{asg.site}</td>
                      <td className="py-3 px-4 text-slate-700 font-medium">{asg.start_date}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">{asg.start_mileage.toLocaleString('fr-FR')} km</td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-emerald-700 text-[11px] font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Fiche signée</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenReassign(asg)}
                            className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold rounded-lg border border-sky-200 transition-colors cursor-pointer text-[11px]"
                            title="Changer le conducteur affecté"
                          >
                            Réassigner
                          </button>
                          <button
                            onClick={() => handleReleaseToPool(asg)}
                            className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-rose-600 font-medium rounded-lg border border-slate-200 transition-colors cursor-pointer text-[11px]"
                            title="Restituer au pool partagé"
                          >
                            Libérer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Historical Assignment Logs */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-bold text-slate-900">Historique des Mouvements & Passations de Véhicules</h3>
              </div>
              <span className="text-xs text-slate-400">Traçabilité complète des clés et états des lieux</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {assignmentHistory.map((hist) => (
                <div key={hist.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sky-700">{hist.vehicle_reg}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-medium text-slate-800">{hist.vehicle_model}</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-slate-600 font-bold">{hist.previous_driver}</span>
                      <span className="text-slate-400">&rarr;</span>
                      <span className="text-emerald-700 font-bold">{hist.new_driver}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      <span>Motif : {hist.reason}</span>
                      <span className="text-slate-300"> • </span>
                      <span>Supervisé par : {hist.handover_officer}</span>
                    </div>
                  </div>

                  <div className="text-right sm:shrink-0">
                    <div className="font-mono text-slate-700 font-semibold">{hist.mileage.toLocaleString('fr-FR')} km</div>
                    <div className="text-[10px] text-slate-400">{hist.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1 : NOUVEAU CONDUCTEUR */}
      {/* ========================================================================= */}
      {isAddDriverModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-sky-600" />
                <span>Nouveau Conducteur Flotte</span>
              </h3>
              <button
                onClick={() => setIsAddDriverModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDriver} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Nom et prénom(s)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Christian ADJOVI"
                    value={newDriverForm.name}
                    onChange={(e) => setNewDriverForm({ ...newDriverForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-sky-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Matricule interne</label>
                  <input
                    type="text"
                    required
                    value={newDriverForm.matricule}
                    onChange={(e) => setNewDriverForm({ ...newDriverForm, matricule: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:border-sky-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Téléphone mobile</label>
                  <input
                    type="text"
                    required
                    placeholder="+229 97 00 00 00"
                    value={newDriverForm.phone}
                    onChange={(e) => setNewDriverForm({ ...newDriverForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-sky-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Site de rattachement</label>
                  <select
                    value={newDriverForm.site}
                    onChange={(e) => setNewDriverForm({ ...newDriverForm, site: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-sky-500 text-xs"
                  >
                    <option value="Siège Administratif (Marina)">Siège Administratif (Marina)</option>
                    <option value="Agence Port de Cotonou">Agence Port de Cotonou</option>
                    <option value="Hub Logistique Akpakpa">Hub Logistique Akpakpa</option>
                    <option value="Base Opérationnelle Portuaire">Base Opérationnelle Portuaire</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">N° Permis ANaTT</label>
                  <input
                    type="text"
                    required
                    placeholder="PC-BEN-2023-XXXX"
                    value={newDriverForm.license_number}
                    onChange={(e) => setNewDriverForm({ ...newDriverForm, license_number: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:border-sky-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Catégorie(s)</label>
                  <select
                    value={newDriverForm.license_category}
                    onChange={(e) => setNewDriverForm({ ...newDriverForm, license_category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-sky-500 text-xs"
                  >
                    <option value="B">Permis B (VL)</option>
                    <option value="B, C">Permis B & C (VL + Utilitaires)</option>
                    <option value="B, C, D">Permis B, C & D (Tous véhicules)</option>
                    <option value="B, C, E">Permis B, C, E (Poids lourd & articulé)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Délivré le</label>
                  <input
                    type="date"
                    required
                    value={newDriverForm.license_issued_at}
                    onChange={(e) => setNewDriverForm({ ...newDriverForm, license_issued_at: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-sky-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Échéance validité</label>
                  <input
                    type="date"
                    required
                    value={newDriverForm.license_expiry}
                    onChange={(e) => setNewDriverForm({ ...newDriverForm, license_expiry: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-sky-500 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddDriverModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Créer le conducteur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2 : RÉASSIGNER UN VÉHICULE */}
      {/* ========================================================================= */}
      {isReassignModalOpen && selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-sky-600" />
                <span>Réassigner le véhicule {selectedAssignment.vehicle_reg}</span>
              </h3>
              <button
                onClick={() => setIsReassignModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteReassignment} className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-[11px] text-slate-500 font-medium">Affectation actuelle :</div>
                <div className="font-bold text-slate-900 mt-0.5">
                  {selectedAssignment.vehicle_model} ({selectedAssignment.vehicle_reg})
                </div>
                <div className="text-slate-600 mt-0.5">
                  Titulaire actuel : <span className="font-bold text-slate-800">{selectedAssignment.driver_name}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Nouveau conducteur titulaire</label>
                <select
                  value={reassignForm.new_driver_id}
                  onChange={(e) => setReassignForm({ ...reassignForm, new_driver_id: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-sky-500 text-xs"
                >
                  {drivers
                    .filter((d) => d.id !== selectedAssignment.driver_id)
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.matricule} • Permis {d.license_category})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Motif de la passation</label>
                <input
                  type="text"
                  required
                  value={reassignForm.reason}
                  onChange={(e) => setReassignForm({ ...reassignForm, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-sky-500 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-sky-50/60 border border-sky-100 rounded-xl">
                <input
                  type="checkbox"
                  id="chk_inspection"
                  checked={reassignForm.handover_inspection}
                  onChange={(e) => setReassignForm({ ...reassignForm, handover_inspection: e.target.checked })}
                  className="rounded text-sky-600"
                />
                <label htmlFor="chk_inspection" className="text-xs text-slate-700">
                  Générer et signer électroniquement la fiche d'état des lieux contradictoire
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsReassignModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Confirmer la réassignation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3 : NOUVELLE AFFECTATION */}
      {/* ========================================================================= */}
      {isNewAssignmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-sky-600" />
                <span>Nouvelle Affectation de Véhicule</span>
              </h3>
              <button
                onClick={() => setIsNewAssignmentModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Véhicule à affecter</label>
                <select
                  value={newAssignmentForm.vehicle_reg}
                  onChange={(e) => {
                    const reg = e.target.value;
                    const model = reg === 'BJ-4567-MN' ? 'Suzuki Vitara AllGrip' : 'Toyota Corolla Berline';
                    setNewAssignmentForm({ ...newAssignmentForm, vehicle_reg: reg, vehicle_model: model });
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-sky-500 text-xs"
                >
                  <option value="BJ-4567-MN">BJ-4567-MN • Suzuki Vitara AllGrip (Disponible en pool)</option>
                  <option value="BJ-6789-OP">BJ-6789-OP • Toyota Corolla Berline Hybrid (Disponible en pool)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Conducteur bénéficiaire</label>
                <select
                  value={newAssignmentForm.driver_id}
                  onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, driver_id: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-sky-500 text-xs"
                >
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.matricule} • {d.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Type d'affectation</label>
                  <select
                    value={newAssignmentForm.assignment_type}
                    onChange={(e) =>
                      setNewAssignmentForm({
                        ...newAssignmentForm,
                        assignment_type: e.target.value as VehicleAssignment['assignment_type'],
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-sky-500 text-xs"
                  >
                    <option value="Véhicule de Fonction">Véhicule de Fonction</option>
                    <option value="Véhicule de Service">Véhicule de Service</option>
                    <option value="Navette Logistique">Navette Logistique</option>
                    <option value="Pool Partagé">Pool Partagé</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Kilométrage initial</label>
                  <input
                    type="number"
                    required
                    value={newAssignmentForm.start_mileage}
                    onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, start_mileage: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:border-sky-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Site de rattachement</label>
                <select
                  value={newAssignmentForm.site}
                  onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, site: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-sky-500 text-xs"
                >
                  <option value="Siège Administratif (Marina)">Siège Administratif (Marina)</option>
                  <option value="Agence Port de Cotonou">Agence Port de Cotonou</option>
                  <option value="Hub Logistique Akpakpa">Hub Logistique Akpakpa</option>
                  <option value="Base Opérationnelle Portuaire">Base Opérationnelle Portuaire</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewAssignmentModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Valider l'affectation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
