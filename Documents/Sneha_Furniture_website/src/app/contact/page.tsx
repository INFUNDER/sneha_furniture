import type { Metadata } from 'next';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, ArrowUpRight, MessageCircle } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import GrievanceOfficer from '@/components/GrievanceOfficer';
import PageHeader from '@/components/PageHeader';
import { ADDRESS, BRAND_NAME, CONTACT_EMAIL, PHONES, WHATSAPP_NUMBER } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact Us & Showroom',
  description: `Visit the ${BRAND_NAME} showroom on Saharanpur Road, Dehradun, or call, WhatsApp or email us.`,
};

export default function ContactPage() {
  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="Visit us"
        title={<>Come and <em className="text-brass">sit a while</em></>}
        intro="See our collections in person at the showroom in Dehradun, or send us a message and we will get back to you within a day."
      />

      <div className="max-w-[1440px] mx-auto px-5 md:px-10 pt-12 md:pt-16 grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-start">
        {/* Details */}
        <div className="space-y-5">
          <div className="card overflow-hidden" data-reveal>
            <div className="relative aspect-[16/10] bg-sand">
              <Image src="/table.jpg" alt="Dining furniture on display" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
            <div className="p-6 flex flex-wrap items-start justify-between gap-4">
              <div className="flex gap-4">
                <MapPin size={20} strokeWidth={1.5} className="text-brass shrink-0 mt-1" aria-hidden="true" />
                <address className="not-italic leading-relaxed">
                  <span className="font-display text-2xl block">Showroom</span>
                  {ADDRESS.street}<br />{ADDRESS.city}, {ADDRESS.state} {ADDRESS.pincode}
                </address>
              </div>
              <a href="https://maps.app.goo.gl/FFm6prxW6b9yJtcKA" target="_blank" rel="noopener noreferrer" className="btn btn-outline !min-h-11 !px-5">
                Directions <ArrowUpRight size={15} />
              </a>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="card p-6" data-reveal>
              <Clock size={20} strokeWidth={1.5} className="text-brass" aria-hidden="true" />
              <h2 className="font-display text-2xl mt-4">Opening hours</h2>
              <p className="mt-2 text-sm text-stone leading-relaxed">Monday – Saturday<br />10:30 AM – 8:00 PM<br />Closed on Sundays</p>
            </div>
            <div className="card p-6" data-reveal style={{ '--reveal-delay': '100ms' } as React.CSSProperties}>
              <Phone size={20} strokeWidth={1.5} className="text-brass" aria-hidden="true" />
              <h2 className="font-display text-2xl mt-4">Call us</h2>
              <div className="mt-2 text-sm space-y-1">
                {PHONES.map((p) => (
                  <a key={p.tel} href={`tel:${p.tel}`} className="block link-draw w-fit">{p.display}</a>
                ))}
              </div>
            </div>
            <div className="card p-6" data-reveal>
              <Mail size={20} strokeWidth={1.5} className="text-brass" aria-hidden="true" />
              <h2 className="font-display text-2xl mt-4">Email</h2>
              <a href={`mailto:${CONTACT_EMAIL}`} className="mt-2 block text-sm link-draw w-fit break-all">{CONTACT_EMAIL}</a>
            </div>
            <div className="card p-6" data-reveal style={{ '--reveal-delay': '100ms' } as React.CSSProperties}>
              <MessageCircle size={20} strokeWidth={1.5} className="text-brass" aria-hidden="true" />
              <h2 className="font-display text-2xl mt-4">WhatsApp</h2>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="mt-2 block text-sm link-draw w-fit">Chat with us</a>
            </div>
          </div>

          <details className="card p-6 group" data-reveal>
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <span className="font-display text-2xl">Grievance Officer</span>
              <span className="text-stone text-sm group-open:hidden">Show</span>
              <span className="text-stone text-sm hidden group-open:inline">Hide</span>
            </summary>
            <p className="mt-4 text-sm text-stone">In accordance with the Consumer Protection (E-Commerce) Rules, 2020:</p>
            <GrievanceOfficer className="mt-3 text-sm text-stone space-y-1" />
          </details>
        </div>

        {/* Form */}
        <div className="card p-8 md:p-12 lg:sticky lg:top-28" data-reveal>
          <h2 className="font-display text-4xl md:text-5xl leading-none">Send us a message</h2>
          <p className="mt-4 text-stone">Questions about a piece, custom sizes or delivery? We are happy to help.</p>
          <div className="mt-10">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
