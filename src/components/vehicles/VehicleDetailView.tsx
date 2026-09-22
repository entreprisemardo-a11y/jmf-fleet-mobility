import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Download,
  Edit,
  MoreHorizontal,
  Car,
  User,
  Building,
  Fuel,
  Gauge,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  ShieldCheck,
  AlertCircle,
  Wrench,
  DollarSign,
  TrendingDown,
  Navigation,
  Check,
  X,
  Phone,
  Radio,
  MapPin,
  AlertTriangle,
} from 'lucide-react';
import { ApiClient } from '../../services/api.js';

interface VehicleDetailViewProps {
  vehicleId: string;
  onBack: () => void;
}

export const VehicleDetailView: React.FC<VehicleDetailViewProps> = ({
  vehicleId,
  onBack,
}) => {
  const [vehicle, setVehicle] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('resume');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    mileage: 56780,
    driver_name: 'Jean KOUASSI',
    status: 'ACTIVE',
    fuel_card_number: 'TOTAL-FLEET-BJ-4491',
    agency_site: 'Siège Cotonou Marina',
  });

  useEffect(() => {
    async function loadVehicle() {
      setIsLoading(true);
      try {
        const res = await ApiClient.getVehicleDetail(vehicleId);
        setVehicle(res.data);
        if (res.data) {
          setEditFormData({
            mileage: res.data.mileage || 56780,
            driver_name: res.data.driver?.name || res.data.driver_name || 'Jean KOUASSI',
            status: res.data.status || 'ACTIVE',
            fuel_card_number: res.data.fuel_card_number || 'TOTAL-FLEET-BJ-4491',
            agency_site: res.data.agency_site || 'Siège Cotonou Marina',
          });
        }
      } catch {
        setVehicle(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadVehicle();
  }, [vehicleId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleExportVehicleSheet = () => {
    if (!vehicle) return;
    const headers = ['Propriété', 'Valeur'];
    const rows = [
      ['Immatriculation', vehicle.registration_number],
      ['Marque & Modèle', `${vehicle.brand} ${vehicle.model} ${vehicle.version || ''}`],
      ['Numéro VIN', vehicle.vin || 'VF3MCYHZRKS123456'],
      ['Kilométrage Actuel', `${vehicle.mileage || 56780} km`],
      ['Chauffeur assigné', vehicle.driver?.name || vehicle.driver_name || 'Jean KOUASSI'],
      ['Site d affectation', vehicle.agency_site || 'Siège Cotonou Marina'],
      ['Statut opérationnel', vehicle.status],
      ['Date mise en service', vehicle.commissioning_date || '15/03/2022'],
      ['Visite technique CNSR', 'Valide jusqu au 20/05/2027'],
      ['Assurance Flotte NSIA', 'Valide jusqu au 14/02/2027'],
      ['Carte Grise ANaTT', 'Certifiée - Émise le 12/03/2022'],
      ['Vignette TVM', 'Payée exercice 2026'],
      ['Coût mensuel moyen', '512 000 FCFA'],
      ['Consommation moyenne', '6.4 L/100 km'],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fiche_technique_${vehicle.registration_number}_jmf.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Fiche technique 360° exportée pour ${vehicle.registration_number}`);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setVehicle((prev: any) => ({
      ...prev,
      mileage: Number(editFormData.mileage),
      status: editFormData.status,
      driver_name: editFormData.driver_name,
      driver: {
        ...prev?.driver,
        name: editFormData.driver_name,
      },
      fuel_card_number: editFormData.fuel_card_number,
      agency_site: editFormData.agency_site,
    }));
    setIsEditModalOpen(false);
    showToast('Véhicule mis à jour avec succès');
  };

  const handleAction = (actionTitle: string) => {
    setIsActionMenuOpen(false);
    if (actionTitle === 'maintenance') {
      setActiveTab('maintenance');
      showToast('Redirection vers le carnet de maintenance pour ce véhicule');
    } else if (actionTitle === 'fuel') {
      setActiveTab('fuel');
      showToast('Redirection vers l historique des pleins de ce véhicule');
    } else if (actionTitle === 'documents') {
      setActiveTab('documents');
      showToast('Redirection vers les pièces certifiées de ce véhicule');
    } else if (actionTitle === 'telematics') {
      setActiveTab('telematics');
      showToast('Affichage du radar GPS en direct');
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500 text-sm">
        Chargement de la fiche véhicule 360°...
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-sm text-slate-600">Véhicule introuvable.</p>
        <button onClick={onBack} className="px-4 py-2 text-xs font-semibold bg-slate-800 text-white rounded-lg">
          Retour à la flotte
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'resume', label: 'Résumé' },
    { id: 'driver', label: 'Conducteur' },
    { id: 'documents', label: 'Documents' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'fuel', label: 'Carburant' },
    { id: 'tires', label: 'Pneus' },
    { id: 'expenses', label: 'Dépenses' },
    { id: 'incidents', label: 'Incidents' },
    { id: 'telematics', label: 'Télématique' },
    { id: 'history', label: 'Historique' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1680px] mx-auto">
      {/* Toast Notification */}
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

      {/* Breadcrumb & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <button onClick={onBack} className="hover:text-slate-800 flex items-center gap-1 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Véhicules</span>
            </button>
            <span>&gt;</span>
            <span className="font-semibold text-slate-700">{vehicle.registration_number}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Détail du véhicule</h1>
          <p className="text-xs text-slate-500">Vue complète 360° et historique d'exploitation du véhicule</p>
        </div>

        <div className="flex items-center gap-2 relative">
          <button
            onClick={handleExportVehicleSheet}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-xs transition-colors"
            title="Exporter la fiche technique complète en CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Exporter</span>
          </button>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-xs transition-colors"
          >
            <Edit className="w-3.5 h-3.5 text-slate-500" />
            <span>Modifier</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 shadow-sm shadow-sky-600/20 transition-colors"
            >
              <span>Actions</span>
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>

            {isActionMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 text-xs">
                <button
                  onClick={() => handleAction('maintenance')}
                  className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                >
                  <Wrench className="w-4 h-4 text-sky-600" />
                  <span>Ordre de travail atelier</span>
                </button>
                <button
                  onClick={() => handleAction('fuel')}
                  className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                >
                  <Fuel className="w-4 h-4 text-emerald-600" />
                  <span>Enregistrer un plein</span>
                </button>
                <button
                  onClick={() => handleAction('documents')}
                  className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                >
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>Téléverser un document</span>
                </button>
                <button
                  onClick={() => handleAction('telematics')}
                  className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                >
                  <Radio className="w-4 h-4 text-amber-600" />
                  <span>Localiser sur la carte</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 360° Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left: Photo + Badges + Title */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative w-36 h-28 sm:w-44 sm:h-32 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
              <img
                src={vehicle.main_photo || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800'}
                alt={vehicle.model}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded-md font-medium">
                6 photos
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  En service
                </span>
                <span className="text-xs text-slate-400 font-mono">VIN: {vehicle.vin || 'VF3MCYHZMNSI23456'}</span>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
                  {vehicle.registration_number}
                </div>
                <div className="text-base font-bold text-slate-700 mt-0.5">
                  {vehicle.brand} {vehicle.model} {vehicle.version}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                  {vehicle.category || 'SUV'}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                  {vehicle.energy_type}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                  Automatique
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                  5 places
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                  {vehicle.color || 'Gris Platinium'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quick stats & Assignment cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            {/* Driver Card */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <User className="w-3.5 h-3.5 text-sky-600" />
                <span>Conducteur principal</span>
              </div>
              <div className="mt-1 text-xs font-bold text-slate-900">
                {vehicle.driver ? vehicle.driver.name : 'Koffi AMAN'}
              </div>
              <div className="text-[10px] text-slate-500">Matricule #EMP-028</div>
            </div>

            {/* Site Card */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Building className="w-3.5 h-3.5 text-sky-600" />
                <span>Site d'affectation</span>
              </div>
              <div className="mt-1 text-xs font-bold text-slate-900">
                {vehicle.site ? vehicle.site.name : 'Siège - Cotonou'}
              </div>
              <div className="text-[10px] text-slate-500">Boulevard de la Marina</div>
            </div>

            {/* Mileage Card */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Gauge className="w-3.5 h-3.5 text-sky-600" />
                <span>Kilométrage actuel</span>
              </div>
              <div className="mt-1 text-xs font-bold text-slate-900 font-mono">
                {vehicle.current_mileage?.toLocaleString('fr-FR') || '56 780'} km
              </div>
              <div className="text-[10px] text-slate-500">Mise à jour 28/05/2026</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 pb-px scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
                isActive
                  ? 'border-sky-600 text-sky-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content: Résumé */}
      {activeTab === 'resume' && (
        <div className="space-y-6">
          {/* 4 Cards Grid matching mockup */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {/* 1. Informations d'identification */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 uppercase">Informations d’identification</span>
                <span className="text-[11px] text-sky-600 font-semibold cursor-pointer">Modifier</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-500">Immatriculation</span><span className="font-bold">{vehicle.registration_number}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Marque / Modèle</span><span className="font-semibold">{vehicle.brand} {vehicle.model}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Finition</span><span className="font-semibold">{vehicle.version}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Type de véhicule</span><span className="font-semibold">{vehicle.vehicle_type}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">VIN</span><span className="font-mono">{vehicle.vin}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Couleur</span><span>{vehicle.color || 'Gris Platinium'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Nombre de places</span><span>5</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Puissance fiscale</span><span>8 CV</span></div>
              </div>
            </div>

            {/* 2. Affectation */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 uppercase">Affectation & Usage</span>
                <span className="text-[11px] text-sky-600 font-semibold cursor-pointer">Modifier</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-500">Conducteur principal</span><span className="font-bold">{vehicle.driver ? vehicle.driver.name : 'Koffi AMAN'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Service</span><span className="font-semibold">Direction Générale</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Site d'affectation</span><span className="font-semibold">Siège Cotonou</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Date d'affectation</span><span>15/03/2022</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Véhicule de fonction</span><span className="font-semibold text-emerald-700">Oui</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Utilisation</span><span>Professionnelle</span></div>
              </div>
            </div>

            {/* 3. Informations financières */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 uppercase">Finances & Contrats</span>
                <span className="text-[11px] text-sky-600 font-semibold cursor-pointer">Modifier</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-500">Mode de financement</span><span className="font-bold">{vehicle.acquisition_mode}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Loueur / Fournisseur</span><span className="font-semibold">{vehicle.supplier || 'Bolloré Fleet Services'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">N° de contrat</span><span className="font-mono">LLD-2022-4587</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Date début</span><span>01/03/2022</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Date fin</span><span>28/02/2027</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Loyer mensuel</span><span className="font-bold text-sky-700">450 000 FCFA</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Coût total estimé</span><span className="font-bold text-slate-900">27 000 000 FCFA</span></div>
              </div>
            </div>

            {/* 4. Conformité & Assurance */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 uppercase">Conformité & Assurance</span>
                <span className="text-[11px] text-sky-600 font-semibold cursor-pointer">Voir tous</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-emerald-900">Contrôle technique</div>
                    <div className="text-[10px] text-emerald-700">Valide jusqu’au 20/05/2027 (Dans 11 mois)</div>
                  </div>
                </div>
                <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-emerald-900">Police d’assurance</div>
                    <div className="text-[10px] text-emerald-700">Valide jusqu’au 14/02/2027 (Dans 9 mois)</div>
                  </div>
                </div>
                <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-emerald-900">Carte grise</div>
                    <div className="text-[10px] text-emerald-700">Émise le 12/03/2022 (À jour)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Mini KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">Coût mensuel moyen</div>
              <div className="mt-1 text-xl font-black text-slate-900">512 000 FCFA</div>
              <div className="text-[11px] text-emerald-600 font-bold mt-0.5">↓ -8% vs période précédente</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">Consommation moyenne</div>
              <div className="mt-1 text-xl font-black text-slate-900">6,4 L/100 km</div>
              <div className="text-[11px] text-emerald-600 font-bold mt-0.5">↓ -12% vs période précédente</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">Prochain entretien</div>
              <div className="mt-1 text-xl font-black text-amber-700">Dans 3 220 km</div>
              <div className="text-[11px] text-slate-500 mt-0.5">ou le 15/08/2026</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500 font-medium">Statut des documents</div>
              <div className="mt-1 text-xl font-black text-emerald-700">4 / 4 valides</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Tous les documents sont à jour</div>
            </div>
          </div>

          {/* Bottom tables: Pleins récents + Historique maintenance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Table pleins */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 uppercase">Derniers pleins carburant</span>
                <span className="text-xs font-semibold text-sky-600">Voir tout &gt;</span>
              </div>
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-[10px] uppercase text-slate-400 border-b border-slate-100">
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Kilométrage</th>
                      <th className="pb-2">Volume</th>
                      <th className="pb-2">Montant</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr><td className="py-2.5">28/05/2026</td><td className="font-mono">56 780 km</td><td>42,5 L</td><td className="font-bold">58 000 FCFA</td></tr>
                    <tr><td className="py-2.5">12/05/2026</td><td className="font-mono">56 120 km</td><td>38,0 L</td><td className="font-bold">51 870 FCFA</td></tr>
                    <tr><td className="py-2.5">25/04/2026</td><td className="font-mono">55 410 km</td><td>40,2 L</td><td className="font-bold">54 870 FCFA</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table maintenance */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 uppercase">Historique maintenance</span>
                <span className="text-xs font-semibold text-sky-600">Voir tout &gt;</span>
              </div>
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-[10px] uppercase text-slate-400 border-b border-slate-100">
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Intervention</th>
                      <th className="pb-2">Kilométrage</th>
                      <th className="pb-2">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr><td className="py-2.5">15/05/2026</td><td className="font-medium">Révision 60 000 km</td><td className="font-mono">56 000 km</td><td><span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">Terminé</span></td></tr>
                    <tr><td className="py-2.5">20/01/2026</td><td className="font-medium">Vidange + Filtres</td><td className="font-mono">50 000 km</td><td><span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">Terminé</span></td></tr>
                    <tr><td className="py-2.5">12/09/2025</td><td className="font-medium">Contrôle freins</td><td className="font-mono">40 000 km</td><td><span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">Terminé</span></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Conducteur */}
      {activeTab === 'driver' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Conducteur principal affecté</h3>
              <p className="text-xs text-slate-500">Chauffeur en charge de l'exploitation de ce véhicule</p>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-3 py-1.5 bg-sky-50 text-sky-600 rounded-lg font-bold text-xs hover:bg-sky-100 transition-colors"
            >
              Changer de chauffeur
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-black text-lg">
                JK
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{vehicle.driver?.name || vehicle.driver_name || 'Jean KOUASSI'}</h4>
                <p className="text-xs text-slate-500">Chauffeur Principal • Titulaire</p>
                <div className="flex items-center gap-1 text-xs text-sky-600 font-semibold mt-1">
                  <Phone className="w-3 h-3" />
                  <span>+229 97 00 11 22</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">Permis ANaTT</span>
              <div className="flex justify-between"><span className="text-slate-500">Catégorie:</span><span className="font-bold font-mono">B & C</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Numéro de permis:</span><span className="font-mono">BJ-2018-99214</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Validité:</span><span className="text-emerald-700 font-bold">Jusqu'au 15/09/2028</span></div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">Score Éco-Conduite</span>
              <div className="text-2xl font-black text-emerald-600">89 / 100</div>
              <div className="text-[11px] text-slate-500">Excellente maîtrise des accélérations et freinages. Conduite souple.</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Documents */}
      {activeTab === 'documents' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Documents certifiés de ce véhicule</h3>
              <p className="text-xs text-slate-500">Pièces réglementaires et attestations de conformité Bénin</p>
            </div>
            <button
              onClick={() => showToast('Justificatifs certifiés téléchargés')}
              className="flex items-center gap-2 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger le dossier complet</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {[
              { type: 'Contrôle Technique CNSR', ref: 'CNSR-BJ-2026-8812', expiry: '20/05/2027', status: 'Valide', org: 'Centre National de Sécurité Routière' },
              { type: 'Police d Assurance Flotte', ref: 'NSIA-ASSUR-FLT-098', expiry: '14/02/2027', status: 'Valide', org: 'NSIA Assurances Bénin' },
              { type: 'Carte Grise Officielle', ref: 'CG-ANATT-2022-771', expiry: 'Permanent', status: 'Certifié', org: 'Agence Nationale des Transports Terrestres' },
              { type: 'Taxe sur Véhicules à Moteur (TVM)', ref: 'TVM-DGI-2026-339', expiry: '31/12/2026', status: 'Payée', org: 'Direction Générale des Impôts' },
            ].map((doc, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{doc.type}</div>
                    <div className="text-slate-500 text-[11px]">Réf: {doc.ref} • {doc.org}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[11px] text-slate-600">Échéance: <strong>{doc.expiry}</strong></span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {doc.status}
                  </span>
                  <button
                    onClick={() => showToast(`Copie certifiée téléchargée (${doc.type})`)}
                    className="p-1.5 text-slate-500 hover:text-sky-600 rounded-md hover:bg-sky-50 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Maintenance */}
      {activeTab === 'maintenance' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Carnet d'entretien numérique JMF</h3>
              <p className="text-xs text-slate-500">Historique des interventions préventives, curatives et pneumatiques</p>
            </div>
            <button
              onClick={() => showToast('Ordre de travail atelier Akpakpa programmé')}
              className="flex items-center gap-2 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition-colors"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Programmer une intervention</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] uppercase text-slate-400 border-b border-slate-100">
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Type d'intervention</th>
                  <th className="pb-2">Atelier & Technicien</th>
                  <th className="pb-2">Kilométrage</th>
                  <th className="pb-2">Coût (FCFA)</th>
                  <th className="pb-2">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3 font-semibold">15/05/2026</td>
                  <td>Révision générale 60 000 km + Filtres huile/air/habitacle</td>
                  <td>Hub Atelier JMF Akpakpa (Tech: Michel A.)</td>
                  <td className="font-mono">56 000 km</td>
                  <td className="font-bold">125 000 FCFA</td>
                  <td><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Terminé certifié</span></td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold">20/01/2026</td>
                  <td>Vidange moteur 5W30 synthèse + purge freinage</td>
                  <td>Hub Atelier JMF Akpakpa</td>
                  <td className="font-mono">50 000 km</td>
                  <td className="font-bold">68 500 FCFA</td>
                  <td><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Terminé certifié</span></td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold">12/09/2025</td>
                  <td>Remplacement plaquettes de frein avant</td>
                  <td>Atelier Partenaire Cotonou</td>
                  <td className="font-mono">40 000 km</td>
                  <td className="font-bold">45 000 FCFA</td>
                  <td><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Terminé certifié</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Carburant */}
      {activeTab === 'fuel' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Suivi Carburant & Approvisionnements</h3>
              <p className="text-xs text-slate-500">Historique des transactions cartes et consommation moyenne</p>
            </div>
            <button
              onClick={() => showToast('Relevé de carburant exporté')}
              className="flex items-center gap-2 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter relevé pleins</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold uppercase text-slate-600">Consommation moyenne</span>
              <div className="text-xl font-black text-sky-600 mt-1">6,4 L/100 km</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold uppercase text-slate-600">Dépenses ce mois</span>
              <div className="text-xl font-black text-slate-900 mt-1">142 500 FCFA</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold uppercase text-slate-600">Carte assignée</span>
              <div className="text-xs font-bold text-slate-800 mt-1 font-mono">{vehicle.fuel_card_number || 'TOTAL-FLEET-BJ-4491'}</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] uppercase text-slate-400 border-b border-slate-100">
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Station service</th>
                  <th className="pb-2">Compteur</th>
                  <th className="pb-2">Volume</th>
                  <th className="pb-2">Prix unitaire</th>
                  <th className="pb-2">Montant total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr><td>28/05/2026</td><td>TotalEnergies Marina Cotonou</td><td className="font-mono">56 780 km</td><td>42,5 L</td><td>1 364 FCFA/L</td><td className="font-bold">58 000 FCFA</td></tr>
                <tr><td>12/05/2026</td><td>Oryx Étoile Rouge Cotonou</td><td className="font-mono">56 120 km</td><td>38,0 L</td><td>1 365 FCFA/L</td><td className="font-bold">51 870 FCFA</td></tr>
                <tr><td>25/04/2026</td><td>TotalEnergies Ganhi Cotonou</td><td className="font-mono">55 410 km</td><td>40,2 L</td><td>1 365 FCFA/L</td><td className="font-bold">54 870 FCFA</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Tires */}
      {activeTab === 'tires' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">État et suivi des 4 pneumatiques + Roue de secours</h3>
          <p className="text-xs text-slate-500">Dimensions: 225/55 R18 102V • Marque: Michelin Primacy 4</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
            {[
              { pos: 'Avant Gauche (AG)', usure: '25%', press: '2.4 bar', status: 'Bon état' },
              { pos: 'Avant Droit (AD)', usure: '28%', press: '2.4 bar', status: 'Bon état' },
              { pos: 'Arrière Gauche (ARG)', usure: '15%', press: '2.3 bar', status: 'Excellent' },
              { pos: 'Arrière Droit (ARD)', usure: '16%', press: '2.3 bar', status: 'Excellent' },
            ].map((pneu, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs text-center">
                <div className="font-bold text-slate-900">{pneu.pos}</div>
                <div className="text-slate-500">Usure: <strong className="text-slate-800">{pneu.usure}</strong></div>
                <div className="text-slate-500">Pression: <strong className="text-sky-600">{pneu.press}</strong></div>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {pneu.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Expenses & TCO */}
      {activeTab === 'expenses' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Coûts de Détention & TCO détaillé ({vehicle.registration_number})</h3>
          <p className="text-xs text-slate-500">Coût de revient total au kilomètre parcouru: <strong>412 FCFA / km</strong></p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-600">Dépenses carburant annuelles</span>
              <div className="text-xl font-bold text-slate-900">1 710 000 FCFA</div>
              <div className="text-[11px] text-slate-500">48% du total TCO</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-600">Maintenance & Pneumatiques</span>
              <div className="text-xl font-bold text-slate-900">885 000 FCFA</div>
              <div className="text-[11px] text-slate-500">25% du total TCO</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-600">Assurance & Taxes TVM</span>
              <div className="text-xl font-bold text-slate-900">965 000 FCFA</div>
              <div className="text-[11px] text-slate-500">27% du total TCO</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Telematics */}
      {activeTab === 'telematics' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Télématique & Balise Teltonika FMC130</h3>
              <p className="text-xs text-slate-500">Dernier ping reçu il y a 32 secondes • Réseau MTN Bénin 4G LTE</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              Balise active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500">Coordonnées GPS:</span>
              <div className="font-mono font-bold text-slate-900 mt-1">6.3542° N, 2.4189° E</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Boulevard de la Marina, Cotonou</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500">Statut contact:</span>
              <div className="font-bold text-slate-900 mt-1">Contact coupé (Stationné)</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Batterie véhicule: 12.6V (Normale)</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500">Zone de gardiennage / Geofence:</span>
              <div className="font-bold text-slate-900 mt-1">Zone Siège Marina</div>
              <div className="text-[11px] text-emerald-600 font-bold mt-0.5">Dans le périmètre autorisé</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: History */}
      {activeTab === 'history' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Journal d'Audit Opérationnel du Véhicule</h3>
          <div className="space-y-3 text-xs">
            {[
              { date: 'Hier à 17:45', event: 'Retour de mission et stationnement au siège', user: 'Jean KOUASSI (Chauffeur)' },
              { date: '28/05/2026 à 09:15', event: 'Plein carburant 42,5L TotalEnergies Marina enregistré', user: 'Jean KOUASSI' },
              { date: '15/05/2026 à 14:00', event: 'Ordre de travail révision 60 000 km validé et certifié', user: 'Michel A. (Atelier Akpakpa)' },
              { date: '20/05/2025 à 11:30', event: 'Contrôle technique CNSR renouvelé pour 24 mois', user: 'Koffi AMAN (Fleet Manager)' },
            ].map((hist, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 flex items-start justify-between">
                <div>
                  <div className="font-bold text-slate-900">{hist.event}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">Par: {hist.user}</div>
                </div>
                <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">{hist.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Modifier les informations du véhicule */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit className="w-5 h-5 text-sky-600" />
                <span>Modifier le véhicule ({vehicle.registration_number})</span>
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Kilométrage actuel (km)</label>
                <input
                  type="number"
                  required
                  value={editFormData.mileage}
                  onChange={(e) => setEditFormData({ ...editFormData, mileage: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Chauffeur assigné</label>
                <input
                  type="text"
                  required
                  value={editFormData.driver_name}
                  onChange={(e) => setEditFormData({ ...editFormData, driver_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Statut opérationnel</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                  >
                    <option value="ACTIVE">En service (Actif)</option>
                    <option value="MAINTENANCE">En maintenance (Atelier)</option>
                    <option value="IMMOBILIZED">Immobilisé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Site / Agence</label>
                  <select
                    value={editFormData.agency_site}
                    onChange={(e) => setEditFormData({ ...editFormData, agency_site: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                  >
                    <option value="Siège Cotonou Marina">Siège Cotonou Marina</option>
                    <option value="Hub Atelier Akpakpa">Hub Atelier Akpakpa</option>
                    <option value="Base Portuaire de Cotonou">Base Portuaire de Cotonou</option>
                    <option value="Agence Calavi">Agence Calavi</option>
                    <option value="Dépôt Parakou">Dépôt Parakou</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Carte carburant assignée</label>
                <input
                  type="text"
                  value={editFormData.fuel_card_number}
                  onChange={(e) => setEditFormData({ ...editFormData, fuel_card_number: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
