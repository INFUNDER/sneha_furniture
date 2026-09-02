'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { Star, StarHalf } from 'lucide-react';

export default function MinimalProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();
  const router = useRouter();
  
  const images = JSON.parse(product.images || '[]');
  const coverImage = images[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';

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
    <div className="flex flex-col">
      <Link href={`/products/${product.id}`} className="group block mb-4">
        <div className="aspect-[4/5] bg-[#F5F5F5] overflow-hidden">
          <img 
            src={coverImage} 
            alt={product.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
      </Link>
      
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
