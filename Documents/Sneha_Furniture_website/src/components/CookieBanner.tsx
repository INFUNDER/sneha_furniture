'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { OPEN_SETTINGS_EVENT, readConsent, subscribeConsent, writeConsent } from '@/lib/consent';

export default function CookieBanner() {
  // 'unset' on the server so nothing flashes before hydration.
  const consent = useSyncExternalStore(subscribeConsent, readConsent, () => 'unset' as const);
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    const open = () => setReopened(true);
    window.addEventListener(OPEN_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, open);
  }, []);

  const handleAccept = () => {
    writeConsent('true');
    setReopened(false);
  };

  const handleReject = () => {
    const wasAccepted = readConsent() === 'true';
    writeConsent('false');
    setReopened(false);
    // Analytics scripts can't be unloaded, so reload to stop them after consent is withdrawn.
    if (wasAccepted) window.location.reload();
  };

  if (consent === 'unset' || (consent !== null && !reopened)) return null;

  return (
    <div role="dialog" aria-label="Cookie consent" className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-[100] card bg-[#FBF8F3] shadow-[0_24px_60px_-20px_rgba(31,26,23,0.45)] p-6">
      <p className="font-display text-2xl">A note on cookies</p>
      <p className="mt-2 text-sm text-stone leading-relaxed">
        We use essential cookies to keep you signed in and remember your bag. With your permission, we also use Google Analytics to understand how the site is used. Change this any time from &quot;Cookie Settings&quot; in the footer. <Link href="/privacy" className="underline underline-offset-2 text-ink">Privacy Policy</Link>
      </p>
      <div className="mt-5 flex gap-3">
        <button onClick={handleReject} className="btn btn-outline flex-1 !min-h-11 !px-4">Reject</button>
        <button onClick={handleAccept} className="btn btn-primary flex-1 !min-h-11 !px-4">Accept</button>
      </div>
    </div>
  );
}
