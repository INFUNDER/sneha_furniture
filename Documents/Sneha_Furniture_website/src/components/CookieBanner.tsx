'use client';

import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-6 z-[100] flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-800">
      <div className="text-sm font-medium opacity-90 max-w-4xl">
        We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies. Read our <a href="/privacy" className="underline hover:text-gray-300">Privacy Policy</a> for more info.
      </div>
      <button 
        onClick={handleAccept}
        className="shrink-0 bg-white text-black px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition"
      >
        Accept
      </button>
    </div>
  );
}
