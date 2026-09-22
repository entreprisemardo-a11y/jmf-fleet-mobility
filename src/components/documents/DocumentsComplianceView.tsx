import React, { useState, useEffect } from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Download,
  Filter,
  Search,
  Plus,
  Calendar,
  ExternalLink,
  X,
  Upload,
  Check,
} from 'lucide-react';

interface FleetDocument {
  id: string;
  vehicle_reg: string;
  vehicle_model: string;
  type: 'ASSURANCE' | 'VISITE_TECHNIQUE' | 'CARTE_GRISE' | 'TVM' | 'EXTINCTEUR';
  document_number: string;
  issuer: string;
  issue_date: string;
  expiry_date: string;
  days_left: number;
  status: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED';
}

const INITIAL_DOCS: FleetDocument[] = [
  {
    id: 'doc_1',
    vehicle_reg: 'BJ-1234-CD',
    vehicle_model: 'Peugeot 3008 Allure',
    type: 'ASSURANCE',
    document_number: 'POL-NSIA-2025-089',
    issuer: 'NSIA Assurances Bénin',
    issue_date: '2025-09-30',
    expiry_date: '2026-09-30',
    days_left: 9,
    status: 'EXPIRING_SOON',
  },
  {
    id: 'doc_2',
    vehicle_reg: 'BJ-5678-EF',
    vehicle_model: 'Renault Master dCi',
    type: 'VISITE_TECHNIQUE',
    document_number: 'CNSR-COT-2025-4412',
    issuer: 'CNSR Bénin (Centre Akpakpa)',
    issue_date: '2025-03-15',
    expiry_date: '2026-03-15',
    days_left: -189,
    status: 'EXPIRED',
  },
  {
    id: 'doc_3',
    vehicle_reg: 'BJ-9012-GH',
    vehicle_model: 'Toyota Hilux 4x4',
    type: 'CARTE_GRISE',
    document_number: 'CG-ANATT-2024-9912',
    issuer: 'ANaTT Bénin (Agence Nationale des Transports Terrestres)',
    issue_date: '2024-01-10',
    expiry_date: '2029-01-10',
    days_left: 842,
    status: 'VALID',
  },
  {
    id: 'doc_4',
    vehicle_reg: 'BJ-3456-IJ',
    vehicle_model: 'Iveco Daily 35S16 Frigo',
    type: 'ASSURANCE',
    document_number: 'POL-SANLAM-2025-612',
    issuer: 'Sanlam Bénin',
    issue_date: '2025-09-18',
    expiry_date: '2026-09-18',
    days_left: -3,
    status: 'EXPIRED',
  },
  {
    id: 'doc_5',
    vehicle_reg: 'BJ-7890-KL',
    vehicle_model: 'Hyundai Santa Fe 2.2',
    type: 'TVM',
    document_number: 'TVM-DGI-2026-0045',
    issuer: 'Direction Générale des Impôts (DGI Bénin)',
    issue_date: '2026-01-05',
    expiry_date: '2027-01-05',
    days_left: 106,
    status: 'VALID',
  },
  {
    id: 'doc_6',
    vehicle_reg: 'BJ-1234-CD',
    vehicle_model: 'Peugeot 3008 Allure',
    type: 'EXTINCTEUR',
    document_number: 'EXT-SIC-2025-110',
    issuer: 'Sécurité Incendie Cotonou (SIC)',
    issue_date: '2025-10-01',
    expiry_date: '2026-10-01',
    days_left: 10,
    status: 'EXPIRING_SOON',
  },
  {
    id: 'doc_7',
    vehicle_reg: 'BJ-9012-GH',
    vehicle_model: 'Toyota Hilux 4x4',
    type: 'ASSURANCE',
    document_number: 'POL-ATL-2025-778',
    issuer: 'Atlantique Assurances Bénin',
    issue_date: '2025-11-15',
    expiry_date: '2026-11-15',
    days_left: 55,
    status: 'VALID',
  },
  {
    id: 'doc_8',
    vehicle_reg: 'BJ-7890-KL',
    vehicle_model: 'Hyundai Santa Fe 2.2',
    type: 'ASSURANCE',
    document_number: 'POL-NSIA-2025-341',
    issuer: 'NSIA Assurances Bénin',
    issue_date: '2025-12-01',
    expiry_date: '2026-12-01',
    days_left: 71,
    status: 'VALID',
  },
  {
    id: 'doc_9',
    vehicle_reg: 'BJ-1234-CD',
    vehicle_model: 'Peugeot 3008 Allure',
    type: 'VISITE_TECHNIQUE',
    document_number: 'CNSR-COT-2026-1089',
    issuer: 'CNSR Bénin (Centre Akpakpa)',
    issue_date: '2025-10-10',
    expiry_date: '2026-10-10',
    days_left: 19,
    status: 'EXPIRING_SOON',
  },
  {
    id: 'doc_10',
    vehicle_reg: 'BJ-9012-GH',
    vehicle_model: 'Toyota Hilux 4x4',
    type: 'VISITE_TECHNIQUE',
    document_number: 'CNSR-PAR-2026-0342',
    issuer: 'CNSR Bénin (Antenne Parakou)',
    issue_date: '2025-11-20',
    expiry_date: '2026-11-20',
    days_left: 60,
    status: 'VALID',
  },
  {
    id: 'doc_11',
    vehicle_reg: 'BJ-3456-IJ',
    vehicle_model: 'Iveco Daily 35S16 Frigo',
    type: 'VISITE_TECHNIQUE',
    document_number: 'CNSR-COT-2025-8821',
    issuer: 'CNSR Bénin (Centre Akpakpa)',
    issue_date: '2025-09-12',
    expiry_date: '2026-09-12',
    days_left: -9,
    status: 'EXPIRED',
  },
  {
    id: 'doc_12',
    vehicle_reg: 'BJ-5678-EF',
    vehicle_model: 'Renault Master dCi',
    type: 'CARTE_GRISE',
    document_number: 'CG-ANATT-2023-4510',
    issuer: 'ANaTT Bénin',
    issue_date: '2023-06-15',
    expiry_date: '2028-06-15',
    days_left: 632,
    status: 'VALID',
  },
  {
    id: 'doc_13',
    vehicle_reg: 'BJ-3456-IJ',
    vehicle_model: 'Iveco Daily 35S16 Frigo',
    type: 'TVM',
    document_number: 'TVM-DGI-2026-1188',
    issuer: 'Direction Générale des Impôts (DGI Bénin)',
    issue_date: '2026-01-10',
    expiry_date: '2027-01-10',
    days_left: 111,
    status: 'VALID',
  },
];

