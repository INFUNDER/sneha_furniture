import Link from 'next/link';
import PageHeader from './PageHeader';

const POLICIES = [
  { href: '/shipping', label: 'Shipping & delivery' },
  { href: '/refund', label: 'Returns & refunds' },
  { href: '/terms', label: 'Terms & conditions' },
  { href: '/privacy', label: 'Privacy policy' },
];

export default function PolicyLayout({ title, current, children }: { title: string; current: string; children: React.ReactNode }) {
  return (
    <div className="pb-24">
      <PageHeader eyebrow="Policies" title={title} />
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 pt-12 grid lg:grid-cols-[240px_1fr] gap-10 lg:gap-20">
        <nav aria-label="Policies" className="lg:sticky lg:top-28 self-start flex lg:flex-col gap-2 overflow-x-auto hide-scrollbar -mx-5 px-5 lg:mx-0 lg:px-0">
          {POLICIES.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              aria-current={current === p.href ? 'page' : undefined}
              className={`shrink-0 rounded-full lg:rounded-xl px-4 py-2.5 text-sm transition-colors ${current === p.href ? 'bg-ink text-ivory' : 'text-stone hover:bg-linen hover:text-ink'}`}
            >
              {p.label}
            </Link>
          ))}
        </nav>
        <article className="prose-policy max-w-3xl">{children}</article>
      </div>
    </div>
  );
}
