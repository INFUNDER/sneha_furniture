import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BRAND_NAME, WHATSAPP_NUMBER } from '@/lib/site';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
  title: 'Services',
  description: `Custom furniture design, interior styling, restoration and consultation from ${BRAND_NAME}.`,
};

const SERVICES = [
  {
    title: 'Bespoke design',
    body: 'Our core offering is custom furniture. We work closely with you to plan, refine and make pieces that suit your space, your measurements and your taste, with every detail agreed before we begin.',
  },
  {
    title: 'Interior styling',
    body: 'Beyond individual pieces, we style whole rooms. We look at your space and bring together furniture, textiles and accents so the room feels complete and calm.',
  },
  {
    title: 'Restoration',
    body: 'Good furniture deserves a long life. Our craftsmen restore well-loved pieces, renewing upholstery and finishes while keeping their original character.',
  },
  {
    title: 'Consultation',
    body: 'Not sure where to begin? Book a one-to-one session for advice on layout, materials and a plan for the room you have in mind.',
  },
];

export default function ServicesPage() {
  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="Services"
        title={<>Beyond the <em className="text-brass">catalogue</em></>}
        intro="From one made-to-measure sofa to a fully styled home, we help you get the room right."
      />

      <section className="max-w-[1440px] mx-auto px-5 md:px-10 py-16 md:py-24 grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-24 items-start">
        <div className="lg:sticky lg:top-28" data-reveal="image">
          <div className="arch relative aspect-[4/5] bg-sand">
            <Image src="/sofa-pic.jpg" alt="An upholstered armchair in a styled corner" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </div>
        </div>

        <ol>
          {SERVICES.map((s, i) => (
            <li key={s.title} className="border-t border-line py-10 last:border-b grid grid-cols-[3rem_1fr] gap-4" data-reveal>
              <span className="font-display text-xl text-brass pt-2">0{i + 1}</span>
              <div>
                <h2 className="font-display text-4xl md:text-5xl leading-none">{s.title}</h2>
                <p className="mt-5 text-stone leading-relaxed max-w-xl">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="max-w-[1440px] mx-auto px-5 md:px-10">
        <div className="rounded-[2rem] bg-ink text-ivory px-8 py-16 md:px-16 md:py-20 grid md:grid-cols-[1.4fr_1fr] gap-10 items-end" data-reveal>
          <h2 className="font-display text-5xl md:text-6xl leading-[0.95]">
            Ready to transform <em className="text-brass-light">your space?</em>
          </h2>
          <div className="flex flex-wrap gap-4 md:justify-end">
            <Link href="/contact" className="btn btn-light">Get in touch <ArrowRight size={16} /></Link>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="btn border border-ivory/40 text-ivory hover:bg-ivory hover:text-ink">
              WhatsApp us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
