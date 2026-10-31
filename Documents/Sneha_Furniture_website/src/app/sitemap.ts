import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { SITE_URL } from '@/lib/site';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      updatedAt: true,
    },
  });

  const productUrls = products.map((product) => ({
    url: `${SITE_URL}/products/${product.id}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const page = (path: string, priority: number, changeFrequency: 'daily' | 'monthly' | 'yearly') => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  });

  return [
    page('', 1, 'daily'),
    page('/shop', 0.9, 'daily'),
    page('/about', 0.5, 'monthly'),
    page('/contact', 0.5, 'monthly'),
    page('/services', 0.5, 'monthly'),
    page('/privacy', 0.2, 'yearly'),
    page('/terms', 0.2, 'yearly'),
    page('/refund', 0.2, 'yearly'),
    page('/shipping', 0.2, 'yearly'),
    ...productUrls,
  ];
}
