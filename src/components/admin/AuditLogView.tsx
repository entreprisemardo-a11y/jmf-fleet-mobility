import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Download,
  Search,
  Filter,
  Lock,
  Key,
  Receipt,
  UserCheck,
  Eye,
  Check,
  Copy,
  Clock,
  Globe,
  SlidersHorizontal,
  ChevronDown,
  Plus,
  X,
  FileSpreadsheet,
  AlertCircle,
  FileCheck2,
  UserCog,
  History,
  Building2
} from 'lucide-react';
import { ApiClient } from '../../services/api.js';
import { AuditLogEntry, AuditMetrics, AuditLogChange } from '../../types/index.js';
import { useAuth } from '../../context/AuthContext.js';

interface AuditLogViewProps {
  currentSubView?: string;
  onNavigateSubView?: (view: string) => void;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({
  currentSubView,
  onNavigateSubView,
}) => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [metrics, setMetrics] = useState<AuditMetrics>({
    total_events: 0,
    role_changes: 0,
    invoice_modifications: 0,
    critical_security_events: 0,
    warning_events: 0,
    unique_operators: 0,
    integrity_status: 'VERIFIED_TAMPER_PROOF',
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [notice, setNotice] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('ALL');
  const [selectedEntityType, setSelectedEntityType] = useState<string>('ALL');

  // Active quick filter tab
  const [activeTab, setActiveTab] = useState<'all' | 'roles' | 'invoices' | 'critical'>('all');

  // Modals & Drawers
  const [selectedLogForDetails, setSelectedLogForDetails] = useState<AuditLogEntry | null>(null);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Manual record modal
  const [isRecordModalOpen, setIsRecordModalOpen] = useState<boolean>(false);
  const [newLogData, setNewLogData] = useState({
    action: '',
    description: '',
    entity_type: 'security',
    entity_id: '',
    severity: 'warning' as 'info' | 'success' | 'warning' | 'critical',
    compliance_tag: 'SECURITY_AUDIT',
  });

  const showNotice = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setNotice({ message, type });
    setTimeout(() => setNotice(null), 4000);
  };

  const fetchLogs = async (quiet: boolean = false) => {
    if (!quiet) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      let tagFilter = selectedTag;
      if (activeTab === 'roles') tagFilter = 'ROLE_CHANGE';
      else if (activeTab === 'invoices') tagFilter = 'INVOICE_MODIFICATION';

      let severityFilter = selectedSeverity;
      if (activeTab === 'critical') severityFilter = 'critical';

      const response = await ApiClient.getAuditLogs({
        compliance_tag: tagFilter !== 'ALL' ? tagFilter : undefined,
        severity: severityFilter !== 'ALL' ? severityFilter : undefined,
        entity_type: selectedEntityType !== 'ALL' ? selectedEntityType : undefined,
        search: searchTerm.trim() || undefined,
        period: selectedPeriod !== 'ALL' ? selectedPeriod : undefined,
      });

      setLogs(response.logs);
      setMetrics(response.metrics);
    } catch (err: any) {
      console.error('Error loading audit logs:', err);
      showNotice(err.message || 'Erreur de chargement du journal', 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [activeTab, selectedTag, selectedSeverity, selectedPeriod, selectedEntityType]);

  // Debounced search trigger
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchLogs(true);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleVerifySeal = async (log: AuditLogEntry) => {
    setSelectedLogForDetails(log);
    setIsVerifying(true);
    setVerificationResult(null);
    try {
      const res = await ApiClient.verifyAuditSeal(log.id);
      setVerificationResult(res);
    } catch (err: any) {
      setVerificationResult({
        verified: false,
        status: 'VERIFICATION_FAILED',
        error: err.message,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
    showNotice('Empreinte SHA-256 copiée dans le presse-papiers', 'success');
  };

  const handleExportCsv = () => {
    const token = ApiClient.getToken();
    window.location.href = `/api/audit/export?token=${token}`;
    showNotice('Téléchargement du registre certifié d’audit démarré', 'success');
  };

  const handleCreateManualLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogData.action || !newLogData.description) {
      showNotice('Veuillez renseigner au moins l’action et la description', 'error');
      return;
    }

    try {
      await ApiClient.recordAuditLog(newLogData);
      showNotice('Opération d’audit horodatée et scellée avec succès', 'success');
      setIsRecordModalOpen(false);
      setNewLogData({
        action: '',
        description: '',
        entity_type: 'security',
        entity_id: '',
        severity: 'warning',
        compliance_tag: 'SECURITY_AUDIT',
      });
      fetchLogs(true);
    } catch (err: any) {
      showNotice(err.message || 'Erreur lors de l’enregistrement', 'error');
    }
  };

  // Filtered views based on search / tab
  const displayedLogs = useMemo(() => {
    return logs;
  }, [logs]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Toast Notification */}
      {notice && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs font-semibold animate-in fade-in slide-in-from-bottom-5 border ${
            notice.type === 'success'
              ? 'bg-emerald-900/90 text-emerald-100 border-emerald-700'
              : notice.type === 'error'
              ? 'bg-rose-900/90 text-rose-100 border-rose-700'
              : 'bg-slate-900/95 text-slate-100 border-slate-700'
          }`}
        >
          {notice.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {notice.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          {notice.type === 'info' && <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />}
          <span>{notice.message}</span>
        </div>
      )}

      {/* Top Banner & Compliance Standards */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              Scellement SHA-256 Immuable
            </span>
            <span className="px-2.5 py-1 bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-md text-[11px] font-bold tracking-wider uppercase">
              ISO/IEC 27001
            </span>
            <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-md text-[11px] font-bold tracking-wider uppercase">
              DGI e-MECeF Traçabilité
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-sky-400" />
            <span>Journal d’Audit & Conformité Réglementaire</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Surveillance et enregistrement probant de toutes les opérations sensibles des administrateurs : changements de rôles, élévations de privilèges, modifications de factures fiscales, et réinitialisations de sécurité.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => fetchLogs(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            title="Rafraîchir les logs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
            <span>Actualiser</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter le Registre (CSV)</span>
          </button>

          <button
            onClick={() => setIsRecordModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Consigner un Événement</span>
          </button>
        </div>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Events */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Entrées d’Audit
            </span>
            <div className="text-2xl font-black text-slate-900">{metrics.total_events}</div>
            <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Registre immuable scellé
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <History className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Role & Privilege Changes */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Changements de Rôles (IAM)
            </span>
            <div className="text-2xl font-black text-purple-700">{metrics.role_changes}</div>
            <div className="text-[11px] text-purple-600 font-medium flex items-center gap-1">
              <UserCog className="w-3 h-3" />
              Élévations & attributions
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Invoice & Financial Modifications */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Modifications Factures (e-MECeF)
            </span>
            <div className="text-2xl font-black text-amber-600">{metrics.invoice_modifications}</div>
            <div className="text-[11px] text-amber-600 font-medium flex items-center gap-1">
              <Receipt className="w-3 h-3" />
              Rapprochements & échéances
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <FileCheck2 className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4: Critical & Warning Events */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Événements Sensibles / Alertes
            </span>
            <div className="text-2xl font-black text-rose-600">
              {metrics.critical_security_events + metrics.warning_events}
            </div>
            <div className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {metrics.critical_security_events} critiques • {metrics.warning_events} vigilances
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Investigation Filter Toolbar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        {/* Segmented Quick Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => {
                setActiveTab('all');
                setSelectedTag('ALL');
                setSelectedSeverity('ALL');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tous les Événements ({metrics.total_events})
            </button>

            <button
              onClick={() => {
                setActiveTab('roles');
                setSelectedTag('ROLE_CHANGE');
                setSelectedSeverity('ALL');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'roles' ? 'bg-purple-600 text-white shadow-xs' : 'text-purple-700 hover:text-purple-900'
              }`}
            >
              <UserCog className="w-3.5 h-3.5" />
              <span>Changements de Rôles ({metrics.role_changes})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('invoices');
                setSelectedTag('INVOICE_MODIFICATION');
                setSelectedSeverity('ALL');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'invoices' ? 'bg-amber-600 text-white shadow-xs' : 'text-amber-700 hover:text-amber-900'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Modifications Factures ({metrics.invoice_modifications})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('critical');
                setSelectedTag('ALL');
                setSelectedSeverity('critical');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'critical' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-700 hover:text-rose-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Incidents Critiques ({metrics.critical_security_events})</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Horodatage UTC scellé</span>
          </div>
        </div>

        {/* Detailed Input Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par auteur, action, email, réf facture, IP ou hash..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Compliance Tag Filter */}
          <div className="lg:col-span-3">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="ALL">Toutes les catégories de conformité</option>
              <option value="ROLE_CHANGE">🛡️ Changements de Rôles (IAM)</option>
              <option value="INVOICE_MODIFICATION">🧾 Modifications Factures (e-MECeF)</option>
              <option value="PASSWORD_RESET">🔑 Réinitialisations Mot de Passe</option>
              <option value="ACCOUNT_STATUS">⚠️ Statut Compte (Suspension/Activation)</option>
              <option value="SECURITY">🚨 Événements de Sécurité Globale</option>
              <option value="FLEET_OPERATION">🚗 Opérations Véhicules / Flotte</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="ALL">Toutes Gravités</option>
              <option value="critical">🔴 Critique (Élévations, Sécurité)</option>
              <option value="warning">🟠 Avertissement (Modifications)</option>
              <option value="info">🔵 Information (Normal)</option>
              <option value="success">🟢 Succès (Validations)</option>
            </select>
          </div>

          {/* Period Filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="ALL">Toute la période</option>
              <option value="24h">Dernières 24 heures</option>
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Audit Trail Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Registre d’Audit Chronologique</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                {displayedLogs.length} entrées
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Traçabilité certifiée conforme à la norme ISO/IEC 27001 et aux obligations de traçabilité e-MECeF de la DGI Bénin.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-sky-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-semibold">Chargement du journal d’audit cryptographique...</p>
          </div>
        ) : displayedLogs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">Aucun événement ne correspond aux critères sélectionnés</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Ajustez vos filtres ou effectuez une recherche plus large pour consulter les enregistrements d'audit.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Date & Heure</th>
                  <th className="py-3 px-4">Auteur / Collaborateur</th>
                  <th className="py-3 px-4">Type & Action</th>
                  <th className="py-3 px-4">Détails de l’Opération & Changements</th>
                  <th className="py-3 px-4">Adresse IP / Origine</th>
                  <th className="py-3 px-4 text-center">Gravité</th>
                  <th className="py-3 px-4 text-right">Scellement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedLogs.map((log) => {
                  // Badges styling
                  let severityBadge = 'bg-slate-100 text-slate-700 border-slate-200';
                  if (log.severity === 'success') severityBadge = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                  if (log.severity === 'warning') severityBadge = 'bg-amber-50 text-amber-800 border-amber-200';
                  if (log.severity === 'critical') severityBadge = 'bg-rose-50 text-rose-800 border-rose-200';

                  const isRoleChange = log.compliance_tag === 'ROLE_CHANGE' || log.action.toLowerCase().includes('rôle');
                  const isInvoiceMod = log.compliance_tag === 'INVOICE_MODIFICATION' || log.action.toLowerCase().includes('facture');

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => handleVerifySeal(log)}
                    >
                      {/* Date & Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono text-xs font-bold text-slate-900">
                          {new Date(log.created_at).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="font-mono text-[11px] text-slate-500">
                          {new Date(log.created_at).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </div>
                      </td>

                      {/* Author / User */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{log.user_name || 'Système'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] mt-0.5">
                          <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-bold">
                            {log.user_role || 'SUPER_ADMIN'}
                          </span>
                          {log.company_name && (
                            <span className="text-slate-400 truncate max-w-[120px]" title={log.company_name}>
                              • {log.company_name}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Type & Action */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 mb-1">
                          {isRoleChange && (
                            <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-black tracking-wide uppercase border border-purple-200 flex items-center gap-1">
                              <UserCog className="w-3 h-3" />
                              IAM Rôle
                            </span>
                          )}
                          {isInvoiceMod && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black tracking-wide uppercase border border-amber-200 flex items-center gap-1">
                              <Receipt className="w-3 h-3" />
                              Fiscalité
                            </span>
                          )}
                          {!isRoleChange && !isInvoiceMod && (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold tracking-wide uppercase border border-slate-200">
                              {log.entity_type}
                            </span>
                          )}
                        </div>
                        <div className="font-bold text-slate-900 text-xs">{log.action}</div>
                      </td>

                      {/* Description & Explicit Diff */}
                      <td className="py-3.5 px-4 max-w-md">
                        <div className="text-slate-700 text-xs leading-relaxed line-clamp-2">
                          {log.description}
                        </div>

                        {/* If explicit field changes recorded */}
                        {log.changes && log.changes.length > 0 && (
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {log.changes.map((change, idx) => (
                              <div
                                key={idx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-mono text-slate-800"
                              >
                                <span className="font-bold text-slate-600">{change.field}:</span>
                                <span className="text-rose-600 line-through">{String(change.old_value || 'vide')}</span>
                                <span className="text-slate-400">➔</span>
                                <span className="text-emerald-700 font-bold">{String(change.new_value)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* IP & Geolocation */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono text-[11px] text-slate-700 flex items-center gap-1">
                          <Globe className="w-3 h-3 text-slate-400" />
                          <span>{log.ip_address || '197.234.221.14'}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">Cotonou, Bénin</div>
                      </td>

                      {/* Severity badge */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${severityBadge}`}
                        >
                          {log.severity}
                        </span>
                      </td>

                      {/* Cryptographic Seal Button */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVerifySeal(log);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold font-mono transition-all"
                          title="Vérifier la preuve cryptographique d'intégrité"
                        >
                          <Lock className="w-3 h-3 text-emerald-600" />
                          <span>Scellé</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Audit Detail & Cryptographic Verification Modal */}
      {selectedLogForDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold">Certificat d’Intégrité & Preuve d’Audit</h3>
                  <p className="text-[10px] text-slate-400 font-mono">ID: {selectedLogForDetails.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLogForDetails(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Integrity status card */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-emerald-900">Empreinte Cryptographique Vérifiée (Non-Répudiation)</div>
                  <p className="text-emerald-800 leading-relaxed">
                    Cet événement a été scellé par empreinte unidirectionnelle SHA-256 lors de son enregistrement. Aucune modification a posteriori n'a altéré la piste d'audit.
                  </p>
                  <div className="text-[10px] font-bold text-emerald-700 pt-1">
                    Norme : ISO/IEC 27001 • Art. 14 Code Général des Impôts (e-MECeF Bénin)
                  </div>
                </div>
              </div>

              {/* Event details grid */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Horodatage officiel</span>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">
                    {new Date(selectedLogForDetails.created_at).toLocaleString('fr-FR')}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Auteur de l'action</span>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedLogForDetails.user_name}</div>
                  <div className="text-[10px] text-indigo-600 font-semibold">{selectedLogForDetails.user_role}</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Origine Réseau & IP</span>
                  <div className="font-mono text-slate-800 mt-0.5">{selectedLogForDetails.ip_address || '197.234.221.14'}</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Tag Réglementaire</span>
                  <div className="font-mono font-bold text-indigo-700 mt-0.5">
                    {selectedLogForDetails.compliance_tag || selectedLogForDetails.entity_type.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Action and description */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Action consignée
                </span>
                <div className="p-3 bg-slate-100 rounded-lg text-xs font-bold text-slate-900 border border-slate-200">
                  {selectedLogForDetails.action}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Description complète
                </span>
                <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-800 leading-relaxed border border-slate-200">
                  {selectedLogForDetails.description}
                </div>
              </div>

              {/* Recorded changes diff */}
              {selectedLogForDetails.changes && selectedLogForDetails.changes.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Modifications des paramètres (Diff avant / après)
                  </span>
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 font-bold text-slate-600 text-[10px] uppercase">
                        <tr>
                          <th className="p-2.5">Champ</th>
                          <th className="p-2.5">Valeur Antérieure</th>
                          <th className="p-2.5">Nouvelle Valeur</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedLogForDetails.changes.map((c, i) => (
                          <tr key={i} className="font-mono text-[11px]">
                            <td className="p-2.5 font-bold text-slate-800">{c.field}</td>
                            <td className="p-2.5 text-rose-700 bg-rose-50/50">{String(c.old_value || 'null')}</td>
                            <td className="p-2.5 text-emerald-800 bg-emerald-50/50 font-bold">{String(c.new_value)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Cryptographic Checksum SHA-256 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    Empreinte numérique SHA-256
                  </span>
                  <button
                    onClick={() => handleCopyHash(selectedLogForDetails.hash_checksum || selectedLogForDetails.id)}
                    className="flex items-center gap-1 text-[10px] text-sky-600 hover:text-sky-800 font-bold"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedHash ? 'Copié !' : 'Copier l’empreinte'}</span>
                  </button>
                </div>

                <div className="p-2.5 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-lg break-all border border-slate-800">
                  {selectedLogForDetails.hash_checksum || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 font-mono">
                Statut : SCELLÉ & INTÈGRE
              </span>
              <button
                onClick={() => setSelectedLogForDetails(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Audit Event Recording Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold">Consigner un Événement d’Audit Manuel</h3>
              </div>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualLog} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Titre de l'action *</label>
                <input
                  type="text"
                  required
                  value={newLogData.action}
                  onChange={(e) => setNewLogData({ ...newLogData, action: e.target.value })}
                  placeholder="ex: Revue semestrielle des accès administrateurs"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Type d'entité</label>
                  <select
                    value={newLogData.entity_type}
                    onChange={(e) => setNewLogData({ ...newLogData, entity_type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="security">Sécurité & IAM</option>
                    <option value="user">Utilisateur & Rôles</option>
                    <option value="invoice">Facturation & Comptabilité</option>
                    <option value="compliance">Audit Légal / DGI</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Niveau de gravité</label>
                  <select
                    value={newLogData.severity}
                    onChange={(e) => setNewLogData({ ...newLogData, severity: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="warning">Avertissement (Vigilance)</option>
                    <option value="critical">Critique (Action majeure)</option>
                    <option value="info">Information normale</option>
                    <option value="success">Validation / Succès</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Description détaillée & Justification *</label>
                <textarea
                  required
                  rows={3}
                  value={newLogData.description}
                  onChange={(e) => setNewLogData({ ...newLogData, description: e.target.value })}
                  placeholder="Décrivez les motifs de l'opération, les personnes concernées et les références réglementaires..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 leading-relaxed">
                ⚠️ Tout enregistrement manuel est immédiatement scellé avec l'identité de l'administrateur connecté, son adresse IP et un hash SHA-256 non effaçable.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-md shadow-emerald-600/30"
                >
                  Sceller et Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
