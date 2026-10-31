'use client';

import { useEffect } from 'react';
import ArmchairMark from './ArmchairMark';
import BrandMark from './BrandMark';
import { BRAND_NAME } from '@/lib/site';

/**
 * First-visit intro: an armchair draws itself, dissolves into the SF monogram, the name fades
 * in and the screen lifts away.
 * The animation is pure CSS (globals.css, .intro) so it starts before hydration; the head
 * script in layout.tsx hides it on later page views in the same browser session.
 */
export default function IntroLoader() {
  useEffect(() => {
    try {
      sessionStorage.setItem('sneha-intro', '1');
    } catch {
      // Storage blocked: the intro simply plays again next time.
    }
    // Remove it from the layout once the lift animation has finished.
    const t = setTimeout(() => document.documentElement.setAttribute('data-intro', 'seen'), 3600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="intro" aria-hidden="true">
      <div className="relative w-36 md:w-44 aspect-[12/11] grid place-items-center">
        <ArmchairMark className="intro-chair absolute inset-0 w-full text-brass" strokeWidth={1.4} />
        <BrandMark decorative className="intro-mono w-[78%] text-ink" />
      </div>
      <div className="intro-word flex flex-col items-center gap-4">
        <p className="font-display text-3xl md:text-4xl tracking-[0.12em] uppercase text-ink">{BRAND_NAME}</p>
        <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-stone">Premium Furniture · Dehradun</p>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 flex flex-col items-center gap-3">
        <span className="intro-count text-xs font-semibold tracking-[0.2em] text-stone" />
        <span className="block h-px w-full bg-line overflow-hidden">
          <span className="intro-bar block h-full w-full bg-brass" />
        </span>
      </div>
    </div>
  );
}
