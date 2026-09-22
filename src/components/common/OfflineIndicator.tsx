import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus.js';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [showReconnected, setShowReconnected] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline) {
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
        setWasOffline(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  // When back online
  if (showReconnected) {
    return (
      <div
        id="pwa-reconnected-banner"
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-lg shadow-emerald-900/30 border border-emerald-400/40 animate-fade-in"
      >
        <Wifi className="w-4 h-4 text-emerald-100" />
        <span>Connexion rétablie — Données synchronisées en direct.</span>
      </div>
    );
  }

  // When offline
  if (!isOnline) {
    return (
      <aside
        id="pwa-offline-banner"
        aria-label="Avertissement mode hors-ligne"
        className="fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-semibold shadow-xl shadow-amber-950/40 border border-amber-400/50"
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
          <WifiOff className="w-4 h-4 text-amber-100" />
        </div>
        <div>
          <span className="font-bold">Mode Hors-Ligne</span>
          <span className="opacity-90 hidden sm:inline"> — Consultation des données locales en cache.</span>
        </div>
        <button
          onClick={() => window.location.reload()}
          title="Actualiser pour vérifier la connexion"
          className="ml-1 p-1 bg-amber-700/80 hover:bg-amber-700 rounded-md transition text-white active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </aside>
    );
  }

  return null;
};
