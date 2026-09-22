import React, { useState } from 'react';
import {
  Car,
  ShieldCheck,
  Wrench,
  TrendingDown,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  CheckCircle2,
  Clock,
  Radio,
  Building2,
  Calculator,
  ChevronDown,
  ChevronUp,
  FileText,
  Star,
  Sparkles,
  Send,
  Truck,
  Lock,
  UserPlus,
} from 'lucide-react';
import { JmfLogo } from '../common/JmfLogo.js';
import { ConvoyPublicFormView } from '../convoy/ConvoyPublicFormView.js';

interface PublicWebsiteViewProps {
  onGoToApp: (tab?: 'login' | 'register') => void;
  initialPublicPage?: 'home' | 'convoyage';
}

export const PublicWebsiteView: React.FC<PublicWebsiteViewProps> = ({ onGoToApp, initialPublicPage = 'home' }) => {
  const [activePublicPage, setActivePublicPage] = useState<'home' | 'convoyage'>(initialPublicPage);
  // Interactive TCO Simulator State
  const [fleetSize, setFleetSize] = useState<number>(25);
  const [monthlyKm, setMonthlyKm] = useState<number>(2500);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Quote Form State
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    fleetSize: '15-30',
    service: 'Flotte complète & Maintenance',
    notes: '',
  });
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  // Dynamic TCO calculation in FCFA
  // Average benchmark: 480 FCFA/km in Benin for commercial/passenger mix
  const estimatedAnnualExpense = fleetSize * monthlyKm * 12 * 450;
  const estimatedSavingsPercent = 21.5; // ~21.5% saved via JMF IoT, anti-fuel theft & planned maintenance
  const annualSavings = Math.round(estimatedAnnualExpense * (estimatedSavingsPercent / 100));

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitted(true);
  };

  const faqs = [
    {
      q: 'Comment s’effectue l’installation des balises télématiques GPS sur nos véhicules ?',
      a: 'Nos techniciens certifiés JMF interviennent directement sur vos sites (à Cotonou, Porto-Novo, Parakou ou dans vos locaux) ou dans notre atelier central d’Akpakpa. L’installation prend 30 à 45 minutes par véhicule sans altérer la garantie constructeur.',
    },
    {
      q: 'La plateforme est-elle conforme aux réglementations béninoises (ANaTT, CNSR, TVM) ?',
      a: 'Oui, JMF Fleet intègre nativement le calendrier réglementaire de la République du Bénin : suivi des visites techniques au CNSR, renouvellement des cartes grises ANaTT, paiement de la Taxe sur les Véhicules à Moteur (TVM) et alertes automatiques 30 jours avant échéance.',
    },
    {
      q: 'En quoi consiste le service de Gardiennage & Parc Sécurisé à Akpakpa ?',
      a: 'JMF met à votre disposition un hub logistique sécurisé de 10 000 m² à Cotonou Akpakpa, sous vidéosurveillance 24h/24, gardiennage armé, portique de lavage haute pression et procédure d’entrée/sortie certifiée par QR code et badge conducteur.',
    },
    {
      q: 'L’application mobile pour les chauffeurs fonctionne-t-elle hors connexion ?',
      a: 'Oui, l’application conducteur JMF dispose d’un mode hors-ligne complet. Les chauffeurs peuvent remplir leur check-list d’inspection avant départ et saisir les pleins de carburant même dans les zones à faible couverture réseau ; les données sont synchronisées dès le retour d’une connexion.',
    },
    {
      q: 'Vos tarifs sont-ils en FCFA et adaptés aux PME béninoises ?',
      a: 'Absolument. Toutes nos offres sont facturées en Francs CFA (XOF) avec des formules mensuelles ou annuelles flexibles, démarrant dès 5 véhicules jusqu’aux grands parcs de plus de 200 unités.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      {/* Top Notification Bar */}
      <div className="bg-[#081020] text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 font-medium">
              <Phone className="w-3.5 h-3.5 text-sky-400" /> +229 21 31 45 00 / 01 23 45 67
            </span>
            <span className="hidden sm:flex items-center gap-1.5 font-medium">
              <Mail className="w-3.5 h-3.5 text-sky-400" /> contact@jmf-mobility.com
            </span>
            <span className="hidden md:flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-sky-400" /> Boulevard de la Marina, Cotonou, Bénin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden lg:inline text-[11px] text-sky-300 font-semibold italic">« Votre mobilité, notre performance ! »</span>
            <button
              onClick={() => onGoToApp('login')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Lock className="w-3 h-3 text-sky-400" />
              <span>Connexion</span>
            </button>
            <button
              onClick={() => onGoToApp('register')}
              className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-md text-[11px] font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <UserPlus className="w-3 h-3" />
              <span>S'enregistrer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setActivePublicPage('home')} className="cursor-pointer">
              <JmfLogo variant="light" className="h-12" />
            </button>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <button
              onClick={() => setActivePublicPage('home')}
              className={`${activePublicPage === 'home' ? 'text-sky-600' : 'hover:text-sky-600'} transition-colors cursor-pointer`}
            >
              Accueil
            </button>
            <a href="#services" onClick={() => setActivePublicPage('home')} className="hover:text-sky-600 transition-colors">Services</a>
            <button
              onClick={() => setActivePublicPage('convoyage')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activePublicPage === 'convoyage'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Convoyage Pro</span>
            </button>
            <a href="#gardiennage" onClick={() => setActivePublicPage('home')} className="hover:text-sky-600 transition-colors">Parc Akpakpa</a>
            <a href="#simulateur" onClick={() => setActivePublicPage('home')} className="hover:text-sky-600 transition-colors">Simulateur TCO</a>
            <a href="#tarifs" onClick={() => setActivePublicPage('home')} className="hover:text-sky-600 transition-colors">Tarifs</a>
            <a href="#faq" onClick={() => setActivePublicPage('home')} className="hover:text-sky-600 transition-colors">FAQ</a>
            <a href="#contact" onClick={() => setActivePublicPage('home')} className="hover:text-sky-600 transition-colors">Devis</a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onGoToApp('login')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-sky-600 hover:bg-slate-50 transition-colors cursor-pointer border border-slate-200 sm:border-0"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Connexion</span>
            </button>
            <button
              onClick={() => onGoToApp('register')}
              className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition-all hover:scale-105 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>S'enregistrer</span>
            </button>
          </div>
        </div>
      </header>

      {activePublicPage === 'convoyage' ? (
        <main className="flex-1 bg-slate-50/50 py-6">
          <ConvoyPublicFormView onBack={() => setActivePublicPage('home')} />
        </main>
      ) : (
        <>
          {/* Hero Section */}
          <section id="accueil" className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span>Leader de la gestion et du gardiennage de flotte automobile au Bénin</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                Optimisez votre flotte automobile en toute sérénité.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                JMF Mobility Services accompagne les entreprises, institutions et logisticiens avec une suite logicielle tout-en-un couplée à nos hubs opérationnels : télématique temps réel, atelier de maintenance certifié et parc de gardiennage sécurisé à Cotonou Akpakpa.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onGoToApp('register')}
                  className="px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-lg shadow-sky-600/25 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>S'enregistrer / Créer un compte</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onGoToApp('login')}
                  className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-sm shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-sky-600" />
                  <span>Se connecter</span>
                </button>
                <button
                  onClick={() => setActivePublicPage('convoyage')}
                  className="px-5 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md shadow-amber-500/25 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                  <span>Convoyage Pro</span>
                </button>
              </div>

              {/* Trust badges */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">500+</div>
                  <div className="text-xs text-slate-500 font-medium">Véhicules sous gestion</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-600">98.4%</div>
                  <div className="text-xs text-slate-500 font-medium">Taux de disponibilité</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-sky-600">24/7</div>
                  <div className="text-xs text-slate-500 font-medium">Surveillance & Assistance</div>
                </div>
              </div>
            </div>

            {/* Right: Mockup Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white p-2">
                <img
                  src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1000"
                  alt="Flotte automobile JMF Mobility Cotonou"
                  className="w-full h-88 object-cover rounded-xl"
                />
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg font-bold">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Hub Akpakpa • Flotte 100% Connectée</div>
                      <div className="text-[10px] text-slate-500">Télématique GPS, carburant & conformité active</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-sky-600 font-mono">EN DIRECT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-sky-600">Piliers d'Excellence</h2>
            <h3 className="text-3xl font-black text-slate-900">Une offre globale pour votre mobilité d'entreprise</h3>
            <p className="text-sm text-slate-500">
              Des solutions concrètes pour superviser, entretenir, sécuriser et rentabiliser votre flotte automobile au Bénin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-sky-300 hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <Radio className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Télématique IoT & Suivi GPS</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Localisation temps réel sur corridors Bénin (RNIE 1 & 2), alertes vitesse, détection des arrêts prolongés et géorepérage du Port de Cotonou.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Wrench className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Maintenance & Atelier Agréé</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gestion des ordres de travail, vidanges programmées, réseau de garages agréés et pièces d'origine certifiées avec carnet d'entretien numérique.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Gardiennage & Parc Sécurisé</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hub de 10 000 m² à Akpakpa : surveillance 24/7, gardiennage armé, portique de lavage et procédures d'entrée/sortie numérisées par QR code.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-amber-300 hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <TrendingDown className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Contrôle Carburant & Anti-Vol</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Réconciliation des cartes TotalEnergies/Oryx, détection des siphonnages et des surconsommations avec suivi strict de la consommation L/100km.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-purple-300 hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Conformité ANaTT, CNSR & TVM</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Veille réglementaire automatisée : alertes d'expiration des assurances NSIA/Sanlam, visites techniques CNSR et vignettes fiscales TVM.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-rose-300 hover:shadow-md transition-all space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">App Mobile Conducteurs & Éco-Score</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Check-list de départ sur smartphone, signalement instantané des pannes avec photos, et notation de conduite souple et sécuritaire.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gardiennage & Hub Akpakpa Showcase */}
      <section id="gardiennage" className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-500/30">
                <Building2 className="w-4 h-4" />
                <span>Hub Opérationnel Central • Akpakpa Cotonou</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Parc Sécurisé & Centre de Gestion de 10 000 m²
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                Idéalement situé à proximité immédiate du Port Autonome de Cotonou, notre site logistique accueille les flottes d'entreprises, véhicules de transit, engins industriels et parcs concessionnaires en toute sécurité.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-200">
                    <span className="font-bold text-white">Surveillance 24/7 & Gardiennage Armé :</span> Clôture électrifiée périmétrique, caméras infrarouges haute définition et rondes continues.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-200">
                    <span className="font-bold text-white">Portique de Lavage & Baie d'Inspection :</span> Nettoyage régulier des véhicules de fonction et contrôle d'état d'arrivée/départ.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-200">
                    <span className="font-bold text-white">Gestion Dématérialisée :</span> Enregistrement instantané des mouvements par scan QR Code et badge RFID chauffeur.
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=1000"
                  alt="Parc automobile sécurisé Akpakpa"
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive TCO Simulator Section */}
      <section id="simulateur" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-sky-600">Simulateur d'Économies</h2>
            <h3 className="text-3xl font-black text-slate-900">Calculez le ROI de votre flotte</h3>
            <p className="text-sm text-slate-500">
              Découvrez en temps réel les économies annuelles générées par JMF Mobility en FCFA sur le carburant, la maintenance et les sinistres.
            </p>
          </div>

          <div className="max-w-4xl mx-auto mt-12 bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Controls */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-2">
                  <span>Taille de votre parc automobile :</span>
                  <span className="text-sky-600 font-mono text-sm">{fleetSize} véhicules</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="150"
                  step="5"
                  value={fleetSize}
                  onChange={(e) => setFleetSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>5 véhicules</span>
                  <span>75 véhicules</span>
                  <span>150+ véhicules</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-2">
                  <span>Kilométrage moyen mensuel par véhicule :</span>
                  <span className="text-sky-600 font-mono text-sm">{monthlyKm.toLocaleString('fr-FR')} km</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="6000"
                  step="250"
                  value={monthlyKm}
                  onChange={(e) => setMonthlyKm(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>1 000 km/mois (Urbain Cotonou)</span>
                  <span>6 000 km/mois (Corridors Parakou/Malanville)</span>
                </div>
              </div>

              <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 text-xs text-sky-900 space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  Méthode de calcul certifiée :
                </span>
                <p className="text-[11px] text-sky-800 leading-relaxed">
                  Basée sur l'optimisation des parcours (-12% de km superflus), la fin des détournements de carburant (-15%) et la diminution des casses moteur par maintenance préventive (-25%).
                </p>
              </div>
            </div>

            {/* Results card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-[#081020] text-white p-6 rounded-2xl shadow-xl space-y-6 text-center">
              <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Économie Annuelle Estimée</div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">
                {annualSavings.toLocaleString('fr-FR')} <span className="text-xs text-slate-300">FCFA</span>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Budget annuel théorique :</span>
                  <span className="font-mono">{estimatedAnnualExpense.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Réduction moyenne :</span>
                  <span>- {estimatedSavingsPercent}%</span>
                </div>
              </div>

              <a
                href="#contact"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
              >
                <span>Obtenir une étude personnalisée</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans in FCFA */}
      <section id="tarifs" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-sky-600">Tarification Transparente</h2>
            <h3 className="text-3xl font-black text-slate-900">Des formules adaptées à chaque taille de flotte</h3>
            <p className="text-sm text-slate-500">
              Sans frais cachés, facturées mensuellement en Francs CFA par véhicule sous gestion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* Plan 1 */}
            <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-6">
              <div>
                <h4 className="text-lg font-bold text-slate-900">Pack Télématique</h4>
                <p className="text-xs text-slate-500 mt-1">Idéal pour démarrer le suivi géolocalisé</p>
              </div>
              <div className="text-3xl font-black text-slate-900 font-mono">
                15 000 <span className="text-xs text-slate-500 font-normal">FCFA / véh. / mois</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-600 border-t border-slate-200 pt-4">
                <li className="flex items-center gap-2">✓ Balise GPS 4G avec carte SIM incluse</li>
                <li className="flex items-center gap-2">✓ Suivi en temps réel & historique trajets</li>
                <li className="flex items-center gap-2">✓ Alertes excès de vitesse & corridors</li>
                <li className="flex items-center gap-2">✓ Accès Web & Mobile 24/7</li>
              </ul>
              <a
                href="#contact"
                className="w-full block py-2.5 text-center text-xs font-bold border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Choisir cette formule
              </a>
            </div>

            {/* Plan 2: Best Value */}
            <div className="p-8 rounded-2xl border-2 border-sky-600 bg-white shadow-xl relative space-y-6">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-sky-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider">
                Le plus plébiscité
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Pack Pro Fleet Management</h4>
                <p className="text-xs text-slate-500 mt-1">Gestion 360° : Carburant, Atelier & Conformité</p>
              </div>
              <div className="text-3xl font-black text-sky-600 font-mono">
                35 000 <span className="text-xs text-slate-500 font-normal">FCFA / véh. / mois</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-700 border-t border-slate-100 pt-4 font-medium">
                <li className="flex items-center gap-2">✓ Tout le pack Télématique inclus</li>
                <li className="flex items-center gap-2">✓ Contrôle carburant & réconciliation cartes</li>
                <li className="flex items-center gap-2">✓ Planning des entretiens & ordres de travail</li>
                <li className="flex items-center gap-2">✓ Alertes conformité ANaTT / CNSR / TVM</li>
                <li className="flex items-center gap-2">✓ Application mobile Conducteurs & Éco-Score</li>
              </ul>
              <a
                href="#contact"
                className="w-full block py-2.5 text-center text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-md transition-colors"
              >
                Demander un devis Pro
              </a>
            </div>

            {/* Plan 3 */}
            <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-6">
              <div>
                <h4 className="text-lg font-bold text-slate-900">Pack Full Outsourcing</h4>
                <p className="text-xs text-slate-500 mt-1">Délégation totale avec Gardiennage Akpakpa</p>
              </div>
              <div className="text-3xl font-black text-slate-900 font-mono">
                Sur Mesure <span className="text-xs text-slate-500 font-normal">Étude personnalisée</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-600 border-t border-slate-200 pt-4">
                <li className="flex items-center gap-2">✓ Tout le pack Pro Fleet inclus</li>
                <li className="flex items-center gap-2">✓ Stationnement sécurisé au Parc Akpakpa</li>
                <li className="flex items-center gap-2">✓ Lavage & inspections systématiques</li>
                <li className="flex items-center gap-2">✓ Véhicule relais garanti en cas de panne</li>
                <li className="flex items-center gap-2">✓ Fleet Manager dédié dans vos locaux</li>
              </ul>
              <a
                href="#contact"
                className="w-full block py-2.5 text-center text-xs font-bold border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Consulter un expert
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-sky-600">Ils nous font confiance</h2>
            <h3 className="text-3xl font-black text-slate-900">Retour d'expérience de nos clients au Bénin</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 italic leading-relaxed">
                « Avec plus de 120 véhicules en circulation quotidienne à Cotonou et Calavi, JMF nous a permis de réduire notre facture mensuelle de carburant de 18% dès le troisième mois et de stopper les pannes imprévues. »
              </p>
              <div className="pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-900">Direction Générale</div>
                <div className="text-[11px] text-slate-500">Société de Distribution et Logistique SARL</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 italic leading-relaxed">
                « Le parc sécurisé d'Akpakpa est un atout stratégique pour nos convois portuaires. Les formalités d'entrée par QR code nous font gagner un temps précieux chaque matin pour nos chauffeurs. »
              </p>
              <div className="pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-900">Responsable Transit & Transport</div>
                <div className="text-[11px] text-slate-500">Opérateur de Transit Maritime Bénin</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 italic leading-relaxed">
                « Fini les amendes pour visites techniques ou assurances expirées. Les alertes automatiques à 30 jours et le carnet d'entretien numérique nous apportent une vraie tranquillité d'esprit. »
              </p>
              <div className="pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-900">Directeur Administratif & Financier</div>
                <div className="text-[11px] text-slate-500">Groupe Agro-Industriel Cotonou</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-sky-600">Questions Fréquentes</h2>
            <h3 className="text-3xl font-black text-slate-900">Tout savoir sur les solutions JMF Mobility</h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 overflow-hidden transition-all bg-slate-50/50"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-slate-900 hover:bg-slate-100/50"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-sky-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact & Quote Request Form */}
      <section id="contact" className="py-20 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold">
                <Send className="w-3.5 h-3.5" />
                <span>Contact & Devis Express</span>
              </div>
              <h3 className="text-3xl font-black tracking-tight">Parlons de votre flotte automobile</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Nos ingénieurs et fleet managers vous accompagnent pour un audit gratuit de votre parc et une démonstration complète en direct.
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-sky-400" />
                  <span>+229 21 31 45 00 / +229 01 23 45 67</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-sky-400" />
                  <span>contact@jmf-mobility.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-sky-400" />
                  <span>Boulevard de la Marina & Hub Akpakpa, Cotonou, Bénin</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white text-slate-900 p-8 rounded-2xl shadow-2xl">
              {quoteSubmitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900">Demande enregistrée avec succès !</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Merci {quoteForm.name}. Un conseiller JMF Mobility vous contactera sous 2 heures avec une proposition détaillée.
                  </p>
                  <button
                    onClick={() => setQuoteSubmitted(false)}
                    className="px-4 py-2 text-xs font-bold text-sky-600 bg-sky-50 rounded-lg"
                  >
                    Envoyer une autre demande
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuoteSubmit} className="space-y-4 text-xs">
                  <h4 className="text-base font-bold text-slate-900 mb-2">Demande de Devis Personnalisé</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Votre Nom & Prénom</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Jean KOUASSI"
                        value={quoteForm.name}
                        onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                        className="w-full p-2.5 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Nom de l'entreprise</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Société SARL"
                        value={quoteForm.company}
                        onChange={(e) => setQuoteForm({ ...quoteForm, company: e.target.value })}
                        className="w-full p-2.5 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Téléphone (+229)</label>
                      <input
                        type="tel"
                        required
                        placeholder="+229 97 00 00 00"
                        value={quoteForm.phone}
                        onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                        className="w-full p-2.5 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Email professionnel</label>
                      <input
                        type="email"
                        required
                        placeholder="contact@societe.com"
                        value={quoteForm.email}
                        onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                        className="w-full p-2.5 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Taille du parc</label>
                      <select
                        value={quoteForm.fleetSize}
                        onChange={(e) => setQuoteForm({ ...quoteForm, fleetSize: e.target.value })}
                        className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 font-medium"
                      >
                        <option value="5-15">5 à 15 véhicules</option>
                        <option value="15-30">15 à 30 véhicules</option>
                        <option value="30-75">30 à 75 véhicules</option>
                        <option value="75+">Plus de 75 véhicules</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Service recherché</label>
                      <select
                        value={quoteForm.service}
                        onChange={(e) => setQuoteForm({ ...quoteForm, service: e.target.value })}
                        className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 font-medium"
                      >
                        <option value="Flotte complète & Maintenance">Flotte complète & Maintenance</option>
                        <option value="Télématique & GPS seul">Télématique & GPS seul</option>
                        <option value="Gardiennage Akpakpa">Gardiennage & Stockage Akpakpa</option>
                        <option value="Délégation complète Outsourcing">Délégation totale (Full Outsourcing)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Précisions éventuelles</label>
                    <textarea
                      rows={3}
                      placeholder="Indiquez vos besoins particuliers, types de véhicules (VP, pick-up, camions)..."
                      value={quoteForm.notes}
                      onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-lg"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-2"
                  >
                    <span>Recevoir mon devis gratuit sous 2h</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      </>
      )}

      {/* Footer */}
      <footer className="bg-[#050B16] text-slate-400 py-12 px-4 sm:px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <JmfLogo variant="dark" className="h-10 mx-auto md:mx-0" />
            <p className="text-xs text-slate-400 max-w-sm">
              JMF Mobility Services — Solutions de mobilité, gestion de flotte automobile, atelier d'entretien et gardiennage au Bénin et en Afrique de l'Ouest.
            </p>
          </div>

          <div className="text-center md:text-right text-xs space-y-1">
            <div className="text-white font-semibold">« Votre mobilité, notre performance ! »</div>
            <div>© 2026 JMF Mobility Services. Tous droits réservés.</div>
            <div className="text-slate-500 font-mono text-[11px]">Plateforme SaaS v1.2.0 • Hébergé en Afrique de l'Ouest</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
