import React, { useState, useEffect } from 'react';
import {
  Receipt,
  CreditCard,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  Building2,
  Calendar,
  Check,
  Search,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  Plus,
  X,
  FileText,
  DollarSign,
  Smartphone,
  Landmark,
  UserCheck,
} from 'lucide-react';
import { ApiClient } from '../../services/api.js';

interface BillingViewProps {
  currentSubView?: string;
  onNavigateSubView?: (subView: string) => void;
}

interface InvoiceItem {
  id: string;
  invoice_number: string;
  emef_code: string;
  period: string;
  issue_date: string;
  due_date: string;
  description: string;
  amount_ht: number;
  amount_tva: number;
  amount_ttc: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  payment_method?: string;
  payment_date?: string;
  transaction_ref?: string;
  items_breakdown: { label: string; qty: number; unit_price: number; total: number }[];
}

const INITIAL_INVOICES: InvoiceItem[] = [
  {
    id: 'inv_2026_09',
    invoice_number: 'FAC-JMF-2026-09-089',
    emef_code: 'DGI-BJ-20260921-99812-MECeF',
    period: 'Septembre 2026',
    issue_date: '2026-09-01',
    due_date: '2026-09-30',
    description: 'Forfait mensuel Gestion de flotte & Télématique IoT (125 véhicules)',
    amount_ht: 3601695,
    amount_tva: 648305,
    amount_ttc: 4250000,
    status: 'PENDING',
    payment_method: 'Virement bancaire / MoMo Business en attente',
    items_breakdown: [
      { label: 'Abonnement Plateforme SaaS JMF & Passerelle IoT (125 véh.)', qty: 125, unit_price: 15000, total: 1875000 },
      { label: 'Supervision & Maintenance préventive déléguée (Atelier)', qty: 1, unit_price: 1200000, total: 1200000 },
      { label: 'Audit conformité & gestion des visites CNSR (Pack mensuel)', qty: 1, unit_price: 526695, total: 526695 },
    ],
  },
  {
    id: 'inv_2026_08',
    invoice_number: 'FAC-JMF-2026-08-084',
    emef_code: 'DGI-BJ-20260820-88124-MECeF',
    period: 'Août 2026',
    issue_date: '2026-08-01',
    due_date: '2026-08-31',
    description: 'Gestion de flotte, renouvellement assurances NSIA et révisions d’atelier',
    amount_ht: 3372881,
    amount_tva: 607119,
    amount_ttc: 3980000,
    status: 'PAID',
    payment_method: 'Virement BOA Bénin #992481',
    payment_date: '2026-08-28',
    transaction_ref: 'TRX-BOA-20260828-0912',
    items_breakdown: [
      { label: 'Abonnement Plateforme SaaS JMF & Passerelle IoT (125 véh.)', qty: 125, unit_price: 15000, total: 1875000 },
      { label: 'Forfait Révisions d’atelier et filtres parc Cotonou', qty: 1, unit_price: 1100000, total: 1100000 },
      { label: 'Courtage & renouvellement polices d’assurance NSIA', qty: 1, unit_price: 397881, total: 397881 },
    ],
  },
  {
    id: 'inv_2026_07',
    invoice_number: 'FAC-JMF-2026-07-078',
    emef_code: 'DGI-BJ-20260722-77412-MECeF',
    period: 'Juillet 2026',
    issue_date: '2026-07-01',
    due_date: '2026-07-31',
    description: 'Prestations de télématique IoT, cartes carburant et gestion des conducteurs',
    amount_ht: 3491525,
    amount_tva: 628475,
    amount_ttc: 4120000,
    status: 'PAID',
    payment_method: 'Virement BOA Bénin #987102',
    payment_date: '2026-07-29',
    transaction_ref: 'TRX-BOA-20260729-4410',
    items_breakdown: [
      { label: 'Abonnement Plateforme SaaS JMF & Passerelle IoT (125 véh.)', qty: 125, unit_price: 15000, total: 1875000 },
      { label: 'Gestion & conciliation cartes carburant TotalEnergies / Oryx', qty: 1, unit_price: 950000, total: 950000 },
      { label: 'Module Formation Éco-conduite pour 25 chauffeurs', qty: 25, unit_price: 26661, total: 666525 },
    ],
  },
  {
    id: 'inv_2026_06',
    invoice_number: 'FAC-JMF-2026-06-071',
    emef_code: 'DGI-BJ-20260618-66321-MECeF',
    period: 'Juin 2026',
    issue_date: '2026-06-01',
    due_date: '2026-06-30',
    description: 'Gestion technique, visites CNSR et réfection pneumatiques parc Cotonou',
    amount_ht: 3262712,
    amount_tva: 587288,
    amount_ttc: 3850000,
    status: 'PAID',
    payment_method: 'Chèque certifié Ecobank Bénin #0041284',
    payment_date: '2026-06-25',
    transaction_ref: 'CHQ-ECO-20260625-1109',
    items_breakdown: [
      { label: 'Abonnement Plateforme SaaS JMF & Passerelle IoT (125 véh.)', qty: 125, unit_price: 15000, total: 1875000 },
      { label: 'Contrôle technique CNSR et géométrie essieux (20 véh.)', qty: 20, unit_price: 35000, total: 700000 },
      { label: 'Changement pneumatiques Bridgestone 16" & équilibrage', qty: 1, unit_price: 687712, total: 687712 },
    ],
  },
];

