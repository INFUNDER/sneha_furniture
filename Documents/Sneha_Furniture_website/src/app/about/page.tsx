import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BRAND_NAME } from '@/lib/site';
import PageHeader from '@/components/PageHeader';
import ArmchairMark from '@/components/ArmchairMark';

export const metadata: Metadata = {
  title: 'About Us',
  description: `The story and philosophy behind ${BRAND_NAME}, Dehradun.`,
};

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` } as React.CSSProperties);

const VALUES = [
  { title: 'Timeless over trendy', body: 'We choose forms that will still feel right in ten years, not just this season.' },
  { title: 'Honest materials', body: 'Every listing states what a piece is made of, and its warranty, plainly.' },
  { title: 'Comfort you can test', body: 'Our showroom exists so you can sit, lie down and compare before you buy.' },
];

export default function AboutPage() {
  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="Our story"
        title={<>Crafting spaces of <em className="text-brass">enduring</em> quality</>}
      />

      <section className="max-w-[1440px] mx-auto px-5 md:px-10 py-16 md:py-24 grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        <div className="relative" data-reveal="image">
          <div className="arch relative aspect-[4/5] bg-sand">
            <Image src="/hero-pic.jpg" alt="A calm, softly lit living room" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
        </div>
        <div className="space-y-14">
          <div data-reveal>
            <p className="eyebrow">Our origins</p>
            <p className="font-display text-3xl md:text-4xl leading-snug mt-6">
              {BRAND_NAME} began as a small atelier dedicated to the uncompromising pursuit of quality, built on the idea that furniture should be an architectural extension of the self.
            </p>
            <p className="mt-6 text-stone leading-relaxed">
              We set aside the fleeting trends of fast furniture in favour of timeless forms and robust materials, pieces meant to be lived with for years.
            </p>
          </div>
          <div data-reveal style={delay(150)}>
            <p className="eyebrow">The philosophy</p>
            <p className="mt-6 text-stone leading-relaxed">
              Our approach is rooted in removing the unnecessary to reveal the essential. A well-designed object does not shout for attention; it earns respect quietly. Every joint, every seam and every finish reflects our respect for craftsmanship.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-linen">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 py-20 md:py-28">
          <div className="flex items-end gap-6 mb-12">
            <h2 className="font-display text-5xl md:text-6xl leading-none" data-reveal>What we stand for</h2>
          </div>
          <ol className="grid md:grid-cols-3 gap-x-10">
            {VALUES.map((v, i) => (
              <li key={v.title} className="border-t border-line pt-8 pb-4" data-reveal style={delay(i * 120)}>
                <span className="font-display text-xl text-brass">0{i + 1}</span>
                <h3 className="font-display text-3xl mt-3">{v.title}</h3>
                <p className="mt-3 text-stone leading-relaxed">{v.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="max-w-[900px] mx-auto px-5 md:px-10 pt-24 text-center flex flex-col items-center">
        <div data-reveal><ArmchairMark className="draw-once w-16 text-brass" strokeWidth={1.6} /></div>
        <p className="font-display text-4xl md:text-5xl leading-tight mt-8 text-balance" data-reveal>
          The best way to know a piece is to sit in it.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4" data-reveal style={delay(150)}>
          <Link href="/contact" className="btn btn-primary">Visit the showroom</Link>
          <Link href="/shop" className="btn btn-outline">Browse online <ArrowRight size={16} /></Link>
        </div>
      </section>
    </div>
  );
}
