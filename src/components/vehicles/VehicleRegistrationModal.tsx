import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Car,
  FileText,
  DollarSign,
  User,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { ApiClient } from '../../services/api.js';

interface VehicleRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVehicleCreated: () => void;
}

export const VehicleRegistrationModal: React.FC<VehicleRegistrationModalProps> = ({
  isOpen,
  onClose,
  onVehicleCreated,
}) => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    registration_number: '',
    vin: '',
    brand: 'Toyota',
    model: 'Hilux Double Cabine',
    version: '2.8 D-4D 204ch',
    vehicle_type: 'VUL',
    category: 'Pick-up',
    color: 'Blanc Banquise',
    year: '2024',
    first_registration_date: '2024-01-15',
    energy_type: 'Diesel',
    current_mileage: '12500',
    acquisition_mode: 'LLD',
    purchase_value: '28000000',
    monthly_lease: '520000',
    supplier: 'CFAO Motors Bénin',
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await ApiClient.createVehicle(formData);
      onVehicleCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du véhicule');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: 'Identification', icon: Car },
    { num: 2, label: 'Technique', icon: FileText },
    { num: 3, label: 'Financement', icon: DollarSign },
    { num: 4, label: 'Affectation', icon: User },
    { num: 5, label: 'Documents', icon: ShieldCheck },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Enregistrer un nouveau véhicule</h2>
            <p className="text-xs text-slate-500">Formulaire d’immatriculation et d'intégration à la flotte</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Stepper */}
        <div className="px-6 py-3 bg-white border-b border-slate-100 flex items-center justify-between">
          {steps.map((s, idx) => (
            <div key={s.num} className="flex items-center gap-2">
              <button
                onClick={() => setStep(s.num)}
                className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-sky-600 text-white shadow-xs'
                    : step > s.num
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
              </button>
              <span className={`text-xs hidden sm:inline font-medium ${step === s.num ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                {s.label}
              </span>
              {idx < steps.length - 1 && <span className="text-slate-300 mx-1 hidden sm:inline">/</span>}
            </div>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Immatriculation *</label>
                  <input
                    type="text"
                    name="registration_number"
                    value={formData.registration_number}
                    onChange={handleChange}
                    placeholder="ex: BJ-8899-XY"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono uppercase font-bold text-sky-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Numéro de châssis (VIN)</label>
                  <input
                    type="text"
                    name="vin"
                    value={formData.vin}
                    onChange={handleChange}
                    placeholder="ex: MROFR22G500123456"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Marque *</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Modèle *</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Type de véhicule</label>
                  <select
                    name="vehicle_type"
                    value={formData.vehicle_type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="VP">Véhicule Particulier (VP)</option>
                    <option value="VUL">Véhicule Utilitaire Léger (VUL)</option>
                    <option value="Poids lourd">Poids Lourd</option>
                    <option value="Bus">Bus / Minibus</option>
                    <option value="Moto">Moto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Couleur</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Type d'énergie</label>
                  <select
                    name="energy_type"
                    value={formData.energy_type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="Diesel">Diesel B7</option>
                    <option value="Essence">Super Sans Plomb</option>
                    <option value="Hybride">Hybride</option>
                    <option value="Électrique">Électrique 100%</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Kilométrage initial (km)</label>
                  <input
                    type="number"
                    name="current_mileage"
                    value={formData.current_mileage}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Année modèle</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Date de 1ère mise en circulation</label>
                  <input
                    type="date"
                    name="first_registration_date"
                    value={formData.first_registration_date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Mode d'acquisition</label>
                  <select
                    name="acquisition_mode"
                    value={formData.acquisition_mode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="LLD">Location Longue Durée (LLD)</option>
                    <option value="LOA">Location avec Option d'Achat (LOA)</option>
                    <option value="Achat comptant">Achat comptant</option>
                    <option value="Crédit-bail">Crédit-bail</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Fournisseur / Loueur</label>
                  <input
                    type="text"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Valeur d'achat (FCFA)</label>
                  <input
                    type="number"
                    name="purchase_value"
                    value={formData.purchase_value}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Loyer mensuel (FCFA)</label>
                  <input
                    type="number"
                    name="monthly_lease"
                    value={formData.monthly_lease}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {step >= 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 text-slate-700">
                <div className="font-bold text-sky-900">Affectation & Pièces justificatives</div>
                <div className="text-xs text-sky-700 mt-1">
                  Ce véhicule sera automatiquement affecté à votre site principal. Les scans de carte grise et assurance peuvent être téléversés immédiatement ou plus tard.
                </div>
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-500 hover:border-sky-400 cursor-pointer transition-colors">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <div className="font-semibold text-slate-700">Glissez-déposez la Carte Grise ou l'Attestation d'Assurance</div>
                <div className="text-[11px] text-slate-400 mt-1">PDF, PNG ou JPG (max 10 Mo)</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40"
          >
            Précédent
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
            >
              Annuler
            </button>
            {step < 5 ? (
              <button
                onClick={() => setStep((s) => Math.min(5, s + 1))}
                className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 shadow-xs"
              >
                Suivant
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-xs flex items-center gap-2"
              >
                {isSubmitting ? 'Enregistrement...' : 'Valider et intégrer le véhicule'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
