import React, { useState } from 'react';
import {
  Car,
  Fuel,
  Gauge,
  AlertTriangle,
  FileText,
  PhoneCall,
  CheckCircle,
  MapPin,
  Clock,
  ShieldCheck,
  X,
  Camera,
  Check,
  Upload,
  AlertCircle,
  Phone,
} from 'lucide-react';
import { JmfLogo } from '../common/JmfLogo.js';

export const MobileAppPreview: React.FC = () => {
  const [odometerKm, setOdometerKm] = useState<number>(56780);
  const [fuelPercent, setFuelPercent] = useState<number>(65);
  const [activeModal, setActiveModal] = useState<'odometer' | 'fuel' | 'incident' | 'docs' | 'emergency' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [newOdoInput, setNewOdoInput] = useState<string>('56850');
  const [fuelStation, setFuelStation] = useState<string>('TotalEnergies Marina Cotonou');
  const [fuelLiters, setFuelLiters] = useState<string>('40');
  const [fuelAmount, setFuelAmount] = useState<string>('54600');
  const [incidentType, setIncidentType] = useState<string>('Pneumatiques (Crevaison / Perte pression)');
  const [incidentDesc, setIncidentDesc] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveOdometer = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(newOdoInput, 10);
    if (!isNaN(val) && val > 0) {
      setOdometerKm(val);
      setActiveModal(null);
      showToast(`Compteur actualisé à ${val.toLocaleString('fr-FR')} km !`);
    }
  };

  const handleSaveFuel = (e: React.FormEvent) => {
    e.preventDefault();
    setFuelPercent(95);
    setActiveModal(null);
    showToast(`Plein de ${fuelLiters}L enregistré à la station ${fuelStation} !`);
  };

  const handleSaveIncident = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveModal(null);
    showToast(`Ticket d'incident transmis en direct à l'atelier Akpakpa !`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-3.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Application Conducteur Connectée</span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Application Mobile JMF Driver</h1>
        <p className="text-xs text-slate-500">
          Interface interactive pour les conducteurs : relevez votre kilométrage, saisissez vos pleins de carburant, signalez des incidents ou contactez l'assistance 24/7.
        </p>
      </div>

      {/* Centered Phone Mockup */}
      <div className="flex justify-center py-4">
        <div className="w-full max-w-[370px] bg-slate-900 p-3 rounded-[40px] shadow-2xl border-4 border-slate-800 relative">
          {/* Phone notch */}
          <div className="w-32 h-4 bg-slate-950 rounded-full mx-auto mb-2" />

          {/* Screen Content */}
          <div className="bg-slate-50 rounded-[30px] overflow-hidden text-slate-800 shadow-inner flex flex-col min-h-[640px] text-xs relative">
            {/* App Header */}
            <div className="bg-[#0B1528] text-white p-4 pt-6 space-y-3">
              <div className="flex items-center justify-between">
                <JmfLogo variant="dark" className="h-7" />
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  En ligne
                </span>
              </div>
              <div>
                <div className="text-slate-400 text-[11px]">Bonjour,</div>
                <div className="text-base font-bold text-white">Pierre DOSSOU 👋</div>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              {/* Assigned Vehicle Card */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-600">Véhicule assigné</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold">
                    Actif
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=200"
                    alt="Peugeot 3008"
                    className="w-16 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <div className="font-black text-slate-900 text-sm font-mono">BJ-1234-CD</div>
                    <div className="text-[11px] text-slate-500">Peugeot 3008 BlueHDi</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                  <div>
                    <span className="text-slate-600">Compteur: </span>
                    <span className="font-bold text-slate-900">{odometerKm.toLocaleString('fr-FR')} km</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Carburant: </span>
                    <span className="font-bold text-sky-600">{fuelPercent}%</span>
                  </div>
                </div>
              </div>

              {/* 4 Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => setActiveModal('odometer')}
                  className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-sky-400 hover:bg-sky-50/40 text-left space-y-1 transition-all active:scale-95"
                >
                  <Gauge className="w-5 h-5 text-sky-600" />
                  <div className="font-bold text-slate-800 text-[11px]">Relever compteur</div>
                  <div className="text-[9px] text-slate-600">Mise à jour km</div>
                </button>

                <button
                  onClick={() => setActiveModal('fuel')}
                  className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-emerald-400 hover:bg-emerald-50/40 text-left space-y-1 transition-all active:scale-95"
                >
                  <Fuel className="w-5 h-5 text-emerald-600" />
                  <div className="font-bold text-slate-800 text-[11px]">Nouveau plein</div>
                  <div className="text-[9px] text-slate-600">Scanner ticket reçu</div>
                </button>

                <button
                  onClick={() => setActiveModal('incident')}
                  className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-rose-400 hover:bg-rose-50/40 text-left space-y-1 transition-all active:scale-95"
                >
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <div className="font-bold text-slate-800 text-[11px]">Signaler panne</div>
                  <div className="text-[9px] text-slate-600">Ouverture ticket</div>
                </button>

                <button
                  onClick={() => setActiveModal('docs')}
                  className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-purple-400 hover:bg-purple-50/40 text-left space-y-1 transition-all active:scale-95"
                >
                  <FileText className="w-5 h-5 text-purple-600" />
                  <div className="font-bold text-slate-800 text-[11px]">Mes documents</div>
                  <div className="text-[9px] text-slate-600">Permis & attestations</div>
                </button>
              </div>

              {/* SOS Hotline Button */}
              <button
                onClick={() => setActiveModal('emergency')}
                className="w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm text-xs transition-all active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Assistance JMF 24/7 (Urgence)</span>
              </button>

              {/* Eco-Score badge */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-emerald-900 uppercase">Éco-Score Semaine</div>
                  <div className="text-xs font-bold text-emerald-800">Conduite optimale • 92/100</div>
                </div>
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
            </div>

            {/* Mobile In-App Modals */}
            {activeModal === 'odometer' && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-end justify-center z-50 p-3">
                <div className="bg-white rounded-2xl p-4 w-full space-y-3 animate-in slide-in-from-bottom-5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Gauge className="w-4 h-4 text-sky-600" />
                      Relevé du compteur
                    </span>
                    <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <form onSubmit={handleSaveOdometer} className="space-y-3 text-xs">
                    <div>
                      <label className="text-slate-600 text-[10px] font-bold">Kilométrage actuel affiché</label>
                      <input
                        type="number"
                        required
                        value={newOdoInput}
                        onChange={(e) => setNewOdoInput(e.target.value)}
                        className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-sm font-bold font-mono focus:border-sky-500"
                        placeholder="Ex: 56850"
                      />
                    </div>
                    <div className="p-2 border border-dashed border-slate-300 rounded-lg text-center text-slate-500 flex items-center justify-center gap-2">
                      <Camera className="w-4 h-4 text-sky-600" />
                      <span className="text-[11px]">Photo compteur (automatique)</span>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold text-xs"
                    >
                      Valider le relevé
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeModal === 'fuel' && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-end justify-center z-50 p-3">
                <div className="bg-white rounded-2xl p-4 w-full space-y-3 animate-in slide-in-from-bottom-5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Fuel className="w-4 h-4 text-emerald-600" />
                      Nouveau plein carburant
                    </span>
                    <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <form onSubmit={handleSaveFuel} className="space-y-2.5 text-xs">
                    <div>
                      <label className="text-slate-600 text-[10px] font-bold">Station service</label>
                      <select
                        value={fuelStation}
                        onChange={(e) => setFuelStation(e.target.value)}
                        className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="TotalEnergies Marina Cotonou">TotalEnergies Marina</option>
                        <option value="Oryx Étoile Rouge Cotonou">Oryx Étoile Rouge</option>
                        <option value="TotalEnergies Ganhi Cotonou">TotalEnergies Ganhi</option>
                        <option value="Benin Petro Akpakpa">Benin Petro Akpakpa</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-slate-600 text-[10px] font-bold">Litres</label>
                        <input
                          type="number"
                          required
                          value={fuelLiters}
                          onChange={(e) => setFuelLiters(e.target.value)}
                          className="w-full mt-1 p-2 border border-slate-200 rounded-lg font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-slate-600 text-[10px] font-bold">Montant (FCFA)</label>
                        <input
                          type="number"
                          required
                          value={fuelAmount}
                          onChange={(e) => setFuelAmount(e.target.value)}
                          className="w-full mt-1 p-2 border border-slate-200 rounded-lg font-bold"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs"
                    >
                      Enregistrer le reçu
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeModal === 'incident' && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-end justify-center z-50 p-3">
                <div className="bg-white rounded-2xl p-4 w-full space-y-3 animate-in slide-in-from-bottom-5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      Signaler une anomalie
                    </span>
                    <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <form onSubmit={handleSaveIncident} className="space-y-2.5 text-xs">
                    <div>
                      <label className="text-slate-600 text-[10px] font-bold">Nature du problème</label>
                      <select
                        value={incidentType}
                        onChange={(e) => setIncidentType(e.target.value)}
                        className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="Pneumatiques (Crevaison)">Pneumatiques (Crevaison)</option>
                        <option value="Freinage / Bruit suspect">Freinage / Bruit suspect</option>
                        <option value="Voyant moteur allumé">Voyant moteur allumé</option>
                        <option value="Batterie / Démarrage difficile">Batterie / Démarrage</option>
                        <option value="Climatisation inopérante">Climatisation inopérante</option>
                        <option value="Choc / Carrosserie">Choc / Carrosserie</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-600 text-[10px] font-bold">Description complémentaire</label>
                      <textarea
                        rows={2}
                        value={incidentDesc}
                        onChange={(e) => setIncidentDesc(e.target.value)}
                        placeholder="Précisez les circonstances..."
                        className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs"
                    >
                      Envoyer à l'atelier Akpakpa
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeModal === 'docs' && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-end justify-center z-50 p-3">
                <div className="bg-white rounded-2xl p-4 w-full space-y-3 animate-in slide-in-from-bottom-5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-purple-600" />
                      Mes documents de bord
                    </span>
                    <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">Permis ANaTT (B & C)</div>
                        <div className="text-[10px] text-slate-500">N° BJ-2018-99214 • Valide 2028</div>
                      </div>
                      <span className="text-emerald-600 font-bold text-[10px]">À jour</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">Attestation CNSR</div>
                        <div className="text-[10px] text-slate-500">BJ-1234-CD • Échéance 20/05/2027</div>
                      </div>
                      <span className="text-emerald-600 font-bold text-[10px]">Valide</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">Assurance NSIA Flotte</div>
                        <div className="text-[10px] text-slate-500">Police N° 098 • Tous Risques</div>
                      </div>
                      <span className="text-emerald-600 font-bold text-[10px]">Actif</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      showToast('Dossier documents téléchargé sur le mobile');
                    }}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-xs"
                  >
                    Télécharger attestation numérique
                  </button>
                </div>
              </div>
            )}

            {activeModal === 'emergency' && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-end justify-center z-50 p-3">
                <div className="bg-white rounded-2xl p-4 w-full space-y-3 animate-in slide-in-from-bottom-5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-black text-rose-600 flex items-center gap-1.5">
                      <PhoneCall className="w-4 h-4" />
                      Assistance JMF 24/7 (SOS)
                    </span>
                    <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 text-xs space-y-1">
                    <div className="font-bold">Dépanneuse et assistance prioritaire</div>
                    <div className="text-[11px]">Position GPS transmise au centre de commandement : Cotonou Marina</div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <a
                      href="tel:+22921314500"
                      onClick={() => showToast('Appel d urgence vers le PC de sécurité JMF')}
                      className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Appeler le +229 21 31 45 00</span>
                    </a>
                    <button
                      onClick={() => {
                        setActiveModal(null);
                        showToast('Alerte SOS émise : véhicule relais en route !');
                      }}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs"
                    >
                      Demander un véhicule relais immédiat
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
