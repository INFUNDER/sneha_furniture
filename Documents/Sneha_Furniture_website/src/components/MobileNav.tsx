'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-black hover:opacity-70 transition flex items-center justify-center"
        aria-label="Open Mobile Menu"
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Menu */}
      <div 
        className={`fixed top-0 left-0 h-full w-[280px] bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-gray-100">
          <span className="text-xl font-black uppercase tracking-tight">Menu</span>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-black hover:opacity-70 transition"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col p-6 gap-6 text-sm font-bold uppercase tracking-widest text-black">
          <Link href="/shop" onClick={() => setIsOpen(false)} className="hover:text-primary transition">Shop</Link>
          <Link href="/services" onClick={() => setIsOpen(false)} className="hover:text-primary transition">Services</Link>
          <Link href="/about" onClick={() => setIsOpen(false)} className="hover:text-primary transition">About</Link>
          <Link href="/contact" onClick={() => setIsOpen(false)} className="hover:text-primary transition">Contact</Link>
        </nav>
        
        <div className="mt-auto p-6 border-t border-gray-100">
          <a href="mailto:snehafurnituresddn@gmail.com" className="text-xs font-bold text-gray-500 hover:text-black transition break-all block mb-2">
            snehafurnituresddn@gmail.com
          </a>
          <a href="tel:+918755594915" className="text-xs font-bold text-gray-500 hover:text-black transition">
            +91 87555 94915
          </a>
        </div>
      </div>
    </div>
  );
}
