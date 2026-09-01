import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-6 py-32">
        <h1 className="text-6xl md:text-8xl font-black font-sans uppercase tracking-tighter text-black leading-none mb-24 max-w-4xl">
          CRAFTING SPACES OF ENDURING QUALITY
        </h1>

        <div className="flex flex-col lg:flex-row gap-24 items-start mb-32">
          <div className="w-full lg:w-1/2">
            <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Our Heritage" 
                className="absolute inset-0 w-full h-full object-cover" 
              />
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 space-y-12">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest opacity-50 mb-4 border-b border-black pb-2 inline-block">OUR ORIGINS</h2>
              <p className="text-2xl font-medium leading-relaxed">
                Founded on the principle that furniture should be an architectural extension of the self, Sneha Furniture began as a small atelier dedicated to the uncompromising pursuit of quality. We rejected the ephemeral trends of fast furniture in favor of timeless forms and robust materials.
              </p>
            </div>
            
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest opacity-50 mb-4 border-b border-black pb-2 inline-block">THE PHILOSOPHY</h2>
              <p className="text-lg font-medium leading-relaxed opacity-70">
                Our approach is rooted in reductionism—removing the unnecessary to reveal the essential. We believe that a well-designed object does not scream for attention; it commands respect through its silent perfection. Every joint, every seam, and every finish is a testament to our reverence for craftsmanship.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
