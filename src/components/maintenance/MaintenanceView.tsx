import React, { useState, useEffect } from 'react';
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Car,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  Disc,
  Gauge,
  RotateCw,
  FileText,
  Check,
  AlertCircle,
  X,
  History,
  TrendingDown,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface WorkOrder {
  id: string;
  code: string;
  vehicle_reg: string;
  vehicle_model: string;
  type: 'PREVENTIVE' | 'CURATIVE' | 'INSPECTION' | 'TIRES';
  title: string;
  workshop: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  scheduled_date: string;
  mileage_km: number;
  cost_fcfa: number;
  driver_name: string;
}

interface MaintenanceScheduleItem {
  id: string;
  vehicle_reg: string;
  vehicle_model: string;
  driver_name: string;
  operation_title: string;
  interval_type: 'Kilométrage' | 'Temps' | 'Mixte';
  interval_km: number;
  current_mileage: number;
  due_mileage: number;
  due_date: string;
  remaining_km: number;
  estimated_cost: number;
  urgency: 'URGENT' | 'PROCHE' | 'NORMAL';
}

interface ReportedBreakdown {
  id: string;
  code: string;
  vehicle_reg: string;
  vehicle_model: string;
  driver_name: string;
  driver_phone: string;
  reported_at: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  title: string;
  description: string;
  immobilized: boolean;
  workshop_assigned: string;
  status: 'DECLARED' | 'DIAGNOSED' | 'IN_REPAIR' | 'RESOLVED';
  estimated_cost: number;
}

interface TireItem {
  id: string;
  vehicle_reg: string;
  vehicle_model: string;
  driver_name: string;
  tire_brand: string;
  tire_dimension: string;
  front_wear_percent: number;
  rear_wear_percent: number;
  front_tread_depth_mm: number;
  rear_tread_depth_mm: number;
  pressure_front_bar: number;
  pressure_rear_bar: number;
  recommended_pressure_bar: number;
  mounted_at_km: number;
  last_inspection_date: string;
  condition: 'EXCELLENT' | 'GOOD' | 'ROTATION_DUE' | 'REPLACE_SOON' | 'CRITICAL';
  axle_type: '4x4' | 'Traction AV' | 'Propulsion AR';
}

const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'wo_1',
    code: 'OT-2026-089',
    vehicle_reg: 'BJ-1234-CD',
    vehicle_model: 'Peugeot 3008 Allure',
    type: 'PREVENTIVE',
    title: 'Révision générale & vidange des 60 000 km',
    workshop: 'Atelier JMF Akpakpa',
    priority: 'NORMAL',
    status: 'SCHEDULED',
    scheduled_date: '2026-09-24',
    mileage_km: 56780,
    cost_fcfa: 185000,
    driver_name: 'Pierre DOSSOU',
  },
  {
    id: 'wo_2',
    code: 'OT-2026-092',
    vehicle_reg: 'BJ-5678-EF',
    vehicle_model: 'Renault Master Fourgon',
    type: 'CURATIVE',
    title: 'Remplacement plaquettes et disques de frein avant',
    workshop: 'Atelier JMF Akpakpa',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    scheduled_date: '2026-09-22',
    mileage_km: 112400,
    cost_fcfa: 245000,
    driver_name: 'Koffi AMAN',
  },
  {
    id: 'wo_3',
    code: 'OT-2026-095',
    vehicle_reg: 'BJ-3456-IJ',
    vehicle_model: 'Iveco Daily 35S16',
    type: 'CURATIVE',
    title: 'Réparation compresseur caisse frigorifique',
    workshop: 'Atelier Agréé Iveco Cotonou',
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
    scheduled_date: '2026-09-21',
    mileage_km: 145600,
    cost_fcfa: 680000,
    driver_name: 'Michel HOUNGBO',
  },
  {
    id: 'wo_4',
    code: 'OT-2026-078',
    vehicle_reg: 'BJ-9012-GH',
    vehicle_model: 'Toyota Hilux 4x4',
    type: 'TIRES',
    title: 'Remplacement 4 pneumatiques tout-terrain 265/65R17',
    workshop: 'Pneumatiques CFAO Marina',
    priority: 'NORMAL',
    status: 'COMPLETED',
    scheduled_date: '2026-09-15',
    mileage_km: 24100,
    cost_fcfa: 420000,
    driver_name: 'Mathieu KPADONOU',
  },
  {
    id: 'wo_5',
    code: 'OT-2026-081',
    vehicle_reg: 'BJ-7890-KL',
    vehicle_model: 'Hyundai Santa Fe 2.2',
    type: 'PREVENTIVE',
    title: 'Contrôle périodique climatisation & filtres habitacle',
    workshop: 'Atelier JMF Akpakpa',
    priority: 'LOW',
    status: 'COMPLETED',
    scheduled_date: '2026-09-12',
    mileage_km: 41800,
    cost_fcfa: 75000,
    driver_name: 'Jean KOUASSI',
  },
];

