'use client';

export default function MarqueeBanner() {
  const text = "🔥 PREMIUM FURNITURE SALE • GET UP TO 50% OFF • LIMITED TIME DEAL • FREE SHIPPING 🔥";
  
  return (
    <div className="w-full bg-black text-white py-2 overflow-hidden flex items-center relative z-50">
      <div className="marquee-content whitespace-nowrap text-xs font-bold uppercase tracking-widest flex">
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
      `}</style>
    </div>
  );
}
