import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  Shield,
  MapPin,
  Mail,
  Phone,
  Save,
  CheckCircle2,
  Lock,
  Globe,
  Plus,
  X,
  FileText,
  Download,
  Upload,
  Search,
  Filter,
  UserCheck,
  UserX,
  KeyRound,
  FileCheck,
  CreditCard,
  Receipt,
  ExternalLink,
  AlertCircle,
  Eye,
  Check,
} from 'lucide-react';

interface CompanySettingsViewProps {
  currentSubView?: string;
  onNavigateSubView?: (subView: string) => void;
}

interface CompanyUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  roleBadgeColor: string;
  site: string;
  status: 'ACTIVE' | 'PENDING' | 'DISABLED';
  lastLogin: string;
}

interface CompanyDoc {
  id: string;
  title: string;
  reference: string;
  category: 'LEGAL' | 'TAX' | 'CONTRACT' | 'BANK';
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  fileSize: string;
  status: 'VALID' | 'EXPIRING' | 'RENEWED';
}

interface CompanyInvoice {
  id: string;
  invoiceNumber: string;
  period: string;
  description: string;
  amountFcfa: number;
  dueDate: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  paymentMethod?: string;
}

const INITIAL_USERS: CompanyUser[] = [
  {
    id: 'usr_1',
    name: 'Jean KOUASSI',
    email: 'jean.kouassi@societe-cliente.bj',
    phone: '+229 97 00 11 22',
    role: 'Administrateur Société',
    roleBadgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    site: 'Siège Administratif & Direction (Marina)',
    status: 'ACTIVE',
    lastLogin: 'Aujourd’hui à 16:42',
  },
  {
    id: 'usr_2',
    name: 'Blandine HOUNSINOU',
    email: 'b.hounsinou@societe-cliente.bj',
    phone: '+229 97 45 88 12',
    role: 'Responsable Ressources Humaines',
    roleBadgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    site: 'Siège Administratif & Direction (Marina)',
    status: 'ACTIVE',
    lastLogin: 'Aujourd’hui à 11:15',
  },
  {
    id: 'usr_3',
    name: 'Marc SOSSOU',
    email: 'marc.sossou@societe-cliente.bj',
    phone: '+229 95 11 22 33',
    role: 'Gestionnaire de Flotte Principal',
    roleBadgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
    site: 'Hub Logistique Akpakpa',
    status: 'ACTIVE',
    lastLogin: 'Hier à 18:20',
  },
  {
    id: 'usr_4',
    name: 'Koffi AMAN',
    email: 'koffi.aman@societe-cliente.bj',
    phone: '+229 96 23 45 67',
    role: 'Superviseur Logistique & Chauffeurs',
    roleBadgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
    site: 'Base Opérationnelle Portuaire',
    status: 'ACTIVE',
    lastLogin: 'Il y a 3 jours',
  },
  {
    id: 'usr_5',
    name: 'Awa DIALLO',
    email: 'a.diallo@societe-cliente.bj',
    phone: '+229 94 88 77 66',
    role: 'Contrôleur de Gestion & Comptabilité',
    roleBadgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    site: 'Siège Administratif & Direction (Marina)',
    status: 'ACTIVE',
    lastLogin: 'Aujourd’hui à 09:30',
  },
  {
    id: 'usr_6',
    name: 'Pierre DOSSOU',
    email: 'p.dossou@societe-cliente.bj',
    phone: '+229 97 12 34 56',
    role: 'Chauffeur VIP Référent',
    roleBadgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    site: 'Siège Administratif & Direction (Marina)',
    status: 'ACTIVE',
    lastLogin: 'Hier à 17:05',
  },
  {
    id: 'usr_7',
    name: 'Mathieu KPADONOU',
    email: 'm.kpadonou@societe-cliente.bj',
    phone: '+229 95 34 56 78',
    role: 'Conducteur Poids Lourd',
    roleBadgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    site: 'Base Opérationnelle Portuaire',
    status: 'ACTIVE',
    lastLogin: 'Il y a 2 jours',
  },
  {
    id: 'usr_8',
    name: 'Michel HOUNGBO',
    email: 'm.houngbo@societe-cliente.bj',
    phone: '+229 97 45 67 89',
    role: 'Conducteur Fourgon Frigorifique',
    roleBadgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    site: 'Hub Logistique Akpakpa',
    status: 'ACTIVE',
    lastLogin: 'Il y a 5 jours',
  },
  {
    id: 'usr_9',
    name: 'Patrice AGBANGLA',
    email: 'p.agbangla@societe-cliente.bj',
    phone: '+229 97 77 88 99',
    role: 'Chef d’Atelier Interne',
    roleBadgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
    site: 'Hub Logistique Akpakpa',
    status: 'ACTIVE',
    lastLogin: 'Hier à 14:10',
  },
  {
    id: 'usr_10',
    name: 'Sylvain TOSSOU',
    email: 's.tossou@societe-cliente.bj',
    phone: '+229 96 11 44 77',
    role: 'Chauffeur Pool de Véhicules',
    roleBadgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    site: 'Siège Administratif & Direction (Marina)',
    status: 'ACTIVE',
    lastLogin: 'Il y a 1 jour',
  },
  {
    id: 'usr_11',
    name: 'Nadia BABA',
    email: 'n.baba@societe-cliente.bj',
    phone: '+229 95 66 33 22',
    role: 'Assistante Administrative & Déplacements',
    roleBadgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    site: 'Siège Administratif & Direction (Marina)',
    status: 'ACTIVE',
    lastLogin: 'Aujourd’hui à 15:20',
  },
  {
    id: 'usr_12',
    name: 'Eric ZANNOU',
    email: 'e.zannou@societe-cliente.bj',
    phone: '+229 97 33 22 11',
    role: 'Responsable Agence Régionale Nord',
    roleBadgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
    site: 'Agence Régionale Nord (Parakou)',
    status: 'PENDING',
    lastLogin: 'Invitation envoyée (En attente)',
  },
];

