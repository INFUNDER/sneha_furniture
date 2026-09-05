import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Link from "next/link";
import { User, Heart } from "lucide-react";
import CartIcon from "@/components/CartIcon";
import MarqueeBanner from "@/components/MarqueeBanner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sneha Furniture | Luxury Furniture in Dehradun",
  description: "Shop premium quality living room, bedroom, and dining furniture at Sneha Furniture, Dehradun. Handcrafted Teak & Sheesham wood pieces.",
  icons: {
    icon: '/icon.png',
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
        <CartProvider>
          <WishlistProvider>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FurnitureStore",
                  "name": "Sneha Furniture",
                  "url": "https://www.snehafurniture.in/",
                  "logo": "https://www.snehafurniture.in/logo.png",
                  "telephone": "+918755594915",
                  "email": "snehafurnituresddn@gmail.com",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Dehradun",
                    "addressRegion": "Uttarakhand",
                    "addressCountry": "IN"
                  },
                  "sameAs": [
                    "https://www.facebook.com/share/1Hd1tiWFCt/?mibextid=wwXIfr",
                    "https://www.instagram.com/snehafurniture.in?stkn=MTdkaGJzdGVydHRzag%3D%3D&utm_source=qr"
                  ]
                })
              }}
            />
            <MarqueeBanner />
            <header className="w-full bg-[#F5F5F5]">
            <div className="max-w-[1400px] mx-auto px-6 h-24 flex items-center justify-between">
              <Link href="/" className="text-3xl font-black font-sans tracking-tight text-black uppercase">
                Sneha Furnitures
              </Link>
              <div className="flex items-center gap-8">
                <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-wider text-black">
                  <Link href="/shop" className="hover:opacity-70 transition">Shop</Link>
                  <Link href="/services" className="hover:opacity-70 transition">Services</Link>
                  <Link href="/about" className="hover:opacity-70 transition">About</Link>
                  <Link href="/contact" className="hover:opacity-70 transition">Contact</Link>
                </nav>
                <div className="flex items-center gap-6 text-black">
                  <Link href="/wishlist" className="text-sm font-bold uppercase tracking-wider hover:opacity-70 transition flex items-center gap-2">
                    <Heart size={18} />
                  </Link>
                  <Link href="/profile" className="text-sm font-bold uppercase tracking-wider hover:opacity-70 transition flex items-center gap-2">
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
          <footer className="bg-[#F5F5F5] text-black pt-24 pb-12 w-full mt-auto">
            <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-12 mb-16">
              {/* Brand Column */}
              <div className="flex flex-col gap-6 md:col-span-1">
                <img src="/logo.png" alt="Sneha Furnitures Logo" className="h-16 w-auto object-contain self-start" />
                <h2 className="text-3xl font-black font-sans uppercase tracking-tight">SNEHA FURNITURES</h2>
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
                <a href="mailto:snehafurnituresddn@gmail.com" className="text-sm font-medium opacity-70 hover:opacity-100 transition break-all">snehafurnituresddn@gmail.com</a>
                <a href="tel:+918755594915" className="text-sm font-medium opacity-70 hover:opacity-100 transition">+91 87555 94915</a>
              </div>

              {/* Social */}
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-2">Social</h3>
                <a href="https://www.instagram.com/snehafurniture.in?stkn=MTdkaGJzdGVydHRzag%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-sm font-medium opacity-70 hover:opacity-100 transition">Instagram</a>
                <a href="https://www.facebook.com/share/1Hd1tiWFCt/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-sm font-medium opacity-70 hover:opacity-100 transition">Facebook</a>
              </div>

              {/* Legal */}
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-2">Policies</h3>
                <Link href="/privacy" className="text-sm font-medium opacity-70 hover:opacity-100 transition">Privacy Policy</Link>
                <Link href="/terms" className="text-sm font-medium opacity-70 hover:opacity-100 transition">Terms & Conditions</Link>
                <Link href="/refund" className="text-sm font-medium opacity-70 hover:opacity-100 transition">Refund Policy</Link>
                <Link href="/shipping" className="text-sm font-medium opacity-70 hover:opacity-100 transition">Shipping Policy</Link>
              </div>
            </div>
            
            <div className="max-w-[1400px] mx-auto px-6 pt-8 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs font-bold uppercase tracking-widest opacity-40">
                &copy; {new Date().getFullYear()} SNEHA FURNITURES. ALL RIGHTS RESERVED.
              </p>
            </div>
          </footer>

          <WhatsAppWidget />
          </WishlistProvider>
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
