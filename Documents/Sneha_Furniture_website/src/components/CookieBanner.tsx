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
    <div role="dialog" aria-label="Cookie consent" className="fixed bottom-0 left-0 right-0 bg-black text-white p-6 z-[100] flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-800">
      <div className="text-sm font-medium opacity-90 max-w-4xl">
        We use essential cookies to keep you signed in and remember your cart. With your permission, we also use Google Analytics cookies to understand how visitors use our site. You can change this choice any time from &quot;Cookie Settings&quot; in the footer. Read our <Link href="/privacy" className="underline hover:text-gray-300">Privacy Policy</Link>.
      </div>
      <div className="flex gap-4">
        <button
          onClick={handleReject}
          className="shrink-0 bg-transparent text-white border border-white px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition"
        >
          Reject
        </button>
        <button
          onClick={handleAccept}
          className="shrink-0 bg-white text-black px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
