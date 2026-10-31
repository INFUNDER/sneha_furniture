'use client';

import { Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';

export default function WishlistButton({ productId, className = "" }: { productId: string, className?: string }) {
  const { wishlistIds, toggleWishlist, isLoading } = useWishlist();
  const isWishlisted = wishlistIds.includes(productId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(productId);
      }}
      disabled={isLoading}
      aria-pressed={isWishlisted}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`grid place-items-center w-10 h-10 rounded-full bg-ivory/90 backdrop-blur text-ink transition-[transform,background-color] duration-300 hover:scale-110 hover:bg-ivory active:scale-95 disabled:opacity-60 ${className}`}
    >
      <Heart
        size={17}
        strokeWidth={1.7}
        className={`transition-colors duration-300 ${isWishlisted ? 'fill-brass text-brass' : ''}`}
      />
    </button>
  );
}
