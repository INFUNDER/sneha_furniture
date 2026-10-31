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
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 flex items-center justify-center"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={32} />
    </a>
  );
}
