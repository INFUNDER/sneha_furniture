'use client';

import { MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { BRAND_NAME, SITE_URL, WHATSAPP_NUMBER } from '@/lib/site';

export default function WhatsAppWidget() {
  const pathname = usePathname();
  
  let message = `Hi ${BRAND_NAME}, I would like to know more about your premium furniture collection.`;
  
  // Dynamic message based on current page
  if (pathname.startsWith('/products/')) {
    message = `Hi ${BRAND_NAME}, I am currently looking at a product on your website and would like to ask about custom sizes or floor models. Link: ${SITE_URL}${pathname}`;
  } else if (pathname === '/contact') {
    message = `Hi ${BRAND_NAME}, I would like to visit your showroom in Dehradun. Can you share the exact location?`;
  }

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group fixed bottom-5 right-5 md:bottom-6 md:right-6 z-50 flex items-center gap-0 h-13 pl-3.5 pr-3.5 rounded-full bg-ink text-ivory shadow-[0_16px_40px_-12px_rgba(31,26,23,0.55)] transition-all duration-500 ease-out-soft hover:pr-5 hover:gap-2.5 hover:bg-brass"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle size={22} strokeWidth={1.6} aria-hidden="true" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium transition-[max-width] duration-500 ease-out-soft group-hover:max-w-[140px]">
        Chat with us
      </span>
    </a>
  );
}
