import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { CartProvider } from "@/context/CartContext";
import Link from "next/link";
import { User } from "lucide-react";
import CartIcon from "@/components/CartIcon";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sneha Premium Furniture | Luxury Furniture in Dehradun",
  description: "Shop premium quality living room, bedroom, and dining furniture at Sneha Furniture, Dehradun. Handcrafted Teak & Sheesham wood pieces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <CartProvider>
          <header className="w-full bg-white">
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
          <footer className="bg-white text-black py-16 px-6 max-w-[1400px] mx-auto w-full flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 w-full">
              <div className="flex flex-col">
                <h2 className="text-4xl md:text-5xl font-black font-sans uppercase tracking-tight">SNEHA FURNITURE</h2>
                <p className="mt-4 text-xs font-bold uppercase tracking-widest opacity-50 text-left">
                  &copy; {new Date().getFullYear()} SNEHA FURNITURE
                </p>
              </div>
              <a href="mailto:ronitmittal0@gmail.com" className="text-4xl md:text-5xl font-black font-sans uppercase tracking-tight hover:opacity-70 transition break-all text-center md:text-right">
                RONITMITTAL0@GMAIL.COM
              </a>
            </div>
            
            <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest opacity-50 justify-center md:justify-start mt-8 border-t border-black/10 pt-8">
              <a href="/privacy" className="hover:opacity-100 transition">Privacy Policy</a>
              <span className="hidden md:inline">|</span>
              <a href="/terms" className="hover:opacity-100 transition">Terms & Conditions</a>
              <span className="hidden md:inline">|</span>
              <a href="/refund" className="hover:opacity-100 transition">Refund Policy</a>
              <span className="hidden md:inline">|</span>
              <a href="/shipping" className="hover:opacity-100 transition">Shipping Policy</a>
            </div>
          </footer>

          <WhatsAppWidget />
        </CartProvider>
      </body>
    </html>
  );
}