interface DocumentsComplianceViewProps {
  currentSubView?: string;
  onNavigateSubView?: (subView: string) => void;
}

export const DocumentsComplianceView: React.FC<DocumentsComplianceViewProps> = ({
  currentSubView,
  onNavigateSubView,
}) => {
  const [docs, setDocs] = useState<FleetDocument[]>(INITIAL_DOCS);
  const [search, setSearch] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (currentSubView === 'docs_insurance') {
      setTypeFilter('ASSURANCE');
    } else if (currentSubView === 'docs_inspections') {
      setTypeFilter('VISITE_TECHNIQUE');
    } else if (currentSubView === 'docs_others') {
      setTypeFilter('OTHER');
    } else if (currentSubView === 'documents') {
      setTypeFilter('ALL');
    }
  }, [currentSubView]);

  const handleSubTabSwitch = (tab: string, filter: string) => {
    setTypeFilter(filter);
    if (onNavigateSubView) {
      onNavigateSubView(tab);
    }
  };

  const [formData, setFormData] = useState({
    vehicle_reg: 'BJ-1234-CD',
    vehicle_model: 'Peugeot 3008',
    type: 'ASSURANCE' as FleetDocument['type'],
    document_number: '',
    issuer: '',
    issue_date: new Date().toISOString().split('T')[0],
    expiry_date: '',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDownloadDoc = (doc: FleetDocument) => {
    const content = `RÉPUBLIQUE DU BÉNIN - MINISTÈRE DU CADRE DE VIE ET DES TRANSPORTS
JMF FLEET & MOBILITY - ATTESTATION CERTIFIÉE D'ENREGISTREMENT
----------------------------------------------------------------
Type de document : ${doc.type}
Numéro de référence : ${doc.document_number}
Immatriculation : ${doc.vehicle_reg}
Véhicule : ${doc.vehicle_model}
Organisme Émetteur : ${doc.issuer}
Date d'émission : ${doc.issue_date}
Date d'échéance : ${doc.expiry_date}
Statut : ${doc.status} (${doc.days_left >= 0 ? `Valide - ${doc.days_left} jours restants` : `Expiré depuis ${Math.abs(doc.days_left)} jours`})
Signature électronique : SHA256-JMF-${Math.random().toString(36).substring(2, 10).toUpperCase()}
Date de téléchargement : ${new Date().toLocaleString('fr-FR')}
----------------------------------------------------------------
Document certifié conforme pour circulation sur le réseau routier béninois.`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Certificat_${doc.type}_${doc.vehicle_reg}_${doc.document_number}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Justificatif certifié ${doc.document_number} téléchargé !`);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.document_number || !formData.issuer || !formData.expiry_date) {
      showToast('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const exp = new Date(formData.expiry_date);
    const today = new Date();
    const diffTime = exp.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const status: FleetDocument['status'] =
      daysLeft < 0 ? 'EXPIRED' : daysLeft <= 30 ? 'EXPIRING_SOON' : 'VALID';

    const newDoc: FleetDocument = {
      id: `doc_${Date.now()}`,
      vehicle_reg: formData.vehicle_reg,
      vehicle_model: formData.vehicle_model,
      type: formData.type,
      document_number: formData.document_number,
      issuer: formData.issuer,
      issue_date: formData.issue_date,
      expiry_date: formData.expiry_date,
      days_left: daysLeft,
      status,
    };

    setDocs([newDoc, ...docs]);
    setIsAddModalOpen(false);
    setFormData({
      vehicle_reg: 'BJ-1234-CD',
      vehicle_model: 'Peugeot 3008',
      type: 'ASSURANCE',
      document_number: '',
      issuer: '',
      issue_date: new Date().toISOString().split('T')[0],
      expiry_date: '',
    });
    showToast(`Document certifié ${newDoc.document_number} ajouté au registre !`);
  };

  const filteredDocs = docs.filter((d) => {
    const matchesSearch =
      d.vehicle_reg.toLowerCase().includes(search.toLowerCase()) ||
      d.document_number.toLowerCase().includes(search.toLowerCase()) ||
      d.issuer.toLowerCase().includes(search.toLowerCase());
    const matchesType =
      typeFilter === 'ALL'
        ? true
        : typeFilter === 'OTHER'
        ? d.type !== 'ASSURANCE' && d.type !== 'VISITE_TECHNIQUE'
        : d.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const expiredCount = docs.filter((d) => d.status === 'EXPIRED').length;
  const expiringSoonCount = docs.filter((d) => d.status === 'EXPIRING_SOON').length;
  const validCount = docs.filter((d) => d.status === 'VALID').length;

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
            <span>Documents</span>
            <span>&gt;</span>
            <span className="font-semibold text-slate-700">
              {typeFilter === 'ASSURANCE'
                ? 'Assurances Flotte (NSIA, Sanlam)'
                : typeFilter === 'VISITE_TECHNIQUE'
                ? 'Visites Techniques CNSR'
                : typeFilter === 'OTHER'
                ? 'Cartes Grises, TVM & Extincteurs'
                : 'Tous les Documents'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-sky-600" />
            <span>Documents Réglementaires & Conformité Flotte</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Centralisation des polices d’assurance, contrôles CNSR, cartes grises ANaTT et vignettes TVM
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto">
            <button
              onClick={() => handleSubTabSwitch('documents', 'ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                typeFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => handleSubTabSwitch('docs_insurance', 'ASSURANCE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                typeFilter === 'ASSURANCE' ? 'bg-white text-sky-700 shadow-xs ring-1 ring-sky-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Assurances
            </button>
            <button
              onClick={() => handleSubTabSwitch('docs_inspections', 'VISITE_TECHNIQUE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                typeFilter === 'VISITE_TECHNIQUE' ? 'bg-white text-sky-700 shadow-xs ring-1 ring-sky-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Visites CNSR
            </button>
            <button
              onClick={() => handleSubTabSwitch('docs_others', 'OTHER')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                typeFilter === 'OTHER' ? 'bg-white text-sky-700 shadow-xs ring-1 ring-sky-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              TVM, CG & Autres
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-sky-600/20 transition-all self-start sm:self-auto cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un document</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/20 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700">Documents expirés (Action urgente)</span>
            <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-700 mt-2">{expiredCount}</div>
          <div className="text-[11px] text-rose-600 mt-1 font-medium">Risque d'immobilisation ou amende</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700">Expire sous 30 jours</span>
            <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-700 mt-2">{expiringSoonCount}</div>
          <div className="text-[11px] text-amber-600 mt-1 font-medium">Renouvellements en cours auprès des assureurs</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Conformes & Validés</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">{validCount}</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Couverture intégrale active</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par immat, N° police ou émetteur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-sky-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Filter className="w-3.5 h-3.5" />
            <span>Type :</span>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 font-medium"
          >
            <option value="ALL">Tous les documents</option>
            <option value="ASSURANCE">Assurance Tous Risques</option>
            <option value="VISITE_TECHNIQUE">Visite Technique CNSR</option>
            <option value="CARTE_GRISE">Carte Grise ANaTT</option>
            <option value="TVM">Taxe TVM</option>
            <option value="EXTINCTEUR">Extincteur</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 font-medium"
          >
            <option value="ALL">Tous statuts</option>
            <option value="EXPIRED">Expirés</option>
            <option value="EXPIRING_SOON">Échéance proche (&lt; 30j)</option>
            <option value="VALID">Valides</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Véhicule</th>
                <th className="py-3 px-4">Type Document</th>
                <th className="py-3 px-4">N° Référence</th>
                <th className="py-3 px-4">Organisme Émetteur</th>
                <th className="py-3 px-4">Date Échéance</th>
                <th className="py-3 px-4">Délai restant</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => {
                const statusBadge =
                  doc.status === 'EXPIRED'
                    ? 'bg-rose-100 text-rose-800'
                    : doc.status === 'EXPIRING_SOON'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800';

                return (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900">{doc.vehicle_reg}</div>
                      <div className="text-[10px] text-slate-500">{doc.vehicle_model}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{doc.type.replace(/_/g, ' ')}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{doc.document_number}</td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{doc.issuer}</td>
                    <td className="py-3 px-4 font-medium text-slate-700">{doc.expiry_date}</td>
                    <td className="py-3 px-4">
                      {doc.days_left < 0 ? (
                        <span className="font-bold text-rose-600">Expiré depuis {Math.abs(doc.days_left)}j</span>
                      ) : doc.days_left <= 30 ? (
                        <span className="font-bold text-amber-600">Reste {doc.days_left} jours</span>
                      ) : (
                        <span className="text-emerald-700 font-medium">{doc.days_left} jours</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${statusBadge}`}>
                        {doc.status === 'EXPIRED' ? 'Expiré' : doc.status === 'EXPIRING_SOON' ? 'Échéance proche' : 'Valide'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDownloadDoc(doc)}
                        className="p-1.5 text-slate-500 hover:text-sky-600 rounded-md hover:bg-sky-50 transition-colors"
                        title="Télécharger justificatif certifié"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Ajouter un document certifié */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-600" />
                <span>Nouveau document de conformité</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Véhicule assigné</label>
                  <select
                    value={formData.vehicle_reg}
                    onChange={(e) => {
                      const reg = e.target.value;
                      const modelMap: Record<string, string> = {
                        'BJ-1234-CD': 'Peugeot 3008',
                        'BJ-5678-EF': 'Renault Master',
                        'BJ-9012-GH': 'Toyota Hilux 4x4',
                        'BJ-3456-IJ': 'Toyota Land Cruiser Prado',
                        'BJ-7890-KL': 'Hyundai Santa Fe',
                      };
                      setFormData({
                        ...formData,
                        vehicle_reg: reg,
                        vehicle_model: modelMap[reg] || 'Véhicule',
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                  >
                    <option value="BJ-1234-CD">BJ-1234-CD (Peugeot 3008)</option>
                    <option value="BJ-5678-EF">BJ-5678-EF (Renault Master)</option>
                    <option value="BJ-9012-GH">BJ-9012-GH (Toyota Hilux)</option>
                    <option value="BJ-3456-IJ">BJ-3456-IJ (Toyota Prado)</option>
                    <option value="BJ-7890-KL">BJ-7890-KL (Hyundai Santa Fe)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Type de document</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as FleetDocument['type'],
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                  >
                    <option value="ASSURANCE">Assurance Flotte</option>
                    <option value="VISITE_TECHNIQUE">Contrôle Technique CNSR</option>
                    <option value="CARTE_GRISE">Carte Grise ANaTT</option>
                    <option value="TVM">Taxe Véhicule Moteur (TVM)</option>
                    <option value="EXTINCTEUR">Extincteur & Sécurité</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Numéro de police / certificat</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: POL-NSIA-2026-991 ou CNSR-COT-2026-102"
                  value={formData.document_number}
                  onChange={(e) => setFormData({ ...formData, document_number: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Organisme émetteur / Compagnie</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: NSIA Assurances, CNSR Cotonou, DGI Bénin..."
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Date d'émission</label>
                  <input
                    type="date"
                    required
                    value={formData.issue_date}
                    onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Date d'échéance</label>
                  <input
                    type="date"
                    required
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="p-3 border border-dashed border-slate-300 rounded-xl text-center space-y-1 bg-slate-50/50">
                <Upload className="w-5 h-5 text-sky-600 mx-auto" />
                <div className="text-slate-700 font-bold">Pièce jointe scannée (PDF, JPG)</div>
                <div className="text-[11px] text-slate-500">Document certifié et horodaté sur la blockchain JMF</div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm"
                >
                  Enregistrer le document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
