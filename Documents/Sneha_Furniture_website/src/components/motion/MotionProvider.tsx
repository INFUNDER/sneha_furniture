'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

/**
 * Site-wide motion, set up once in the root layout:
 * - Lenis inertial smooth scrolling (skipped for reduced motion and touch devices)
 * - one IntersectionObserver that reveals every [data-reveal] element as it scrolls in
 * - lightweight parallax for [data-parallax="<speed>"] elements
 * Server components only need to add the data attributes; no client wrappers required.
 */
export default function MotionProvider() {
  const pathname = usePathname();

  // Smooth scrolling
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (reduce || coarse) return;

    const lenis = new Lenis({ autoRaf: true, lerp: 0.1, smoothWheel: true });
    (window as Window & { lenis?: Lenis }).lenis = lenis;
    return () => {
      lenis.destroy();
      delete (window as Window & { lenis?: Lenis }).lenis;
    };
  }, []);

  // Jump to the top instantly on navigation (Lenis would otherwise animate it)
  useEffect(() => {
    const lenis = (window as Window & { lenis?: Lenis }).lenis;
    if (lenis && !window.location.hash) lenis.scrollTo(0, { immediate: true });
  }, [pathname]);

  // Scroll reveals
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-visible', 'true');
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );

    const observeAll = () => {
      document.querySelectorAll('[data-reveal]:not([data-visible])').forEach((el) => io.observe(el));
    };
    observeAll();

    // Pick up elements added by client-side navigation or late renders
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  // Parallax
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) return;
        const speed = Number(el.dataset.parallax) || 0.1;
        const offset = (rect.top + rect.height / 2 - vh / 2) * -speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