const INITIAL_COMPANY_DOCS: CompanyDoc[] = [
  {
    id: 'cdoc_1',
    title: 'Registre du Commerce et du Crédit Mobilier (RCCM)',
    reference: 'RB/COT/21 B 14234',
    category: 'LEGAL',
    issuer: 'Greffe du Tribunal de Commerce de Cotonou',
    issueDate: '2021-04-12',
    fileSize: '2.4 Mo (PDF Certifié)',
    status: 'VALID',
  },
  {
    id: 'cdoc_2',
    title: 'Attestation d’Immatriculation Fiscale (IFU)',
    reference: 'IFU 0202110293849',
    category: 'TAX',
    issuer: 'Direction Générale des Impôts (DGI Bénin)',
    issueDate: '2021-04-15',
    fileSize: '1.1 Mo (PDF)',
    status: 'VALID',
  },
  {
    id: 'cdoc_3',
    title: 'Statuts Notariés de la Société Cliente SARL',
    reference: 'ACTE-NOT-2021-084',
    category: 'LEGAL',
    issuer: 'Étude Notariale Maître KÉKÉ, Cotonou',
    issueDate: '2021-03-28',
    fileSize: '5.8 Mo (PDF Scanné)',
    status: 'VALID',
  },
  {
    id: 'cdoc_4',
    title: 'Convention Cadre de Gestion de Flotte JMF Mobility',
    reference: 'CTR-2025-JMF-042',
    category: 'CONTRACT',
    issuer: 'JMF Mobility Services SARL',
    issueDate: '2025-01-01',
    expiryDate: '2027-12-31',
    fileSize: '3.6 Mo (PDF Signé)',
    status: 'VALID',
  },
  {
    id: 'cdoc_5',
    title: 'Relevé d’Identité Bancaire (RIB Principal)',
    reference: 'RIB BOA Bénin 00142-01928472910-44',
    category: 'BANK',
    issuer: 'Bank of Africa (BOA) Bénin - Agence Marina',
    issueDate: '2024-01-10',
    fileSize: '650 Ko (PDF)',
    status: 'VALID',
  },
  {
    id: 'cdoc_6',
    title: 'Attestation de Mise à Jour CNSS (Sécurité Sociale)',
    reference: 'CNSS-COT-2026-Q3-0941',
    category: 'LEGAL',
    issuer: 'Caisse Nationale de Sécurité Sociale (Bénin)',
    issueDate: '2026-07-01',
    expiryDate: '2026-10-01',
    fileSize: '820 Ko (PDF)',
    status: 'EXPIRING',
  },
];

