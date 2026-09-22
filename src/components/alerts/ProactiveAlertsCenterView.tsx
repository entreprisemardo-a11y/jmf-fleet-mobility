import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Send,
  MessageSquare,
  Smartphone,
  Mail,
  Copy,
  Check,
  Calendar,
  Car,
  User,
  Wrench,
  FileText,
  Filter,
  Search,
  ExternalLink,
  Flame,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  X,
} from 'lucide-react';

export interface FleetAlert {
  id: string;
  category: 'CNSR' | 'INSURANCE' | 'DRIVER_LICENSE' | 'MAINTENANCE' | 'SAFETY_GEAR';
  title: string;
  severity: 'CRITICAL' | 'WARNING' | 'RESOLVED';
  vehicleReg: string;
  vehicleModel: string;
  driverName: string;
  driverPhone: string;
  driverEmail: string;
  expiryDate: string;
  daysRemaining: number;
  documentRef?: string;
  description: string;
  status: 'PENDING_ACTION' | 'RELANCE_SENT' | 'APPOINTMENT_SCHEDULED' | 'RENEWED';
  actionNote?: string;
}

const INITIAL_ALERTS: FleetAlert[] = [
  {
    id: 'alt_1',
    category: 'CNSR',
    title: 'Visite Technique CNSR expirée',
    severity: 'CRITICAL',
    vehicleReg: 'BJ-3456-IJ',
    vehicleModel: 'Iveco Daily Frigo 3.5T',
    driverName: 'Koffi AMAN',
    driverPhone: '+229 96 23 45 67',
    driverEmail: 'koffi.aman@societe-cliente.com',
    expiryDate: '2026-09-18',
    daysRemaining: -3,
    documentRef: 'CNSR-COT-2025-3891',
    description: 'Le certificat de visite technique a expiré il y a 3 jours. Risque de mise en fourrière par la Police Républicaine.',
    status: 'PENDING_ACTION',
  },
  {
    id: 'alt_2',
    category: 'INSURANCE',
    title: 'Police Assurance NSIA arrive à échéance',
    severity: 'WARNING',
    vehicleReg: 'BJ-1234-CD',
    vehicleModel: 'Peugeot 3008 Allure',
    driverName: 'Marc AGBO',
    driverPhone: '+229 95 34 56 78',
    driverEmail: 'marc.agbo@societe-cliente.com',
    expiryDate: '2026-09-28',
    daysRemaining: 7,
    documentRef: 'POL-NSIA-2025-089',
    description: 'Échéance annuelle de la police Tous Risques NSIA Bénin dans 7 jours.',
    status: 'PENDING_ACTION',
  },
  {
    id: 'alt_3',
    category: 'CNSR',
    title: 'Contrôle Technique CNSR à renouveler',
    severity: 'WARNING',
    vehicleReg: 'BJ-9012-GH',
    vehicleModel: 'Toyota Hilux 4x4 Double Cabine',
    driverName: 'Pierre DOSSOU',
    driverPhone: '+229 97 12 34 56',
    driverEmail: 'pierre.dossou@societe-cliente.com',
    expiryDate: '2026-09-30',
    daysRemaining: 9,
    documentRef: 'CNSR-COT-2025-4412',
    description: 'Contrôle semestriel de sécurité routière obligatoire pour les véhicules de société circulant interurbain.',
    status: 'RELANCE_SENT',
    actionNote: 'Relance WhatsApp transmise le 20/09. RDV au centre d’Akpakpa en attente de confirmation.',
  },
  {
    id: 'alt_4',
    category: 'DRIVER_LICENSE',
    title: 'Visite médicale d’aptitude ANaTT requise',
    severity: 'WARNING',
    vehicleReg: 'BJ-5678-EF',
    vehicleModel: 'Renault Master Fourgon',
    driverName: 'Saliou BIO',
    driverPhone: '+229 94 45 67 89',
    driverEmail: 'saliou.bio@societe-cliente.com',
    expiryDate: '2026-10-05',
    daysRemaining: 14,
    documentRef: 'MED-ANATT-2024-118',
    description: 'Certificat médical d’aptitude à la conduite pour catégorie C (poids lourd) à renouveler.',
    status: 'PENDING_ACTION',
  },
  {
    id: 'alt_5',
    category: 'MAINTENANCE',
    title: 'Dépassement du kilométrage de vidange moteur',
    severity: 'CRITICAL',
    vehicleReg: 'BJ-7890-KL',
    vehicleModel: 'Hyundai Santa Fe Premium',
    driverName: 'Jean KOUASSI',
    driverPhone: '+229 97 00 11 22',
    driverEmail: 'jean.kouassi@societe-cliente.com',
    expiryDate: '2026-09-20',
    daysRemaining: -1,
    description: 'Compteur actuel : 42 100 km (échéance vidange Total Quartz 9000 prévue à 40 000 km). Risque d’usure prématurée.',
    status: 'APPOINTMENT_SCHEDULED',
    actionNote: 'Rendez-vous fixé à l’Atelier Central Akpakpa le 22/09 à 09h00.',
  },
  {
    id: 'alt_6',
    category: 'SAFETY_GEAR',
    title: 'Vérification et pesée extincteur de bord',
    severity: 'WARNING',
    vehicleReg: 'BJ-2345-AB',
    vehicleModel: 'Toyota HiAce Minibus 15 places',
    driverName: 'Koffi AMAN',
    driverPhone: '+229 96 23 45 67',
    driverEmail: 'koffi.aman@societe-cliente.com',
    expiryDate: '2026-10-12',
    daysRemaining: 21,
    description: 'Recharge annuelle de l’extincteur poudre ABC 2kg prescrite par les normes de transport de personnes.',
    status: 'PENDING_ACTION',
  },
];