const INITIAL_SCHEDULE_ITEMS: MaintenanceScheduleItem[] = [
  {
    id: 'sch_1',
    vehicle_reg: 'BJ-1234-CD',
    vehicle_model: 'Peugeot 3008 Allure',
    driver_name: 'Pierre DOSSOU',
    operation_title: 'Vidange moteur 10 000 km + Remplacement filtre à huile & air',
    interval_type: 'Kilométrage',
    interval_km: 10000,
    current_mileage: 59400,
    due_mileage: 60000,
    due_date: '2026-09-28',
    remaining_km: 600,
    estimated_cost: 95000,
    urgency: 'PROCHE',
  },
  {
    id: 'sch_2',
    vehicle_reg: 'BJ-5678-EF',
    vehicle_model: 'Renault Master dCi',
    driver_name: 'Koffi AMAN',
    operation_title: 'Kit distribution + Pompe à eau (Échéance 120 000 km)',
    interval_type: 'Kilométrage',
    interval_km: 120000,
    current_mileage: 119850,
    due_mileage: 120000,
    due_date: '2026-09-25',
    remaining_km: 150,
    estimated_cost: 380000,
    urgency: 'URGENT',
  },
  {
    id: 'sch_3',
    vehicle_reg: 'BJ-9012-GH',
    vehicle_model: 'Toyota Hilux 4x4',
    driver_name: 'Mathieu KPADONOU',
    operation_title: 'Vidange boîte de transfert et ponts 4x4',
    interval_type: 'Kilométrage',
    interval_km: 40000,
    current_mileage: 38200,
    due_mileage: 40000,
    due_date: '2026-10-15',
    remaining_km: 1800,
    estimated_cost: 160000,
    urgency: 'NORMAL',
  },
  {
    id: 'sch_4',
    vehicle_reg: 'BJ-7890-KL',
    vehicle_model: 'Hyundai Santa Fe 2.2',
    driver_name: 'Jean KOUASSI',
    operation_title: 'Purge circuit de freinage & liquide de refroidissement',
    interval_type: 'Temps',
    interval_km: 30000,
    current_mileage: 42500,
    due_mileage: 45000,
    due_date: '2026-10-30',
    remaining_km: 2500,
    estimated_cost: 110000,
    urgency: 'NORMAL',
  },
  {
    id: 'sch_5',
    vehicle_reg: 'BJ-3456-IJ',
    vehicle_model: 'Iveco Daily 35S16 Frigo',
    driver_name: 'Michel HOUNGBO',
    operation_title: 'Contrôle étanchéité & recharge fluide frigorigène R404A',
    interval_type: 'Temps',
    interval_km: 25000,
    current_mileage: 146100,
    due_mileage: 147000,
    due_date: '2026-09-26',
    remaining_km: 900,
    estimated_cost: 210000,
    urgency: 'PROCHE',
  },
];

const INITIAL_BREAKDOWNS: ReportedBreakdown[] = [
  {
    id: 'brk_1',
    code: 'PANNE-2026-014',
    vehicle_reg: 'BJ-3456-IJ',
    vehicle_model: 'Iveco Daily 35S16 Frigo',
    driver_name: 'Michel HOUNGBO',
    driver_phone: '+229 97 45 67 89',
    reported_at: '2026-09-21 à 08:30',
    severity: 'CRITICAL',
    title: 'Arrêt complet groupe froid en pleine tournée portuaire',
    description: 'Température positive +14°C au lieu de -18°C. Risque de rupture chaîne du froid.',
    immobilized: true,
    workshop_assigned: 'Atelier Agréé Iveco Cotonou',
    status: 'IN_REPAIR',
    estimated_cost: 680000,
  },
  {
    id: 'brk_2',
    code: 'PANNE-2026-015',
    vehicle_reg: 'BJ-5678-EF',
    vehicle_model: 'Renault Master Fourgon',
    driver_name: 'Koffi AMAN',
    driver_phone: '+229 96 23 45 67',
    reported_at: '2026-09-20 à 16:45',
    severity: 'HIGH',
    title: 'Vibrations et crissements violents au freinage appuyé',
    description: 'Témoin usure plaquettes allumé au tableau de bord. Disques avant rayés.',
    immobilized: true,
    workshop_assigned: 'Atelier JMF Akpakpa',
    status: 'IN_REPAIR',
    estimated_cost: 245000,
  },
  {
    id: 'brk_3',
    code: 'PANNE-2026-016',
    vehicle_reg: 'BJ-9012-GH',
    vehicle_model: 'Toyota Hilux 4x4 Légende',
    driver_name: 'Mathieu KPADONOU',
    driver_phone: '+229 95 34 56 78',
    reported_at: '2026-09-19 à 11:20',
    severity: 'MEDIUM',
    title: 'Perte de puissance intermittente au-delà de 2 500 tr/min',
    description: 'Filtre à gasoil possiblement encrassé suite à ravitaillement hors agence.',
    immobilized: false,
    workshop_assigned: 'Atelier JMF Akpakpa',
    status: 'DIAGNOSED',
    estimated_cost: 85000,
  },
];

