'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { CONTACT_EMAIL, PHONES } from '@/lib/site';
import BrandMark from './BrandMark';

const LINKS = [
  { href: '/shop', label: 'Shop All' },
  { href: '/shop?category=Sofa', label: 'Sofas' },
  { href: '/shop?category=Bedroom', label: 'Bedroom' },
  { href: '/shop?category=Dining', label: 'Dining' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'Our Story' },
  { href: '/contact', label: 'Visit Us' },
];

const noop = () => () => {};

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  // The header animates with transform, which would trap a fixed overlay inside it,
  // so the menu is portalled to <body> once mounted on the client.
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const pathname = usePathname();

  // Close on navigation, lock page scroll while open
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setIsOpen(false), [pathname]);
  useEffect(() => {
    const lenis = (window as Window & { lenis?: { stop: () => void; start: () => void } }).lenis;
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (isOpen) lenis?.stop(); else lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="grid place-items-center w-11 h-11 -ml-2 rounded-full text-ink hover:bg-linen transition-colors"
        aria-label="Open menu"
        aria-expanded={isOpen}
      >
        <Menu size={22} strokeWidth={1.6} />
      </button>

      {mounted && createPortal(
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        data-lenis-prevent
        className={`fixed inset-0 z-[90] bg-ivory flex flex-col transition-[clip-path] duration-700 ease-out-soft ${
          isOpen ? '[clip-path:inset(0_0_0_0)]' : '[clip-path:inset(0_0_100%_0)] pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between px-5 h-[72px] border-b border-line">
          <BrandMark className="h-6 text-ink" />
          <button
            onClick={() => setIsOpen(false)}
            className="grid place-items-center w-11 h-11 rounded-full hover:bg-linen transition-colors"
            aria-label="Close menu"
          >
            <X size={22} strokeWidth={1.6} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-8 flex flex-col">
          {LINKS.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex items-center justify-between py-3 border-b border-line/70"
              style={{ transitionDelay: isOpen ? `${150 + i * 50}ms` : '0ms' }}
              tabIndex={isOpen ? 0 : -1}
            >
              <span
                className={`font-display text-[40px] leading-tight text-ink transition-all duration-700 ease-out-soft ${
                  isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: isOpen ? `${150 + i * 50}ms` : '0ms' }}
              >
                {l.label}
              </span>
              <ArrowUpRight size={22} strokeWidth={1.4} className="text-brass opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
          <div className="mt-auto pt-10 grid grid-cols-2 gap-4 text-sm">
            <Link href="/profile" tabIndex={isOpen ? 0 : -1} className="link-draw justify-self-start">My Account</Link>
            <Link href="/wishlist" tabIndex={isOpen ? 0 : -1} className="link-draw justify-self-start">Wishlist</Link>
            {PHONES.map((p) => (
              <a key={p.tel} href={`tel:${p.tel}`} tabIndex={isOpen ? 0 : -1} className="text-stone">{p.display}</a>
            ))}
            <a href={`mailto:${CONTACT_EMAIL}`} tabIndex={isOpen ? 0 : -1} className="col-span-2 text-stone break-all">{CONTACT_EMAIL}</a>
          </div>
        </nav>
      </div>,
        document.body
      )}
    </div>
  );
}
