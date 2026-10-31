import Link from 'next/link';
import ArmchairMark from './ArmchairMark';

export default function EmptyState({
  title,
  body,
  href,
  cta,
}: {
  title: string;
  body?: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-5 py-24">
      <ArmchairMark className="w-20 text-brass-soft mb-8" strokeWidth={1.6} />
      <h1 className="font-display text-5xl md:text-6xl leading-none text-balance">{title}</h1>
      {body && <p className="mt-5 max-w-md text-stone leading-relaxed">{body}</p>}
      <Link href={href} className="btn btn-primary mt-10">{cta}</Link>
    </div>
  );
}
