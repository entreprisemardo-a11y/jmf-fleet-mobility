import React, { useState } from 'react';
import {
  Car,
  MapPin,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Send,
  Upload,
  ArrowRight,
  Info,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { ApiClient } from '../../services/api.js';

interface ConvoyPublicFormViewProps {
  onBack?: () => void;
  onSuccessNavigate?: (reference: string) => void;
}

export const ConvoyPublicFormView: React.FC<ConvoyPublicFormViewProps> = ({ onBack, onSuccessNavigate }) => {
  const [formData, setFormData] = useState({
    // Section 1: Vehicle
    vehicle_brand: '',
    vehicle_model: '',
    vehicle_year: new Date().getFullYear(),
    vehicle_plate: '',
    is_registered: true,
    vehicle_color: '',
    vehicle_condition: 'good',
    condition_details: '',
    requires_flatbed: false,

    // Section 2: Route & details
    pickup_address: '',
    pickup_city: 'Cotonou',
    pickup_country: 'Bénin',
    delivery_address: '',
    delivery_city: 'Porto-Novo',
    delivery_country: 'Bénin',
    desired_date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    desired_time: '09:00',
    convoy_type: 'company',
    convoy_mode: 'driver',
    access_instructions: '',

    // Section 3: Requester
    client_name: '',
    client_company: '',
    client_email: '',
    client_phone: '+229 ',
    client_country: 'Bénin',

    // Section 4: Notes & agreement
    special_instructions: '',
    privacy_accepted: false,

    // Anti-spam honeypot (hidden)
    _hp: '',
  });

  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedReference, setSubmittedReference] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const vehicleBrands = [
    'Toyota', 'Peugeot', 'Renault', 'Mercedes-Benz', 'Hyundai', 'Nissan',
    'Kia', 'Mitsubishi', 'Ford', 'Volkswagen', 'BMW', 'Suzuki', 'Isuzu', 'Autre'
  ];

  const westAfricanCountries = [
    'Bénin', 'Togo', 'Côte d’Ivoire', 'Nigéria', 'Ghana', 'Burkina Faso', 'Niger', 'Sénégal', 'Autre'
  ];

  const handleConditionChange = (condition: string) => {
    const requiresPlateau = condition === 'non_running' || condition === 'breakdown' || condition === 'damaged';
    setFormData(prev => ({
      ...prev,
      vehicle_condition: condition,
      requires_flatbed: requiresPlateau || prev.requires_flatbed,
      convoy_mode: requiresPlateau ? 'flatbed' : prev.convoy_mode,
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newUrls = files.map((_, i) =>
        `https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400&sig=${Date.now() + i}`
      );
      setUploadedPhotos(prev => [...prev, ...newUrls].slice(0, 4));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic client validation
    if (!formData.vehicle_brand.trim() || !formData.vehicle_model.trim()) {
      setErrorMessage('Veuillez renseigner la marque et le modèle du véhicule.');
      return;
    }
    if (!formData.pickup_address.trim() || !formData.delivery_address.trim()) {
      setErrorMessage('Veuillez renseigner les adresses de prise en charge et de livraison.');
      return;
    }
    if (!formData.client_name.trim() || !formData.client_email.trim() || !formData.client_phone.trim()) {
      setErrorMessage('Veuillez renseigner vos coordonnées complètes (nom, email, téléphone).');
      return;
    }
    if (!formData.privacy_accepted) {
      setErrorMessage('Veuillez accepter la politique de traitement des données pour continuer.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await ApiClient.submitPublicConvoy(formData);
      if (res && res.success) {
        setSubmittedReference(res.reference);
        if (onSuccessNavigate) {
          onSuccessNavigate(res.reference);
        }
      } else {
        setErrorMessage(res.message || 'Une erreur est survenue lors de l’envoi de votre demande.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erreur de connexion au serveur.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyRefToClipboard = () => {
    if (submittedReference) {
      navigator.clipboard.writeText(submittedReference);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (submittedReference) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden text-center p-8 sm:p-12 animate-in fade-in duration-300">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800">
            Demande enregistrée avec succès
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-4 mb-2">
            Votre demande de convoyage est en cours d'examen
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto mb-8">
            Un email de confirmation récapitulatif a été transmis à <strong className="text-slate-800 font-semibold">{formData.client_email}</strong>. Notre cellule opérationnelle étudie votre itinéraire et vous recontactera sous 2 à 4 heures ouvrées.
          </p>

          {/* Reference Card */}
          <div className="bg-slate-50 border-2 border-dashed border-sky-300 rounded-xl p-6 max-w-md mx-auto mb-8 text-center">
            <p className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-1">Votre numéro de référence officiel</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl sm:text-3xl font-mono font-extrabold text-sky-700 tracking-tight">
                {submittedReference}
              </span>
              <button
                onClick={copyRefToClipboard}
                title="Copier la référence"
                className="p-2 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-700 transition-colors"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            {copied && <p className="text-[11px] font-bold text-emerald-600 mt-2">Référence copiée dans le presse-papier !</p>}
          </div>

          {/* Summary Recap Table */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-left max-w-lg mx-auto mb-8 text-xs text-slate-700 space-y-2">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Véhicule :</span>
              <span className="font-bold text-slate-800">{formData.vehicle_brand} {formData.vehicle_model} ({formData.vehicle_year})</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Trajet :</span>
              <span className="font-semibold text-slate-800">{formData.pickup_city} ({formData.pickup_country}) → {formData.delivery_city} ({formData.delivery_country})</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Date souhaitée :</span>
              <span className="font-semibold text-slate-800">{formData.desired_date} à {formData.desired_time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Mode :</span>
              <span className="font-semibold text-slate-800">
                {formData.convoy_mode === 'driver' ? 'Chauffeur professionnel certifié JMF' : 'Transport sur camion plateau sécurisé'}
              </span>
            </div>
          </div>

          {/* Contact Assurances */}
          <div className="border-t border-slate-200 pt-6 max-w-lg mx-auto text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-around gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-sky-600" />
              <span>Assistance : <strong>+229 01 97 83 21 21</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-sky-600" />
              <span>Email : <strong>contact@jmf-mobility.com</strong></span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                setSubmittedReference(null);
                setFormData(prev => ({
                  ...prev,
                  vehicle_brand: '',
                  vehicle_model: '',
                  vehicle_plate: '',
                  pickup_address: '',
                  delivery_address: '',
                  privacy_accepted: false,
                }));
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
            >
              Déposer une autre demande
            </button>
            {onBack && (
              <button
                onClick={onBack}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Retour à l'accueil
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // MAIN PUBLIC FORM
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Title & Service Presentation */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-3">
          <Truck className="w-4 h-4 text-sky-600" />
          <span>Convoyage Professionnel Sécurisé • Bénin & Sous-Région</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Demande de Convoyage Automobile
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2">
          Confiez le déplacement de vos véhicules légers, utilitaires ou poids lourds à nos équipes certifiées. Garantie zéro kilomètre fantôme, traçabilité GPS en temps réel et couverture d'assurance tous risques.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-8 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Attention</p>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Anti-spam Honeypot field (hidden from view, trap for bots) */}
        <input
          type="text"
          name="_hp"
          value={formData._hp}
          onChange={(e) => setFormData({ ...formData, _hp: e.target.value })}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        {/* ================= SECTION 1 : VÉHICULE ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-black">
              1
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Car className="w-5 h-5 text-sky-600" /> Informations sur le véhicule
              </h2>
              <p className="text-xs text-slate-500">Caractéristiques techniques et condition physique de l'automobile</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Marque */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Marque <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  list="brands-list"
                  placeholder="Ex: Toyota, Peugeot..."
                  value={formData.vehicle_brand}
                  onChange={e => setFormData({ ...formData, vehicle_brand: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-slate-50/50"
                />
                <datalist id="brands-list">
                  {vehicleBrands.map(b => <option key={b} value={b} />)}
                </datalist>
              </div>
            </div>

            {/* Modèle */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Modèle <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Hilux, 3008, Corolla..."
                value={formData.vehicle_model}
                onChange={e => setFormData({ ...formData, vehicle_model: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-slate-50/50"
              />
            </div>

            {/* Année */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Année de mise en circulation <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1990"
                max={new Date().getFullYear() + 1}
                value={formData.vehicle_year}
                onChange={e => setFormData({ ...formData, vehicle_year: parseInt(e.target.value) || 2022 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-slate-50/50"
              />
            </div>

            {/* Immatriculation */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Immatriculation
                </label>
                <label className="flex items-center gap-1.5 text-[11px] text-slate-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!formData.is_registered}
                    onChange={e => setFormData({ ...formData, is_registered: !e.target.checked, vehicle_plate: e.target.checked ? '' : formData.vehicle_plate })}
                    className="rounded text-sky-600 focus:ring-sky-500"
                  />
                  <span>En transit / Non immatriculé</span>
                </label>
              </div>
              <input
                type="text"
                disabled={!formData.is_registered}
                placeholder={formData.is_registered ? 'Ex: BJ-1234-CD ou IT-0099' : 'Véhicule sans immatriculation'}
                value={formData.vehicle_plate}
                onChange={e => setFormData({ ...formData, vehicle_plate: e.target.value.toUpperCase() })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono uppercase transition-colors ${
                  formData.is_registered
                    ? 'border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-slate-50/50'
                    : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                }`}
              />
            </div>

            {/* Couleur */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Couleur du véhicule <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Blanc, Gris métallisé, Noir..."
                value={formData.vehicle_color}
                onChange={e => setFormData({ ...formData, vehicle_color: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-slate-50/50"
              />
            </div>

            {/* État général */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                État mécanique & carrosserie <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.vehicle_condition}
                onChange={e => handleConditionChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-slate-50/50"
              >
                <option value="good">Roulant • Très bon état</option>
                <option value="medium">Roulant • État d'usage moyen</option>
                <option value="breakdown">En panne mécanique</option>
                <option value="damaged">Accidenté / Choc carrosserie</option>
                <option value="non_running">Non roulant / Épave</option>
              </select>
            </div>
          </div>

          {/* Conditional: Précisions si panne ou accident */}
          {(formData.vehicle_condition === 'breakdown' || formData.vehicle_condition === 'damaged' || formData.vehicle_condition === 'non_running') && (
            <div className="mt-5 p-4 rounded-xl bg-amber-50 border border-amber-200 animate-in fade-in duration-200">
              <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                Précisions sur l'avarie / la panne <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Moteur ne démarre pas, direction bloquée, pneu crevé..."
                value={formData.condition_details}
                onChange={e => setFormData({ ...formData, condition_details: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-amber-300 text-sm bg-white focus:ring-2 focus:ring-amber-500"
              />
              <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-amber-800">
                <Truck className="w-4 h-4 text-amber-600" />
                <span>Ce véhicule requiert un équipement de remorquage adapté ou camion plateau. Le transport plateau a été pré-sélectionné.</span>
              </div>
            </div>
          )}

          {/* Photos upload area */}
          <div className="mt-5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Photos du véhicule (facultatif mais recommandé pour l'état des lieux)
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-sky-400 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="vehicle-photos-upload"
              />
              <label htmlFor="vehicle-photos-upload" className="cursor-pointer flex flex-col items-center">
                <Upload className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-xs font-semibold text-slate-700">Cliquez pour ajouter des photos ou glissez-déposez ici</span>
                <span className="text-[11px] text-slate-400">JPG, PNG jusqu'à 10 Mo</span>
              </label>
            </div>
            {uploadedPhotos.length > 0 && (
              <div className="flex gap-2 mt-3">
                {uploadedPhotos.map((url, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200">
                    <img src={url} alt={`Aperçu ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ================= SECTION 2 : DÉTAILS DU CONVOYAGE ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-black">
              2
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-sky-600" /> Détails du convoyage et itinéraire
              </h2>
              <p className="text-xs text-slate-500">Lieux d'enlèvement, de livraison et modalités opérationnelles</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Prise en charge */}
            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 mb-3">
                <MapPin className="w-3.5 h-3.5" /> Point de départ (Prise en charge)
              </span>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Adresse complète / Repère <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Boulevard de la Marina, en face du port..."
                    value={formData.pickup_address}
                    onChange={e => setFormData({ ...formData, pickup_address: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Ville <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Cotonou"
                      value={formData.pickup_city}
                      onChange={e => setFormData({ ...formData, pickup_city: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Pays <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.pickup_country}
                      onChange={e => setFormData({ ...formData, pickup_country: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-sky-500"
                    >
                      {westAfricanCountries.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Livraison */}
            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 mb-3">
                <MapPin className="w-3.5 h-3.5" /> Point d'arrivée (Livraison)
              </span>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Adresse complète / Concessionnaire / Garage <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Agence Parakou, Route inter-états..."
                    value={formData.delivery_address}
                    onChange={e => setFormData({ ...formData, delivery_address: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Ville <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Porto-Novo, Parakou..."
                      value={formData.delivery_city}
                      onChange={e => setFormData({ ...formData, delivery_city: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Pays <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.delivery_country}
                      onChange={e => setFormData({ ...formData, delivery_country: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-sky-500"
                    >
                      {westAfricanCountries.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
            {/* Date souhaitée */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Date souhaitée <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={formData.desired_date}
                  onChange={e => setFormData({ ...formData, desired_date: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
                />
              </div>
            </div>

            {/* Heure souhaitée */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Heure d'enlèvement <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                required
                value={formData.desired_time}
                onChange={e => setFormData({ ...formData, desired_time: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
              />
            </div>

            {/* Type de convoyage */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Type de demandeur <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.convoy_type}
                onChange={e => setFormData({ ...formData, convoy_type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
              >
                <option value="company">Entreprise / Flotte professionnelle</option>
                <option value="individual">Particulier</option>
                <option value="agency_transfer">Transfert Inter-Agences</option>
                <option value="client_delivery">Livraison client final</option>
                <option value="garage_transfer">Transfert Atelier / Carrosserie</option>
              </select>
            </div>

            {/* Mode souhaité */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mode de convoyage <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.convoy_mode}
                onChange={e => setFormData({ ...formData, convoy_mode: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
              >
                <option value="driver">Par la route (Chauffeur pro certifié)</option>
                <option value="flatbed">Sur camion plateau porte-voiture</option>
                <option value="to_be_determined">À déterminer selon devis JMF</option>
              </select>
            </div>
          </div>
        </div>

        {/* ================= SECTION 3 : COORDONNÉES ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-black">
              3
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-sky-600" /> Coordonnées du demandeur
              </h2>
              <p className="text-xs text-slate-500">Pour l'envoi de la confirmation, du devis et le suivi opérationnel</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Nom & prénom */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nom & Prénom <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Patrice Talon, Martin Adjovi..."
                value={formData.client_name}
                onChange={e => setFormData({ ...formData, client_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
              />
            </div>

            {/* Entreprise */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Entreprise / Société <span className="text-slate-400 font-normal">(Optionnel)</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Bolloré, Société Générale, Bénin Logistics..."
                value={formData.client_company}
                onChange={e => setFormData({ ...formData, client_company: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Adresse Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="contact@societe.com"
                value={formData.client_email}
                onChange={e => setFormData({ ...formData, client_email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
              />
            </div>

            {/* Téléphone / WhatsApp */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Téléphone / WhatsApp <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="+229 01 23 45 67"
                value={formData.client_phone}
                onChange={e => setFormData({ ...formData, client_phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
              />
            </div>

            {/* Pays */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Pays de résidence <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.client_country}
                onChange={e => setFormData({ ...formData, client_country: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
              >
                {westAfricanCountries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* ================= SECTION 4 : OPTIONS & ACCORD ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-black">
              4
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-sky-600" /> Précisions particulières & Validation
              </h2>
              <p className="text-xs text-slate-500">Instructions spéciales et acceptation des conditions de service</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Instructions particulières ou contraintes spécifiques
              </label>
              <textarea
                rows={3}
                placeholder="Ex: Clés disponibles auprès du gardien, horaires de fermeture de l'agence de livraison à 17h, contact sur place..."
                value={formData.special_instructions}
                onChange={e => setFormData({ ...formData, special_instructions: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.privacy_accepted}
                  onChange={e => setFormData({ ...formData, privacy_accepted: e.target.checked })}
                  className="w-4 h-4 mt-1 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  J'accepte que mes données personnelles et les informations de ce véhicule soient traitées par <strong>JMF Mobility Services</strong> dans le cadre de ma demande de convoyage, conformément à la politique de confidentialité et au protocole d'assurance transport.
                </span>
              </label>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Devis gratuit sans engagement • Assurance marchandise & véhicule incluse</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2 transition-all ${
                isSubmitting
                  ? 'bg-sky-400 cursor-wait'
                  : 'bg-sky-600 hover:bg-sky-700 hover:scale-102 shadow-sky-600/25 active:scale-98'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Traitement en cours...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Envoyer ma demande de convoyage</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
