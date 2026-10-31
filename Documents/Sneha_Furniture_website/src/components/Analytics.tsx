'use client';

import { useSyncExternalStore } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { readConsent, subscribeConsent } from '@/lib/consent';

// Google Analytics loads only after the visitor accepts cookies.
export default function Analytics({ gaId }: { gaId: string }) {
  const consent = useSyncExternalStore(subscribeConsent, readConsent, () => null);
  return consent === 'true' ? <GoogleAnalytics gaId={gaId} /> : null;
}
