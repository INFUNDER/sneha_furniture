import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";

import "./globals.css";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Link from "next/link";
import Image from "next/image";
import { User, Heart } from "lucide-react";
import CartIcon from "@/components/CartIcon";
import MarqueeBanner from "@/components/MarqueeBanner";
import CookieBanner from "@/components/CookieBanner";
import MobileNav from "@/components/MobileNav";
import Analytics from "@/components/Analytics";
import CookieSettingsButton from "@/components/CookieSettingsButton";
import { ADDRESS, BRAND_NAME, CONTACT_EMAIL, PHONES, SITE_URL, SOCIAL } from "@/lib/site";
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

const DESCRIPTION = `Shop sofas, beds, dining sets and living room furniture at ${BRAND_NAME}, Dehradun. Visit our showroom on Saharanpur Road or order online with free delivery.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND_NAME} | Premium Furniture in Dehradun`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  icons: {
    icon: '/icon.png',
  },
  openGraph: {
    title: `${BRAND_NAME} | Premium Furniture in Dehradun`,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: BRAND_NAME,
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans overflow-x-hidden">
        <NextTopLoader
          color="#000000"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #000000,0 0 5px #000000"
        />
        <CartProvider>
          <WishlistProvider>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FurnitureStore",
                  "name": BRAND_NAME,
                  "url": SITE_URL,
                  "logo": `${SITE_URL}/logo.png`,
                  "telephone": PHONES.map((p) => p.tel),
                  "email": CONTACT_EMAIL,
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": ADDRESS.street,
                    "addressLocality": ADDRESS.city,
                    "addressRegion": ADDRESS.state,
                    "postalCode": ADDRESS.pincode,
                    "addressCountry": "IN"
                  },
                  "sameAs": [SOCIAL.facebook, SOCIAL.instagram]
                })
              }}
            />
            <MarqueeBanner />
            <header className="w-full bg-[#F5F5F5]">
            <div className="max-w-[1400px] mx-auto px-6 h-24 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <MobileNav />
                <Link href="/" className="text-2xl md:text-3xl font-black font-sans tracking-tight text-black uppercase">
                  {BRAND_NAME}
                </Link>
              </div>
              <div className="flex items-center gap-8">
                <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-wider text-black">
                  <Link href="/shop" className="hover:opacity-70 transition">Shop</Link>
                  <Link href="/services" className="hover:opacity-70 transition">Services</Link>
                  <Link href="/about" className="hover:opacity-70 transition">About</Link>
                  <Link href="/contact" className="hover:opacity-70 transition">Contact</Link>
                </nav>
                <div className="flex items-center gap-6 text-black">
                  <Link href="/wishlist" aria-label="Wishlist" className="text-sm font-bold uppercase tracking-wider hover:opacity-70 transition flex items-center gap-2">
                    <Heart size={18} />
                  </Link>
                  <Link href="/profile" aria-label="My account" className="text-sm font-bold uppercase tracking-wider hover:opacity-70 transition flex items-center gap-2">
                    <User size={18} />
                  </Link>
                  <div className="text-sm font-bold uppercase tracking-wider hover:opacity-70 transition">
                    <CartIcon />
                  </div>
                </div>
              </div>
            </div>
          </header>
          
          <main className="flex-grow w-full">
            {children}
          </main>
          
          {/* Footer */}
          <footer className="bg-[#FAFAFA] border-t border-gray-200 text-black pt-16 pb-8 w-full mt-auto">
            <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-12 mb-12">
              {/* Brand Column */}
              <div className="flex flex-col gap-6 md:col-span-1">
                <Image src="/logo.png" alt={`${BRAND_NAME} logo`} width={160} height={64} className="h-16 w-auto object-contain self-start" />
                <h2 className="text-3xl font-black font-sans uppercase tracking-tight">{BRAND_NAME}</h2>
                <p className="text-sm font-medium opacity-70 leading-relaxed">
                  Premium quality living room, bedroom, and dining furniture in Dehradun. Handcrafted luxury for your home.
                </p>
              </div>

              {/* Quick Links */}
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-2">Shop</h3>
                <Link href="/shop" className="text-sm font-medium opacity-70 hover:opacity-100 transition">All Furniture</Link>
                <Link href="/services" className="text-sm font-medium opacity-70 hover:opacity-100 transition">Our Services</Link>
                <Link href="/about" className="text-sm font-medium opacity-70 hover:opacity-100 transition">About Us</Link>
              </div>

              {/* Customer Care */}
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-2">Support</h3>
                <Link href="/contact" className="text-sm font-medium opacity-70 hover:opacity-100 transition">Contact Us</Link>
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm font-medium opacity-70 hover:opacity-100 transition break-all">{CONTACT_EMAIL}</a>
                {PHONES.map((p) => (
                  <a key={p.tel} href={`tel:${p.tel}`} className="text-sm font-medium opacity-70 hover:opacity-100 transition">{p.display}</a>
                ))}
              </div>

              {/* Social */}
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-2">Social</h3>
                <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="text-sm font-medium opacity-70 hover:opacity-100 transition">Instagram</a>
                <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" className="text-sm font-medium opacity-70 hover:opacity-100 transition">Facebook</a>
              </div>

              {/* Legal */}
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-2">Policies</h3>
                <Link href="/privacy" className="text-sm font-medium opacity-70 hover:opacity-100 transition">Privacy Policy</Link>
                <Link href="/terms" className="text-sm font-medium opacity-70 hover:opacity-100 transition">Terms & Conditions</Link>
                <Link href="/refund" className="text-sm font-medium opacity-70 hover:opacity-100 transition">Refund Policy</Link>
                <Link href="/shipping" className="text-sm font-medium opacity-70 hover:opacity-100 transition">Shipping Policy</Link>
                <CookieSettingsButton className="text-left text-sm font-medium opacity-70 hover:opacity-100 transition" />
              </div>
            </div>
            
            <div className="max-w-[1400px] mx-auto px-6 pt-8 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs font-bold uppercase tracking-widest opacity-40">
                &copy; {new Date().getFullYear()} {BRAND_NAME}. ALL RIGHTS RESERVED.
              </p>
            </div>
          </footer>

          <WhatsAppWidget />
          <CookieBanner />
          </WishlistProvider>
        </CartProvider>
        <Analytics gaId="G-PZ4QKENKZJ" />
      </body>
    </html>
  );
}
