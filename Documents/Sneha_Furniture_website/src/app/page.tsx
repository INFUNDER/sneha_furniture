import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full flex items-center justify-center">
        {/* Placeholder for arched hallway interior */}
        <div 
          className="absolute inset-0 bg-[url('/hero-pic.jpg')] bg-cover bg-center bg-no-repeat" 
        />
        <div className="absolute inset-0 bg-black/30 z-10" />

        <div className="relative z-20 text-center px-4 w-full">
          <h1 className="text-6xl md:text-8xl lg:text-[100px] font-black font-sans tracking-tighter text-white uppercase leading-none w-full max-w-screen-2xl mx-auto">
            Elevated Home Comforts
          </h1>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-white px-6 max-w-[1400px] mx-auto w-full">
        <h2 className="text-5xl md:text-6xl font-black font-sans uppercase tracking-tight text-black leading-none mb-12 text-center">
          Collections
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link href="/shop?category=Sofa" className="group relative aspect-square overflow-hidden bg-gray-100 flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('/sofa-pic.jpg')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
            <h3 className="relative z-10 text-4xl font-black uppercase text-white tracking-widest">Sofa</h3>
          </Link>
          
          <Link href="/shop?category=Table" className="group relative aspect-square overflow-hidden bg-gray-100 flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('/table.jpg')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
            <h3 className="relative z-10 text-4xl font-black uppercase text-white tracking-widest">Table</h3>
          </Link>
          
          <Link href="/shop?category=Chair" className="group relative aspect-square overflow-hidden bg-gray-100 flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('/chair.jpg')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
            <h3 className="relative z-10 text-4xl font-black uppercase text-white tracking-widest">Chair</h3>
          </Link>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-32 bg-white px-6 max-w-[1400px] mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          <div className="w-full lg:w-1/2 aspect-[4/5] bg-gray-100 relative">
            <img 
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Quality Commitment" 
              className="absolute inset-0 w-full h-full object-cover" 
            />
          </div>
          <div className="w-full lg:w-1/2 flex flex-col items-start">
            <h2 className="text-5xl md:text-7xl font-black font-sans uppercase tracking-tight text-black leading-[0.9] mb-8">
              COMMITMENT<br/>
              TO LASTING<br/>
              QUALITY
            </h2>
            <p className="text-lg text-black font-medium leading-relaxed max-w-xl mb-12">
              For over a decade, the team has sourced responsibly manufactured furnishings and refined installation methodologies to ensure durability and aesthetic coherence.
            </p>
            <Link 
              href="/about" 
              className="inline-flex items-center justify-center bg-black text-white rounded-full px-12 py-5 text-sm font-bold tracking-widest uppercase hover:bg-black/80 transition"
            >
              LEARN MORE
            </Link>
          </div>
        </div>
      </section>


    </div>
  );
}
