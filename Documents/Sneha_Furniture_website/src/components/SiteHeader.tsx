'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, User, Search } from 'lucide-react';
import CartIcon from './CartIcon';
import MobileNav from './MobileNav';
import BrandMark from './BrandMark';
import { BRAND_NAME } from '@/lib/site';

export const NAV_LINKS = [
  { href: '/shop', label: 'Shop All' },
  { href: '/shop?category=Sofa', label: 'Sofas' },
  { href: '/shop?category=Bedroom', label: 'Bedroom' },
  { href: '/shop?category=Dining', label: 'Dining' },
  { href: '/about', label: 'Our Story' },
  { href: '/contact', label: 'Visit Us' },
];

// Sticky header that tucks away while scrolling down and returns when scrolling up.
export default function SiteHeader() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      setHidden(y > 160 && y > lastY);
      lastY = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) => (href === '/shop' ? pathname === '/shop' : pathname === href);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-[transform,background-color,box-shadow] duration-500 ease-out-soft ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      } ${scrolled ? 'bg-ivory/85 backdrop-blur-md shadow-[0_1px_0_var(--line)]' : 'bg-ivory'}`}
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 h-[72px] md:h-20 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="flex items-center gap-2">
          <MobileNav />
          <nav aria-label="Main" className="hidden lg:flex items-center gap-7 text-[13px] font-medium tracking-wide text-ink">
            {NAV_LINKS.slice(0, 4).map((l) => (
              <Link key={l.href} href={l.href} className="link-draw" aria-current={isActive(l.href) ? 'page' : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <Link href="/" className="group flex items-center gap-2.5 md:gap-3 text-ink whitespace-nowrap" aria-label={`${BRAND_NAME} home`}>
          <BrandMark decorative className="h-[22px] md:h-[28px] transition-colors duration-500 group-hover:text-brass" />
          <span className="font-display text-[23px] md:text-[29px] leading-none tracking-[0.03em]">
            Sneha <em className="text-brass">Furniture</em>
          </span>
        </Link>

        <div className="flex items-center justify-end gap-1 md:gap-2 text-ink">
          <nav aria-label="Secondary" className="hidden lg:flex items-center gap-7 mr-5 text-[13px] font-medium tracking-wide">
            {NAV_LINKS.slice(4).map((l) => (
              <Link key={l.href} href={l.href} className="link-draw" aria-current={isActive(l.href) ? 'page' : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>
          <Link href="/shop" aria-label="Search products" className="hidden sm:grid place-items-center w-11 h-11 rounded-full hover:bg-linen transition-colors">
            <Search size={19} strokeWidth={1.6} />
          </Link>
          <Link href="/wishlist" aria-label="Wishlist" className="hidden sm:grid place-items-center w-11 h-11 rounded-full hover:bg-linen transition-colors">
            <Heart size={19} strokeWidth={1.6} />
          </Link>
          <Link href="/profile" aria-label="My account" className="hidden sm:grid place-items-center w-11 h-11 rounded-full hover:bg-linen transition-colors">
            <User size={19} strokeWidth={1.6} />
          </Link>
          <CartIcon />
        </div>
      </div>
    </header>
  );
}