export const ProactiveAlertsCenterView: React.FC = () => {
  const [alerts, setAlerts] = useState<FleetAlert[]>(INITIAL_ALERTS);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal WhatsApp / SMS message preview
  const [selectedAlertForMessage, setSelectedAlertForMessage] = useState<FleetAlert | null>(null);
  const [messageChannel, setMessageChannel] = useState<'WHATSAPP' | 'SMS' | 'EMAIL'>('WHATSAPP');
  const [customMessageText, setCustomMessageText] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Modal Update action note
  const [selectedAlertForNote, setSelectedAlertForNote] = useState<FleetAlert | null>(null);
  const [actionNoteInput, setActionNoteInput] = useState<string>('');
  const [actionStatusInput, setActionStatusInput] = useState<FleetAlert['status']>('APPOINTMENT_SCHEDULED');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const generateDefaultMessage = (alert: FleetAlert, channel: 'WHATSAPP' | 'SMS' | 'EMAIL') => {
    const isPast = alert.daysRemaining < 0;
    const deadlineText = isPast
      ? `A EXPIRÉ le ${alert.expiryDate} (il y a ${Math.abs(alert.daysRemaining)} jours)`
      : `arrive à échéance le ${alert.expiryDate} (dans ${alert.daysRemaining} jours)`;

    if (channel === 'WHATSAPP') {
      return (
        `*NOTIFICATION OFFICIELLE JMF FLEET & MOBILITY*\n\n` +
        `Bonjour *${alert.driverName}*,\n\n` +
        `Nous vous informons que le document suivant pour votre véhicule assigné (*${alert.vehicleReg}* - ${alert.vehicleModel}) nécessite votre action immédiate :\n\n` +
        `📌 *Objet :* ${alert.title}\n` +
        `⏳ *Échéance :* ${deadlineText}\n` +
        `📋 *Réf :* ${alert.documentRef || 'N/A'}\n\n` +
        `⚠️ *Consigne obligatoire :* ${isPast ? 'Le véhicule ne doit pas circuler sans régularisation immédiate pour éviter toute mise en fourrière routière.' : 'Merci de vous rapprocher de la coordination logistique pour valider le créneau de renouvellement.'}\n\n` +
        `_JMF Mobility Services • Cotonou, Bénin_`
      );
    } else if (channel === 'SMS') {
      return `JMF FLOTTE: Bonjour ${alert.driverName}. Urgence: ${alert.title} sur ${alert.vehicleReg} (${deadlineText}). Merci de contacter la logistique au +229 97000000.`;
    } else {
      return (
        `Bonjour ${alert.driverName},\n\n` +
        `Dans le cadre du suivi de conformité réglementaire de la flotte, nous constatons que pour votre véhicule ${alert.vehicleReg} (${alert.vehicleModel}), la pièce suivante nécessite votre intervention :\n\n` +
        `- Objet : ${alert.title}\n` +
        `- Date d'échéance : ${alert.expiryDate}\n` +
        `- Référence : ${alert.documentRef || 'N/A'}\n\n` +
        `Merci de prendre les dispositions requises ou de nous indiquer la date de passage retenue.\n\n` +
        `Cordialement,\n` +
        `La Gestion de Flotte • JMF Mobility Services`
      );
    }
  };

  const handleOpenMessageModal = (alert: FleetAlert, channel: 'WHATSAPP' | 'SMS' | 'EMAIL') => {
    setSelectedAlertForMessage(alert);
    setMessageChannel(channel);
    setCustomMessageText(generateDefaultMessage(alert, channel));
    setIsCopied(false);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(customMessageText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
    showToast('Message copié dans le presse-papier !');
  };

  const handleSendViaWhatsApp = () => {
    if (!selectedAlertForMessage) return;
    // Format phone: remove spaces and non-digits
    const cleanPhone = selectedAlertForMessage.driverPhone.replace(/[^0-9]/g, '');
    const encodedText = encodeURIComponent(customMessageText);
    const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
    window.open(url, '_blank');

    // Mark as relance sent
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === selectedAlertForMessage.id
          ? { ...a, status: 'RELANCE_SENT', actionNote: `Relance WhatsApp envoyée le ${new Date().toLocaleDateString('fr-FR')}` }
          : a
      )
    );

    setSelectedAlertForMessage(null);
    showToast(`Relance WhatsApp envoyée à ${selectedAlertForMessage.driverName} !`);
  };

  const handleSendViaSms = () => {
    if (!selectedAlertForMessage) return;
    const cleanPhone = selectedAlertForMessage.driverPhone.replace(/[^0-9]/g, '');
    const encodedText = encodeURIComponent(customMessageText);
    window.open(`sms:+${cleanPhone}?body=${encodedText}`, '_self');

    setAlerts((prev) =>
      prev.map((a) =>
        a.id === selectedAlertForMessage.id
          ? { ...a, status: 'RELANCE_SENT', actionNote: `SMS transmis le ${new Date().toLocaleDateString('fr-FR')}` }
          : a
      )
    );

    setSelectedAlertForMessage(null);
    showToast(`SMS transmis à ${selectedAlertForMessage.driverName} !`);
  };

  const handleSendViaEmail = () => {
    if (!selectedAlertForMessage) return;
    const subject = encodeURIComponent(`URGENT: ${selectedAlertForMessage.title} - ${selectedAlertForMessage.vehicleReg}`);
    const body = encodeURIComponent(customMessageText);
    window.open(`mailto:${selectedAlertForMessage.driverEmail}?subject=${subject}&body=${body}`, '_self');

    setSelectedAlertForMessage(null);
    showToast(`Client email ouvert pour ${selectedAlertForMessage.driverEmail}`);
  };

  const handleSaveActionNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlertForNote) return;

    setAlerts((prev) =>
      prev.map((a) =>
        a.id === selectedAlertForNote.id
          ? {
              ...a,
              status: actionStatusInput,
              actionNote: actionNoteInput,
            }
          : a
      )
    );

    setSelectedAlertForNote(null);
    showToast('Plan d’action enregistré avec succès !');
  };

  const handleMarkRenewed = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status: 'RENEWED',
              severity: 'RESOLVED',
              actionNote: `Document renouvelé avec succès le ${new Date().toLocaleDateString('fr-FR')}. Validité reconduite d'un an.`,
            }
          : a
      )
    );
    showToast('Document validé et marqué comme renouvelé !');
  };

  // Filtered
  const filteredAlerts = alerts.filter((a) => {
    const matchesCategory = categoryFilter === 'ALL' || a.category === categoryFilter;
    const matchesSeverity =
      severityFilter === 'ALL' ||
      (severityFilter === 'CRITICAL' && a.daysRemaining <= 0) ||
      (severityFilter === 'WARNING_7' && a.daysRemaining > 0 && a.daysRemaining <= 7) ||
      (severityFilter === 'WARNING_15' && a.daysRemaining > 7 && a.daysRemaining <= 15) ||
      (severityFilter === 'RESOLVED' && a.status === 'RENEWED');

    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.vehicleReg.toLowerCase().includes(search.toLowerCase()) ||
      a.driverName.toLowerCase().includes(search.toLowerCase()) ||
      (a.documentRef && a.documentRef.toLowerCase().includes(search.toLowerCase()));

    return matchesCategory && matchesSeverity && matchesSearch;
  });

  const criticalCount = alerts.filter((a) => a.daysRemaining <= 0 && a.status !== 'RENEWED').length;
  const warning7Count = alerts.filter((a) => a.daysRemaining > 0 && a.daysRemaining <= 7 && a.status !== 'RENEWED').length;
  const warning15Count = alerts.filter((a) => a.daysRemaining > 7 && a.daysRemaining <= 15 && a.status !== 'RENEWED').length;
  const renewedCount = alerts.filter((a) => a.status === 'RENEWED').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1680px] mx-auto">
      {/* Toast Notification */}
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
            <span>Conformité & Sécurité</span>
            <span>&gt;</span>
            <span className="font-semibold text-slate-700">Centre d’Alertes & Relances</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
            <span>Centre d'Alertes Proactives & Relances (WhatsApp / SMS)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Surveillance continue des échéances CNSR, assurances NSIA, permis de conduire ANaTT et relances automatisées aux chauffeurs
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Conformité Flotte : <strong>91.8%</strong></span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs bg-gradient-to-br from-white to-rose-50/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800">Échéances dépassées</span>
            <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-700 mt-2">{criticalCount}</div>
          <div className="text-[11px] text-rose-600 mt-1 font-semibold">Circulation interdite sans régularisation</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs bg-gradient-to-br from-white to-amber-50/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800">Urgences à 7 jours</span>
            <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-700 mt-2">{warning7Count}</div>
          <div className="text-[11px] text-amber-600 mt-1 font-semibold">Relances immédiates requises</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Échéances à 15 jours</span>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{warning15Count}</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Anticipation des plannings d’atelier</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Traités & Renouvelés</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-2">{renewedCount}</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">Dossiers conformes et archivés</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par véhicule, chauffeur, n° attestation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Severity selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setSeverityFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                severityFilter === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Toutes ({alerts.length})
            </button>
            <button
              onClick={() => setSeverityFilter('CRITICAL')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                severityFilter === 'CRITICAL' ? 'bg-rose-600 text-white' : 'text-rose-700 bg-rose-50 hover:bg-rose-100'
              }`}
            >
              Expirées ({criticalCount})
            </button>
            <button
              onClick={() => setSeverityFilter('WARNING_7')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                severityFilter === 'WARNING_7' ? 'bg-amber-600 text-white' : 'text-amber-700 bg-amber-50 hover:bg-amber-100'
              }`}
            >
              J-7 ({warning7Count})
            </button>
            <button
              onClick={() => setSeverityFilter('WARNING_15')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                severityFilter === 'WARNING_15' ? 'bg-indigo-600 text-white' : 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100'
              }`}
            >
              J-15 ({warning15Count})
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Catégorie :</span>
          {[
            { id: 'ALL', label: 'Toutes les catégories' },
            { id: 'CNSR', label: '🛡️ Visites CNSR' },
            { id: 'INSURANCE', label: '📄 Assurances NSIA' },
            { id: 'DRIVER_LICENSE', label: '🪪 Permis & Aptitude ANaTT' },
            { id: 'MAINTENANCE', label: '🔧 Vidanges & Révisions' },
            { id: 'SAFETY_GEAR', label: '🧯 Équipements de bord' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-sky-600 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-3.5">
        {filteredAlerts.map((alert) => {
          const isExpired = alert.daysRemaining <= 0 && alert.status !== 'RENEWED';
          const isUrgent = alert.daysRemaining > 0 && alert.daysRemaining <= 7 && alert.status !== 'RENEWED';
          const isRenewed = alert.status === 'RENEWED';

          return (
            <div
              key={alert.id}
              className={`bg-white rounded-xl border p-4 sm:p-5 shadow-xs transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                isExpired
                  ? 'border-rose-300 bg-rose-50/20'
                  : isUrgent
                  ? 'border-amber-300 bg-amber-50/20'
                  : isRenewed
                  ? 'border-emerald-200 bg-emerald-50/10 opacity-80'
                  : 'border-slate-200'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isExpired
                        ? 'bg-rose-100 text-rose-800'
                        : isUrgent
                        ? 'bg-amber-100 text-amber-800'
                        : isRenewed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-sky-100 text-sky-800'
                    }`}
                  >
                    {isExpired
                      ? `EXPIRÉ (J-${Math.abs(alert.daysRemaining)})`
                      : isUrgent
                      ? `EXPIRE DANS ${alert.daysRemaining} JOURS`
                      : isRenewed
                      ? 'CONFORME & RENOUVELÉ'
                      : `ÉCHÉANCE J-${alert.daysRemaining}`}
                  </span>

                  <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono">
                    {alert.category}
                  </span>

                  {alert.documentRef && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      Réf: {alert.documentRef}
                    </span>
                  )}
                </div>

                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-bold text-slate-900">{alert.title}</h3>
                  <span className="text-xs font-mono font-bold text-slate-600 shrink-0 ml-2">
                    Date limite : {alert.expiryDate}
                  </span>
                </div>

                <p className="text-xs text-slate-600">{alert.description}</p>

                {/* Vehicle & Driver details */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-700 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>{alert.vehicleModel}</span>
                    <strong className="font-mono text-sky-800 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-100">
                      {alert.vehicleReg}
                    </strong>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{alert.driverName}</span>
                    <span className="text-slate-400 font-mono text-[11px]">({alert.driverPhone})</span>
                  </div>
                </div>

                {/* Action note if any */}
                {alert.actionNote && (
                  <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-600 border border-slate-200/80 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Suivi d'intervention :</strong> {alert.actionNote}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                {!isRenewed ? (
                  <>
                    <button
                      onClick={() => handleOpenMessageModal(alert, 'WHATSAPP')}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                      title="Ouvrir WhatsApp avec message officiel pré-rédigé"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>

                    <button
                      onClick={() => handleOpenMessageModal(alert, 'SMS')}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      title="Envoyer un SMS au chauffeur"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-slate-600" />
                      <span>SMS</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedAlertForNote(alert);
                        setActionNoteInput(alert.actionNote || '');
                        setActionStatusInput(alert.status);
                      }}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      title="Planifier un rendez-vous ou noter une action"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Planifier RDV</span>
                    </button>

                    <button
                      onClick={() => handleMarkRenewed(alert.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg transition-colors border border-emerald-200 cursor-pointer"
                      title="Marquer comme renouvelé (document reçu)"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Renouvelé</span>
                    </button>
                  </>
                ) : (
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Dossier clos</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal 1: Relance WhatsApp / SMS / Email Composer */}
      {selectedAlertForMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full my-6 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                {messageChannel === 'WHATSAPP' && <MessageSquare className="w-5 h-5 text-emerald-600" />}
                {messageChannel === 'SMS' && <Smartphone className="w-5 h-5 text-sky-600" />}
                {messageChannel === 'EMAIL' && <Mail className="w-5 h-5 text-indigo-600" />}
                <h3 className="text-base font-bold text-slate-900">
                  Relance Officielle {messageChannel === 'WHATSAPP' ? 'WhatsApp' : messageChannel === 'SMS' ? 'SMS' : 'Email'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAlertForMessage(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recipient Details */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-500">Destinataire :</span>{' '}
                <strong className="text-slate-900">{selectedAlertForMessage.driverName}</strong>
              </div>
              <div className="font-mono text-sky-700 font-bold">
                {selectedAlertForMessage.driverPhone}
              </div>
            </div>

            {/* Message Channel Switcher */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setMessageChannel('WHATSAPP');
                  setCustomMessageText(generateDefaultMessage(selectedAlertForMessage, 'WHATSAPP'));
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                  messageChannel === 'WHATSAPP'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                WhatsApp Direct
              </button>
              <button
                type="button"
                onClick={() => {
                  setMessageChannel('SMS');
                  setCustomMessageText(generateDefaultMessage(selectedAlertForMessage, 'SMS'));
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                  messageChannel === 'SMS'
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                SMS
              </button>
              <button
                type="button"
                onClick={() => {
                  setMessageChannel('EMAIL');
                  setCustomMessageText(generateDefaultMessage(selectedAlertForMessage, 'EMAIL'));
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                  messageChannel === 'EMAIL'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Courrier Email
              </button>
            </div>

            {/* Editable Message Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contenu du message officiel (modifiable) :
              </label>
              <textarea
                rows={9}
                value={customMessageText}
                onChange={(e) => setCustomMessageText(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl text-xs font-sans text-slate-800 focus:border-sky-500 focus:outline-none"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCopyText}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Texte copié !' : 'Copier texte'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAlertForMessage(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Fermer
                </button>

                {messageChannel === 'WHATSAPP' && (
                  <button
                    type="button"
                    onClick={handleSendViaWhatsApp}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Ouvrir WhatsApp</span>
                  </button>
                )}

                {messageChannel === 'SMS' && (
                  <button
                    type="button"
                    onClick={handleSendViaSms}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm cursor-pointer"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Envoyer SMS</span>
                  </button>
                )}

                {messageChannel === 'EMAIL' && (
                  <button
                    type="button"
                    onClick={handleSendViaEmail}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Ouvrir Email</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Planifier RDV / Noter action */}
      {selectedAlertForNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <span>Enregistrer un Rendez-vous / Action</span>
              </h3>
              <button
                onClick={() => setSelectedAlertForNote(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveActionNote} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900">{selectedAlertForNote.title}</div>
                <div className="text-slate-600">
                  {selectedAlertForNote.vehicleModel} ({selectedAlertForNote.vehicleReg})
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Nouveau statut du dossier</label>
                <select
                  value={actionStatusInput}
                  onChange={(e) => setActionStatusInput(e.target.value as FleetAlert['status'])}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                >
                  <option value="APPOINTMENT_SCHEDULED">Rendez-vous pris au centre / atelier</option>
                  <option value="RELANCE_SENT">Relance effectuée auprès du chauffeur</option>
                  <option value="PENDING_ACTION">En attente d'arbitrage</option>
                  <option value="RENEWED">Renouvelé et clôturé</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Note de suivi / Détails du rendez-vous</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ex: Rendez-vous pris à la station CNSR Akpakpa le 24/09 à 08h30 avec le chauffeur."
                  value={actionNoteInput}
                  onChange={(e) => setActionNoteInput(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedAlertForNote(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Enregistrer l'action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
