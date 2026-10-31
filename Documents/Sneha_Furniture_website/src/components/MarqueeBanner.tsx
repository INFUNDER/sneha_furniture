'use client';

export default function MarqueeBanner() {
  const text = "FREE DELIVERY ON ALL ORDERS • CASH ON DELIVERY AVAILABLE • VISIT OUR SHOWROOM IN DEHRADUN";

  return (
    <div className="w-full bg-black text-white py-2 overflow-hidden flex items-center relative z-50">
      <p className="sr-only">{text}</p>
      <div className="marquee-content whitespace-nowrap text-xs font-bold uppercase tracking-widest flex" aria-hidden="true">
        <span className="px-8">{text}</span>
        <span className="px-8">{text}</span>
        <span className="px-8">{text}</span>
        <span className="px-8">{text}</span>
      </div>
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-content {
          animation: marquee 20s linear infinite;
          min-width: 200%;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-content { animation: none; }
        }
      `}</style>
    </div>
  );
}
