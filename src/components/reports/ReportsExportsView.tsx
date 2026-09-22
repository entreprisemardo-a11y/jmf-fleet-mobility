import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  PieChart,
  Truck,
  Fuel,
  Wrench,
  ShieldCheck,
  AlertTriangle,
  Search,
  Check,
  Building2,
  Users,
  Radio,
  FileSpreadsheet,
  ArrowDownToLine,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface ReportsExportsViewProps {
  currentSubView?: string;
  onNavigateSubView?: (subView: string) => void;
}

interface ReportItem {
  id: string;
  title: string;
  category: 'EXPLOITATION' | 'CARBURANT' | 'MAINTENANCE' | 'CONFORMITE' | 'RSE';
  frequency: string;
  lastGenerated: string;
  fileFormat: 'PDF' | 'EXCEL' | 'MULTI';
  description: string;
  keyMetric: string;
  keyMetricLabel: string;
}

const AVAILABLE_REPORTS: ReportItem[] = [
  {
    id: 'rep_monthly_ops',
    title: 'Rapport Mensuel d’Exploitation & Kilométrage',
    category: 'EXPLOITATION',
    frequency: 'Mensuel (Septembre 2026)',
    lastGenerated: '21/09/2026 à 08:30',
    fileFormat: 'PDF',
    description: 'Synthèse de l’activité globale de la flotte : taux d’utilisation par véhicule, rotation des missions, répartition des trajets urbains vs interurbains Bénin.',
    keyMetric: '458 900 km',
    keyMetricLabel: 'Distance cumulée',
  },
  {
    id: 'rep_fuel_efficiency',
    title: 'Audit Carburant, Cartes & Éco-Conduite',
    category: 'CARBURANT',
    frequency: 'Hebdomadaire & Mensuel',
    lastGenerated: '20/09/2026 à 18:00',
    fileFormat: 'MULTI',
    description: 'Rapprochement des cartes TotalEnergies/Oryx, détection des anomalies de consommation anormale (>12L/100km) et classements des chauffeurs éco-responsables.',
    keyMetric: '9.8 L/100',
    keyMetricLabel: 'Conso moyenne parc',
  },
  {
    id: 'rep_maintenance_costs',
    title: 'Bilan Maintenance Préventive & Coûts d’Atelier',
    category: 'MAINTENANCE',
    frequency: 'Mensuel',
    lastGenerated: '19/09/2026 à 14:15',
    fileFormat: 'PDF',
    description: 'Ventilation des interventions préventives vs curatives, approvisionnement en pièces d’usure (plaquettes, filtres, pneumatiques) et temps moyen d’immobilisation.',
    keyMetric: '94.4%',
    keyMetricLabel: 'Taux disponibilité',
  },
  {
    id: 'rep_cnsr_compliance',
    title: 'Audit de Conformité Réglementaire & Sécurité CNSR',
    category: 'CONFORMITE',
    frequency: 'Bimensuel',
    lastGenerated: '21/09/2026 à 07:00',
    fileFormat: 'MULTI',
    description: 'Tableau de bord exhaustif des validités : visites techniques CNSR Cotonou/Parakou, polices assurances NSIA/Sanlam, TVM DGI et extincteurs certifiés SIC.',
    keyMetric: '92.0%',
    keyMetricLabel: 'Taux conformité',
  },
  {
    id: 'rep_carbon_footprint',
    title: 'Bilan Empreinte Carbone & Émissions CO2',
    category: 'RSE',
    frequency: 'Trimestriel (T3 2026)',
    lastGenerated: '15/09/2026 à 10:00',
    fileFormat: 'PDF',
    description: 'Calcul des tonnes équivalent CO2 émises sur les corridors routiers béninois et recommandations d’optimisation des tournées logistiques.',
    keyMetric: '118.4 t',
    keyMetricLabel: 'CO2 estimé ce mois',
  },
];