const INITIAL_TIRES: TireItem[] = [
  {
    id: 'tire_1',
    vehicle_reg: 'BJ-1234-CD',
    vehicle_model: 'Peugeot 3008 Allure',
    driver_name: 'Pierre DOSSOU',
    tire_brand: 'Michelin Primacy 4',
    tire_dimension: '225/55 R18 102V',
    front_wear_percent: 45,
    rear_wear_percent: 35,
    front_tread_depth_mm: 5.2,
    rear_tread_depth_mm: 6.1,
    pressure_front_bar: 2.4,
    pressure_rear_bar: 2.4,
    recommended_pressure_bar: 2.4,
    mounted_at_km: 35000,
    last_inspection_date: '2026-09-10',
    condition: 'GOOD',
    axle_type: 'Traction AV',
  },
  {
    id: 'tire_2',
    vehicle_reg: 'BJ-5678-EF',
    vehicle_model: 'Renault Master Fourgon',
    driver_name: 'Koffi AMAN',
    tire_brand: 'Continental VanContact 200',
    tire_dimension: '215/65 R16C 109R',
    front_wear_percent: 78,
    rear_wear_percent: 65,
    front_tread_depth_mm: 2.6,
    rear_tread_depth_mm: 3.8,
    pressure_front_bar: 3.5,
    pressure_rear_bar: 3.8,
    recommended_pressure_bar: 3.8,
    mounted_at_km: 72000,
    last_inspection_date: '2026-09-18',
    condition: 'ROTATION_DUE',
    axle_type: 'Traction AV',
  },
  {
    id: 'tire_3',
    vehicle_reg: 'BJ-9012-GH',
    vehicle_model: 'Toyota Hilux 4x4 Légende',
    driver_name: 'Mathieu KPADONOU',
    tire_brand: 'Bridgestone Dueler A/T 697',
    tire_dimension: '265/65 R17 112S',
    front_wear_percent: 20,
    rear_wear_percent: 18,
    front_tread_depth_mm: 7.8,
    rear_tread_depth_mm: 8.0,
    pressure_front_bar: 2.3,
    pressure_rear_bar: 2.5,
    recommended_pressure_bar: 2.3,
    mounted_at_km: 24100,
    last_inspection_date: '2026-09-15',
    condition: 'EXCELLENT',
    axle_type: '4x4',
  },
  {
    id: 'tire_4',
    vehicle_reg: 'BJ-3456-IJ',
    vehicle_model: 'Iveco Daily 35S16 Frigo',
    driver_name: 'Michel HOUNGBO',
    tire_brand: 'Michelin Agilis 3',
    tire_dimension: '225/75 R16C 118R',
    front_wear_percent: 86,
    rear_wear_percent: 82,
    front_tread_depth_mm: 1.9,
    rear_tread_depth_mm: 2.3,
    pressure_front_bar: 4.0,
    pressure_rear_bar: 4.4,
    recommended_pressure_bar: 4.5,
    mounted_at_km: 98000,
    last_inspection_date: '2026-09-12',
    condition: 'CRITICAL',
    axle_type: 'Propulsion AR',
  },
  {
    id: 'tire_5',
    vehicle_reg: 'BJ-7890-KL',
    vehicle_model: 'Hyundai Santa Fe 2.2',
    driver_name: 'Jean KOUASSI',
    tire_brand: 'Goodyear EfficientGrip 2 SUV',
    tire_dimension: '235/60 R18 107V',
    front_wear_percent: 50,
    rear_wear_percent: 45,
    front_tread_depth_mm: 4.8,
    rear_tread_depth_mm: 5.3,
    pressure_front_bar: 2.5,
    pressure_rear_bar: 2.5,
    recommended_pressure_bar: 2.5,
    mounted_at_km: 20000,
    last_inspection_date: '2026-09-08',
    condition: 'GOOD',
    axle_type: '4x4',
  },
  {
    id: 'tire_6',
    vehicle_reg: 'BJ-4567-MN',
    vehicle_model: 'Suzuki Vitara AllGrip (Pool)',
    driver_name: 'Véhicule en Pool Partagé',
    tire_brand: 'Continental EcoContact 6',
    tire_dimension: '215/55 R17 94V',
    front_wear_percent: 15,
    rear_wear_percent: 12,
    front_tread_depth_mm: 7.9,
    rear_tread_depth_mm: 8.2,
    pressure_front_bar: 2.3,
    pressure_rear_bar: 2.3,
    recommended_pressure_bar: 2.3,
    mounted_at_km: 100,
    last_inspection_date: '2026-09-14',
    condition: 'EXCELLENT',
    axle_type: '4x4',
  },
];

