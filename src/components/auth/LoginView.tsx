import React, { useState, useId } from 'react';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Building2,
  AlertCircle,
  Eye,
  EyeOff,
  Phone,
  Truck,
  Car,
  CheckCircle2,
  Sparkles,
  Briefcase,
  UserPlus,
  LogIn,
  Check,
  XCircle,
  HelpCircle,
  Layers,
  ChevronRight,
  AlertTriangle,
  Info,
  KeyRound,
  CheckCircle,
} from 'lucide-react';
import { JmfLogo } from '../common/JmfLogo.js';
import { useAuth } from '../../context/AuthContext.js';
import { RoleId } from '../../types/index.js';

interface LoginViewProps {
  initialTab?: 'login' | 'register';
  onGoToPublic?: () => void;
  onSuccess?: () => void;
}

interface PasswordCriteria {
  minLength: boolean;
  hasLower: boolean;
  hasUpper: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  noSequential: boolean;
}

export const LoginView: React.FC<LoginViewProps> = ({
  initialTab = 'login',
  onGoToPublic,
  onSuccess,
}) => {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginTouched, setLoginTouched] = useState<{ email?: boolean; password?: boolean }>({});

  // Registration form state
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regCompanyName, setRegCompanyName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('+229 ');
  const [regFleetSize, setRegFleetSize] = useState('6-25');
  const [regRole, setRegRole] = useState<RoleId>('COMPANY_ADMIN');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegPasswordConfirm, setShowRegPasswordConfirm] = useState(false);
  const [regAcceptTerms, setRegAcceptTerms] = useState(true);
  const [regTouched, setRegTouched] = useState<Record<string, boolean>>({});

  // Status state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrorsList, setFieldErrorsList] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Unique IDs for accessibility
  const loginEmailId = useId();
  const loginPasswordId = useId();
  const regFirstNameId = useId();
  const regLastNameId = useId();
  const regCompanyId = useId();
  const regFleetSizeId = useId();
  const regEmailId = useId();
  const regPhoneId = useId();
  const regPasswordId = useId();
  const regConfirmPasswordId = useId();
  const regTermsId = useId();

  // Helper: Email format validation
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  // Helper: Detect common email domain typos
  const getEmailSuggestion = (email: string) => {
    const trimmed = email.trim().toLowerCase();
    if (trimmed.includes('@gmai.com')) return trimmed.replace('@gmai.com', '@gmail.com');
    if (trimmed.includes('@yaho.com')) return trimmed.replace('@yaho.com', '@yahoo.com');
    if (trimmed.includes('@outloo.com')) return trimmed.replace('@outloo.com', '@outlook.com');
    return null;
  };

  // Helper: Phone validation (Bénin +229 format or international)
  const isValidPhone = (phone: string) => {
    const cleaned = phone.replace(/[\s\-()]/g, '');
    return cleaned.length >= 8;
  };

  // Helper: Comprehensive Password Strength Evaluation
  const evaluatePassword = (pass: string) => {
    const criteria: PasswordCriteria = {
      minLength: pass.length >= 8,
      hasLower: /[a-z]/.test(pass),
      hasUpper: /[A-Z]/.test(pass),
      hasNumber: /[0-9]/.test(pass),
      hasSpecial: /[^A-Za-z0-9]/.test(pass),
      noSequential: !/(1234|azerty|password|admin|0000)/i.test(pass),
    };

    if (pass.length === 0) {
      return {
        score: 0,
        percentage: 0,
        criteria,
        label: 'Non renseigné',
        color: 'bg-slate-200',
        textColor: 'text-slate-400',
        suggestion: 'Minimum 8 caractères combinant majuscules, chiffres et symboles.',
      };
    }

    let rawScore = 0;
    if (criteria.minLength) rawScore += 1;
    if (pass.length >= 12) rawScore += 1; // bonus length
    if (criteria.hasLower && criteria.hasUpper) rawScore += 1;
    if (criteria.hasNumber) rawScore += 1;
    if (criteria.hasSpecial) rawScore += 1;
    if (!criteria.noSequential) rawScore = Math.max(1, rawScore - 1);

    // Map to 1-4 scale
    const normalizedScore = Math.min(4, Math.max(1, Math.ceil(rawScore * (4 / 6))));
    const percentage = Math.min(100, Math.round((rawScore / 6) * 100));

    switch (normalizedScore) {
      case 1:
        return {
          score: 1,
          percentage: Math.max(20, percentage),
          criteria,
          label: 'Faible',
          color: 'bg-rose-500',
          textColor: 'text-rose-600',
          suggestion: 'Mot de passe vulnérable. Ajoutez au moins 8 caractères avec majuscules et chiffres.',
        };
      case 2:
        return {
          score: 2,
          percentage: Math.max(45, percentage),
          criteria,
          label: 'Moyen',
          color: 'bg-amber-500',
          textColor: 'text-amber-600',
          suggestion: 'Niveau moyen. Ajoutez un symbole (@, #, $) ou augmentez la longueur pour sécuriser.',
        };
      case 3:
        return {
          score: 3,
          percentage: Math.max(75, percentage),
          criteria,
          label: 'Fort',
          color: 'bg-emerald-500',
          textColor: 'text-emerald-600',
          suggestion: 'Très bon niveau de protection pour votre console de flotte.',
        };
      case 4:
      default:
        return {
          score: 4,
          percentage: 100,
          criteria,
          label: 'Très robuste',
          color: 'bg-sky-600',
          textColor: 'text-sky-600',
          suggestion: 'Excellente sécurité ! Votre mot de passe résiste aux attaques par force brute.',
        };
    }
  };

  const passwordEvaluation = evaluatePassword(regPassword);
  const passwordsMatch = regPasswordConfirm.length > 0 && regPassword === regPasswordConfirm;
  const passwordsMismatch = regPasswordConfirm.length > 0 && regPassword !== regPasswordConfirm;
  const emailSuggestion = getEmailSuggestion(regEmail);

  // Detailed validation errors for Login
  const loginErrors = {
    email:
      loginTouched.email && !loginEmail.trim()
        ? 'L’adresse e-mail professionnelle est requise.'
        : loginTouched.email && !isValidEmail(loginEmail)
        ? 'Format d’adresse e-mail invalide (ex: direction@entreprise.bj).'
        : null,
    password:
      loginTouched.password && !loginPassword
        ? 'Veuillez saisir votre mot de passe.'
        : null,
  };

  // Detailed validation errors for Register
  const regErrors = {
    firstName:
      regTouched.firstName && regFirstName.trim().length < 2
        ? 'Le prénom doit contenir au moins 2 caractères alphabétiques.'
        : null,
    lastName:
      regTouched.lastName && regLastName.trim().length < 2
        ? 'Le nom de famille est obligatoire (min. 2 caractères).'
        : null,
    companyName:
      regTouched.companyName && regRole !== 'DRIVER' && regCompanyName.trim().length < 2
        ? 'La raison sociale de l’entreprise ou organisation est obligatoire.'
        : null,
    email:
      regTouched.email && !regEmail.trim()
        ? 'L’adresse e-mail professionnelle est requise pour créer l’espace flotte.'
        : regTouched.email && !isValidEmail(regEmail)
        ? 'Veuillez saisir une adresse e-mail valide (ex: contact@societe.com).'
        : null,
    phone:
      regTouched.phone && regPhone.trim().length > 5 && !isValidPhone(regPhone)
        ? 'Numéro de téléphone incomplet (au moins 8 chiffres requis).'
        : null,
    password:
      regTouched.password && regPassword.length < 8
        ? `Le mot de passe doit comporter au moins 8 caractères (encore ${8 - regPassword.length} caractère${8 - regPassword.length > 1 ? 's' : ''}).`
        : null,
    confirmPassword:
      regTouched.confirmPassword && !regPasswordConfirm
        ? 'Veuillez confirmer votre mot de passe.'
        : regTouched.confirmPassword && regPassword !== regPasswordConfirm
        ? 'Les deux mots de passe saisis ne correspondent pas.'
        : null,
    terms:
      regTouched.terms && !regAcceptTerms
        ? 'Vous devez accepter les conditions d’utilisation et la politique de données JMF.'
        : null,
  };

  const markRegAllTouched = () => {
    setRegTouched({
      firstName: true,
      lastName: true,
      companyName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
      terms: true,
    });
  };

  const markLoginAllTouched = () => {
    setLoginTouched({
      email: true,
      password: true,
    });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    markLoginAllTouched();
    setFieldErrorsList([]);

    const errors: string[] = [];
    if (!loginEmail.trim()) {
      errors.push('Adresse e-mail requise');
    } else if (!isValidEmail(loginEmail)) {
      errors.push('Format d’e-mail invalide');
    }
    if (!loginPassword) {
      errors.push('Mot de passe requis');
    }

    if (errors.length > 0) {
      setError('Veuillez corriger les informations de connexion ci-dessous.');
      setFieldErrorsList(errors);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await login(loginEmail.trim(), loginPassword);
      onSuccess?.();
    } catch (err: any) {
      setError(
        err.message ||
          'Identifiants introuvables ou mot de passe incorrect. Vous pouvez tester un compte de démonstration en un clic ci-dessous.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    markRegAllTouched();
    setError(null);
    setFieldErrorsList([]);

    const errors: string[] = [];
    if (regFirstName.trim().length < 2) errors.push('Prénom (min. 2 caractères)');
    if (regLastName.trim().length < 2) errors.push('Nom de famille obligatoire');
    if (regRole !== 'DRIVER' && regCompanyName.trim().length < 2)
      errors.push('Raison sociale de l’entreprise obligatoire');
    if (!regEmail.trim() || !isValidEmail(regEmail)) errors.push('Adresse e-mail professionnelle valide');
    if (regPassword.length < 8) errors.push('Mot de passe robuste (min. 8 caractères)');
    if (regPassword !== regPasswordConfirm) errors.push('Confirmation du mot de passe identique');
    if (!regAcceptTerms) errors.push('Acceptation des conditions générales et politique APDP');

    if (errors.length > 0) {
      setError('Des informations obligatoires sont manquantes ou incomplètes :');
      setFieldErrorsList(errors);
      return;
    }

    setIsLoading(true);
    try {
      await register({
        first_name: regFirstName.trim(),
        last_name: regLastName.trim(),
        company_name:
          regRole === 'DRIVER' ? regCompanyName.trim() || 'Indépendant Chauffeur' : regCompanyName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        password: regPassword,
        role: regRole,
        fleet_size: regFleetSize,
      });
      setSuccessMessage('Félicitations ! Votre espace flotte JMF a été configuré avec succès. Redirection...');
      setTimeout(() => {
        onSuccess?.();
      }, 900);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'enregistrement de votre entreprise.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail: string, demoPass: string) => {
    setLoginEmail(demoEmail);
    setLoginPassword(demoPass);
    setActiveTab('login');
    setError(null);
    setFieldErrorsList([]);
    setIsLoading(true);
    try {
      await login(demoEmail, demoPass);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Échec de connexion rapide au profil de test.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-[#070E1B] px-3 py-6 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-700/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Trust Status */}
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl relative z-10 text-center mb-6">
        <div className="flex justify-center mb-2.5">
          <JmfLogo variant="dark" className="h-12 sm:h-14" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Portail JMF Fleet & Mobility Bénin
        </h1>
        <p className="mt-1 text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
          Télématique IoT temps réel, gestion de flotte automobile, maintenance certifiée & convoyage au Bénin
        </p>

        {/* Reassurance pills */}
        <div className="mt-2.5 inline-flex flex-wrap items-center justify-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300">
          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Serveurs Cotonou En Ligne
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="inline-flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            Conforme APDP Bénin
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="inline-flex items-center gap-1 text-slate-400">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            Hub Akpakpa 24/7
          </span>
        </div>
      </div>

      {/* Main Form Container Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl relative z-10">
        <div className="bg-white shadow-2xl rounded-2xl border border-slate-200 overflow-hidden">
          {/* ======================================================== */}
          {/* HIGH-VISIBILITY MODE TOGGLE BAR                          */}
          {/* ======================================================== */}
          <div className="p-3 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 border-b border-slate-200">
            <div className="grid grid-cols-2 gap-2 bg-slate-200/80 p-1.5 rounded-xl border border-slate-300/60 shadow-inner">
              {/* Tab 1: Se connecter */}
              <button
                id="auth-toggle-login-btn"
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setError(null);
                  setFieldErrorsList([]);
                  setSuccessMessage(null);
                }}
                className={`py-3 px-3 sm:px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-white text-sky-700 shadow-md border border-slate-200/90 font-extrabold ring-2 ring-sky-500/20 translate-y-[-1px]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    activeTab === 'login' ? 'bg-sky-100 text-sky-700' : 'bg-slate-300/50 text-slate-500'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs sm:text-sm font-extrabold leading-tight">Se connecter</div>
                  <div className="text-[10px] font-normal text-slate-500 hidden sm:block">
                    Espace flotte & superviseurs
                  </div>
                </div>
              </button>

              {/* Tab 2: S'enregistrer */}
              <button
                id="auth-toggle-register-btn"
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setError(null);
                  setFieldErrorsList([]);
                  setSuccessMessage(null);
                }}
                className={`py-3 px-3 sm:px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                  activeTab === 'register'
                    ? 'bg-white text-sky-700 shadow-md border border-slate-200/90 font-extrabold ring-2 ring-sky-500/20 translate-y-[-1px]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    activeTab === 'register' ? 'bg-sky-100 text-sky-700' : 'bg-slate-300/50 text-slate-500'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                </div>
                <div className="text-left flex items-center gap-1.5">
                  <div>
                    <div className="text-xs sm:text-sm font-extrabold leading-tight">S'enregistrer</div>
                    <div className="text-[10px] font-normal text-slate-500 hidden sm:block">
                      Nouvelle entreprise & flotte
                    </div>
                  </div>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 text-[9px] font-extrabold">
                    Gratuit
                  </span>
                </div>
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Global Error Alert Banner with list of missing fields */}
            {error && (
              <div
                id="auth-error-banner"
                role="alert"
                className="mb-5 p-4 rounded-xl bg-rose-50 border-2 border-rose-200 text-rose-800 text-xs shadow-xs"
              >
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-extrabold text-rose-900 text-xs sm:text-sm">Attention requise</div>
                    <div className="mt-0.5 leading-relaxed text-rose-700 font-medium">{error}</div>

                    {fieldErrorsList.length > 0 && (
                      <ul className="mt-2 space-y-1 pl-4 list-disc text-rose-700 font-medium">
                        {fieldErrorsList.map((errItem, idx) => (
                          <li key={idx}>{errItem}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setFieldErrorsList([]);
                    }}
                    className="text-rose-400 hover:text-rose-700 p-1 cursor-pointer"
                    title="Fermer"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Global Success Banner */}
            {successMessage && (
              <div
                id="auth-success-banner"
                role="status"
                className="mb-5 p-4 rounded-xl bg-emerald-50 border-2 border-emerald-200 text-emerald-900 text-xs flex items-center gap-3 shadow-xs"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                <div className="font-extrabold text-xs sm:text-sm leading-relaxed">{successMessage}</div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 1: CONNEXION / LOGIN                                  */}
            {/* ======================================================== */}
            {activeTab === 'login' && (
              <div>
                <div className="mb-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900">
                        Connexion à votre espace professionnel
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Renseignez vos identifiants pour piloter votre flotte, vos tournées et la maintenance.
                      </p>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-sky-700 font-bold bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                      Session Chiffrée
                    </span>
                  </div>
                </div>

                <form className="space-y-4" onSubmit={handleLoginSubmit} noValidate>
                  {/* Email field */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor={loginEmailId}
                        className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider"
                      >
                        Adresse e-mail professionnelle *
                      </label>
                      {loginTouched.email && !loginErrors.email && loginEmail && (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> E-mail conforme
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        id={loginEmailId}
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        onBlur={() => setLoginTouched((prev) => ({ ...prev, email: true }))}
                        placeholder="jean.kouassi@societe-cliente.com"
                        className={`w-full pl-9 pr-3 py-2.5 text-xs rounded-xl transition-all ${
                          loginErrors.email
                            ? 'border-2 border-rose-400 bg-rose-50/25 text-slate-900 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500'
                            : loginTouched.email && loginEmail
                            ? 'border border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500'
                            : 'border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500'
                        }`}
                        required
                      />
                    </div>
                    {loginErrors.email && (
                      <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1 font-semibold">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {loginErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Password field */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor={loginPasswordId}
                        className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider"
                      >
                        Mot de passe *
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          alert(
                            'Pour réinitialiser votre mot de passe, contactez l’administrateur JMF ou utilisez immédiatement l’un des 4 comptes de test ci-dessous.'
                          )
                        }
                        className="text-[11px] text-sky-600 hover:text-sky-700 font-bold cursor-pointer transition-colors"
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        id={loginPasswordId}
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        onBlur={() => setLoginTouched((prev) => ({ ...prev, password: true }))}
                        placeholder="••••••••"
                        className={`w-full pl-9 pr-10 py-2.5 text-xs rounded-xl transition-all ${
                          loginErrors.password
                            ? 'border-2 border-rose-400 bg-rose-50/25 text-slate-900 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500'
                            : 'border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500'
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-md"
                        title={showLoginPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {loginErrors.password && (
                      <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1 font-semibold">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {loginErrors.password}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    id="auth-submit-login-btn"
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 px-4 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-md shadow-sky-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Vérification de la session en cours...</span>
                      </>
                    ) : (
                      <>
                        <span>Se connecter à la console</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Clear Reciprocal Switch to Registration */}
                <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-black text-slate-900">Vous n'avez pas encore d'espace flotte ?</div>
                    <div className="text-[11px] text-slate-500">
                      Enregistrez votre entreprise et bénéficiez de 30 jours d'essai sans engagement.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('register');
                      setError(null);
                      setFieldErrorsList([]);
                    }}
                    className="px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-300 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-sky-600" />
                    <span>Créer un compte entreprise</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Fast Demo Profiles (One-click login for testing) */}
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Profils de test en un clic
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Cliquez sur un profil pour vous connecter instantanément
                      </span>
                    </div>
                    <span className="text-[10px] text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                      Démo Live
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleQuickDemo('jean.kouassi@societe-cliente.com', 'jmf2026')}
                      className="p-3 text-left rounded-xl bg-slate-50 hover:bg-sky-50 hover:border-sky-300 border border-slate-200 transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-sky-200">
                          JK
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">Jean KOUASSI</div>
                          <div className="text-[10px] text-slate-500 truncate">Admin Flotte SARL (125 véh.)</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-sky-600 shrink-0 ml-1 group-hover:underline flex items-center gap-0.5">
                        Tester <ArrowRight className="w-3 h-3" />
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickDemo('admin@jmf-mobility.com', 'admin123')}
                      className="p-3 text-left rounded-xl bg-slate-50 hover:bg-purple-50 hover:border-purple-300 border border-slate-200 transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-purple-200">
                          SA
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">Super Admin JMF</div>
                          <div className="text-[10px] text-slate-500 truncate">Supervision multi-entreprises</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-purple-600 shrink-0 ml-1 group-hover:underline flex items-center gap-0.5">
                        Tester <ArrowRight className="w-3 h-3" />
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickDemo('marc.allagbe@bollore-logistics.com', 'bollore2026')}
                      className="p-3 text-left rounded-xl bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-amber-200">
                          MA
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">Marc ALLAGBE</div>
                          <div className="text-[10px] text-slate-500 truncate">Bolloré Logistics Bénin</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-amber-600 shrink-0 ml-1 group-hover:underline flex items-center gap-0.5">
                        Tester <ArrowRight className="w-3 h-3" />
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickDemo('pierre.dossou@societe-cliente.com', 'jmf2026')}
                      className="p-3 text-left rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-emerald-200">
                          PD
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">Pierre DOSSOU</div>
                          <div className="text-[10px] text-slate-500 truncate">Chauffeur & Missionnaire</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-600 shrink-0 ml-1 group-hover:underline flex items-center gap-0.5">
                        Tester <ArrowRight className="w-3 h-3" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 2: ENREGISTREMENT / SIGN-UP                          */}
            {/* ======================================================== */}
            {activeTab === 'register' && (
              <div>
                {/* Registration Header with Stepper */}
                <div className="mb-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900">
                        Enregistrer votre entreprise & flotte
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Configurez votre espace en 2 minutes pour démarrer la gestion télématique au Bénin.
                      </p>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      30 jours d'essai
                    </span>
                  </div>

                  {/* 3-Step visual progress indicator */}
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-sky-800 font-bold">
                      <span className="w-5 h-5 rounded-full bg-sky-600 text-white text-[10px] flex items-center justify-center font-black">
                        1
                      </span>
                      <span>Profil & Rôle</span>
                    </div>
                    <span className="text-slate-300 font-bold">→</span>
                    <div className="flex items-center gap-1.5 text-sky-800 font-bold">
                      <span className="w-5 h-5 rounded-full bg-sky-600 text-white text-[10px] flex items-center justify-center font-black">
                        2
                      </span>
                      <span>Organisation</span>
                    </div>
                    <span className="text-slate-300 font-bold">→</span>
                    <div className="flex items-center gap-1.5 text-sky-800 font-bold">
                      <span className="w-5 h-5 rounded-full bg-sky-600 text-white text-[10px] flex items-center justify-center font-black">
                        3
                      </span>
                      <span>Sécurité & Accès</span>
                    </div>
                  </div>
                </div>

                <form className="space-y-4" onSubmit={handleRegisterSubmit} noValidate>
                  {/* Account Type Selection */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Type de profil professionnel *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setRegRole('COMPANY_ADMIN')}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          regRole === 'COMPANY_ADMIN'
                            ? 'border-sky-500 bg-sky-50/80 ring-2 ring-sky-500/20 text-sky-950 font-bold'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Building2 className={`w-4 h-4 ${regRole === 'COMPANY_ADMIN' ? 'text-sky-600' : 'text-slate-400'}`} />
                          {regRole === 'COMPANY_ADMIN' && <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />}
                        </div>
                        <div className="text-[11px] font-bold leading-tight">Entreprise</div>
                        <div className="text-[9px] text-slate-500 leading-tight mt-0.5">Gestionnaire parc</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRegRole('DRIVER')}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          regRole === 'DRIVER'
                            ? 'border-sky-500 bg-sky-50/80 ring-2 ring-sky-500/20 text-sky-950 font-bold'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Car className={`w-4 h-4 ${regRole === 'DRIVER' ? 'text-sky-600' : 'text-slate-400'}`} />
                          {regRole === 'DRIVER' && <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />}
                        </div>
                        <div className="text-[11px] font-bold leading-tight">Chauffeur</div>
                        <div className="text-[9px] text-slate-500 leading-tight mt-0.5">Conducteur pro</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRegRole('CLIENT')}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          regRole === 'CLIENT'
                            ? 'border-sky-500 bg-sky-50/80 ring-2 ring-sky-500/20 text-sky-950 font-bold'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Truck className={`w-4 h-4 ${regRole === 'CLIENT' ? 'text-sky-600' : 'text-slate-400'}`} />
                          {regRole === 'CLIENT' && <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />}
                        </div>
                        <div className="text-[11px] font-bold leading-tight">Convoyage</div>
                        <div className="text-[9px] text-slate-500 leading-tight mt-0.5">Donneur d’ordre</div>
                      </button>
                    </div>
                  </div>

                  {/* Name fields */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor={regFirstNameId}
                        className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1"
                      >
                        Prénom *
                      </label>
                      <input
                        id={regFirstNameId}
                        type="text"
                        value={regFirstName}
                        onChange={(e) => setRegFirstName(e.target.value)}
                        onBlur={() => setRegTouched((prev) => ({ ...prev, firstName: true }))}
                        placeholder="Marc"
                        className={`w-full px-3 py-2 text-xs rounded-xl transition-all ${
                          regErrors.firstName
                            ? 'border-2 border-rose-400 bg-rose-50/25 text-slate-900 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500'
                            : regTouched.firstName && regFirstName.trim().length >= 2
                            ? 'border border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500'
                            : 'border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500'
                        }`}
                        required
                      />
                      {regErrors.firstName && (
                        <p className="mt-1 text-[10px] text-rose-600 flex items-center gap-1 font-semibold">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          {regErrors.firstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor={regLastNameId}
                        className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1"
                      >
                        Nom de famille *
                      </label>
                      <input
                        id={regLastNameId}
                        type="text"
                        value={regLastName}
                        onChange={(e) => setRegLastName(e.target.value)}
                        onBlur={() => setRegTouched((prev) => ({ ...prev, lastName: true }))}
                        placeholder="SOGLO"
                        className={`w-full px-3 py-2 text-xs rounded-xl transition-all ${
                          regErrors.lastName
                            ? 'border-2 border-rose-400 bg-rose-50/25 text-slate-900 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500'
                            : regTouched.lastName && regLastName.trim().length >= 2
                            ? 'border border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500'
                            : 'border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500'
                        }`}
                        required
                      />
                      {regErrors.lastName && (
                        <p className="mt-1 text-[10px] text-rose-600 flex items-center gap-1 font-semibold">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          {regErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Company & Fleet size */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor={regCompanyId}
                        className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1"
                      >
                        {regRole === 'DRIVER' ? 'Société ou Affiliation' : 'Nom de l’entreprise *'}
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                        <input
                          id={regCompanyId}
                          type="text"
                          value={regCompanyName}
                          onChange={(e) => setRegCompanyName(e.target.value)}
                          onBlur={() => setRegTouched((prev) => ({ ...prev, companyName: true }))}
                          placeholder={
                            regRole === 'DRIVER' ? 'Ex: Conducteur Indépendant' : 'Ex: Transports & Logistique Bénin SARL'
                          }
                          className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl transition-all ${
                            regErrors.companyName
                              ? 'border-2 border-rose-400 bg-rose-50/25 text-slate-900 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500'
                              : regTouched.companyName && regCompanyName.trim().length >= 2
                              ? 'border border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500'
                              : 'border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500'
                          }`}
                          required={regRole !== 'DRIVER'}
                        />
                      </div>
                      {regErrors.companyName && (
                        <p className="mt-1 text-[10px] text-rose-600 flex items-center gap-1 font-semibold">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          {regErrors.companyName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor={regFleetSizeId}
                        className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1"
                      >
                        Taille estimée du parc
                      </label>
                      <select
                        id={regFleetSizeId}
                        value={regFleetSize}
                        onChange={(e) => setRegFleetSize(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-white"
                      >
                        <option value="1-5">1 à 5 véhicules (Formule Essentiel)</option>
                        <option value="6-25">6 à 25 véhicules (Formule Pro Business)</option>
                        <option value="26-50">26 à 50 véhicules (Grand Parc)</option>
                        <option value="50+">Plus de 50 véhicules (Sur mesure Entreprise)</option>
                      </select>
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label
                          htmlFor={regEmailId}
                          className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider"
                        >
                          Adresse e-mail professionnelle *
                        </label>
                        {regTouched.email && !regErrors.email && regEmail && (
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Conforme
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                        <input
                          id={regEmailId}
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          onBlur={() => setRegTouched((prev) => ({ ...prev, email: true }))}
                          placeholder="direction@mon-entreprise.bj"
                          className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl transition-all ${
                            regErrors.email
                              ? 'border-2 border-rose-400 bg-rose-50/25 text-slate-900 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500'
                              : regTouched.email && isValidEmail(regEmail)
                              ? 'border border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500'
                              : 'border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500'
                          }`}
                          required
                        />
                      </div>
                      {emailSuggestion && (
                        <button
                          type="button"
                          onClick={() => setRegEmail(emailSuggestion)}
                          className="mt-1 text-[10px] text-sky-600 hover:underline flex items-center gap-1 text-left cursor-pointer"
                        >
                          <Info className="w-3 h-3 shrink-0" />
                          <span>Vouliez-vous dire <strong>{emailSuggestion}</strong> ?</span>
                        </button>
                      )}
                      {regErrors.email && (
                        <p className="mt-1 text-[10px] text-rose-600 flex items-center gap-1 font-semibold">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          {regErrors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label
                          htmlFor={regPhoneId}
                          className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider"
                        >
                          Numéro de téléphone
                        </label>
                        <span className="text-[10px] text-slate-400">Bénin (+229) ou intl</span>
                      </div>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                        <input
                          id={regPhoneId}
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          onBlur={() => setRegTouched((prev) => ({ ...prev, phone: true }))}
                          placeholder="+229 01 23 45 67"
                          className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl transition-all ${
                            regErrors.phone
                              ? 'border-2 border-rose-400 bg-rose-50/25 text-slate-900 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500'
                              : 'border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500'
                          }`}
                        />
                      </div>
                      {regErrors.phone && (
                        <p className="mt-1 text-[10px] text-rose-600 flex items-center gap-1 font-semibold">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          {regErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ======================================================== */}
                  {/* PASSWORD & DETAILED STRENGTH FEEDBACK                    */}
                  {/* ======================================================== */}
                  <div className="pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Password input */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label
                            htmlFor={regPasswordId}
                            className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider"
                          >
                            Mot de passe (min. 8 car.) *
                          </label>
                        </div>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                          <input
                            id={regPasswordId}
                            type={showRegPassword ? 'text' : 'password'}
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            onBlur={() => setRegTouched((prev) => ({ ...prev, password: true }))}
                            placeholder="••••••••"
                            className={`w-full pl-9 pr-10 py-2 text-xs rounded-xl transition-all ${
                              regErrors.password
                                ? 'border-2 border-rose-400 bg-rose-50/25 text-slate-900 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500'
                                : regTouched.password && regPassword.length >= 8
                                ? 'border border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500'
                                : 'border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500'
                            }`}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegPassword(!showRegPassword)}
                            className="absolute right-3 top-2 text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-md"
                            title={showRegPassword ? 'Masquer' : 'Afficher'}
                          >
                            {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {regErrors.password && (
                          <p className="mt-1 text-[10px] text-rose-600 flex items-center gap-1 font-semibold">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            {regErrors.password}
                          </p>
                        )}
                      </div>

                      {/* Confirm Password input */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label
                            htmlFor={regConfirmPasswordId}
                            className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider"
                          >
                            Confirmer le mot de passe *
                          </label>
                          {passwordsMatch && (
                            <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              <CheckCircle className="w-3 h-3" /> Identiques
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                          <input
                            id={regConfirmPasswordId}
                            type={showRegPasswordConfirm ? 'text' : 'password'}
                            value={regPasswordConfirm}
                            onChange={(e) => setRegPasswordConfirm(e.target.value)}
                            onBlur={() => setRegTouched((prev) => ({ ...prev, confirmPassword: true }))}
                            placeholder="••••••••"
                            className={`w-full pl-9 pr-10 py-2 text-xs rounded-xl transition-all ${
                              passwordsMismatch || regErrors.confirmPassword
                                ? 'border-2 border-rose-400 bg-rose-50/25 text-slate-900 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500'
                                : passwordsMatch
                                ? 'border-2 border-emerald-400 bg-emerald-50/15 text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500'
                                : 'border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500'
                            }`}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegPasswordConfirm(!showRegPasswordConfirm)}
                            className="absolute right-3 top-2 text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-md"
                            title={showRegPasswordConfirm ? 'Masquer' : 'Afficher'}
                          >
                            {showRegPasswordConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {passwordsMismatch && (
                          <p className="mt-1 text-[10px] text-rose-600 flex items-center gap-1 font-semibold">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            Les mots de passe ne correspondent pas.
                          </p>
                        )}
                        {regErrors.confirmPassword && !passwordsMismatch && (
                          <p className="mt-1 text-[10px] text-rose-600 flex items-center gap-1 font-semibold">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            {regErrors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* DYNAMIC PASSWORD STRENGTH GAUGE & CHECKLIST */}
                    {regPassword.length > 0 && (
                      <div
                        id="password-strength-container"
                        className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 transition-all shadow-2xs"
                      >
                        {/* Header with Level and Progress */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5">
                            <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                              Sécurité du mot de passe :
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500 font-bold">
                              {passwordEvaluation.percentage}%
                            </span>
                            <span
                              className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                                passwordEvaluation.score === 1
                                  ? 'bg-rose-100 text-rose-700'
                                  : passwordEvaluation.score === 2
                                  ? 'bg-amber-100 text-amber-700'
                                  : passwordEvaluation.score === 3
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-sky-100 text-sky-700'
                              }`}
                            >
                              {passwordEvaluation.label}
                            </span>
                          </div>
                        </div>

                        {/* Multi-Segmented Colored Progress Bar */}
                        <div className="grid grid-cols-4 gap-1.5 h-2 w-full mb-2.5">
                          <div
                            className={`rounded-full transition-all duration-300 ${
                              passwordEvaluation.score >= 1 ? passwordEvaluation.color : 'bg-slate-200'
                            }`}
                          />
                          <div
                            className={`rounded-full transition-all duration-300 ${
                              passwordEvaluation.score >= 2 ? passwordEvaluation.color : 'bg-slate-200'
                            }`}
                          />
                          <div
                            className={`rounded-full transition-all duration-300 ${
                              passwordEvaluation.score >= 3 ? passwordEvaluation.color : 'bg-slate-200'
                            }`}
                          />
                          <div
                            className={`rounded-full transition-all duration-300 ${
                              passwordEvaluation.score >= 4 ? passwordEvaluation.color : 'bg-slate-200'
                            }`}
                          />
                        </div>

                        {/* Live Criteria Checklist */}
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px] pt-2 border-t border-slate-200">
                          <div
                            className={`flex items-center gap-1.5 transition-colors ${
                              passwordEvaluation.criteria.minLength
                                ? 'text-emerald-700 font-extrabold'
                                : 'text-slate-400'
                            }`}
                          >
                            {passwordEvaluation.criteria.minLength ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-slate-300 ml-0.5 mr-1 shrink-0" />
                            )}
                            <span>Min. 8 caractères</span>
                          </div>

                          <div
                            className={`flex items-center gap-1.5 transition-colors ${
                              passwordEvaluation.criteria.hasLower && passwordEvaluation.criteria.hasUpper
                                ? 'text-emerald-700 font-extrabold'
                                : 'text-slate-400'
                            }`}
                          >
                            {passwordEvaluation.criteria.hasLower && passwordEvaluation.criteria.hasUpper ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-slate-300 ml-0.5 mr-1 shrink-0" />
                            )}
                            <span>Majuscules & minuscules</span>
                          </div>

                          <div
                            className={`flex items-center gap-1.5 transition-colors ${
                              passwordEvaluation.criteria.hasNumber
                                ? 'text-emerald-700 font-extrabold'
                                : 'text-slate-400'
                            }`}
                          >
                            {passwordEvaluation.criteria.hasNumber ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-slate-300 ml-0.5 mr-1 shrink-0" />
                            )}
                            <span>Au moins un chiffre (0-9)</span>
                          </div>

                          <div
                            className={`flex items-center gap-1.5 transition-colors ${
                              passwordEvaluation.criteria.hasSpecial
                                ? 'text-emerald-700 font-extrabold'
                                : 'text-slate-400'
                            }`}
                          >
                            {passwordEvaluation.criteria.hasSpecial ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-slate-300 ml-0.5 mr-1 shrink-0" />
                            )}
                            <span>Caractère spécial (!, @, #, $)</span>
                          </div>
                        </div>

                        {/* Actionable recommendation sentence */}
                        <div className="mt-2 text-[10px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200/80 flex items-start gap-1.5">
                          <Info className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                          <span>{passwordEvaluation.suggestion}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Accept terms checkbox with validation */}
                  <div className="pt-1">
                    <label
                      htmlFor={regTermsId}
                      className="flex items-start gap-2.5 cursor-pointer select-none"
                    >
                      <input
                        id={regTermsId}
                        type="checkbox"
                        checked={regAcceptTerms}
                        onChange={(e) => {
                          setRegAcceptTerms(e.target.checked);
                          setRegTouched((prev) => ({ ...prev, terms: true }));
                        }}
                        className="mt-0.5 rounded-sm border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                      />
                      <span className="text-[11px] text-slate-600 leading-tight">
                        J'accepte les conditions générales du service JMF Fleet & Mobility et autorise le traitement sécurisé des données télématiques de mon parc conformément à la réglementation béninoise (APDP).
                      </span>
                    </label>
                    {regErrors.terms && (
                      <p className="mt-1 text-[10px] text-rose-600 flex items-center gap-1 font-semibold">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        {regErrors.terms}
                      </p>
                    )}
                  </div>

                  {/* Register Submit Button */}
                  <button
                    id="auth-submit-register-btn"
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3.5 px-4 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-md shadow-sky-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Création et configuration de votre flotte en cours...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-sky-200" />
                        <span>Créer mon compte JMF Fleet Pro</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Clear Reciprocal Switch to Login */}
                <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-black text-slate-900">Vous avez déjà un compte ou des accès chauffeur ?</div>
                    <div className="text-[11px] text-slate-500">
                      Connectez-vous directement avec votre e-mail et mot de passe.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('login');
                      setError(null);
                      setFieldErrorsList([]);
                    }}
                    className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
                  >
                    <LogIn className="w-3.5 h-3.5 text-sky-600" />
                    <span>Se connecter ici</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer with return to public website */}
          {onGoToPublic && (
            <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <button
                type="button"
                onClick={onGoToPublic}
                className="font-bold text-slate-600 hover:text-sky-600 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>← Retour au site vitrine JMF</span>
              </button>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-sky-500" />
                <span>Akpakpa Hub Central • Cotonou, Bénin</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const AuthPortalView = LoginView;
