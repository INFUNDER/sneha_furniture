'use client';

import { Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';

export default function WishlistButton({ productId, className = "" }: { productId: string, className?: string }) {
  const { wishlistIds, toggleWishlist, isLoading } = useWishlist();

  if (isLoading) return null;

  const isWishlisted = wishlistIds.includes(productId);

  return (
    <button 
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(productId);
      }}
      className={`absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition flex items-center justify-center text-black ${className}`}
      title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
    >
      <Heart 
        size={20} 
        className={isWishlisted ? "fill-black text-black" : "text-black"} 
      />
    </button>
  );
}
