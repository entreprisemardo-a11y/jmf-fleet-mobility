import React, { useState } from 'react';
import { Download, Smartphone, Share, PlusSquare, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall.js';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'primary' | 'outline' | 'compact';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'compact',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already running as an installed standalone PWA, hide the button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    setIsInstalling(true);
    try {
      await install();
    } finally {
      setIsInstalling(false);
    }
  };

  // Chromium / Android / Edge / Desktop flow
  if (isInstallable) {
    if (variant === 'compact') {
      return (
        <button
          id="pwa-install-btn-compact"
          onClick={handleInstallClick}
          disabled={isInstalling}
          title="Installer JMF Fleet pour un accès hors-ligne instantané"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-xs transition-all active:scale-95 ${className}`}
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Installer l'app</span>
        </button>
      );
    }

    return (
      <button
        id="pwa-install-btn-full"
        onClick={handleInstallClick}
        disabled={isInstalling}
        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/25 transition-all ${className}`}
      >
        <Smartphone className="w-4 h-4" />
        <span>Installer JMF Fleet sur l'appareil</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          id="pwa-install-btn-ios"
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 transition-all ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Installer (iOS)</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Installer JMF Fleet sur iPhone</h3>
                    <p className="text-[11px] text-slate-500">Accès rapide & mode hors-ligne</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs text-slate-700">
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div className="p-1.5 bg-sky-100 rounded-lg text-sky-700 shrink-0">
                    <Share className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">1. Appuyez sur Partager</p>
                    <p className="text-[11px] text-slate-500">Dans la barre de navigation Safari au bas de l'écran.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-700 shrink-0">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">2. "Sur l'écran d'accueil"</p>
                    <p className="text-[11px] text-slate-500">Faites défiler le menu et sélectionnez cette option.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <p className="text-[11px] font-medium leading-relaxed">
                    L'icône JMF Fleet sera ajoutée à votre écran avec le cache hors-ligne actif.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
              >
                Compris
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
