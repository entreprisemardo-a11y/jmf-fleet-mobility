import { registerSW } from 'virtual:pwa-register';

export function setupServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    const updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        console.log('[PWA] Contenu mis à jour disponible.');
      },
      onOfflineReady() {
        console.log('[PWA] JMF Fleet est prêt pour une consultation hors-ligne.');
      },
      onRegisteredSW(swUrl, registration) {
        console.log(`[PWA] Service Worker enregistré : ${swUrl}`);
      },
      onRegisterError(error) {
        console.warn('[PWA] Échec enregistrement Service Worker :', error);
      },
    });

    return updateSW;
  }
  return null;
}
