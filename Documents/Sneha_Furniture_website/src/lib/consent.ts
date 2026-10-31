// Cookie consent is stored in localStorage and broadcast with a window event
// so the banner and the analytics loader stay in sync without a context provider.
export const CONSENT_KEY = 'cookie_consent';
export const CONSENT_EVENT = 'cookie-consent-change';
export const OPEN_SETTINGS_EVENT = 'open-cookie-settings';

export function readConsent(): 'true' | 'false' | null {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === 'true' || value === 'false' ? value : null;
  } catch {
    return null;
  }
}

export function writeConsent(value: 'true' | 'false') {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Storage blocked: consent simply won't persist.
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function subscribeConsent(callback: () => void) {
  window.addEventListener(CONSENT_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(CONSENT_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}
