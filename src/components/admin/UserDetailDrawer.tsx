import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Building2,
  Mail,
  Phone,
  ShieldCheck,
  Calendar,
  Lock,
  Receipt,
  Truck,
  Car,
  History,
  CheckCircle2,
  AlertTriangle,
  Download,
  Plus,
  Send,
  RefreshCw,
  Edit2,
  Check,
  Globe,
  Smartphone,
  Laptop,
} from 'lucide-react';
import { ApiClient } from '../../services/api.js';
import { UserDetailSheet, Invoice, ConvoyRequest } from '../../types/index.js';

interface UserDetailDrawerProps {
  userId: string;
  onClose: () => void;
  onUserUpdated?: () => void;
  onNavigateToConvoy?: (convoyId?: string) => void;
}

export const UserDetailDrawer: React.FC<UserDetailDrawerProps> = ({
  userId,
  onClose,
  onUserUpdated,
  onNavigateToConvoy,
}) => {
  const [data, setData] = useState<UserDetailSheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'convoys' | 'vehicles' | 'history' | 'edit'>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Suspension modal
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');

  // Password reset state
  const [isResetPassModalOpen, setIsResetPassModalOpen] = useState(false);
  const [generatedTempPass, setGeneratedTempPass] = useState<string | null>(null);

  // Send message modal
  const [isSendMessageOpen, setIsSendMessageOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');

  // Create invoice modal
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    description: 'Prestation convoyage & gardiennage véhicule',
    amount_ttc: 75000,
    due_days: 15,
  });

  // Edit user state
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company_name: '',
    site_name: '',
    role: '',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadUserDetails = async () => {
    setLoading(true);
    try {
      const details = await ApiClient.getUserDetail(userId);
      setData(details);
      setEditForm({
        first_name: details.user.first_name,
        last_name: details.user.last_name,
        email: details.user.email,
        phone: details.user.phone,
        company_name: details.user.company_name,
        site_name: details.user.site_name,
        role: details.user.role,
      });
    } catch (err) {
      console.error('Failed to load user details:', err);
      showToast('Erreur lors du chargement de la fiche utilisateur');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserDetails();
  }, [userId]);

  const handleToggleStatus = async () => {
    if (!data) return;
    const newStatus = !data.user.is_active;

    try {
      await ApiClient.updateUser(data.user.id, {
        is_active: newStatus,
        status_reason: newStatus ? 'Réactivation administrative' : (suspendReason || 'Suspension temporaire par l’administrateur'),
      });

      showToast(newStatus ? 'Compte réactivé avec succès' : 'Compte suspendu avec succès');
      setIsSuspendModalOpen(false);
      setSuspendReason('');
      await loadUserDetails();
      if (onUserUpdated) onUserUpdated();
    } catch (err) {
      showToast('Erreur lors du changement de statut');
    }
  };

  const handleResetPassword = async () => {
    if (!data) return;
    try {
      const res = await ApiClient.resetUserPassword(data.user.id);
      setGeneratedTempPass(res.tempPassword || 'JmfSecure@2026!');
      showToast(res.message || 'Lien de réinitialisation généré et envoyé');
    } catch (err) {
      showToast('Erreur lors de la réinitialisation du mot de passe');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    try {
      await ApiClient.updateUser(data.user.id, editForm);
      showToast('Informations mises à jour avec succès');
      setActiveTab('overview');
      await loadUserDetails();
      if (onUserUpdated) onUserUpdated();
    } catch (err) {
      showToast('Erreur lors de la mise à jour des informations');
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    try {
      const issueDate = new Date();
      const dueDate = new Date();
      dueDate.setDate(issueDate.getDate() + Number(invoiceForm.due_days));

      const amountTtc = Number(invoiceForm.amount_ttc);
      const amountHt = Math.round(amountTtc / 1.18);
      const amountTva = amountTtc - amountHt;

      const newInv = await ApiClient.createInvoice({
        company_id: data.user.company_name,
        user_id: data.user.id,
        client_name: `${data.user.first_name} ${data.user.last_name}`,
        client_email: data.user.email,
        description: invoiceForm.description,
        amount_ht: amountHt,
        amount_tva: amountTva,
        amount_ttc: amountTtc,
        due_date: dueDate.toISOString().split('T')[0],
        status: 'PENDING',
        items_breakdown: [
          {
            label: invoiceForm.description,
            qty: 1,
            unit_price: amountHt,
            total: amountHt,
          },
        ],
      });

      showToast(`Facture ${newInv.invoice_number} créée et transmise au client`);
      setIsCreateInvoiceOpen(false);
      await loadUserDetails();
      if (onUserUpdated) onUserUpdated();
    } catch (err) {
      showToast('Erreur lors de la création de la facture');
    }
  };

  const handleDownloadInvoiceReceipt = (inv: Invoice) => {
    const text = `=====================================================
JMF FLEET & MOBILITY SERVICES - BÉNIN
FACTURE NORMALISÉE DGI e-MECeF
=====================================================
N° Facture   : ${inv.invoice_number}
Code e-MECeF : ${inv.emef_code || 'DGI-BJ-2026-MECeF'}
Date émission: ${inv.issue_date}
Date échéance: ${inv.due_date}

CLIENT :
Nom          : ${inv.client_name || data?.user.first_name + ' ' + data?.user.last_name}
Email        : ${inv.client_email || data?.user.email}
Entreprise   : ${data?.user.company_name}

OBJET :
${inv.description}

DÉCOMPTE :
Montant Hors Taxes (HT) : ${inv.amount_ht.toLocaleString('fr-FR')} FCFA
TVA Légale (18%)        : ${inv.amount_tva.toLocaleString('fr-FR')} FCFA
TOTAL TTC À PAYER       : ${inv.amount_ttc.toLocaleString('fr-FR')} FCFA
Statut règlement        : ${inv.status}

MOYENS DE PAIEMENT ACCEPTÉS :
- Virement bancaire BOA / Ecobank / NSIA Bénin
- MTN Mobile Money & MoMo Business
- Celtiis Cash & Moov Money
=====================================================
JMF Mobility Services • Cotonou Akpakpa • République du Bénin`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Facture_${inv.invoice_number}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Téléchargement de la facture ${inv.invoice_number}`);
  };

  if (loading || !data) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-xs">
        <div className="w-full max-w-3xl bg-white h-full shadow-2xl flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 text-sky-600 animate-spin" />
            <p className="text-sm font-semibold text-slate-600">Chargement de la fiche client...</p>
          </div>
        </div>
      </div>
    );
  }

  const { user, invoices = [], convoys = [], vehicles = [], history = [] } = data;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col overflow-hidden text-slate-800">
        
        {/* Toast feedback */}
        {toastMessage && (
          <div className="absolute top-4 left-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center justify-between text-xs font-semibold animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Drawer Header */}
        <div className="bg-[#081020] text-white p-6 border-b border-slate-800">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256'}
                alt=""
                className="w-14 h-14 rounded-2xl object-cover border-2 border-sky-400/40 shadow-md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white">
                    {user.first_name} {user.last_name}
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      user.is_active
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {user.is_active ? 'Compte Actif' : 'Compte Suspendu'}
                  </span>
                </div>
                <div className="text-xs text-sky-400 font-medium flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{user.company_name}</span>
                  <span className="text-slate-500">•</span>
                  <span>{user.site_name}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {user.email} | {user.phone}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Actions Row */}
          <div className="flex flex-wrap items-center gap-2 pt-5 border-t border-slate-800/80 mt-4">
            <button
              onClick={() => setIsSuspendModalOpen(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                user.is_active
                  ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30'
                  : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{user.is_active ? 'Suspendre l’accès' : 'Réactiver l’accès'}</span>
            </button>

            <button
              onClick={() => setIsResetPassModalOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Réinitialiser MDP</span>
            </button>

            <button
              onClick={() => setIsCreateInvoiceOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Créer une facture</span>
            </button>

            <button
              onClick={() => setIsSendMessageOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>Envoyer notification</span>
            </button>

            <button
              onClick={() => setActiveTab('edit')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all ml-auto"
            >
              <Edit2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Modifier</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center px-6 border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-sky-600 text-sky-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Vue d'ensemble</span>
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'invoices'
                ? 'border-sky-600 text-sky-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Factures ({invoices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('convoys')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'convoys'
                ? 'border-sky-600 text-sky-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Convoyages ({convoys.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('vehicles')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'vehicles'
                ? 'border-sky-600 text-sky-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Véhicules ({vehicles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-sky-600 text-sky-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit & Connexions</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 text-xs">
              {/* Profile Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-sky-600" />
                    <span>Identité et Contact</span>
                  </h4>
                  <div className="space-y-2 text-slate-600">
                    <div>
                      <span className="text-slate-400">Nom complet :</span>{' '}
                      <span className="font-bold text-slate-800">{user.first_name} {user.last_name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Email :</span>{' '}
                      <span className="font-mono text-slate-800">{user.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Téléphone :</span>{' '}
                      <span className="font-mono text-slate-800">{user.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Rôle RBAC :</span>{' '}
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-sm border border-indigo-200">
                        {user.role_label || user.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-sky-600" />
                    <span>Rattachement Organisationnel</span>
                  </h4>
                  <div className="space-y-2 text-slate-600">
                    <div>
                      <span className="text-slate-400">Société :</span>{' '}
                      <span className="font-bold text-slate-800">{user.company_name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Site d'exploitation :</span>{' '}
                      <span className="font-medium text-slate-800">{user.site_name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Dernière activité :</span>{' '}
                      <span className="text-slate-800">{user.last_login || 'Récemment'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Statut actuel :</span>{' '}
                      <span className={`font-bold ${user.is_active ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {user.is_active ? 'Opérationnel / Actif' : 'Accès Suspendu'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Metrics / Summaries */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-sky-50 border border-sky-100 p-3.5 rounded-xl text-center">
                  <div className="text-[10px] font-bold text-sky-700 uppercase">Factures Émises</div>
                  <div className="text-xl font-black text-sky-950 mt-1">{invoices.length}</div>
                  <div className="text-[10px] text-sky-600 mt-0.5">
                    {invoices.reduce((acc, i) => acc + (i.amount_ttc || 0), 0).toLocaleString('fr-FR')} FCFA TTC
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-xl text-center">
                  <div className="text-[10px] font-bold text-amber-700 uppercase">Dossiers Convoyage</div>
                  <div className="text-xl font-black text-amber-950 mt-1">{convoys.length}</div>
                  <div className="text-[10px] text-amber-600 mt-0.5">
                    {convoys.filter(c => c.status === 'COMPLETED').length} réalisés avec succès
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl text-center">
                  <div className="text-[10px] font-bold text-emerald-700 uppercase">Véhicules Associés</div>
                  <div className="text-xl font-black text-emerald-950 mt-1">{vehicles.length}</div>
                  <div className="text-[10px] text-emerald-600 mt-0.5">Sous surveillance IoT</div>
                </div>
              </div>

              {/* Recent Activity Brief */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-4 py-2.5 font-bold text-slate-800 flex items-center justify-between">
                  <span>Dernières activités de connexion</span>
                  <button onClick={() => setActiveTab('history')} className="text-sky-600 hover:underline text-[11px]">
                    Voir tout l'historique
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {history.slice(0, 3).map((h, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Laptop className="w-4 h-4 text-slate-400" />
                        <div>
                          <div className="font-semibold text-slate-800">{h.action || 'Connexion réussie'}</div>
                          <div className="text-[11px] text-slate-400 font-mono">IP: {h.ip_address} • {h.device}</div>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">{h.timestamp}</span>
                    </div>
                  ))}
                  {history.length === 0 && (
                    <div className="p-4 text-center text-slate-400">Aucune activité enregistrée</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INVOICES */}
          {activeTab === 'invoices' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">Factures rattachées à ce compte</h4>
                  <p className="text-[11px] text-slate-500">Factures émises et reçus normalisés DGI e-MECeF</p>
                </div>
                <button
                  onClick={() => setIsCreateInvoiceOpen(true)}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nouvelle Facture</span>
                </button>
              </div>

              {invoices.length === 0 ? (
                <div className="bg-slate-50 p-8 rounded-xl border border-dashed border-slate-200 text-center space-y-2">
                  <Receipt className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="font-bold text-slate-700">Aucune facture émise pour ce client</p>
                  <p className="text-slate-400 text-[11px]">Vous pouvez générer une facture directement via le bouton ci-dessus.</p>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 text-[11px] font-bold">
                      <tr>
                        <th className="py-2.5 px-3">N° Facture</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Description</th>
                        <th className="py-2.5 px-3">Montant TTC</th>
                        <th className="py-2.5 px-3">Statut</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {invoices.map((inv) => (
                        <tr key={inv.id || inv.invoice_number} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-slate-900">
                            {inv.invoice_number}
                          </td>
                          <td className="py-3 px-3 text-slate-600">
                            {inv.issue_date}
                          </td>
                          <td className="py-3 px-3 max-w-[200px] truncate text-slate-700">
                            {inv.description}
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-900">
                            {inv.amount_ttc?.toLocaleString('fr-FR')} FCFA
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                inv.status === 'PAID'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : inv.status === 'OVERDUE'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {inv.status === 'PAID' ? 'Payée' : inv.status === 'OVERDUE' ? 'En retard' : 'En attente'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => handleDownloadInvoiceReceipt(inv)}
                              className="p-1.5 rounded-md hover:bg-slate-100 text-sky-600 hover:text-sky-700 transition-colors"
                              title="Télécharger le reçu normalisé e-MECeF"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CONVOYS */}
          {activeTab === 'convoys' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">Demandes de convoyage associées</h4>
                  <p className="text-[11px] text-slate-500">Missions de transfert de véhicules passées par ce client</p>
                </div>
                {onNavigateToConvoy && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToConvoy();
                    }}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline"
                  >
                    Ouvrir le module Convoyage →
                  </button>
                )}
              </div>

              {convoys.length === 0 ? (
                <div className="bg-slate-50 p-8 rounded-xl border border-dashed border-slate-200 text-center space-y-2">
                  <Truck className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="font-bold text-slate-700">Aucune demande de convoyage pour ce client</p>
                  <p className="text-slate-400 text-[11px]">Le client peut soumettre une demande via le formulaire public en ligne.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {convoys.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 shadow-2xs space-y-3 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                            {c.reference}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="font-bold text-slate-900">
                            {c.vehicle_brand} {c.vehicle_model} ({c.vehicle_plate})
                          </span>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            c.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : c.status === 'IN_PROGRESS' || c.status === 'PLANNED'
                              ? 'bg-blue-100 text-blue-800'
                              : c.status === 'QUOTE_SENT' || c.status === 'ACCEPTED'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {c.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                        <div>
                          <span className="text-slate-400 block">Départ :</span>
                          <span className="font-semibold text-slate-800">{c.pickup_city} ({c.pickup_address})</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Arrivée :</span>
                          <span className="font-semibold text-slate-800">{c.delivery_city} ({c.delivery_address})</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Date souhaitée :</span>
                          <span className="font-semibold text-slate-800">{c.desired_date}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Tarif estimé :</span>
                          <span className="font-bold text-slate-900">
                            {c.price_estimated ? `${c.price_estimated.toLocaleString('fr-FR')} FCFA` : 'Sur devis'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: VEHICLES */}
          {activeTab === 'vehicles' && (
            <div className="space-y-4 text-xs">
              <h4 className="font-bold text-slate-900">Véhicules rattachés ou confiés</h4>
              {vehicles.length === 0 ? (
                <div className="bg-slate-50 p-8 rounded-xl border border-dashed border-slate-200 text-center space-y-2">
                  <Car className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="font-bold text-slate-700">Aucun véhicule rattaché directement</p>
                  <p className="text-slate-400 text-[11px]">Les véhicules de la flotte sont administrés au niveau de l'entreprise.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {vehicles.map((v) => (
                    <div key={v.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                      <div className="font-bold text-slate-900">{v.brand} {v.model}</div>
                      <div className="font-mono text-sky-700 text-xs font-semibold">{v.plate}</div>
                      <div className="text-[11px] text-slate-500">Statut : {v.status || 'En service'}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: AUDIT HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4 text-xs">
              <h4 className="font-bold text-slate-900">Journal d'audit et connexions du compte</h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 text-[11px] font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Date & Heure</th>
                      <th className="py-2.5 px-3">Événement</th>
                      <th className="py-2.5 px-3">Adresse IP</th>
                      <th className="py-2.5 px-3">Appareil & Navigateur</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {history.map((h, i) => (
                      <tr key={i} className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-3 text-slate-700 font-medium">{h.timestamp}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{h.action}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">{h.ip_address}</td>
                        <td className="py-2.5 px-3 text-slate-500">{h.device}</td>
                      </tr>
                    ))}
                    {history.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-slate-400">Aucun événement enregistré</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: EDIT USER */}
          {activeTab === 'edit' && (
            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs bg-slate-50 p-5 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm">Modifier les informations de l'utilisateur</h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={editForm.first_name}
                    onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    value={editForm.last_name}
                    onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Téléphone Bénin *</label>
                  <input
                    type="tel"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Entreprise *</label>
                  <input
                    type="text"
                    required
                    value={editForm.company_name}
                    onChange={(e) => setEditForm({ ...editForm, company_name: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Site / Agence</label>
                  <input
                    type="text"
                    value={editForm.site_name}
                    onChange={(e) => setEditForm({ ...editForm, site_name: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Rôle Attribué (RBAC) *</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-white font-bold text-slate-800"
                >
                  <option value="CLIENT">Client Donneur d’Ordre</option>
                  <option value="SUPER_ADMIN_JMF">Super Admin JMF</option>
                  <option value="COMPANY_ADMIN">Administrateur Entreprise</option>
                  <option value="FLEET_MANAGER">Gestionnaire de Flotte</option>
                  <option value="MAINTENANCE_MANAGER">Responsable Maintenance</option>
                  <option value="FINANCE_MANAGER">Responsable Financier</option>
                  <option value="DRIVER">Conducteur</option>
                  <option value="AUDITOR">Auditeur / Observateur</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg shadow-sm"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* SUSPEND / RE-ACTIVATE MODAL */}
      {isSuspendModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center gap-2.5 text-slate-900 font-black text-sm">
              <AlertTriangle className={`w-5 h-5 ${user.is_active ? 'text-rose-600' : 'text-emerald-600'}`} />
              <span>{user.is_active ? 'Confirmer la suspension du compte' : 'Confirmer la réactivation du compte'}</span>
            </div>

            <p className="text-slate-600 leading-relaxed">
              {user.is_active
                ? `Êtes-vous certain de vouloir suspendre l'accès de ${user.first_name} ${user.last_name} ? L'utilisateur ne pourra plus se connecter à la plateforme.`
                : `Voulez-vous rétablir l'accès complet de ${user.first_name} ${user.last_name} à la plateforme JMF ?`}
            </p>

            {user.is_active && (
              <div>
                <label className="block text-slate-700 font-bold mb-1">Motif de la suspension (optionnel)</label>
                <textarea
                  rows={2}
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  placeholder="Ex: Factures impayées, demande client, audit en cours..."
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSuspendModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleToggleStatus}
                className={`px-4 py-2 text-white font-bold rounded-lg shadow-sm ${
                  user.is_active ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {user.is_active ? 'Suspendre définitivement' : 'Réactiver l’accès'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {isResetPassModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center gap-2.5 text-slate-900 font-black text-sm">
              <Lock className="w-5 h-5 text-amber-500" />
              <span>Réinitialisation du mot de passe</span>
            </div>

            <p className="text-slate-600">
              Un mot de passe temporaire sera généré pour <span className="font-bold">{user.email}</span>. Un email sécurisé lui sera également adressé pour le réinitialiser.
            </p>

            {generatedTempPass && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-amber-800 uppercase">Mot de passe temporaire généré :</span>
                <div className="font-mono text-base font-black text-amber-950 select-all">{generatedTempPass}</div>
                <span className="text-[10px] text-amber-700">À communiquer au client s'il ne reçoit pas l'email.</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsResetPassModalOpen(false);
                  setGeneratedTempPass(null);
                }}
                className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50"
              >
                Fermer
              </button>
              {!generatedTempPass && (
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Générer et envoyer
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SEND SYSTEM NOTIFICATION MODAL */}
      {isSendMessageOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center gap-2.5 text-slate-900 font-black text-sm">
              <Mail className="w-5 h-5 text-indigo-600" />
              <span>Envoyer une notification / Email au client</span>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Destinataire :</label>
              <div className="font-mono text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200">
                {user.first_name} {user.last_name} &lt;{user.email}&gt;
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Message ou Instruction *</label>
              <textarea
                rows={4}
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Votre message sera délivré instantanément par email et sur son tableau de bord..."
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSendMessageOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(`Notification transmise avec succès à ${user.email}`);
                  setIsSendMessageOpen(false);
                  setMessageContent('');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Envoyer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE INVOICE FOR USER MODAL */}
      {isCreateInvoiceOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center gap-2.5 text-slate-900 font-black text-sm">
              <Receipt className="w-5 h-5 text-sky-600" />
              <span>Créer une facture rattachée à ce client</span>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Client Donneur d'Ordre</label>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold">
                  {user.first_name} {user.last_name} — {user.company_name}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description de la prestation *</label>
                <input
                  type="text"
                  required
                  value={invoiceForm.description}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, description: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg"
                  placeholder="Ex: Forfait convoyage Cotonou-Parakou + gardiennage 10 jours"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Montant TTC (FCFA) *</label>
                  <input
                    type="number"
                    required
                    min={1000}
                    step={1000}
                    value={invoiceForm.amount_ttc}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, amount_ttc: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-mono font-bold"
                  />
                  <span className="text-[10px] text-slate-400">
                    HT: {Math.round(invoiceForm.amount_ttc / 1.18).toLocaleString('fr-FR')} FCFA | TVA: {Math.round(invoiceForm.amount_ttc - invoiceForm.amount_ttc / 1.18).toLocaleString('fr-FR')} FCFA
                  </span>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Échéance de paiement</label>
                  <select
                    value={invoiceForm.due_days}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, due_days: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 font-medium"
                  >
                    <option value={7}>Sous 7 jours</option>
                    <option value={15}>Sous 15 jours</option>
                    <option value={30}>Sous 30 jours fin de mois</option>
                    <option value={0}>Paiement comptant / Immédiat</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-lg border border-sky-100 text-[11px] text-sky-800">
                La facture sera numérotée selon la séquence officielle JMF et certifiée avec le code de conformité e-MECeF de la DGI Bénin.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateInvoiceOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg shadow-sm"
                >
                  Émettre et notifier le client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
