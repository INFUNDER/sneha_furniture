import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import MinimalProductCard from '@/components/MinimalProductCard';
import EmptyState from '@/components/EmptyState';
import PageHeader from '@/components/PageHeader';

export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
  const session = await getSession();

  if (!session) {
    return (
      <EmptyState
        title="Your wishlist"
        body="Sign in to save the pieces you love and come back to them any time."
        href="/login?callbackUrl=/wishlist"
        cta="Sign in"
      />
    );
  }

  const wishlistItems = await prisma.wishlistItem.findMany({
    where: { userId: session.id },
    include: { product: true },
    orderBy: { createdAt: 'desc' }
  });

  if (wishlistItems.length === 0) {
    return (
      <EmptyState
        title="Nothing saved yet"
        body="Tap the heart on any piece to keep it here for later."
        href="/shop"
        cta="Explore the collection"
      />
    );
  }

  return (
    <div className="pb-24">
      <PageHeader eyebrow="Saved for later" title="Your wishlist">
        <p className="text-sm text-stone">{wishlistItems.length} {wishlistItems.length === 1 ? 'piece' : 'pieces'}</p>
      </PageHeader>
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 pt-12 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-12">
        {wishlistItems.map((item, i) => (
          <div key={item.id} data-reveal style={{ '--reveal-delay': `${(i % 4) * 80}ms` } as React.CSSProperties}>
            <MinimalProductCard product={item.product} />
          </div>
        ))}
      </div>
    </div>
  );
}