export const ReportsExportsView: React.FC<ReportsExportsViewProps> = ({
  currentSubView = 'reports_overview',
  onNavigateSubView,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'exports'>('overview');
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Export State
  const [selectedDataset, setSelectedDataset] = useState<string>('fleet');
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const [selectedSite, setSelectedSite] = useState<string>('ALL');

  useEffect(() => {
    if (currentSubView === 'reports_exports') {
      setActiveTab('exports');
    } else if (currentSubView === 'reports_overview' || currentSubView?.startsWith('reports')) {
      setActiveTab('overview');
    }
  }, [currentSubView]);

  const handleSubTabSwitch = (tab: 'overview' | 'exports') => {
    setActiveTab(tab);
    if (onNavigateSubView) {
      if (tab === 'exports') onNavigateSubView('reports_exports');
      else onNavigateSubView('reports_overview');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDownloadReport = (rep: ReportItem) => {
    const reportText = `=====================================================
JMF FLEET & MOBILITY - RAPPORT DE SYNTHÈSE OFFICIEL
Rapport : ${rep.title}
Catégorie : ${rep.category}
Période : ${rep.frequency}
Date de génération : ${rep.lastGenerated}
-----------------------------------------------------
INDICATEUR CLÉ : ${rep.keyMetric} (${rep.keyMetricLabel})
Flotte supervisée : 125 Véhicules opérationnels
Sites : Cotonou Marina, Akpakpa, Port, Parakou
-----------------------------------------------------
RÉSUMÉ ANALYTIQUE :
${rep.description}

DÉTAILS DES OBSERVATIONS :
- 118 véhicules en circulation sans anomalie critique.
- Consommation moyenne stabilisée à 9.8 L/100 km.
- 0 immobilisation imprévue supérieure à 48 heures.
- 100% des documents réglementaires prioritaires à jour (Assurances NSIA & Visites CNSR).
=====================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${rep.id}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Rapport « ${rep.title} » téléchargé avec succès !`);
  };

  const handleExecuteExport = () => {
    let filename = '';
    let content = '';

    if (selectedDataset === 'fleet') {
      filename = `export_flotte_vehicules_jmf_${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      if (exportFormat === 'csv') {
        content = `Immatriculation,Marque,Modele,Categorie,Site,Statut,Chauffeur,Kilometrage,Derniere_Revision
"BJ-4501-RB","Toyota","Hilux Double Cabine 4x4","Pick-up","Hub Logistique Akpakpa","EN SERVICE","Pierre DOSSOU",68400,"2026-08-15"
"BJ-8822-RC","Peugeot","Partner HDI","Fourgonnette","Siège Administratif (Marina)","EN SERVICE","Sylvain TOSSOU",41200,"2026-08-20"
"BJ-1092-RA","Renault","Duster 1.5 dCi","SUV","Base Portuaire","EN SERVICE","Mathieu KPADONOU",89000,"2026-07-28"
"BJ-3304-RB","Mercedes-Benz","Actros 3340","Poids Lourd","Hub Logistique Akpakpa","EN SERVICE","Michel HOUNGBO",145000,"2026-08-10"
"BJ-7119-RC","Toyota","Land Cruiser Prado TXL","VIP Direction","Siège Administratif (Marina)","EN SERVICE","Koffi AMAN",52300,"2026-09-02"`;
      } else {
        content = JSON.stringify([
          { immat: 'BJ-4501-RB', marque: 'Toyota', modele: 'Hilux 4x4', site: 'Akpakpa', statut: 'EN SERVICE', km: 68400 },
          { immat: 'BJ-8822-RC', marque: 'Peugeot', modele: 'Partner', site: 'Marina', statut: 'EN SERVICE', km: 41200 },
          { immat: 'BJ-1092-RA', marque: 'Renault', modele: 'Duster', site: 'Port', statut: 'EN SERVICE', km: 89000 },
        ], null, 2);
      }
    } else if (selectedDataset === 'fuel') {
      filename = `export_journal_carburant_jmf_${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      content = `Date,Vehicule,Conducteur,Station,Litre,Montant_FCFA,Kilometrage_Saisi,Ratio_L100
"2026-09-20","BJ-4501-RB","Pierre DOSSOU","TotalEnergies Akpakpa",65.5,45850,68400,9.6
"2026-09-19","BJ-8822-RC","Sylvain TOSSOU","Oryx Marina",48.0,33600,41200,7.2
"2026-09-18","BJ-3304-RB","Michel HOUNGBO","Shell Port Cotonou",180.0,126000,145000,28.4`;
    } else if (selectedDataset === 'maintenance') {
      filename = `export_carnet_maintenance_jmf_${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      content = `Date,Vehicule,Nature_Intervention,Atelier,Cout_Pieces_FCFA,Main_Oeuvre_FCFA,Statut
"2026-09-15","BJ-4501-RB","Vidange complète & remplacement filtres","Atelier Central JMF",45000,15000,"CLÔTURÉ"
"2026-09-10","BJ-8822-RC","Plaquettes de frein avant & disques","Atelier JMF",62000,18000,"CLÔTURÉ"
"2026-09-04","BJ-1092-RA","Remplacement amortisseurs arrière","Atelier JMF",95000,25000,"CLÔTURÉ"`;
    } else {
      filename = `export_conformite_documents_jmf_${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      content = `Vehicule,Document,Emetteur,Date_Emission,Date_Expiration,Statut
"BJ-4501-RB","Visite Technique","CNSR Cotonou","2026-03-15","2027-03-15","VALIDE"
"BJ-4501-RB","Police Assurance","NSIA Bénin","2026-01-01","2026-12-31","VALIDE"
"BJ-8822-RC","Taxe Véhicules (TVM)","DGI Bénin","2026-01-10","2026-12-31","VALIDE"`;
    }

    const mimeType = exportFormat === 'csv' ? 'text/csv;charset=utf-8;' : 'application/json;charset=utf-8;';
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Exportation réussie : « ${filename} » prêt et téléchargé !`);
  };

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
            <span>Rapports & Décisionnel</span>
            <span>&gt;</span>
            <span className="font-semibold text-slate-700">
              {activeTab === 'overview' ? 'Synthèses & Audits de Flotte' : 'Centre d’Exports de Données'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-sky-600" />
            <span>
              {activeTab === 'overview' ? 'Rapports & Analyses d’Activité' : 'Centre d’Exports Multi-Formats'}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeTab === 'overview'
              ? 'Rapports consolidés d’exploitation, audits de conformité CNSR, bilans carburant et KPI décisionnels.'
              : 'Extraction instantanée de vos données brutes de flotte aux formats CSV (Excel) et JSON filtrées par site.'}
          </p>
        </div>

        {/* 2 Sub-tabs matching the sidebar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto">
            <button
              onClick={() => handleSubTabSwitch('overview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-white text-sky-700 shadow-xs ring-1 ring-sky-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-sky-600" />
              <span>Rapports & Audits ({AVAILABLE_REPORTS.length})</span>
            </button>
            <button
              onClick={() => handleSubTabSwitch('exports')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'exports'
                  ? 'bg-white text-sky-700 shadow-xs ring-1 ring-sky-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowDownToLine className="w-3.5 h-3.5 text-sky-600" />
              <span>Centre d’Exports (CSV / Excel)</span>
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
              <button
                onClick={() => setPeriod('month')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  period === 'month' ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Septembre 2026
              </button>
              <button
                onClick={() => setPeriod('quarter')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  period === 'quarter' ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                T3 2026
              </button>
              <button
                onClick={() => setPeriod('year')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  period === 'year' ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Année 2026
              </button>
            </div>
          )}
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Taux de Disponibilité</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">94.4%</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">118 sur 125 véhicules prêts</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Conformité Légale</span>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-sky-600 mt-2">92.0%</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">CNSR, NSIA, TVM à jour</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Conso Moyenne Flotte</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Fuel className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">9.8 L/100</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">-0.4L vs mois précédent</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Distance Cumulée</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">458 900 km</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Parcourus sur le réseau Bénin</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VUE 1 : RAPPORTS ET AUDITS */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List of 5 Standard Reports */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Rapports d’Activité Consolidés</h3>
                <span className="text-xs text-slate-500">Mise à jour en temps réel</span>
              </div>

              <div className="space-y-3">
                {AVAILABLE_REPORTS.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-sky-300 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                            {rep.category}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">• {rep.frequency}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{rep.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{rep.description}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-base font-black text-slate-900 font-mono">{rep.keyMetric}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">{rep.keyMetricLabel}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                      <span className="text-slate-400 text-[11px]">Dernière extraction : {rep.lastGenerated}</span>
                      <button
                        onClick={() => handleDownloadReport(rep)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold rounded-lg transition-colors cursor-pointer text-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Télécharger le Rapport</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Insights Sidebar */}
            <div className="space-y-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-sky-600" />
                  <span>Répartition de l’Activité par Catégorie</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-slate-700">Pick-up 4x4 (Missions & Chantiers)</span>
                      <span className="text-slate-900 font-bold">42% (52 véh.)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-sky-600 h-full rounded-full w-[42%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-slate-700">Fourgonnettes & Utilitaires Logistique</span>
                      <span className="text-slate-900 font-bold">28% (35 véh.)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full w-[28%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-slate-700">Berlines & SUV Direction VIP</span>
                      <span className="text-slate-900 font-bold">18% (23 véh.)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full w-[18%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-slate-700">Poids Lourds & Frigorifiques Port</span>
                      <span className="text-slate-900 font-bold">12% (15 véh.)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full w-[12%]"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instant Global Pack Export */}
              <div className="p-5 bg-gradient-to-br from-sky-900 to-indigo-950 text-white rounded-2xl shadow-md space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-300" />
                  <span className="text-xs font-bold text-sky-200 uppercase tracking-wider">Pack Direction</span>
                </div>
                <h4 className="text-base font-bold">Rapport Annuel Consolidé Flotte 2026</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Générez en un seul document l’intégralité des indicateurs : TCO, consommation de carburant, registre CNSR et interventions de maintenance.
                </p>
                <button
                  onClick={() =>
                    handleDownloadReport({
                      id: 'rep_pack_direction',
                      title: 'Pack Direction - Synthèse Globale Flotte',
                      category: 'EXPLOITATION',
                      frequency: 'Annuelle 2026',
                      lastGenerated: '21/09/2026',
                      fileFormat: 'PDF',
                      description: 'Compilation complète du TCO, des coûts kilométriques et des audits réglementaires.',
                      keyMetric: '100% Conforme',
                      keyMetricLabel: 'Audit validé',
                    })
                  }
                  className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger Rapport Global PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VUE 2 : CENTRE D'EXPORTS */}
      {/* ========================================================================= */}
      {activeTab === 'exports' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Paramétrage de l’Extraction de Données</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sélectionnez le jeu de données, la base d’exploitation et le format souhaité pour exporter immédiatement vos données.
              </p>
            </div>

            {/* Step 1: Select Dataset */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                1. Choisissez le Jeu de Données à Exporter
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedDataset('fleet')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-1.5 ${
                    selectedDataset === 'fleet'
                      ? 'border-sky-500 bg-sky-50/50 ring-2 ring-sky-200'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <Truck className="w-5 h-5 text-sky-600" />
                  <div className="font-bold text-xs text-slate-900">Parc & Fiches Véhicules</div>
                  <p className="text-[11px] text-slate-500">125 véhicules, spécifications, statuts, affectations</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDataset('fuel')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-1.5 ${
                    selectedDataset === 'fuel'
                      ? 'border-sky-500 bg-sky-50/50 ring-2 ring-sky-200'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <Fuel className="w-5 h-5 text-amber-600" />
                  <div className="font-bold text-xs text-slate-900">Journal des Pleins Carburant</div>
                  <p className="text-[11px] text-slate-500">Dates, litrages, montants FCFA, stations Total/Oryx</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDataset('maintenance')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-1.5 ${
                    selectedDataset === 'maintenance'
                      ? 'border-sky-500 bg-sky-50/50 ring-2 ring-sky-200'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <Wrench className="w-5 h-5 text-emerald-600" />
                  <div className="font-bold text-xs text-slate-900">Ordres de Travaux Atelier</div>
                  <p className="text-[11px] text-slate-500">Révisions, pièces d’usure, factures prestataires</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDataset('docs')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-1.5 ${
                    selectedDataset === 'docs'
                      ? 'border-sky-500 bg-sky-50/50 ring-2 ring-sky-200'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 text-purple-600" />
                  <div className="font-bold text-xs text-slate-900">Conformité Légale & Assurances</div>
                  <p className="text-[11px] text-slate-500">Dates de validité CNSR, NSIA, TVM, extincteurs</p>
                </button>
              </div>
            </div>

            {/* Step 2: Site Filter & Format */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  2. Filtrer par Site Opérationnel
                </label>
                <select
                  value={selectedSite}
                  onChange={(e) => setSelectedSite(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 font-medium"
                >
                  <option value="ALL">Tous les sites (125 véhicules)</option>
                  <option value="marina">Siège Administratif & Direction (Marina - 45 véh.)</option>
                  <option value="akpakpa">Hub Logistique & Gardiennage (Akpakpa - 52 véh.)</option>
                  <option value="port">Base Opérationnelle Portuaire (18 véh.)</option>
                  <option value="parakou">Agence Régionale Nord (Parakou - 10 véh.)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  3. Format du Fichier
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setExportFormat('csv')}
                    className={`flex-1 p-2.5 border rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      exportFormat === 'csv'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>CSV / Microsoft Excel</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExportFormat('json')}
                    className={`flex-1 p-2.5 border rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      exportFormat === 'json'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-800'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>JSON Brut (API/ERP)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Extraction instantanée générée côté client sans délai de traitement.
              </div>
              <button
                type="button"
                onClick={handleExecuteExport}
                className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger l’Export Immédiat</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
