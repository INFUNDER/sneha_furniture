import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import TrustBadges from '@/components/TrustBadges';
import MinimalProductCard from '@/components/MinimalProductCard';

export default async function Home() {
  // Fetch some products for the Best Sellers section
  const featuredProducts = await prisma.product.findMany({
    take: 8,
    orderBy: { createdAt: 'desc' }
  });
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[75vh] w-full flex items-center justify-center">
        {/* Placeholder for arched hallway interior */}
        <div 
          className="absolute inset-0 bg-[url('/hero-pic.jpg')] bg-cover bg-center bg-no-repeat" 
        />
        <div className="absolute inset-0 bg-black/40 z-10" />

        <div className="relative z-20 text-center px-4 w-full">
          <h1 className="text-5xl md:text-7xl lg:text-[90px] font-black font-sans tracking-tighter text-white uppercase leading-none w-full max-w-screen-2xl mx-auto drop-shadow-xl">
            Elevated Home Comforts
          </h1>
          <p className="text-white/90 mt-6 text-lg md:text-xl max-w-2xl mx-auto font-medium drop-shadow-md">
            Premium quality, handcrafted furniture designed to bring warmth and elegance to your home.
          </p>
          <Link href="/shop" className="mt-8 inline-block bg-[#f3724c] hover:bg-[#d95a36] text-white px-10 py-4 rounded-sm font-bold uppercase tracking-widest transition shadow-lg">
            Shop Collection
          </Link>
        </div>
      </section>

      {/* Trust Badges - Adds density and trust signals */}
      <TrustBadges />

      {/* Featured Products / Best Sellers */}
      <section className="py-16 bg-white px-6 max-w-[1400px] mx-auto w-full">
        <div className="flex justify-between items-end mb-10 border-b border-gray-200 pb-4">
          <h2 className="text-3xl md:text-4xl font-black font-sans uppercase tracking-tight text-black leading-none">
            Best Sellers
          </h2>
          <Link href="/shop" className="text-sm font-bold uppercase tracking-widest text-[#f3724c] hover:text-[#d95a36] transition">
            View All
          </Link>
        </div>
        
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <MinimalProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 font-medium">No products found. Please add products from the admin dashboard.</p>
        )}
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-[#FAFAFA] px-6 w-full border-y border-gray-200">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-black font-sans uppercase tracking-tight text-black leading-none mb-10 text-center">
            Shop by Category
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
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-16 bg-white px-6 max-w-[1400px] mx-auto w-full mb-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center bg-gray-50 border border-gray-200 rounded-sm overflow-hidden shadow-sm">
          <div className="w-full lg:w-1/2 aspect-[4/5] bg-gray-100 relative">
            <Image 
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Quality Commitment" 
              fill
              className="object-cover" 
              unoptimized
            />
          </div>
          <div className="w-full lg:w-1/2 flex flex-col items-start p-8 lg:p-12">
            <h2 className="text-4xl md:text-5xl font-black font-sans uppercase tracking-tight text-black leading-[1.1] mb-6">
              COMMITMENT<br/>
              TO LASTING<br/>
              QUALITY
            </h2>
            <p className="text-base text-gray-700 font-medium leading-relaxed max-w-xl mb-8">
              For over a decade, we have sourced responsibly manufactured furnishings and refined our methodologies to ensure durability and aesthetic coherence for Indian homes.
            </p>
            <div className="flex gap-4 items-center mb-8">
              <div className="bg-white border border-gray-200 p-4 rounded-sm text-center shadow-sm">
                <p className="text-2xl font-black text-black">10K+</p>
                <p className="text-xs text-gray-500 font-bold uppercase">Happy Homes</p>
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-sm text-center shadow-sm">
                <p className="text-2xl font-black text-black">15+</p>
                <p className="text-xs text-gray-500 font-bold uppercase">Years Trust</p>
              </div>
            </div>
            <Link 
              href="/about" 
              className="inline-flex items-center justify-center bg-black text-white rounded-sm px-8 py-3 text-sm font-bold tracking-widest uppercase hover:bg-black/80 transition"
            >
              LEARN MORE
            </Link>
          </div>
        </div>
      </section>


    </div>
  );
}
