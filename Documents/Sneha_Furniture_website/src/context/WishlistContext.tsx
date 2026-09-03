'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type WishlistContextType = {
  wishlistIds: string[];
  toggleWishlist: (productId: string) => Promise<void>;
  isLoading: boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await fetch('/api/wishlist');
      if (res.ok) {
        const data = await res.json();
        setWishlistIds(data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWishlist = async (productId: string) => {
    // Optimistic update
    const isCurrentlyWishlisted = wishlistIds.includes(productId);
    
    if (isCurrentlyWishlisted) {
      setWishlistIds(prev => prev.filter(id => id !== productId));
    } else {
      setWishlistIds(prev => [...prev, productId]);
    }

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (res.status === 401) {
        // Revert if unauthorized and redirect to login
        setWishlistIds(prev => isCurrentlyWishlisted ? [...prev, productId] : prev.filter(id => id !== productId));
        router.push('/login');
        return;
      }

      if (!res.ok) {
        // Revert on error
        setWishlistIds(prev => isCurrentlyWishlisted ? [...prev, productId] : prev.filter(id => id !== productId));
      }
    } catch (error) {
      // Revert on error
      setWishlistIds(prev => isCurrentlyWishlisted ? [...prev, productId] : prev.filter(id => id !== productId));
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggleWishlist, isLoading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