const INITIAL_INVOICES: CompanyInvoice[] = [
  {
    id: 'inv_1',
    invoiceNumber: 'FAC-2026-09-089',
    period: 'Septembre 2026',
    description: 'Forfait mensuel Gestion de flotte & Maintenance préventive (125 véhicules)',
    amountFcfa: 4250000,
    dueDate: '2026-09-30',
    status: 'PENDING',
    paymentMethod: 'Virement bancaire / MTN MoMo Business',
  },
  {
    id: 'inv_2',
    invoiceNumber: 'FAC-2026-08-084',
    period: 'Août 2026',
    description: 'Gestion de flotte, renouvellement assurances NSIA et révisions d’atelier',
    amountFcfa: 3980000,
    dueDate: '2026-08-31',
    status: 'PAID',
    paymentMethod: 'Virement BOA Bénin #992481',
  },
  {
    id: 'inv_3',
    invoiceNumber: 'FAC-2026-07-078',
    period: 'Juillet 2026',
    description: 'Prestations de télématique IoT, cartes carburant et gestion des conducteurs',
    amountFcfa: 4120000,
    dueDate: '2026-07-31',
    status: 'PAID',
    paymentMethod: 'Virement BOA Bénin #987102',
  },
  {
    id: 'inv_4',
    invoiceNumber: 'FAC-2026-06-071',
    period: 'Juin 2026',
    description: 'Gestion technique, visites CNSR et réfection pneumatiques parc Cotonou',
    amountFcfa: 3850000,
    dueDate: '2026-06-30',
    status: 'PAID',
    paymentMethod: 'Chèque certifié Ecobank #0041284',
  },
];