export const BillingView: React.FC<BillingViewProps> = ({
  currentSubView = 'billing_invoices',
  onNavigateSubView,
}) => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments'>('invoices');
  const [invoices, setInvoices] = useState<InvoiceItem[]>(INITIAL_INVOICES);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING'>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal Record Payment
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    invoiceId: 'inv_2026_09',
    method: 'Virement bancaire (BOA Bénin)',
    reference: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (currentSubView === 'billing_payments') {
      setActiveTab('payments');
    } else if (currentSubView === 'billing_invoices' || currentSubView?.startsWith('billing')) {
      setActiveTab('invoices');
    }
  }, [currentSubView]);

  // Load backend invoices on mount
  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const remote = await ApiClient.getInvoices();
        if (remote && remote.length > 0) {
          const mappedRemote: InvoiceItem[] = remote.map((r: any) => ({
            id: r.id,
            invoice_number: r.invoice_number,
            emef_code: r.emef_code || 'DGI-BJ-2026-MECeF',
            period: r.period || new Date(r.issue_date || Date.now()).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
            issue_date: r.issue_date || new Date().toISOString().split('T')[0],
            due_date: r.due_date || new Date().toISOString().split('T')[0],
            description: r.description || 'Prestation de gestion & mobilité JMF',
            amount_ht: r.amount_ht || Math.round((r.amount_ttc || 0) / 1.18),
            amount_tva: r.amount_tva || Math.round((r.amount_ttc || 0) - Math.round((r.amount_ttc || 0) / 1.18)),
            amount_ttc: r.amount_ttc || 0,
            status: r.status === 'PAID' ? 'PAID' : (r.status === 'OVERDUE' ? 'OVERDUE' : 'PENDING'),
            payment_method: r.payment_method,
            payment_date: r.payment_date,
            transaction_ref: r.transaction_ref,
            items_breakdown: r.items_breakdown || [
              { label: r.description || 'Prestation de services', qty: 1, unit_price: r.amount_ht || 0, total: r.amount_ht || 0 }
            ],
          }));

          setInvoices((prev) => {
            const existingIds = new Set(prev.map((i) => i.id));
            const fresh = mappedRemote.filter((m) => !existingIds.has(m.id));
            return [...fresh, ...prev];
          });
        }
      } catch (err) {
        console.warn('API invoices fallback used:', err);
      }
    };
    loadInvoices();
  }, []);

  const handleSubTabSwitch = (tab: 'invoices' | 'payments') => {
    setActiveTab(tab);
    if (onNavigateSubView) {
      if (tab === 'payments') onNavigateSubView('billing_payments');
      else onNavigateSubView('billing_invoices');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDownloadInvoice = (inv: InvoiceItem) => {
    // Generate text/csv or simulated PDF receipt file download
    const invoiceContent = `=====================================================
JMF FLEET & MOBILITY SERVICES - BÉNIN
FACTURE NORMALISÉE DGI e-MECeF
N° Facture : ${inv.invoice_number}
Code MECeF : ${inv.emef_code}
Date d'émission : ${inv.issue_date}
Date d'échéance : ${inv.due_date}
Statut : ${inv.status === 'PAID' ? 'PAYÉE' : 'EN ATTENTE'}
-----------------------------------------------------
CLIENT : Société Cliente SARL Bénin
IFU : 0202110293849 • RCCM : RB/COT/21 B 14234
Cotonou, République du Bénin
-----------------------------------------------------
DÉTAIL DES PRESTATIONS :
${inv.items_breakdown.map((item) => `- ${item.label} (x${item.qty}) : ${item.total.toLocaleString('fr-FR')} FCFA`).join('\n')}

MONTANT TOTAL HT  : ${inv.amount_ht.toLocaleString('fr-FR')} FCFA
TVA (18% Bénin)   : ${inv.amount_tva.toLocaleString('fr-FR')} FCFA
TOTAL TTC À PAYER : ${inv.amount_ttc.toLocaleString('fr-FR')} FCFA
-----------------------------------------------------
Règlement : ${inv.payment_method || 'Virement bancaire BOA Bénin'}
${inv.transaction_ref ? `Référence Transaction : ${inv.transaction_ref}` : ''}
Signature électronique & Sceau certifié e-MECeF
=====================================================`;

    const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Facture_${inv.invoice_number}_e-MECeF.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Facture ${inv.invoice_number} (format normalisé e-MECeF) téléchargée avec succès !`);
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentForm.reference) {
      showToast('Veuillez saisir le numéro de référence du virement ou paiement.');
      return;
    }

    try {
      await ApiClient.updateInvoice(paymentForm.invoiceId, {
        status: 'PAID',
        payment_method: paymentForm.method,
        payment_date: paymentForm.date,
        transaction_ref: paymentForm.reference,
      });
    } catch (err) {
      console.warn('API update invoice fallback:', err);
    }

    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === paymentForm.invoiceId) {
          return {
            ...inv,
            status: 'PAID',
            payment_method: paymentForm.method,
            payment_date: paymentForm.date,
            transaction_ref: paymentForm.reference,
          };
        }
        return inv;
      })
    );

    setIsRecordPaymentOpen(false);
    showToast(`Règlement de la facture enregistré avec succès (Réf: ${paymentForm.reference}) !`);
  };

  const handleExportStatement = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['N_Facture,Code_MECeF,Periode,Echeance,Montant_HT,TVA_18,Montant_TTC,Statut,Mode_Reglement,Ref_Transaction']
        .concat(
          invoices.map(
            (i) =>
              `"${i.invoice_number}","${i.emef_code}","${i.period}","${i.due_date}",${i.amount_ht},${i.amount_tva},${i.amount_ttc},"${i.status}","${i.payment_method || ''}","${i.transaction_ref || ''}"`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `releve_facturation_flotte_jmf_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Relevé comptable complet exporté au format CSV !');
  };

  const totalBilled = invoices.reduce((acc, i) => acc + i.amount_ttc, 0);
  const totalPaid = invoices.filter((i) => i.status === 'PAID').reduce((acc, i) => acc + i.amount_ttc, 0);
  const totalPending = invoices.filter((i) => i.status === 'PENDING').reduce((acc, i) => acc + i.amount_ttc, 0);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      inv.description.toLowerCase().includes(search.toLowerCase()) ||
      inv.period.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            <span>Facturation</span>
            <span>&gt;</span>
            <span className="font-semibold text-slate-700">
              {activeTab === 'invoices' ? 'Factures e-MECeF & Abonnements Flotte' : 'Rôles d’Approbation & Modes de Paiements'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-sky-600" />
            <span>
              {activeTab === 'invoices' ? 'Facturation de la Flotte' : 'Rôles Financiers & Moyens de Paiements'}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeTab === 'invoices'
              ? 'Factures normalisées conformes à la Direction Générale des Impôts (DGI e-MECeF Bénin), gestion des forfaits et quittances.'
              : 'Circuits d’approbation comptable, comptes bancaires officiels BOA et passerelles Mobile Money Bénin.'}
          </p>
        </div>

        {/* 2 Sub-tabs matching the sidebar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto">
            <button
              onClick={() => handleSubTabSwitch('invoices')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'invoices'
                  ? 'bg-white text-sky-700 shadow-xs ring-1 ring-sky-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Receipt className="w-3.5 h-3.5 text-sky-600" />
              <span>Factures ({invoices.length})</span>
            </button>
            <button
              onClick={() => handleSubTabSwitch('payments')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'payments'
                  ? 'bg-white text-sky-700 shadow-xs ring-1 ring-sky-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-sky-600" />
              <span>Rôles & Paiements</span>
            </button>
          </div>

          {activeTab === 'invoices' ? (
            <button
              onClick={handleExportStatement}
              className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>Exporter Relevé</span>
            </button>
          ) : (
            <button
              onClick={() => setIsRecordPaymentOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Enregistrer un Règlement</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Facturé (Cumul)</span>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {totalBilled.toLocaleString('fr-FR')} <span className="text-xs text-slate-500">FCFA</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">4 factures d'exploitation 2026</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Factures Réglées</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            {totalPaid.toLocaleString('fr-FR')} <span className="text-xs text-slate-500">FCFA</span>
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 font-medium">3 factures apurées et acquittées</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Échéance en cours</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">
            {totalPending.toLocaleString('fr-FR')} <span className="text-xs text-slate-500">FCFA</span>
          </div>
          <div className="text-[11px] text-amber-700 mt-1 font-medium">Échéance au 30 Septembre 2026</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Conformité Fiscale</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-600 mt-2">100% e-MECeF</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Certification DGI Bénin en règle</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VUE 1 : FACTURES e-MECeF */}
      {/* ========================================================================= */}
      {activeTab === 'invoices' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher par n° de facture, période..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-sky-500 bg-slate-50"
              />
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Toutes ({invoices.length})
              </button>
              <button
                onClick={() => setStatusFilter('PAID')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === 'PAID' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Payées ({invoices.filter((i) => i.status === 'PAID').length})
              </button>
              <button
                onClick={() => setStatusFilter('PENDING')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === 'PENDING' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                En attente ({invoices.filter((i) => i.status === 'PENDING').length})
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Facture & Sceau e-MECeF</th>
                    <th className="py-3 px-4">Période & Prestations</th>
                    <th className="py-3 px-4">Échéance</th>
                    <th className="py-3 px-4">Montant HT</th>
                    <th className="py-3 px-4">Montant TTC</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-900">{inv.invoice_number}</div>
                        <div className="text-[10px] text-sky-700 font-mono mt-0.5">{inv.emef_code}</div>
                        <div className="text-[10px] text-slate-400">Émise le {inv.issue_date}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{inv.period}</div>
                        <div className="text-[11px] text-slate-500 max-w-sm truncate">{inv.description}</div>
                        {inv.payment_date && (
                          <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                            Règlement le {inv.payment_date} ({inv.payment_method})
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-700">{inv.due_date}</td>

                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        {inv.amount_ht.toLocaleString('fr-FR')} FCFA
                      </td>

                      <td className="py-3.5 px-4 font-mono font-black text-slate-900 text-sm">
                        {inv.amount_ttc.toLocaleString('fr-FR')} FCFA
                      </td>

                      <td className="py-3.5 px-4">
                        {inv.status === 'PAID' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <Check className="w-3 h-3 text-emerald-600" />
                            Payée
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            En attente
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer text-[11px]"
                          >
                            Détail
                          </button>
                          <button
                            onClick={() => handleDownloadInvoice(inv)}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold rounded-lg transition-colors cursor-pointer text-[11px]"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>PDF</span>
                          </button>
                        </div>
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
      {/* VUE 2 : RÔLES & PAIEMENTS */}
      {/* ========================================================================= */}
      {activeTab === 'payments' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Modalités & Canaux de Paiements Bénin */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-sky-600" />
                  <h3 className="text-sm font-bold text-slate-900">Coordonnées Bancaires & Télécoms Officielles</h3>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Actif & Vérifié
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {/* Bank Account */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-sky-700" />
                      <span>Bank of Africa (BOA Bénin)</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">Compte Courant Entreprise</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-600 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Titulaire du compte</span>
                      <span className="font-bold text-slate-800">JMF MOBILITY SERVICES SARL</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Code Banque / Guichet</span>
                      <span className="font-mono font-bold text-slate-800">BJ061 / 01001</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 block text-[10px]">Numéro de Compte (RIB)</span>
                      <span className="font-mono font-bold text-sky-900 text-xs">0012 8492 0019 45</span>
                    </div>
                  </div>
                </div>

                {/* Mobile Money */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-amber-600" />
                      <span>MTN Mobile Money Pro (MoMo Business)</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Instantané</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Numéro Marchand Agréé :</span>
                    <span className="font-mono font-bold text-slate-900">+229 01 97 83 21 21</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Code Marchand Rapide :</span>
                    <span className="font-mono font-bold text-slate-900">MOMO-JMF-892</span>
                  </div>
                </div>

                {/* Moov Money Flooz */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-blue-600" />
                      <span>Moov Money Flooz Entreprise</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Instantané</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Numéro Flotte Marchand :</span>
                    <span className="font-mono font-bold text-slate-900">+229 01 95 11 22 33</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rôles d'Approbation & Gouvernance Financière */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-sky-600" />
                  <h3 className="text-sm font-bold text-slate-900">Rôles d'Approbation & Seuil Budgétaire</h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">Contrôle interne</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900">Vérification de Service Fait</div>
                    <div className="text-slate-600 text-[11px]">
                      Attribué à : <span className="font-bold">Marc SOSSOU</span> (Gestionnaire de Flotte)
                    </div>
                    <p className="text-slate-400 text-[10px]">
                      Validation du décompte des kilomètres, des litres de carburant consommés et des interventions d'atelier effectuées.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900">Contrôle Comptable & Rapprochement</div>
                    <div className="text-slate-600 text-[11px]">
                      Attribué à : <span className="font-bold">Awa DIALLO</span> (Comptabilité & Contrôle de gestion)
                    </div>
                    <p className="text-slate-400 text-[10px]">
                      Rapprochement des bons de commande, imputation analytique par centre de coût et émission du bon à payer.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900">Ordonnancement & Signature Bancaire</div>
                    <div className="text-slate-600 text-[11px]">
                      Attribué à : <span className="font-bold">Jean KOUASSI</span> (Directeur Général / Administrateur)
                    </div>
                    <p className="text-slate-400 text-[10px]">
                      Double signature requise pour tout ordre de virement dépassant 2 000 000 FCFA.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 text-xs text-sky-800 flex items-center justify-between">
                <span>Notification automatique par email des factures arrivant à échéance (J-7 et J-3)</span>
                <span className="font-bold text-sky-900">Activée</span>
              </div>
            </div>
          </div>

          {/* Quittances et Reçus Libératoires */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Registre des Règlements & Quittances Libératoires</h3>
              <span className="text-xs text-slate-500">Traçabilité complète</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase">
                  <tr>
                    <th className="py-3 px-4">Date de Paiement</th>
                    <th className="py-3 px-4">Facture Concernée</th>
                    <th className="py-3 px-4">Canal & Référence Transaction</th>
                    <th className="py-3 px-4">Montant Versé</th>
                    <th className="py-3 px-4 text-right">Quittance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono text-slate-700">28/08/2026</td>
                    <td className="py-3 px-4 font-mono font-bold text-sky-900">FAC-JMF-2026-08-084</td>
                    <td className="py-3 px-4 text-slate-700">
                      <div>Virement BOA Bénin</div>
                      <div className="font-mono text-[10px] text-slate-400">TRX-BOA-20260828-0912</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">3 980 000 FCFA</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => showToast('Quittance libératoire Août 2026 téléchargée !')}
                        className="text-sky-600 hover:text-sky-800 font-bold text-xs cursor-pointer"
                      >
                        Télécharger
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono text-slate-700">29/07/2026</td>
                    <td className="py-3 px-4 font-mono font-bold text-sky-900">FAC-JMF-2026-07-078</td>
                    <td className="py-3 px-4 text-slate-700">
                      <div>Virement BOA Bénin</div>
                      <div className="font-mono text-[10px] text-slate-400">TRX-BOA-20260729-4410</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">4 120 000 FCFA</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => showToast('Quittance libératoire Juillet 2026 téléchargée !')}
                        className="text-sky-600 hover:text-sky-800 font-bold text-xs cursor-pointer"
                      >
                        Télécharger
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DÉTAIL FACTURE e-MECeF */}
      {/* ========================================================================= */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-sky-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedInvoice.invoice_number}</h3>
                  <div className="text-[10px] font-mono text-sky-700">{selectedInvoice.emef_code}</div>
                </div>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Émetteur</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">JMF FLEET & MOBILITY SARL</div>
                  <div className="text-slate-500 text-[11px]">Akpakpa, Boulevard du Mono, Cotonou</div>
                  <div className="text-slate-500 text-[11px]">IFU : 3202111894523 • RCCM : RB/COT/20 B 10291</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Client Destinataire</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">Société Cliente SARL Bénin</div>
                  <div className="text-slate-500 text-[11px]">Boulevard de la Marina, Cotonou</div>
                  <div className="text-slate-500 text-[11px]">Période : {selectedInvoice.period}</div>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Désignation</th>
                      <th className="py-2.5 px-3 text-center">Quantité</th>
                      <th className="py-2.5 px-3 text-right">P.U HT</th>
                      <th className="py-2.5 px-3 text-right">Total HT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedInvoice.items_breakdown.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3 font-medium text-slate-800">{item.label}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{item.qty}</td>
                        <td className="py-2.5 px-3 text-right font-mono">{item.unit_price.toLocaleString('fr-FR')} FCFA</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          {item.total.toLocaleString('fr-FR')} FCFA
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Breakdown */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Montant Total Hors Taxes (HT) :</span>
                  <span className="font-mono font-bold">{selectedInvoice.amount_ht.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>TVA République du Bénin (18%) :</span>
                  <span className="font-mono font-bold">{selectedInvoice.amount_tva.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-200">
                  <span>Total Toutes Taxes Comprises (TTC) :</span>
                  <span className="font-mono text-sky-800">{selectedInvoice.amount_ttc.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2">
                <div>
                  Statut : <span className="font-bold text-slate-800">{selectedInvoice.status === 'PAID' ? 'Facture Acquittée' : 'Facture en Attente de Règlement'}</span>
                </div>
                <button
                  onClick={() => handleDownloadInvoice(selectedInvoice)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger Facture PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ENREGISTRER RÈGLEMENT */}
      {/* ========================================================================= */}
      {isRecordPaymentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span>Enregistrer un Règlement de Facture</span>
              </h3>
              <button onClick={() => setIsRecordPaymentOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmPayment} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Sélectionner la facture</label>
                <select
                  value={paymentForm.invoiceId}
                  onChange={(e) => setPaymentForm({ ...paymentForm, invoiceId: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 font-medium"
                >
                  {invoices.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.invoice_number} ({i.period}) - {i.amount_ttc.toLocaleString('fr-FR')} FCFA ({i.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Moyen de paiement utilisé</label>
                <select
                  value={paymentForm.method}
                  onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 font-medium"
                >
                  <option value="Virement bancaire (BOA Bénin)">Virement bancaire (BOA Bénin)</option>
                  <option value="MTN Mobile Money Business">MTN Mobile Money Business</option>
                  <option value="Moov Money Flooz Pro">Moov Money Flooz Pro</option>
                  <option value="Chèque certifié de banque">Chèque certifié de banque</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Référence du virement / transaction</label>
                <input
                  type="text"
                  required
                  placeholder="ex: TRX-BOA-20260921-9988 ou N° Chèque"
                  value={paymentForm.reference}
                  onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Date d'exécution de l'ordre</label>
                <input
                  type="date"
                  required
                  value={paymentForm.date}
                  onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecordPaymentOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm cursor-pointer"
                >
                  Valider et Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
