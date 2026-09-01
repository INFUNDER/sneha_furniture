'use client';

import { MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function WhatsAppWidget() {
  const pathname = usePathname();
  const phoneNumber = '919634312102'; // +91 96343 12102
  
  let message = 'Hi Sneha Furniture, I would like to know more about your premium furniture collection.';
  
  // Dynamic message based on current page
  if (pathname.startsWith('/products/')) {
    message = `Hi Sneha Furniture, I am currently looking at a product on your website and would like to ask about custom sizes or floor models. Link: https://localhost:3000${pathname}`;
  } else if (pathname === '/contact') {
    message = 'Hi Sneha Furniture, I would like to visit your showroom in Dehradun. Can you share the exact location?';
  }

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

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