export const CompanySettingsView: React.FC<CompanySettingsViewProps> = ({
  currentSubView = 'company_info',
  onNavigateSubView,
}) => {
  // Active Tab state synced with currentSubView
  const [activeTab, setActiveTab] = useState<string>('company_info');

  useEffect(() => {
    if (currentSubView) {
      if (currentSubView === 'company_users') setActiveTab('company_users');
      else if (currentSubView === 'company_sites') setActiveTab('company_sites');
      else if (currentSubView === 'company_documents') setActiveTab('company_documents');
      else if (currentSubView.startsWith('billing_') || currentSubView.startsWith('billing')) setActiveTab('billing_invoices');
      else if (currentSubView === 'settings_general' || currentSubView === 'company_info') setActiveTab('company_info');
    }
  }, [currentSubView]);

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    if (onNavigateSubView) {
      onNavigateSubView(tab);
    }
  };

  // Company Info Form State
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Société Cliente SARL',
    legal_name: 'Société Cliente SARL Bénin',
    rccm: 'RB/COT/21 B 14234',
    ifu: '0202110293849',
    email: 'direction@societe-cliente.bj',
    phone: '+229 21 31 45 00',
    address: 'Boulevard de la Marina, Lot 45, Cotonou',
    currency: 'FCFA (XOF)',
    timezone: 'Africa/Porto-Novo (GMT+1)',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sites State
  const [sitesList, setSitesList] = useState([
    { name: 'Siège Administratif & Direction', city: 'Cotonou (Boulevard de la Marina)', vehicles: 45, manager: 'Jean KOUASSI' },
    { name: 'Hub Logistique & Gardiennage Akpakpa', city: 'Cotonou Akpakpa', vehicles: 52, manager: 'Atelier Central JMF' },
    { name: 'Base Opérationnelle Portuaire', city: 'Port de Cotonou', vehicles: 18, manager: 'Michel HOUNGBO' },
    { name: 'Agence Régionale Nord', city: 'Parakou', vehicles: 10, manager: 'Eric ZANNOU' },
  ]);
  const [isAddSiteModalOpen, setIsAddSiteModalOpen] = useState(false);
  const [newSite, setNewSite] = useState({ name: '', city: '', vehicles: 1, manager: '' });

  // Users State
  const [usersList, setUsersList] = useState<CompanyUser[]>(INITIAL_USERS);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '+229 ',
    role: 'Gestionnaire de Flotte Principal',
    site: 'Siège Administratif & Direction',
  });

  // Docs State
  const [docsList, setDocsList] = useState<CompanyDoc[]>(INITIAL_COMPANY_DOCS);
  const [isUploadDocModalOpen, setIsUploadDocModalOpen] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: '',
    reference: '',
    category: 'LEGAL' as CompanyDoc['category'],
    issuer: '',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Fiche légale et coordonnées enregistrées avec succès !');
  };

  const handleAddSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSite.name || !newSite.city || !newSite.manager) {
      showToast('Veuillez renseigner tous les champs du site.');
      return;
    }
    setSitesList([
      ...sitesList,
      {
        name: newSite.name,
        city: newSite.city,
        vehicles: Number(newSite.vehicles) || 1,
        manager: newSite.manager,
      },
    ]);
    setIsAddSiteModalOpen(false);
    setNewSite({ name: '', city: '', vehicles: 1, manager: '' });
    showToast(`Site « ${newSite.name} » ajouté avec succès !`);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      showToast('Veuillez renseigner le nom et l’adresse email.');
      return;
    }
    const created: CompanyUser = {
      id: `usr_${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      roleBadgeColor: newUser.role.includes('Admin')
        ? 'bg-purple-100 text-purple-800 border-purple-200'
        : 'bg-sky-100 text-sky-800 border-sky-200',
      site: newUser.site,
      status: 'ACTIVE',
      lastLogin: 'Compte activé (Jamais connecté)',
    };
    setUsersList([created, ...usersList]);
    setIsAddUserModalOpen(false);
    setNewUser({ name: '', email: '', phone: '+229 ', role: 'Gestionnaire de Flotte Principal', site: 'Siège Administratif & Direction' });
    showToast(`Utilisateur « ${newUser.name} » invité et créé avec succès !`);
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsersList(
      usersList.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
          showToast(`Statut de ${u.name} modifié : ${nextStatus === 'ACTIVE' ? 'Compte Réactivé' : 'Accès Suspendu'}`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleResetPassword = (name: string) => {
    showToast(`Lien de réinitialisation sécurisé envoyé par SMS et Email à ${name} !`);
  };

  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.title || !newDoc.reference) {
      showToast('Veuillez renseigner le titre et la référence.');
      return;
    }
    const docItem: CompanyDoc = {
      id: `cdoc_${Date.now()}`,
      title: newDoc.title,
      reference: newDoc.reference,
      category: newDoc.category,
      issuer: newDoc.issuer || 'Direction Générale',
      issueDate: new Date().toISOString().split('T')[0],
      fileSize: '1.8 Mo (PDF)',
      status: 'VALID',
    };
    setDocsList([docItem, ...docsList]);
    setIsUploadDocModalOpen(false);
    setNewDoc({ title: '', reference: '', category: 'LEGAL', issuer: '' });
    showToast(`Document « ${newDoc.title} » archivé avec succès dans le coffre-fort d'entreprise !`);
  };

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'ALL' || u.role.includes(userRoleFilter);
    return matchesSearch && matchesRole;
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
            <span>Ma Société</span>
            <span>&gt;</span>
            <span className="font-semibold text-slate-700">
              {activeTab === 'company_info' && 'Fiche Légale & Identité'}
              {activeTab === 'company_sites' && 'Sites & Agences'}
              {activeTab === 'company_users' && 'Utilisateurs & Accès'}
              {activeTab === 'company_documents' && 'Documents Société'}
              {activeTab === 'billing_invoices' && 'Factures & Règlements'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-sky-600" />
            <span>Ma Société : Administration & Équipe</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gérez les informations légales, vos sites d'exploitation, l'équipe d'utilisateurs et vos documents d'entreprise
          </p>
        </div>

        {/* Tab Quick Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto">
          <button
            onClick={() => handleSelectTab('company_info')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'company_info'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-sky-600" />
            <span>Fiche Société</span>
          </button>

          <button
            onClick={() => handleSelectTab('company_sites')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'company_sites'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-sky-600" />
            <span>Sites & Agences ({sitesList.length})</span>
          </button>

          <button
            onClick={() => handleSelectTab('company_users')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'company_users'
                ? 'bg-white text-sky-700 shadow-xs ring-1 ring-sky-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-sky-600" />
            <span>Utilisateurs ({usersList.length})</span>
          </button>

          <button
            onClick={() => handleSelectTab('company_documents')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'company_documents'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-sky-600" />
            <span>Documents ({docsList.length})</span>
          </button>

          <button
            onClick={() => handleSelectTab('billing_invoices')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'billing_invoices'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Receipt className="w-3.5 h-3.5 text-sky-600" />
            <span>Facturation Flotte</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: INFORMATIONS SOCIÉTÉ */}
      {/* ========================================================= */}
      {activeTab === 'company_info' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-sky-600" />
                  <span>Identité Juridique & Renseignements Officiels</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ces informations figurent automatiquement sur les ordres de mission, bordereaux et factures
                </p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-lg border border-emerald-200">
                Compte Validé & Actif
              </span>
            </div>

            <form onSubmit={handleSaveCompany} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Nom commercial de l'entreprise</label>
                  <input
                    type="text"
                    value={companyInfo.name}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-medium focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Raison sociale légale complète</label>
                  <input
                    type="text"
                    value={companyInfo.legal_name}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, legal_name: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-medium focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">N° RCCM (Registre de Commerce)</label>
                  <input
                    type="text"
                    value={companyInfo.rccm}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, rccm: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-mono font-bold text-slate-800 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">N° IFU Fiscal (DGI Bénin)</label>
                  <input
                    type="text"
                    value={companyInfo.ifu}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, ifu: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-mono font-bold text-slate-800 bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email officiel de gestion de flotte</label>
                  <input
                    type="email"
                    value={companyInfo.email}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Téléphone standard direction</label>
                  <input
                    type="text"
                    value={companyInfo.phone}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Adresse géographique du siège</label>
                <input
                  type="text"
                  value={companyInfo.address}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Devise d'exploitation</label>
                  <input
                    type="text"
                    disabled
                    value={companyInfo.currency}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Fuseau horaire officiel</label>
                  <input
                    type="text"
                    disabled
                    value={companyInfo.timezone}
                    className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer les modifications</span>
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
                <Shield className="w-4 h-4" />
                <span>Multi-Tenancy & Sécurité Étanchéifiée</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Toutes les entités de <strong>{companyInfo.name}</strong> sont cryptographiquement cloisonnées.
                Seuls vos utilisateurs autorisés ci-contre peuvent accéder aux coordonnées GPS, dépenses et fiches conducteurs.
              </p>
              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                Certificat de conformité RGPD & Code du Numérique Bénin (APDP)
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-600" />
                <span>Raccourcis Administrateur</span>
              </h4>
              <div className="space-y-2 text-xs">
                <button
                  onClick={() => handleSelectTab('company_users')}
                  className="w-full text-left p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 font-semibold text-slate-700 flex items-center justify-between"
                >
                  <span>Gérer les accès utilisateurs</span>
                  <Users className="w-3.5 h-3.5 text-sky-600" />
                </button>
                <button
                  onClick={() => handleSelectTab('company_sites')}
                  className="w-full text-left p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 font-semibold text-slate-700 flex items-center justify-between"
                >
                  <span>Configurer les sites & agences</span>
                  <MapPin className="w-3.5 h-3.5 text-sky-600" />
                </button>
                <button
                  onClick={() => handleSelectTab('company_documents')}
                  className="w-full text-left p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 font-semibold text-slate-700 flex items-center justify-between"
                >
                  <span>Consulter les pièces juridiques</span>
                  <FileText className="w-3.5 h-3.5 text-sky-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: UTILISATEURS (THE DIRECT SCREENSHOT REQUEST) */}
      {/* ========================================================= */}
      {activeTab === 'company_users' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* Top User Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Utilisateurs</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{usersList.length}</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Comptes configurés</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actifs / Connectés</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                {usersList.filter((u) => u.status === 'ACTIVE').length}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Accès immédiat</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Administrateurs</div>
              <div className="text-2xl font-black text-purple-600 mt-1">
                {usersList.filter((u) => u.role.includes('Admin')).length}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Privilèges complets</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Invitations en attente</div>
              <div className="text-2xl font-black text-amber-500 mt-1">
                {usersList.filter((u) => u.status === 'PENDING').length}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Activation en cours</div>
            </div>
          </div>

          {/* User Controls & Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-2.5 w-full sm:w-auto">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email, rôle..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 font-semibold"
              >
                <option value="ALL">Tous les rôles</option>
                <option value="Admin">Administrateurs</option>
                <option value="Gestionnaire">Gestionnaires de Flotte</option>
                <option value="Superviseur">Superviseurs & Logistique</option>
                <option value="Chauffeur">Chauffeurs & Conducteurs</option>
                <option value="Comptabilité">Comptabilité</option>
              </select>
            </div>

            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Inviter un utilisateur</span>
            </button>
          </div>

          {/* User Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                  <tr>
                    <th className="py-3.5 px-4">Utilisateur / Collaborateur</th>
                    <th className="py-3.5 px-4">Rôle & Permissions</th>
                    <th className="py-3.5 px-4">Site d'affectation</th>
                    <th className="py-3.5 px-4">Dernière activité</th>
                    <th className="py-3.5 px-4">Statut</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-black flex items-center justify-center text-xs shrink-0">
                            {user.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{user.name}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2">
                              <span>{user.email}</span>
                              <span>•</span>
                              <span>{user.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${user.roleBadgeColor}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-slate-600 font-medium text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{user.site}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {user.lastLogin}
                      </td>

                      <td className="py-3 px-4">
                        {user.status === 'ACTIVE' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Actif
                          </span>
                        )}
                        {user.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            En attente
                          </span>
                        )}
                        {user.status === 'DISABLED' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            Suspendu
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleResetPassword(user.name)}
                            className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                            title="Réinitialiser le mot de passe"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleUserStatus(user.id)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              user.status === 'ACTIVE'
                                ? 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
                                : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={user.status === 'ACTIVE' ? "Suspendre l'accès" : "Réactiver l'accès"}
                          >
                            {user.status === 'ACTIVE' ? (
                              <UserX className="w-4 h-4" />
                            ) : (
                              <UserCheck className="w-4 h-4" />
                            )}
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

      {/* ========================================================= */}
      {/* TAB 3: SITES & AGENCES */}
      {/* ========================================================= */}
      {activeTab === 'company_sites' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sites d'Exploitation & Dépôts au Bénin</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Bases logistiques, agences régionales et parcs de stationnement de votre entreprise
              </p>
            </div>
            <button
              onClick={() => setIsAddSiteModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau site / agence</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sitesList.map((site, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-sky-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold font-mono px-2.5 py-1 bg-sky-100 text-sky-800 rounded-full">
                    {site.vehicles} véhicules
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{site.name}</h4>
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{site.city}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-600">
                  Responsable : <span className="font-bold text-slate-800">{site.manager}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: DOCUMENTS SOCIÉTÉ */}
      {/* ========================================================= */}
      {activeTab === 'company_documents' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Coffre-fort Numérique & Pièces Légales</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Statuts, attestations fiscales, RIB et contrats-cadres certifiés de votre entreprise
              </p>
            </div>
            <button
              onClick={() => setIsUploadDocModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Téléverser un document</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {docsList.map((doc) => (
              <div
                key={doc.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between hover:border-sky-300 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="p-2.5 bg-slate-100 text-slate-700 rounded-xl">
                      <FileText className="w-5 h-5 text-sky-600" />
                    </div>
                    {doc.status === 'VALID' ? (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-md border border-emerald-200">
                        Certifié conforme
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-bold text-[10px] rounded-md border border-amber-200">
                        À renouveler sous peu
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs mt-3 leading-snug">{doc.title}</h4>
                  <div className="text-[11px] font-mono text-slate-500 mt-1">Réf: {doc.reference}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Émetteur: {doc.issuer}</div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 font-medium">{doc.fileSize}</span>
                  <button
                    onClick={() => showToast(`Téléchargement de « ${doc.title} » initié !`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition-colors cursor-pointer text-[11px]"
                  >
                    <Download className="w-3.5 h-3.5 text-sky-600" />
                    <span>Télécharger</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: FACTURATION & RÈGLEMENTS */}
      {/* ========================================================= */}
      {activeTab === 'billing_invoices' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Historique des Factures de Gestion de Flotte</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Factures normalisées e-MECeF Bénin, bordereaux de prestations et reçus de règlement
              </p>
            </div>
            <button
              onClick={() => showToast('Relevé comptable annuel exporté au format Excel / PDF !')}
              className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Exporter relevé complet</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                  <tr>
                    <th className="py-3.5 px-4">N° Facture</th>
                    <th className="py-3.5 px-4">Période & Libellé</th>
                    <th className="py-3.5 px-4">Échéance</th>
                    <th className="py-3.5 px-4">Montant TTC</th>
                    <th className="py-3.5 px-4">Statut</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {INITIAL_INVOICES.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{inv.period}</div>
                        <div className="text-[11px] text-slate-500 max-w-md truncate">{inv.description}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{inv.dueDate}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {inv.amountFcfa.toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="py-3 px-4">
                        {inv.status === 'PAID' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Check className="w-3 h-3 text-emerald-600" />
                            Payée
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            En attente
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => showToast(`Téléchargement de la facture ${inv.invoiceNumber} (PDF e-MECeF) !`)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-sky-600" />
                          <span>PDF</span>
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

      {/* ========================================================= */}
      {/* MODAL: NOUVEL UTILISATEUR */}
      {/* ========================================================= */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-sky-600" />
                <span>Inviter un Nouveau Collaborateur</span>
              </h3>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nom et Prénom</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Christian MEHOU"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email professionnel</label>
                  <input
                    type="email"
                    required
                    placeholder="c.mehou@societe-cliente.bj"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Téléphone mobile (Bénin)</label>
                  <input
                    type="text"
                    required
                    placeholder="+229 97 00 00 00"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Rôle & Droits d'accès</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-sky-500 bg-white"
                  >
                    <option value="Gestionnaire de Flotte Principal">Gestionnaire de Flotte</option>
                    <option value="Superviseur Logistique & Chauffeurs">Superviseur Logistique</option>
                    <option value="Administrateur Société">Administrateur Société</option>
                    <option value="Chauffeur VIP Référent">Chauffeur Référent</option>
                    <option value="Contrôleur de Gestion & Comptabilité">Comptabilité</option>
                    <option value="Assistante Administrative & Déplacements">Assistante Administrative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Site d'affectation</label>
                  <select
                    value={newUser.site}
                    onChange={(e) => setNewUser({ ...newUser, site: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-sky-500 bg-white"
                  >
                    {sitesList.map((s, idx) => (
                      <option key={idx} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 space-y-1">
                <div className="font-bold text-slate-800">Notification automatique :</div>
                <p>
                  Un email d'activation ainsi qu'un code temporaire par SMS (+229) seront immédiatement transmis au collaborateur.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs cursor-pointer"
                >
                  Confirmer et Inviter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: AJOUTER SITE */}
      {/* ========================================================= */}
      {isAddSiteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-sky-600" />
                <span>Nouveau Site / Agence Opérationnelle</span>
              </h3>
              <button
                onClick={() => setIsAddSiteModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSite} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nom du site ou dépôt</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Hub Industriel Glo-Djigbé (GDIZ)"
                  value={newSite.name}
                  onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Ville / Emplacement au Bénin</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Zone Économique Spéciale GDIZ"
                  value={newSite.city}
                  onChange={(e) => setNewSite({ ...newSite, city: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Véhicules alloués</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newSite.vehicles}
                    onChange={(e) => setNewSite({ ...newSite, vehicles: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Responsable du site</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Paul MENSAH"
                    value={newSite.manager}
                    onChange={(e) => setNewSite({ ...newSite, manager: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddSiteModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs cursor-pointer"
                >
                  Créer le site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: AJOUTER UN DOCUMENT D'ENTREPRISE */}
      {/* ========================================================= */}
      {isUploadDocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-sky-600" />
                <span>Téléverser un Document d'Entreprise</span>
              </h3>
              <button
                onClick={() => setIsUploadDocModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDoc} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nom / Intitulé du document</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Attestation de Non Faillite Tribunal de Cotonou"
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Numéro de référence / Acte</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: ACT-2026-COT-992"
                  value={newDoc.reference}
                  onChange={(e) => setNewDoc({ ...newDoc, reference: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Catégorie</label>
                  <select
                    value={newDoc.category}
                    onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value as CompanyDoc['category'] })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-sky-500 bg-white"
                  >
                    <option value="LEGAL">Juridique & Statuts</option>
                    <option value="TAX">Fiscal & Impôts DGI</option>
                    <option value="CONTRACT">Contrat & Avenant</option>
                    <option value="BANK">Bancaire & RIB</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Organisme Émetteur</label>
                  <input
                    type="text"
                    placeholder="Ex: DGI, Tribunal, Notaire"
                    value={newDoc.issuer}
                    onChange={(e) => setNewDoc({ ...newDoc, issuer: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center space-y-1 bg-slate-50">
                <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                <div className="text-[11px] font-bold text-slate-700">Sélectionnez le fichier PDF ou image scannée</div>
                <div className="text-[10px] text-slate-400">PDF, PNG, JPG jusqu'à 25 Mo</div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadDocModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs cursor-pointer"
                >
                  Enregistrer & Archiver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