interface MaintenanceViewProps {
  currentSubView?: string;
  onNavigateSubView?: (subView: string) => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  currentSubView,
  onNavigateSubView,
}) => {
  const [orders, setOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);
  const [schedules, setSchedules] = useState<MaintenanceScheduleItem[]>(INITIAL_SCHEDULE_ITEMS);
  const [breakdowns, setBreakdowns] = useState<ReportedBreakdown[]>(INITIAL_BREAKDOWNS);
  const [tires, setTires] = useState<TireItem[]>(INITIAL_TIRES);

  const [search, setSearch] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'schedule' | 'orders' | 'breakdowns' | 'tires'>('orders');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [showNewOrderModal, setShowNewOrderModal] = useState<boolean>(false);
  const [showTireInspectionModal, setShowTireInspectionModal] = useState<boolean>(false);
  const [selectedTire, setSelectedTire] = useState<TireItem | null>(null);

  // Forms
  const [newOrder, setNewOrder] = useState({
    vehicle_reg: 'BJ-1234-CD',
    vehicle_model: 'Peugeot 3008',
    title: '',
    type: 'PREVENTIVE' as WorkOrder['type'],
    workshop: 'Atelier JMF Akpakpa',
    priority: 'NORMAL' as WorkOrder['priority'],
    cost_fcfa: '120000',
    scheduled_date: '2026-09-25',
  });

  const [tireForm, setTireForm] = useState({
    pressure_front: 2.4,
    pressure_rear: 2.4,
    tread_front: 5.0,
    tread_rear: 5.5,
    action: 'INSPECTION' as 'INSPECTION' | 'ROTATION' | 'REPLACE',
  });

  // Synchronize activeTab from currentSubView
  useEffect(() => {
    if (currentSubView === 'maintenance_breakdowns') {
      setActiveTab('breakdowns');
    } else if (currentSubView === 'maintenance_tires') {
      setActiveTab('tires');
    } else if (currentSubView === 'maintenance_schedule') {
      setActiveTab('schedule');
    } else if (currentSubView === 'maintenance_orders' || currentSubView === 'maintenance') {
      setActiveTab('orders');
    }
  }, [currentSubView]);

  const handleTabSwitch = (tab: 'schedule' | 'orders' | 'breakdowns' | 'tires') => {
    setActiveTab(tab);
    if (onNavigateSubView) {
      if (tab === 'breakdowns') onNavigateSubView('maintenance_breakdowns');
      else if (tab === 'tires') onNavigateSubView('maintenance_tires');
      else if (tab === 'schedule') onNavigateSubView('maintenance_schedule');
      else onNavigateSubView('maintenance_orders');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Create Work Order
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrder.title.trim()) return;

    const created: WorkOrder = {
      id: `wo_${Date.now()}`,
      code: `OT-2026-${Math.floor(100 + Math.random() * 900)}`,
      vehicle_reg: newOrder.vehicle_reg,
      vehicle_model: newOrder.vehicle_model,
      type: newOrder.type,
      title: newOrder.title,
      workshop: newOrder.workshop,
      priority: newOrder.priority,
      status: 'SCHEDULED',
      scheduled_date: newOrder.scheduled_date,
      mileage_km: 57000,
      cost_fcfa: parseInt(newOrder.cost_fcfa) || 85000,
      driver_name: 'Conducteur assigné',
    };

    setOrders([created, ...orders]);
    setShowNewOrderModal(false);
    showToast(`Ordre de travail ${created.code} planifié avec succès !`);
  };

  // Convert breakdown to Work Order
  const handleLaunchWorkshopFromBreakdown = (brk: ReportedBreakdown) => {
    const newOT: WorkOrder = {
      id: `wo_${Date.now()}`,
      code: `OT-2026-${Math.floor(200 + Math.random() * 700)}`,
      vehicle_reg: brk.vehicle_reg,
      vehicle_model: brk.vehicle_model,
      type: 'CURATIVE',
      title: `Résolution panne: ${brk.title}`,
      workshop: brk.workshop_assigned,
      priority: brk.severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
      status: 'IN_PROGRESS',
      scheduled_date: new Date().toISOString().split('T')[0],
      mileage_km: 115000,
      cost_fcfa: brk.estimated_cost,
      driver_name: brk.driver_name,
    };

    setOrders([newOT, ...orders]);
    setBreakdowns((prev) =>
      prev.map((b) => (b.id === brk.id ? { ...b, status: 'IN_REPAIR' } : b))
    );
    showToast(`Ordre de travail ${newOT.code} ouvert en urgence à l'atelier pour ${brk.vehicle_reg}.`);
  };

  // Open Tire Inspection Modal
  const handleOpenTireInspection = (item: TireItem) => {
    setSelectedTire(item);
    setTireForm({
      pressure_front: item.pressure_front_bar,
      pressure_rear: item.pressure_rear_bar,
      tread_front: item.front_tread_depth_mm,
      tread_rear: item.rear_tread_depth_mm,
      action: item.condition === 'ROTATION_DUE' ? 'ROTATION' : 'INSPECTION',
    });
    setShowTireInspectionModal(true);
  };

  // Save Tire Inspection / Rotation / Replacement
  const handleSaveTireInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTire) return;

    let newCondition: TireItem['condition'] = 'GOOD';
    let frontWear = selectedTire.front_wear_percent;
    let rearWear = selectedTire.rear_wear_percent;
    let frontTread = tireForm.tread_front;
    let rearTread = tireForm.tread_rear;

    if (tireForm.action === 'ROTATION') {
      // Invert front and rear wear
      const tempWear = frontWear;
      frontWear = rearWear;
      rearWear = tempWear;
      const tempTread = frontTread;
      frontTread = rearTread;
      rearTread = tempTread;
      newCondition = 'GOOD';
      showToast(`Permutation des trains AV/AR effectuée avec succès sur ${selectedTire.vehicle_reg}.`);
    } else if (tireForm.action === 'REPLACE') {
      frontWear = 5;
      rearWear = 5;
      frontTread = 8.2;
      rearTread = 8.2;
      newCondition = 'EXCELLENT';
      showToast(`Train de pneus neuf enregistré pour ${selectedTire.vehicle_reg} (OT facturation généré).`);
    } else {
      if (frontTread < 2.0 || rearTread < 2.0) {
        newCondition = 'CRITICAL';
      } else if (frontTread < 3.0 || rearTread < 3.0) {
        newCondition = 'ROTATION_DUE';
      } else if (frontTread > 7.0) {
        newCondition = 'EXCELLENT';
      } else {
        newCondition = 'GOOD';
      }
      showToast(`Pression et profondeur des sculptures enregistrées pour ${selectedTire.vehicle_reg}.`);
    }

    setTires((prev) =>
      prev.map((t) =>
        t.id === selectedTire.id
          ? {
              ...t,
              pressure_front_bar: tireForm.pressure_front,
              pressure_rear_bar: tireForm.pressure_rear,
              front_tread_depth_mm: frontTread,
              rear_tread_depth_mm: rearTread,
              front_wear_percent: frontWear,
              rear_wear_percent: rearWear,
              condition: newCondition,
              last_inspection_date: new Date().toISOString().split('T')[0],
            }
          : t
      )
    );

    setShowTireInspectionModal(false);
  };

  const totalCost = orders.reduce((acc, curr) => acc + curr.cost_fcfa, 0);
  const inProgressCount = orders.filter((o) => o.status === 'IN_PROGRESS').length;
  const criticalBreakdownsCount = breakdowns.filter((b) => b.immobilized).length;

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Maintenance</span>
            <span>&gt;</span>
            <span className="font-semibold text-slate-700">
              {activeTab === 'schedule' && 'Planning des Entretiens Préventifs'}
              {activeTab === 'orders' && 'Ordres de Travail & Suivi Atelier'}
              {activeTab === 'breakdowns' && 'Pannes Signalées & Dépannages'}
              {activeTab === 'tires' && 'Gestion & Usure du Parc Pneumatiques'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Wrench className="w-6 h-6 text-sky-600" />
            <span>
              {activeTab === 'schedule' && 'Planning des Entretiens Préventifs'}
              {activeTab === 'orders' && 'Gestion de la Maintenance & Ordres de Travail'}
              {activeTab === 'breakdowns' && 'Pannes Signalées & Véhicules Immobilisés'}
              {activeTab === 'tires' && 'Gestion des Pneumatiques & Sécurité Roulement'}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeTab === 'schedule' && 'Anticipation des vidanges, révisions et courroies par seuils kilométriques et calendrier.'}
            {activeTab === 'orders' && 'Suivi des interventions préventives et curatives à l’Atelier Central JMF et réseaux agréés.'}
            {activeTab === 'breakdowns' && 'Signalements d’incidents mécaniques, diagnostic atelier et véhicules immobilisés.'}
            {activeTab === 'tires' && 'Suivi de la pression en bar, usure des sculptures en mm et calendrier des permutations.'}
          </p>
        </div>

        {/* 4 Tabs matching the sidebar menu items */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => handleTabSwitch('schedule')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'schedule' ? 'bg-white text-sky-700 shadow-xs ring-1 ring-sky-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Planning</span>
              <span className="text-[10px] bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded-full font-bold">{schedules.length}</span>
            </button>

            <button
              onClick={() => handleTabSwitch('orders')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'orders' ? 'bg-white text-sky-700 shadow-xs ring-1 ring-sky-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Ordres de travail</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full font-bold">{orders.length}</span>
            </button>

            <button
              onClick={() => handleTabSwitch('breakdowns')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'breakdowns' ? 'bg-white text-rose-700 shadow-xs ring-1 ring-rose-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Pannes</span>
              <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded-full font-bold">{breakdowns.length}</span>
            </button>

            <button
              onClick={() => handleTabSwitch('tires')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'tires' ? 'bg-white text-amber-700 shadow-xs ring-1 ring-amber-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Disc className="w-3.5 h-3.5" />
              <span>Pneumatiques</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-bold">Flotte</span>
            </button>
          </div>

          <button
            onClick={() => setShowNewOrderModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Créer un ordre (OT)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VUE 1 : PLANNING ENTRETIENS PRÉVENTIFS */}
      {/* ========================================================================= */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500">Opérations prévues</span>
              <div className="text-2xl font-black text-slate-900 mt-2">{schedules.length}</div>
              <div className="text-[11px] text-sky-600 font-medium">Programme préventif constructeurs</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500">Interventions &lt; 500 km</span>
              <div className="text-2xl font-black text-rose-600 mt-2">1</div>
              <div className="text-[11px] text-rose-700 font-medium">Renault Master (Distribution)</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500">Budget prévisionnel</span>
              <div className="text-2xl font-black text-slate-900 mt-2">955 000 <span className="text-xs text-slate-500">FCFA</span></div>
              <div className="text-[11px] text-emerald-600 font-medium">Pièces & main d'œuvre prévues</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500">Taux de respect préventif</span>
              <div className="text-2xl font-black text-emerald-600 mt-2">98.2%</div>
              <div className="text-[11px] text-slate-500 font-medium">Zéro casse moteur sur 12 mois</div>
            </div>
          </div>

          {/* Schedule Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Échéancier Prévisionnel des Révisions & Vidanges</h3>
                <p className="text-xs text-slate-500">Calcul dynamique basé sur le kilométrage télématique temps réel</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                    <th className="py-3 px-4">Véhicule</th>
                    <th className="py-3 px-4">Opération préventive</th>
                    <th className="py-3 px-4">Km Compteur</th>
                    <th className="py-3 px-4">Échéance cible</th>
                    <th className="py-3 px-4">Reste à parcourir</th>
                    <th className="py-3 px-4">Date estimée</th>
                    <th className="py-3 px-4">Urgence</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schedules.map((sch) => (
                    <tr key={sch.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-sky-800">{sch.vehicle_reg}</div>
                        <div className="text-[11px] text-slate-500">{sch.vehicle_model}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{sch.operation_title}</div>
                        <div className="text-[10px] text-slate-400">Conducteur : {sch.driver_name}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono">{sch.current_mileage.toLocaleString('fr-FR')} km</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{sch.due_mileage.toLocaleString('fr-FR')} km</td>
                      <td className="py-3.5 px-4">
                        <span className={`font-mono font-bold ${sch.remaining_km <= 200 ? 'text-rose-600' : 'text-slate-700'}`}>
                          {sch.remaining_km.toLocaleString('fr-FR')} km
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{sch.due_date}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          sch.urgency === 'URGENT'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : sch.urgency === 'PROCHE'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-sky-50 text-sky-800 border border-sky-200'
                        }`}>
                          {sch.urgency === 'URGENT' ? 'Urgent (< 300 km)' : sch.urgency === 'PROCHE' ? 'Sous 10 jours' : 'Planifié'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setNewOrder({
                              vehicle_reg: sch.vehicle_reg,
                              vehicle_model: sch.vehicle_model,
                              title: sch.operation_title,
                              type: 'PREVENTIVE',
                              workshop: 'Atelier JMF Akpakpa',
                              priority: sch.urgency === 'URGENT' ? 'HIGH' : 'NORMAL',
                              cost_fcfa: String(sch.estimated_cost),
                              scheduled_date: sch.due_date,
                            });
                            setShowNewOrderModal(true);
                          }}
                          className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg font-bold text-[11px] cursor-pointer"
                        >
                          Générer OT &rarr;
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
      {/* VUE 2 : ORDRES DE TRAVAIL (OT) */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500">En cours d'intervention</span>
              <div className="text-2xl font-black text-slate-900 mt-2">{inProgressCount}</div>
              <div className="text-[11px] text-amber-600 mt-1 font-medium">À l'atelier JMF Akpakpa</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500">Interventions planifiées</span>
              <div className="text-2xl font-black text-slate-900 mt-2">
                {orders.filter((o) => o.status === 'SCHEDULED').length}
              </div>
              <div className="text-[11px] text-sky-600 mt-1 font-medium">7 prochains jours</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500">Budget engagé (Mois)</span>
              <div className="text-2xl font-black text-slate-900 mt-2">
                {totalCost.toLocaleString('fr-FR')} <span className="text-xs text-slate-500">FCFA</span>
              </div>
              <div className="text-[11px] text-emerald-600 mt-1 font-medium">{orders.length} ordres traités</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500">Taux de disponibilité</span>
              <div className="text-2xl font-black text-emerald-600 mt-2">94.4%</div>
              <div className="text-[11px] text-slate-500 mt-1">Objectif SLA &gt; 92%</div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Code OT</th>
                    <th className="py-3 px-4">Véhicule</th>
                    <th className="py-3 px-4">Intervention</th>
                    <th className="py-3 px-4">Atelier</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Priorité</th>
                    <th className="py-3 px-4">Montant</th>
                    <th className="py-3 px-4">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{order.code}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 font-mono">{order.vehicle_reg}</div>
                        <div className="text-[11px] text-slate-500">{order.vehicle_model}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{order.title}</div>
                        <div className="text-[10px] text-slate-500">{order.mileage_km.toLocaleString('fr-FR')} km</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">{order.workshop}</td>
                      <td className="py-3.5 px-4 text-slate-600">{order.scheduled_date}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          order.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                          order.priority === 'HIGH' ? 'bg-amber-100 text-amber-800' :
                          'bg-sky-100 text-sky-800'
                        }`}>
                          {order.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {order.cost_fcfa.toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                          order.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-800' :
                          'bg-sky-100 text-sky-800'
                        }`}>
                          {order.status === 'COMPLETED' ? 'Terminé' : order.status === 'IN_PROGRESS' ? 'En cours' : 'Planifié'}
                        </span>
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
      {/* VUE 3 : PANNES SIGNALÉES (3) */}
      {/* ========================================================================= */}
      {activeTab === 'breakdowns' && (
        <div className="space-y-6">
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-rose-900">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-100 text-rose-700 rounded-lg shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm block text-rose-950">3 pannes en cours dont 2 véhicules immobilisés</span>
                <span>Interventions prioritaires à l’Atelier Central Akpakpa et chez le concessionnaire Iveco agréé.</span>
              </div>
            </div>
            <button
              onClick={() => showToast('Rapport des pannes et temps d’immobilisation exporté en PDF.')}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shrink-0 cursor-pointer"
            >
              Export rapport pannes
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {breakdowns.map((brk) => (
              <div key={brk.id} className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4 hover:border-rose-200 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">{brk.code}</span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">{brk.title}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    brk.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                    brk.severity === 'HIGH' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                    'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {brk.severity}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg space-y-1 text-xs text-slate-600">
                  <div className="font-medium text-slate-800">{brk.description}</div>
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                    <span>Signalé le {brk.reported_at}</span>
                    <span className="font-semibold text-rose-600">{brk.immobilized ? 'Immobilisé' : 'Roulant'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-mono font-bold text-sky-800">{brk.vehicle_reg}</div>
                    <div className="text-[11px] text-slate-500">{brk.driver_name}</div>
                  </div>
                  <button
                    onClick={() => handleLaunchWorkshopFromBreakdown(brk)}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg cursor-pointer text-xs shadow-xs"
                  >
                    Ouvrir OT Atelier &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VUE 4 : PNEUMATIQUES (DÉDIÉE) */}
      {/* ========================================================================= */}
      {activeTab === 'tires' && (
        <div className="space-y-6">
          {/* Tire KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Véhicules sous contrôle</span>
                <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
                  <Disc className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{tires.length}</div>
              <div className="text-[11px] text-sky-600 font-medium">Contrôle bimensuel systématique</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Remplacement immédiat</span>
                <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-rose-600 mt-2">1 train</div>
              <div className="text-[11px] text-rose-700 font-medium">Iveco Daily (&lt; 2.0 mm de témoin)</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Permutations conseillées</span>
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                  <RotateCw className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-amber-600 mt-2">1 véhicule</div>
              <div className="text-[11px] text-amber-700 font-medium">Renault Master (Équilibrage usure)</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Conformité pression bar</span>
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <Gauge className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-emerald-600 mt-2">92.5%</div>
              <div className="text-[11px] text-emerald-600 font-medium">Optimisation conso carburant</div>
            </div>
          </div>

          {/* Tires Management Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Registre Pneumatiques & État d'Usure des Trains de Pneus</h3>
                <p className="text-xs text-slate-500">Suivi des dimensions, marques, profondeur des sculptures et pressions constructeur</p>
              </div>
              <button
                onClick={() => showToast('Rapport complet du parc pneumatiques exporté en PDF.')}
                className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg cursor-pointer shadow-xs"
              >
                <Disc className="w-3.5 h-3.5" />
                <span>Exporter registre pneus (PDF)</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                    <th className="py-3 px-4">Véhicule</th>
                    <th className="py-3 px-4">Marque & Dimensions</th>
                    <th className="py-3 px-4">Usure Train AV</th>
                    <th className="py-3 px-4">Usure Train AR</th>
                    <th className="py-3 px-4">Sculptures (mm)</th>
                    <th className="py-3 px-4">Pression (bar)</th>
                    <th className="py-3 px-4">Diagnostic État</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tires.map((t) => {
                    const isCritical = t.condition === 'CRITICAL';
                    const isRotationDue = t.condition === 'ROTATION_DUE';
                    return (
                      <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-sky-800">{t.vehicle_reg}</div>
                          <div className="text-[11px] text-slate-500">{t.vehicle_model}</div>
                          <div className="text-[10px] text-slate-400">{t.axle_type}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{t.tire_brand}</div>
                          <div className="font-mono text-slate-600 text-[11px]">{t.tire_dimension}</div>
                        </td>

                        {/* Front Wear */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  t.front_wear_percent > 80 ? 'bg-rose-500' :
                                  t.front_wear_percent > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${t.front_wear_percent}%` }}
                              />
                            </div>
                            <span className="font-mono font-bold text-[11px] text-slate-700">{t.front_wear_percent}%</span>
                          </div>
                        </td>

                        {/* Rear Wear */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  t.rear_wear_percent > 80 ? 'bg-rose-500' :
                                  t.rear_wear_percent > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${t.rear_wear_percent}%` }}
                              />
                            </div>
                            <span className="font-mono font-bold text-[11px] text-slate-700">{t.rear_wear_percent}%</span>
                          </div>
                        </td>

                        {/* Tread Depth */}
                        <td className="py-3.5 px-4 font-mono">
                          <span className={t.front_tread_depth_mm < 2.0 ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                            AV: {t.front_tread_depth_mm} mm
                          </span>
                          <span className="text-slate-400"> / </span>
                          <span className={t.rear_tread_depth_mm < 2.0 ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                            AR: {t.rear_tread_depth_mm} mm
                          </span>
                        </td>

                        {/* Pressure in Bar */}
                        <td className="py-3.5 px-4 font-mono text-slate-700">
                          <span>{t.pressure_front_bar} / {t.pressure_rear_bar} bar</span>
                          <span className="text-[10px] text-slate-400 block">(Cible {t.recommended_pressure_bar})</span>
                        </td>

                        {/* Condition Badge */}
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isCritical ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            isRotationDue ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            t.condition === 'EXCELLENT' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            'bg-sky-50 text-sky-700 border border-sky-200'
                          }`}>
                            {isCritical && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                            {isRotationDue && <RotateCw className="w-3 h-3 text-amber-600" />}
                            {t.condition === 'EXCELLENT' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                            {isCritical ? 'Témoin atteint (Changer)' :
                             isRotationDue ? 'Permuter AV/AR' :
                             t.condition === 'EXCELLENT' ? 'Pneus neufs' : 'Bon état'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenTireInspection(t)}
                              className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold rounded-lg border border-sky-200 transition-colors cursor-pointer text-[11px]"
                              title="Enregistrer contrôle usure & pression"
                            >
                              Contrôle
                            </button>
                            {isCritical && (
                              <button
                                onClick={() => {
                                  setNewOrder({
                                    vehicle_reg: t.vehicle_reg,
                                    vehicle_model: t.vehicle_model,
                                    title: `Remplacement 4 pneumatiques ${t.tire_brand} ${t.tire_dimension}`,
                                    type: 'TIRES',
                                    workshop: 'Pneumatiques CFAO Marina',
                                    priority: 'HIGH',
                                    cost_fcfa: '420000',
                                    scheduled_date: new Date().toISOString().split('T')[0],
                                  });
                                  setShowNewOrderModal(true);
                                }}
                                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg cursor-pointer text-[11px]"
                              >
                                Remplacer
                              </button>
                            )}
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
      {/* MODAL 1 : NOUVEL ORDRE DE TRAVAIL */}
      {/* ========================================================================= */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-sky-600" />
                <span>Créer un ordre de travail (OT)</span>
              </h3>
              <button
                onClick={() => setShowNewOrderModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Véhicule concerné</label>
                <select
                  value={newOrder.vehicle_reg}
                  onChange={(e) => {
                    const modelMap: Record<string, string> = {
                      'BJ-1234-CD': 'Peugeot 3008',
                      'BJ-5678-EF': 'Renault Master',
                      'BJ-9012-GH': 'Toyota Hilux 4x4',
                      'BJ-3456-IJ': 'Iveco Daily 35S16',
                      'BJ-7890-KL': 'Hyundai Santa Fe',
                    };
                    setNewOrder({
                      ...newOrder,
                      vehicle_reg: e.target.value,
                      vehicle_model: modelMap[e.target.value] || 'Véhicule',
                    });
                  }}
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50"
                >
                  <option value="BJ-1234-CD">BJ-1234-CD • Peugeot 3008 Allure</option>
                  <option value="BJ-5678-EF">BJ-5678-EF • Renault Master dCi</option>
                  <option value="BJ-9012-GH">BJ-9012-GH • Toyota Hilux 4x4</option>
                  <option value="BJ-3456-IJ">BJ-3456-IJ • Iveco Daily 35S16 Frigo</option>
                  <option value="BJ-7890-KL">BJ-7890-KL • Hyundai Santa Fe 2.2</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Désignation de l'intervention</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Remplacement courroie de distribution + pompe à eau"
                  value={newOrder.title}
                  onChange={(e) => setNewOrder({ ...newOrder, title: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Type d'opération</label>
                  <select
                    value={newOrder.type}
                    onChange={(e) => setNewOrder({ ...newOrder, type: e.target.value as WorkOrder['type'] })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50"
                  >
                    <option value="PREVENTIVE">Préventif (Vidange/Révision)</option>
                    <option value="CURATIVE">Curatif (Réparation panne)</option>
                    <option value="TIRES">Pneumatiques</option>
                    <option value="INSPECTION">Visite technique / Contrôle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Priorité</label>
                  <select
                    value={newOrder.priority}
                    onChange={(e) => setNewOrder({ ...newOrder, priority: e.target.value as WorkOrder['priority'] })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50"
                  >
                    <option value="NORMAL">Normale</option>
                    <option value="HIGH">Élevée</option>
                    <option value="CRITICAL">Critique (Immobilisation)</option>
                    <option value="LOW">Basse</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Atelier assigné</label>
                  <select
                    value={newOrder.workshop}
                    onChange={(e) => setNewOrder({ ...newOrder, workshop: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50"
                  >
                    <option value="Atelier JMF Akpakpa">Atelier Central JMF Akpakpa</option>
                    <option value="Atelier Agréé Iveco Cotonou">Atelier Agréé Iveco Cotonou</option>
                    <option value="CFAO Motors Bénin Marina">CFAO Motors Bénin Marina</option>
                    <option value="Pneumatiques CFAO Marina">Pneumatiques CFAO Marina</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Montant estimé (FCFA)</label>
                  <input
                    type="number"
                    value={newOrder.cost_fcfa}
                    onChange={(e) => setNewOrder({ ...newOrder, cost_fcfa: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewOrderModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Enregistrer l'ordre de travail
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2 : CONTRÔLE / INTERVENTION PNEUMATIQUES */}
      {/* ========================================================================= */}
      {showTireInspectionModal && selectedTire && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Disc className="w-5 h-5 text-amber-600" />
                <span>Contrôle Pneumatiques • {selectedTire.vehicle_reg}</span>
              </h3>
              <button
                onClick={() => setShowTireInspectionModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTireInspection} className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900">{selectedTire.vehicle_model}</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  {selectedTire.tire_brand} • {selectedTire.tire_dimension}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Type d'intervention pneumatique</label>
                <select
                  value={tireForm.action}
                  onChange={(e) => setTireForm({ ...tireForm, action: e.target.value as any })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 font-bold text-slate-800"
                >
                  <option value="INSPECTION">Contrôle pression & usure périodique</option>
                  <option value="ROTATION">Permutation des trains AV / AR</option>
                  <option value="REPLACE">Remplacement du train complet (Pneus neufs)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Pression Train AV (bar)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tireForm.pressure_front}
                    onChange={(e) => setTireForm({ ...tireForm, pressure_front: parseFloat(e.target.value) })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Pression Train AR (bar)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tireForm.pressure_rear}
                    onChange={(e) => setTireForm({ ...tireForm, pressure_rear: parseFloat(e.target.value) })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Sculpture AV (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tireForm.tread_front}
                    onChange={(e) => setTireForm({ ...tireForm, tread_front: parseFloat(e.target.value) })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Sculpture AR (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tireForm.tread_rear}
                    onChange={(e) => setTireForm({ ...tireForm, tread_rear: parseFloat(e.target.value) })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTireInspectionModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Valider l'intervention
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
