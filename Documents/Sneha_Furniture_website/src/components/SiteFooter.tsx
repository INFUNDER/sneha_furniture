import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import CookieSettingsButton from './CookieSettingsButton';
import BrandMark from './BrandMark';
import { ADDRESS, BRAND_NAME, CONTACT_EMAIL, PHONES, SOCIAL } from '@/lib/site';

const linkClass = 'text-sm text-ivory/70 hover:text-ivory transition-colors';

export default function SiteFooter() {
  return (
    <footer className="bg-ink text-ivory mt-auto">
      {/* Showroom invitation */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 pt-20 md:pt-28 pb-16 grid lg:grid-cols-[1.4fr_1fr] gap-12 items-end border-b border-ivory/10">
        <div data-reveal>
          <p className="eyebrow !text-brass-light before:!bg-brass-light/60">Visit the showroom</p>
          <h2 className="font-display text-5xl md:text-7xl leading-[0.95] mt-6">
            Sit on it <em className="text-brass-light">before</em><br />you bring it home.
          </h2>
        </div>
        <div className="flex flex-col gap-6 lg:items-end" data-reveal style={{ '--reveal-delay': '150ms' } as React.CSSProperties}>
          <address className="not-italic text-ivory/70 leading-relaxed lg:text-right">
            {ADDRESS.street}<br />{ADDRESS.city}, {ADDRESS.state} {ADDRESS.pincode}<br />
            Mon – Sat · 10:30 AM – 8:00 PM
          </address>
          <Link href="/contact" className="btn btn-light self-start lg:self-auto">
            Plan your visit <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-5 md:px-10 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="flex flex-col gap-3">
          <h3 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brass-light mb-2">Shop</h3>
          <Link href="/shop" className={linkClass}>All Furniture</Link>
          <Link href="/shop?category=Sofa" className={linkClass}>Sofas</Link>
          <Link href="/shop?category=Bedroom" className={linkClass}>Bedroom</Link>
          <Link href="/shop?category=Dining" className={linkClass}>Dining</Link>
          <Link href="/shop?category=Living%20Room" className={linkClass}>Living Room</Link>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brass-light mb-2">Studio</h3>
          <Link href="/about" className={linkClass}>Our Story</Link>
          <Link href="/services" className={linkClass}>Services</Link>
          <Link href="/contact" className={linkClass}>Contact</Link>
          <Link href="/profile" className={linkClass}>My Account</Link>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brass-light mb-2">Talk to us</h3>
          {PHONES.map((p) => (
            <a key={p.tel} href={`tel:${p.tel}`} className={linkClass}>{p.display}</a>
          ))}
          <a href={`mailto:${CONTACT_EMAIL}`} className={`${linkClass} break-all`}>{CONTACT_EMAIL}</a>
          <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className={linkClass}>Instagram</a>
          <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" className={linkClass}>Facebook</a>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brass-light mb-2">Policies</h3>
          <Link href="/shipping" className={linkClass}>Shipping & Delivery</Link>
          <Link href="/refund" className={linkClass}>Returns & Refunds</Link>
          <Link href="/terms" className={linkClass}>Terms & Conditions</Link>
          <Link href="/privacy" className={linkClass}>Privacy Policy</Link>
          <CookieSettingsButton className={`${linkClass} text-left`} />
        </div>
      </div>

      {/* Oversized wordmark */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 overflow-hidden">
        <div className="flex items-center gap-5 md:gap-10 border-t border-ivory/10 pt-12" aria-hidden="true">
          <BrandMark decorative className="h-[13vw] md:h-[9vw] max-h-40 text-brass-light" />
          <p className="font-display text-[13vw] md:text-[9.5vw] leading-[0.85] tracking-[-0.02em] text-ivory/95 whitespace-nowrap">
            Sneha <em className="text-ivory/60">Furniture</em>
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-5 md:px-10 py-8 flex flex-col md:flex-row gap-2 justify-between text-xs text-ivory/50">
        <p>&copy; {new Date().getFullYear()} {BRAND_NAME}, Dehradun. All rights reserved.</p>
        <p>Prices include all taxes · Free delivery · Cash on delivery</p>
      </div>
    </footer>
  );
}
