import React, { useState, useEffect } from 'react';
import {
  Truck,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  UserCheck,
  DollarSign,
  Plus,
  RefreshCw,
  X,
  Send,
  Calendar,
  MapPin,
  Car,
  User,
  Phone,
  Mail,
  Shield,
  Check,
  ChevronRight,
  Receipt
} from 'lucide-react';
import { ApiClient } from '../../services/api.js';
import { ConvoyRequest, ConvoyStatus } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';

interface ConvoyManagementViewProps {
  onNavigateView?: (view: string) => void;
  onOpenNewForm?: () => void;
}

export const ConvoyManagementView: React.FC<ConvoyManagementViewProps> = ({ onNavigateView, onOpenNewForm }) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ConvoyRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<ConvoyRequest | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Status modal state
  const [newStatus, setNewStatus] = useState<ConvoyStatus>('ANALYZING');
  const [timelineNote, setTimelineNote] = useState('');
  const [quoteAmount, setQuoteAmount] = useState<number>(0);
  const [internalNotes, setInternalNotes] = useState('');
  const [assignedDriverId, setAssignedDriverId] = useState('');

  // Client link modal
  const [isLinkingClient, setIsLinkingClient] = useState(false);
  const [linkMode, setLinkMode] = useState<'create_new' | 'existing'>('create_new');

  const fetchConvoyRequests = async () => {
    setIsLoading(true);
    try {
      const data = await ApiClient.getConvoyRequests({
        status: statusFilter,
        search: searchQuery,
      });
      setRequests(data);
    } catch (e) {
      console.error('Error fetching convoy requests:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConvoyRequests();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchConvoyRequests();
  };

  const openDetailModal = async (req: ConvoyRequest) => {
    setSelectedRequest(req);
    setNewStatus(req.status);
    setQuoteAmount(req.quote_amount || 0);
    setInternalNotes(req.internal_notes || '');
    setAssignedDriverId(req.assigned_driver_id || '');
    setActionSuccessMessage(null);

    // Fetch fresh detail from API
    try {
      const fresh = await ApiClient.getConvoyDetail(req.id);
      if (fresh) setSelectedRequest(fresh);
    } catch (err) {
      console.warn('Failed to load fresh convoy detail', err);
    }
  };

  const handleUpdateStatusAndNotes = async () => {
    if (!selectedRequest) return;
    setIsUpdating(true);
    setActionSuccessMessage(null);
    try {
      const payload: any = {
        status: newStatus,
        internal_notes: internalNotes,
        quote_amount: quoteAmount,
        assigned_driver_id: assignedDriverId || null,
        timeline_note: timelineNote || undefined,
      };
      const res = await ApiClient.updateConvoyRequest(selectedRequest.id, payload);
      if (res && res.data) {
        setSelectedRequest(res.data);
        setActionSuccessMessage('Mise à jour enregistrée avec succès !');
        setTimelineNote('');
        fetchConvoyRequests();
      }
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLinkClient = async () => {
    if (!selectedRequest) return;
    setIsUpdating(true);
    try {
      const payload = linkMode === 'create_new' ? { create_new_user: true } : { user_id: 'usr_client_martin' };
      const res = await ApiClient.linkConvoyClient(selectedRequest.id, payload);
      if (res && res.data) {
        setSelectedRequest(res.data);
        setIsLinkingClient(false);
        setActionSuccessMessage('Compte client rattaché avec succès !');
        fetchConvoyRequests();
      }
    } catch (err: any) {
      alert(err.message || 'Erreur lors du rattachement');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateInvoiceForConvoy = async () => {
    if (!selectedRequest) return;
    if (!selectedRequest.quote_amount || selectedRequest.quote_amount <= 0) {
      alert('Veuillez renseigner un montant de devis/tarif avant de générer la facture.');
      return;
    }
    setIsUpdating(true);
    try {
      const invPayload = {
        company_id: selectedRequest.company_id || 'comp_jmf_client_001',
        user_id: selectedRequest.user_id,
        service_type: 'convoy',
        reference_mission: selectedRequest.reference,
        description: `Prestation de convoyage véhicule ${selectedRequest.vehicle_brand} ${selectedRequest.vehicle_model} (${selectedRequest.pickup_city} → ${selectedRequest.delivery_city})`,
        unit_price: selectedRequest.quote_amount,
        quantity: 1,
        tax_rate: 18,
        currency: 'FCFA',
        status: 'PENDING',
      };
      const res = await ApiClient.createInvoice(invPayload);
      if (res && res.data) {
        setActionSuccessMessage(`Facture N° ${res.data.invoice_number} générée avec succès !`);
        // Refresh detail
        const fresh = await ApiClient.getConvoyDetail(selectedRequest.id);
        if (fresh) setSelectedRequest(fresh);
        fetchConvoyRequests();
      }
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la génération de la facture');
    } finally {
      setIsUpdating(false);
    }
  };

  // Status Badges
  const renderStatusBadge = (status: ConvoyStatus) => {
    const map: Record<ConvoyStatus, { label: string; color: string; bg: string }> = {
      NEW: { label: 'Nouvelle demande', color: 'text-amber-800', bg: 'bg-amber-100' },
      ANALYZING: { label: 'En analyse', color: 'text-sky-800', bg: 'bg-sky-100' },
      QUOTE_SENT: { label: 'Devis envoyé', color: 'text-indigo-800', bg: 'bg-indigo-100' },
      ACCEPTED: { label: 'Devis accepté', color: 'text-emerald-800', bg: 'bg-emerald-100' },
      PLANNED: { label: 'Planifiée', color: 'text-purple-800', bg: 'bg-purple-100' },
      IN_PROGRESS: { label: 'En cours de route', color: 'text-blue-800', bg: 'bg-blue-100' },
      COMPLETED: { label: 'Terminée', color: 'text-teal-800', bg: 'bg-teal-100' },
      REJECTED: { label: 'Refusée', color: 'text-rose-800', bg: 'bg-rose-100' },
      CANCELLED: { label: 'Annulée', color: 'text-slate-800', bg: 'bg-slate-200' },
    };
    const s = map[status] || { label: status, color: 'text-slate-700', bg: 'bg-slate-100' };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${s.bg} ${s.color}`}>
        {s.label}
      </span>
    );
  };

  // KPI Calculations
  const totalCount = requests.length;
  const newCount = requests.filter(r => r.status === 'NEW').length;
  const analyzingCount = requests.filter(r => r.status === 'ANALYZING' || r.status === 'QUOTE_SENT').length;
  const inProgressCount = requests.filter(r => r.status === 'PLANNED' || r.status === 'IN_PROGRESS').length;
  const completedCount = requests.filter(r => r.status === 'COMPLETED').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Truck className="w-7 h-7 text-sky-600" />
              <span>Gestion des Demandes de Convoyage</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-800 text-xs font-bold">
              Opérations JMF
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Traitement opérationnel des demandes reçues via le formulaire public et le portail client
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchConvoyRequests}
            title="Rafraîchir"
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          {onOpenNewForm && (
            <button
              onClick={onOpenNewForm}
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nouvelle demande de convoyage</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Demandes</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalCount}</p>
        </div>
        <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 shadow-xs">
          <p className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center justify-between">
            <span>Nouvelles</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </p>
          <p className="text-2xl font-black text-amber-900 mt-1">{newCount}</p>
        </div>
        <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-200 shadow-xs">
          <p className="text-xs font-bold text-sky-800 uppercase tracking-wider">En analyse / Devis</p>
          <p className="text-2xl font-black text-sky-900 mt-1">{analyzingCount}</p>
        </div>
        <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 shadow-xs">
          <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">En cours de route</p>
          <p className="text-2xl font-black text-blue-900 mt-1">{inProgressCount}</p>
        </div>
        <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 shadow-xs">
          <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Terminées</p>
          <p className="text-2xl font-black text-emerald-900 mt-1">{completedCount}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher réf, demandeur, véhicule..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
          />
        </form>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'Tous' },
            { id: 'NEW', label: 'Nouvelles' },
            { id: 'ANALYZING', label: 'En analyse' },
            { id: 'QUOTE_SENT', label: 'Devis envoyé' },
            { id: 'IN_PROGRESS', label: 'En cours' },
            { id: 'COMPLETED', label: 'Terminées' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                statusFilter === f.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table of Convoy Requests */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Référence & Date</th>
                <th className="py-3.5 px-4">Demandeur</th>
                <th className="py-3.5 px-4">Véhicule</th>
                <th className="py-3.5 px-4">Trajet</th>
                <th className="py-3.5 px-4">Date Souhaitée</th>
                <th className="py-3.5 px-4">Mode</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-sky-500" />
                    Chargement des dossiers de convoyage...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    Aucune demande de convoyage trouvée pour ce critère.
                  </td>
                </tr>
              ) : (
                requests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Référence */}
                    <td className="py-3.5 px-4 font-mono">
                      <span className="font-extrabold text-sky-700">{req.reference}</span>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(req.created_at).toLocaleDateString('fr-FR')} {new Date(req.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    {/* Demandeur */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{req.client_name}</div>
                      <div className="text-[11px] text-slate-500">{req.client_company || 'Particulier'}</div>
                      <div className="text-[10px] text-slate-400">{req.client_phone}</div>
                    </td>

                    {/* Véhicule */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{req.vehicle_brand} {req.vehicle_model}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {req.is_registered && req.vehicle_plate ? req.vehicle_plate : 'Non immatriculé'} • {req.vehicle_year}
                      </div>
                      {req.requires_flatbed && (
                        <span className="inline-block mt-0.5 text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                          Plateau requis
                        </span>
                      )}
                    </td>

                    {/* Trajet */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 font-medium text-slate-700">
                        <span>{req.pickup_city}</span>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                        <span className="font-bold text-slate-900">{req.delivery_city}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">{req.pickup_country}</div>
                    </td>

                    {/* Date Souhaitée */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{req.desired_date}</div>
                      <div className="text-[10px] text-slate-400">à {req.desired_time}</div>
                    </td>

                    {/* Mode */}
                    <td className="py-3.5 px-4 text-[11px]">
                      {req.convoy_mode === 'driver' ? (
                        <span className="text-slate-700">Par la route</span>
                      ) : (
                        <span className="font-semibold text-amber-800">Camion Plateau</span>
                      )}
                    </td>

                    {/* Statut */}
                    <td className="py-3.5 px-4">
                      {renderStatusBadge(req.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openDetailModal(req)}
                        className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Traiter</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL & TREATMENT MODAL / DRAWER */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black tracking-tight">{selectedRequest.reference}</span>
                    {renderStatusBadge(selectedRequest.status)}
                  </div>
                  <p className="text-xs text-slate-400">
                    Demande déposée le {new Date(selectedRequest.created_at).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {actionSuccessMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{actionSuccessMessage}</span>
                </div>
              )}

              {/* 3-Column Recap Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Véhicule */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <p className="font-bold text-slate-900 flex items-center gap-1.5 text-sm mb-2">
                    <Car className="w-4 h-4 text-sky-600" /> Véhicule
                  </p>
                  <div><strong className="text-slate-700">Marque & Modèle:</strong> {selectedRequest.vehicle_brand} {selectedRequest.vehicle_model}</div>
                  <div><strong className="text-slate-700">Année:</strong> {selectedRequest.vehicle_year}</div>
                  <div><strong className="text-slate-700">Immatriculation:</strong> {selectedRequest.vehicle_plate || 'Non immatriculé'}</div>
                  <div><strong className="text-slate-700">Couleur:</strong> {selectedRequest.vehicle_color}</div>
                  <div><strong className="text-slate-700">État:</strong> {selectedRequest.vehicle_condition}</div>
                  {selectedRequest.condition_details && (
                    <div className="text-amber-800 bg-amber-50 p-1.5 rounded mt-1">
                      <strong>Détails:</strong> {selectedRequest.condition_details}
                    </div>
                  )}
                  {selectedRequest.requires_flatbed && (
                    <div className="text-amber-700 font-bold mt-1">Plateau requis</div>
                  )}
                </div>

                {/* Trajet */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <p className="font-bold text-slate-900 flex items-center gap-1.5 text-sm mb-2">
                    <MapPin className="w-4 h-4 text-sky-600" /> Trajet & Horaires
                  </p>
                  <div><strong className="text-slate-700">Départ:</strong> {selectedRequest.pickup_address}, {selectedRequest.pickup_city} ({selectedRequest.pickup_country})</div>
                  <div><strong className="text-slate-700">Arrivée:</strong> {selectedRequest.delivery_address}, {selectedRequest.delivery_city} ({selectedRequest.delivery_country})</div>
                  <div><strong className="text-slate-700">Date souhaitée:</strong> {selectedRequest.desired_date} à {selectedRequest.desired_time}</div>
                  <div><strong className="text-slate-700">Mode:</strong> {selectedRequest.convoy_mode === 'driver' ? 'Chauffeur certifié' : 'Camion plateau'}</div>
                  {selectedRequest.special_instructions && (
                    <div className="text-slate-600 italic bg-white p-1.5 rounded border border-slate-200 mt-1">
                      "{selectedRequest.special_instructions}"
                    </div>
                  )}
                </div>

                {/* Demandeur */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <p className="font-bold text-slate-900 flex items-center gap-1.5 text-sm mb-2">
                    <User className="w-4 h-4 text-sky-600" /> Demandeur
                  </p>
                  <div><strong className="text-slate-700">Nom:</strong> {selectedRequest.client_name}</div>
                  <div><strong className="text-slate-700">Société:</strong> {selectedRequest.client_company || 'Non renseigné'}</div>
                  <div><strong className="text-slate-700">Email:</strong> {selectedRequest.client_email}</div>
                  <div><strong className="text-slate-700">Téléphone:</strong> {selectedRequest.client_phone}</div>
                  <div><strong className="text-slate-700">Pays:</strong> {selectedRequest.client_country}</div>

                  <div className="pt-2 border-t border-slate-200 mt-2">
                    {selectedRequest.user_id ? (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block">
                        Rattaché au compte client #{selectedRequest.user_id}
                      </span>
                    ) : (
                      <button
                        onClick={() => setIsLinkingClient(true)}
                        className="px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] transition-colors"
                      >
                        + Lier à un compte client
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Update & Operational Assignment Box */}
              <div className="bg-sky-50/60 rounded-xl p-5 border border-sky-200 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-sky-900 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-sky-600" />
                  Mise à jour du statut & Actions opérationnelles
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Status Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Statut du dossier
                    </label>
                    <select
                      value={newStatus}
                      onChange={e => setNewStatus(e.target.value as ConvoyStatus)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-semibold focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="NEW">Nouvelle demande</option>
                      <option value="ANALYZING">En analyse de faisabilité</option>
                      <option value="QUOTE_SENT">Devis envoyé au client</option>
                      <option value="ACCEPTED">Devis accepté par le client</option>
                      <option value="PLANNED">Mission planifiée</option>
                      <option value="IN_PROGRESS">Convoyage en cours de route</option>
                      <option value="COMPLETED">Convoyage terminé avec succès</option>
                      <option value="REJECTED">Demande refusée</option>
                      <option value="CANCELLED">Demande annulée</option>
                    </select>
                  </div>

                  {/* Quote Amount */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Montant du devis / Tarif convenu (FCFA)
                    </label>
                    <input
                      type="number"
                      placeholder="Ex: 85000"
                      value={quoteAmount}
                      onChange={e => setQuoteAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-mono font-bold focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  {/* Chauffeur assigné */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Chauffeur JMF assigné
                    </label>
                    <select
                      value={assignedDriverId}
                      onChange={e => setAssignedDriverId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="">-- Aucun chauffeur assigné --</option>
                      <option value="drv_ahouandjinou_01">Séraphin AHOUANDJINOU (Permis B, C, D - Certifié)</option>
                      <option value="drv_gnacadja_02">Rodrigue GNACADJA (Permis B, C - Certifié)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Note pour l'historique (Timeline)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Véhicule inspecté à l'enlèvement, départ à 09h15"
                      value={timelineNote}
                      onChange={e => setTimelineNote(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Notes internes JMF (Confidentielles)
                    </label>
                    <input
                      type="text"
                      placeholder="Remarques tarifaires ou consignes d'atelier..."
                      value={internalNotes}
                      onChange={e => setInternalNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    {/* Invoice Button */}
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={handleCreateInvoiceForConvoy}
                      className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>{selectedRequest.invoice_id ? 'Facture déjà générée' : 'Générer la facture'}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={handleUpdateStatusAndNotes}
                    className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    {isUpdating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    <span>Enregistrer les modifications</span>
                  </button>
                </div>
              </div>

              {/* Timeline History */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Historique opérationnel & Jalons
                </h4>
                <div className="border-l-2 border-sky-300 pl-4 space-y-3 text-xs">
                  {selectedRequest.timeline && selectedRequest.timeline.length > 0 ? (
                    selectedRequest.timeline.map((item, idx) => (
                      <div key={item.id || idx} className="relative">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-sky-500 ring-4 ring-white" />
                        <div className="font-bold text-slate-800 flex items-center gap-2">
                          <span>{item.label}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {new Date(item.created_at).toLocaleString('fr-FR')} • Par {item.author}
                          </span>
                        </div>
                        {item.note && <p className="text-slate-600 text-[11px] mt-0.5">{item.note}</p>}
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 italic">Aucun événement enregistré.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Protocole de convoyage JMF Fleet v2.4 • Traçabilité active
              </span>
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: LINK CLIENT ACCOUNT */}
      {isLinkingClient && selectedRequest && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-600" />
              Lier la demande à un compte client
            </h3>
            <p className="text-xs text-slate-600">
              Rattachez cette demande de convoyage au dossier d'un client afin qu'il puisse la suivre en temps réel depuis son espace personnel.
            </p>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="linkMode"
                  checked={linkMode === 'create_new'}
                  onChange={() => setLinkMode('create_new')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span>Créer un nouveau compte client pour {selectedRequest.client_name} ({selectedRequest.client_email})</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="linkMode"
                  checked={linkMode === 'existing'}
                  onChange={() => setLinkMode('existing')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span>Rattacher au compte existant Martin ADJOVI (Client Démo)</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsLinkingClient(false)}
                className="px-3.5 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Annuler
              </button>
              <button
                onClick={handleLinkClient}
                disabled={isUpdating}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
              >
                Confirmer la liaison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
