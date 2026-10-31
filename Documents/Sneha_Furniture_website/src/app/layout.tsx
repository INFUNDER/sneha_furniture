import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import "./globals.css";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import MarqueeBanner from "@/components/MarqueeBanner";
import CookieBanner from "@/components/CookieBanner";
import Analytics from "@/components/Analytics";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import IntroLoader from "@/components/IntroLoader";
import MotionProvider from "@/components/motion/MotionProvider";
import { ADDRESS, BRAND_NAME, CONTACT_EMAIL, PHONES, SITE_URL, SOCIAL } from "@/lib/site";
import NextTopLoader from 'nextjs-toploader';

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

// Runs before paint: enables JS-only reveal styles and skips the intro after the first view.
const BOOT_SCRIPT = `document.documentElement.classList.add('js');try{if(sessionStorage.getItem('sneha-intro'))document.documentElement.setAttribute('data-intro','seen')}catch(e){}`;

const DESCRIPTION = `Shop sofas, beds, dining sets and living room furniture at ${BRAND_NAME}, Dehradun. Visit our showroom on Saharanpur Road or order online with free delivery.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND_NAME} | Premium Furniture in Dehradun`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    title: `${BRAND_NAME} | Premium Furniture in Dehradun`,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: BRAND_NAME,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${BRAND_NAME} logo`,
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
  themeColor: "#F6F1EA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${cormorant.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-ivory text-ink font-sans overflow-x-hidden">
        <IntroLoader />
        <NextTopLoader
          color="#7A5230"
          initialPosition={0.08}
          crawlSpeed={200}
          height={2}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow={false}
        />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[300] btn btn-primary">Skip to content</a>
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
            <SiteHeader />

            <main id="main" className="flex-grow w-full">
              {children}
            </main>

            <SiteFooter />
            <WhatsAppWidget />
            <CookieBanner />
          </WishlistProvider>
        </CartProvider>
        <MotionProvider />
        <Analytics gaId="G-PZ4QKENKZJ" />
      </body>
    </html>
  );
}
