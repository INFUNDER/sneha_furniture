'use client';

import Link from 'next/link';
import WishlistButton from './WishlistButton';

export default function MinimalProductCard({ product }: { product: any }) {
  const parsedImages = JSON.parse(product.images || '[]');
  const images = parsedImages.length > 0 ? parsedImages : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'];

  // Pricing Logic
  const currentPrice = product.discountPrice || product.price;
  const mrp = product.price > currentPrice ? product.price : Math.round(currentPrice * 1.4); // 40% markup for realistic fake MRP
  const discountPercentage = Math.round(((mrp - currentPrice) / mrp) * 100);

  // Randomize tag for visual variety like the screenshot
  const tag = product.stock > 10 ? 'New Arrivals' : 'Bestseller';

  return (
    <div className="flex flex-col relative group cursor-pointer">
      {/* Image Gallery Container */}
      <div className="relative mb-3 overflow-hidden rounded-sm bg-gray-50">
        
        {/* Floating Tags */}
        <div className="absolute top-3 left-3 z-20 bg-[#f3724c] text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-sm uppercase tracking-wider">
          {tag}
        </div>
        
        <div className="absolute top-3 right-3 z-20">
          <WishlistButton productId={product.id} />
        </div>

        {/* Horizontal scroll snap gallery */}
        <div 
          className="w-full flex overflow-x-auto hide-scrollbar" 
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {images.map((img: string, idx: number) => (
            <Link 
              key={idx} 
              href={`/products/${product.id}`} 
              className="min-w-full flex-shrink-0 block relative pt-[100%]"
              style={{ scrollSnapAlign: 'center' }}
            >
              <img 
                src={img} 
                alt={`${product.title} - ${idx + 1}`} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </Link>
          ))}
        </div>
        
        {/* Pagination Dots (purely visual for swipe cue) */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 pointer-events-none z-10">
            {images.map((_: any, idx: number) => (
              <div key={idx} className="w-1.5 h-1.5 rounded-full bg-white/80 shadow-sm" />
            ))}
          </div>
        )}
      </div>
      
      {/* Text Section */}
      <Link href={`/products/${product.id}`} className="flex flex-col gap-1">
        <p className="text-xs text-gray-500 font-medium">Sneha Furniture</p>
        <h3 className="text-sm font-semibold text-[#212121] leading-tight line-clamp-2">{product.title}</h3>
        
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-base font-black text-black">₹{currentPrice.toLocaleString('en-IN')}</span>
          <span className="text-xs text-gray-400 line-through">₹{mrp.toLocaleString('en-IN')}</span>
          <span className="text-xs font-bold text-emerald-500">{discountPercentage}% OFF</span>
        </div>
      </Link>
    </div>
  );
}
