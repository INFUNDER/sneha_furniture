import Link from 'next/link';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-6 py-32">
        <h1 className="text-6xl md:text-8xl font-black font-sans uppercase tracking-tighter text-black leading-none mb-24">
          SERVICES
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
          <div className="space-y-8 border-b md:border-b-0 md:border-r border-black pb-16 md:pb-0 md:pr-16">
            <h2 className="text-4xl font-black uppercase tracking-tight">BESPOKE DESIGN</h2>
            <p className="text-lg font-medium leading-relaxed opacity-70">
              Our core offering centers on custom furniture design. We collaborate intimately with clients to conceptualize, iterate, and manufacture pieces that perfectly complement their unique spaces and aesthetic preferences. Every detail is meticulously planned and executed.
            </p>
          </div>

          <div className="space-y-8">
            <h2 className="text-4xl font-black uppercase tracking-tight">INTERIOR STYLING</h2>
            <p className="text-lg font-medium leading-relaxed opacity-70">
              Beyond individual pieces, we offer comprehensive spatial styling. Our team assesses your environment and curates a selection of furnishings, textiles, and objects that transform a mere room into a cohesive, elevated living experience.
            </p>
          </div>

          <div className="space-y-8 border-b md:border-b-0 md:border-r border-black pb-16 md:pb-0 md:pr-16">
            <h2 className="text-4xl font-black uppercase tracking-tight">RESTORATION</h2>
            <p className="text-lg font-medium leading-relaxed opacity-70">
              True quality deserves longevity. Our master craftsmen provide meticulous restoration services for premium furnishings, breathing new life into cherished pieces while preserving their original character and structural integrity.
            </p>
          </div>

          <div className="space-y-8">
            <h2 className="text-4xl font-black uppercase tracking-tight">CONSULTATION</h2>
            <p className="text-lg font-medium leading-relaxed opacity-70">
              Not sure where to begin? Schedule a one-on-one consultation with our design experts. We offer spatial planning advice, material selection guidance, and a roadmap to achieving your ideal interior atmosphere.
            </p>
          </div>
        </div>

        <div className="mt-32 pt-16 border-t border-black text-center">
          <h3 className="text-3xl font-black uppercase tracking-tight mb-8">READY TO TRANSFORM YOUR SPACE?</h3>
          <Link href="/contact" className="inline-flex items-center justify-center bg-black text-white rounded-full px-12 py-5 text-sm font-bold tracking-widest uppercase hover:bg-black/80 transition">
            GET IN TOUCH
          </Link>
        </div>
      </div>
    </div>
  );
}
