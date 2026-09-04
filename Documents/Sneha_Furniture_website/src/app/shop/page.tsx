import { prisma } from '@/lib/prisma';
import ShopUI from './ShopUI';

export const dynamic = 'force-dynamic';

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const resolvedParams = await searchParams;
  const initialCategory = resolvedParams.category || 'All';

  // Fetch all products for lightning-fast client-side filtering
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const categories = await prisma.product.findMany({
    select: { category: true },
    distinct: ['category'],
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <ShopUI initialProducts={products} categories={categories} initialCategory={initialCategory} />
    </div>
  );
}
