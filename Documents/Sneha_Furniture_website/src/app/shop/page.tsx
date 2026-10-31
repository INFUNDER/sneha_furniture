import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import ShopUI from './ShopUI';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ category?: string }> }): Promise<Metadata> {
  const { category } = await searchParams;
  return {
    title: category ? `${category} Furniture` : 'Shop All Furniture',
    description: category
      ? `Browse our ${category.toLowerCase()} furniture collection with free delivery in Dehradun.`
      : 'Browse sofas, beds, dining sets and more with free delivery in Dehradun.',
    alternates: { canonical: category ? `/shop?category=${encodeURIComponent(category)}` : '/shop' },
  };
}

export const revalidate = 60;

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const resolvedParams = await searchParams;
  const initialCategory = resolvedParams.category || 'All';

  // Fetch all products for lightning-fast client-side filtering
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    // Only the fields the grid needs; descriptions would bloat the page payload.
    select: { id: true, title: true, price: true, discountPrice: true, category: true, primaryMaterial: true, stock: true, images: true, createdAt: true },
  });

  const categories = await prisma.product.findMany({
    select: { category: true },
    distinct: ['category'],
  });

  return (
    <ShopUI key={initialCategory} initialProducts={products} categories={categories.map((c) => c.category)} initialCategory={initialCategory} />
  );
}
