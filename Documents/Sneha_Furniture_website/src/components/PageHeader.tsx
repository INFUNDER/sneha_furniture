export default function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="max-w-[1440px] mx-auto px-5 md:px-10 pt-10 md:pt-16 pb-10 md:pb-14 border-b border-line grid md:grid-cols-[1fr_auto] gap-6 items-end">
      <div>
        <p className="eyebrow" data-reveal>{eyebrow}</p>
        <h1 className="font-display text-[clamp(3rem,7vw,6rem)] leading-[0.95] mt-5 text-balance" data-reveal style={{ '--reveal-delay': '100ms' } as React.CSSProperties}>
          {title}
        </h1>
        {intro && (
          <p className="mt-5 max-w-xl text-stone leading-relaxed" data-reveal style={{ '--reveal-delay': '200ms' } as React.CSSProperties}>
            {intro}
          </p>
        )}
      </div>
      {children}
    </header>
  );
}
