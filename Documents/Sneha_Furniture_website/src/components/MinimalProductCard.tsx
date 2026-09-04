'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { Star, StarHalf } from 'lucide-react';
import WishlistButton from './WishlistButton';

export default function MinimalProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();
  const router = useRouter();
  
  const parsedImages = JSON.parse(product.images || '[]');
  const images = parsedImages.length > 0 ? parsedImages : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'];
  const coverImage = images[0];

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.discountPrice || product.price,
      image: coverImage
    }, 1);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  // Helper to render stars
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 fill-black text-black" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarHalf key={i} className="w-4 h-4 fill-black text-black" />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="flex flex-col relative">
      <WishlistButton productId={product.id} />
      <div className="relative group mb-4 bg-[#F5F5F5] overflow-hidden rounded-lg">
        {/* Horizontal scroll snap gallery */}
        <div className="w-full flex overflow-x-auto snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {images.map((img: string, idx: number) => (
            <Link key={idx} href={`/products/${product.id}`} className="min-w-full flex-shrink-0 snap-center block">
              <div className="aspect-square w-full flex items-center justify-center p-2">
                <img 
                  src={img} 
                  alt={`${product.title} - ${idx + 1}`} 
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </Link>
          ))}
        </div>
        
        {/* Pagination Dots (purely visual for swipe cue) */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
            {images.map((_: any, idx: number) => (
              <div key={idx} className="w-1.5 h-1.5 rounded-full bg-black/20" />
            ))}
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold font-sans text-black">{product.title}</h3>
          
          <div className="flex items-center gap-2 mt-1">
            <div className="flex">
              {renderStars(product.ratings || 0)}
            </div>
            <span className="text-xs font-bold text-gray-500">
              {product.ratings > 0 ? product.ratings.toFixed(1) : '0.0'} ({product.reviewsCount || 0})
            </span>
          </div>

          <p className="text-lg font-medium text-black mt-2">₹{(product.discountPrice || product.price).toLocaleString('en-IN')}</p>
        </div>
        
        <div className="flex flex-col gap-2">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-white text-black border border-black h-12 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-gray-50 transition"
          >
            Add to Cart
          </button>
          
          <button 
            onClick={handleBuyNow}
            className="w-full bg-black text-white h-12 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-black/80 transition"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
