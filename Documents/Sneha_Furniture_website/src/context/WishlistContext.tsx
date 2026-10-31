'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

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
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/wishlist')
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data) => setWishlistIds(data.items || []))
      .catch((error) => console.error('Failed to fetch wishlist', error))
      .finally(() => setIsLoading(false));
  }, []);

  const toggleWishlist = async (productId: string) => {
    // Optimistic update
    const isCurrentlyWishlisted = wishlistIds.includes(productId);
    const revert = () =>
      setWishlistIds(prev => isCurrentlyWishlisted ? [...prev, productId] : prev.filter(id => id !== productId));

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
        // Revert and send the visitor to log in, then back here
        revert();
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
        return;
      }

      if (!res.ok) revert();
    } catch {
      revert();
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
