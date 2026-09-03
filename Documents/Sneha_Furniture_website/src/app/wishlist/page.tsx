import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import MinimalProductCard from '@/components/MinimalProductCard';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-24 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <Heart size={64} className="mb-6 opacity-20" />
        <h1 className="text-4xl font-black uppercase tracking-tight mb-4">Your Wishlist</h1>
        <p className="text-gray-500 max-w-md mx-auto mb-8 font-medium">
          Please log in to view or add items to your wishlist.
        </p>
        <Link 
          href="/login?redirect=/wishlist" 
          className="bg-black text-white px-8 py-3 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-black/80 transition"
        >
          Log In
        </Link>
      </div>
    );
  }

  const wishlistItems = await prisma.wishlistItem.findMany({
    where: { userId: session.id },
    include: { product: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-24">
      <div className="flex flex-col gap-2 mb-12 border-b border-black pb-8">
        <h1 className="text-5xl font-black uppercase tracking-tight">Your Wishlist</h1>
        <p className="text-sm font-bold uppercase tracking-widest opacity-50">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'} Saved
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-gray-300">
          <Heart size={48} className="mb-4 opacity-20" />
          <p className="text-xl font-bold uppercase tracking-widest opacity-50 mb-6">Your wishlist is empty</p>
          <Link 
            href="/shop" 
            className="bg-black text-white px-8 py-3 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-black/80 transition"
          >
            Explore Furniture
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
          {wishlistItems.map((item) => (
            <MinimalProductCard key={item.id} product={item.product} />
          ))}
        </div>
      )}
    </div>
  );
}
