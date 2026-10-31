const ITEMS = ['Free delivery on every order', 'Cash on delivery available', 'Visit our showroom on Saharanpur Road, Dehradun'];

// Slim announcement strip above the header.
export default function MarqueeBanner() {
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center">
      {[...ITEMS, ...ITEMS].map((t, i) => (
        <span key={i} className="flex items-center gap-10 pr-10">
          {t}
          <span className="w-1 h-1 rounded-full bg-brass-light" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-ink text-ivory/90 h-9 overflow-hidden flex items-center text-[11px] font-medium tracking-[0.2em] uppercase">
      <p className="sr-only">{ITEMS.join('. ')}</p>
      <div className="marquee-track flex w-max" aria-hidden="true">
        {row('a')}
        {row('b')}
      </div>
    </div>
  );
}
