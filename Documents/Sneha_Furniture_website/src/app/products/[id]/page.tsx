import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import AddToCartSection from './AddToCartSection';
import Link from 'next/link';
import MinimalProductCard from '@/components/MinimalProductCard';
import ReviewSection from '@/components/ReviewSection';
import { getSession } from '@/lib/auth';
import ProductImageGallery from '@/components/ProductImageGallery';
import ProductAccordion from '@/components/ProductAccordion';

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!product) {
    notFound();
  }

  // Fetch related products (same category, excluding current)
  const relatedProducts = await prisma.product.findMany({
    where: {
      category: product.category,
      id: { not: product.id }
    },
    take: 3,
    orderBy: { createdAt: 'desc' }
  });

  // Fetch reviews
  const reviews = await prisma.review.findMany({
    where: { productId: product.id, status: 'APPROVED' },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' }
  });

  const session = await getSession();
  const isLoggedIn = !!session;

  const images = JSON.parse(product.images || '[]');

  // Generate specs
  let specsList: { key: string; val: string }[] = [];
  if (product.primaryMaterial) specsList.push({ key: 'Primary Material', val: product.primaryMaterial });
  if (product.dimensions) specsList.push({ key: 'Dimensions', val: product.dimensions });
  if (product.finish) specsList.push({ key: 'Finish', val: product.finish });
  if (product.warranty) specsList.push({ key: 'Warranty', val: product.warranty });
  if (product.additionalSpecs) {
    Object.entries(JSON.parse(product.additionalSpecs)).forEach(([key, val]) => {
      specsList.push({ key, val: String(val) });
    });
  }

  const accordionItems = [
    {
      title: 'Product Details',
      defaultOpen: true,
      content: (
        <p className="text-sm font-medium leading-relaxed opacity-70 whitespace-pre-wrap">
          {product.description}
        </p>
      )
    },
    {
      title: 'Specifications',
      defaultOpen: true,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {specsList.map((spec, i) => (
            <div key={i} className="flex justify-between border-b border-gray-200 pb-2">
              <span className="font-bold uppercase tracking-widest text-xs opacity-50 pr-4">{spec.key}</span>
              <span className="font-bold text-black uppercase text-xs text-right">{spec.val}</span>
            </div>
          ))}
        </div>
      )
    }
  ];

  if (product.careInstructions) {
    accordionItems.push({
      title: 'Care & Maintenance',
      defaultOpen: false,
      content: (
        <p className="text-sm font-medium leading-relaxed opacity-70 whitespace-pre-wrap">
          {product.careInstructions}
        </p>
      )
    });
  }

  if (product.returnsPolicy) {
    accordionItems.push({
      title: 'Returns & Policy',
      defaultOpen: false,
      content: (
        <p className="text-sm font-medium leading-relaxed opacity-70 whitespace-pre-wrap">
          {product.returnsPolicy}
        </p>
      )
    });
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-24 bg-white min-h-screen">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
        {/* Images */}
        <div className="w-full lg:w-1/2">
          <ProductImageGallery images={images} title={product.title} />
        </div>

        {/* Details */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="mb-6 flex items-center gap-4 text-sm font-bold uppercase tracking-widest opacity-50">
            <span>{product.category}</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-black uppercase tracking-tight text-black mb-6 leading-none">
            {product.title}
          </h1>
          
          <div className="text-3xl font-medium text-black mb-12">
            {product.discountPrice ? (
              <div className="flex items-center gap-4">
                <span>₹{product.discountPrice.toLocaleString('en-IN')}</span>
                <span className="text-2xl opacity-30 line-through">₹{product.price.toLocaleString('en-IN')}</span>
              </div>
            ) : (
              <span>₹{product.price.toLocaleString('en-IN')}</span>
            )}
          </div>

          <AddToCartSection product={product} coverImage={images[0] || ''} />

          <div className="mt-12">
            <ProductAccordion items={accordionItems} />
          </div>
        </div>
      </div>

      <ReviewSection productId={product.id} reviews={reviews} isLoggedIn={isLoggedIn} />
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-40 border-t border-black pt-24">
          <h2 className="text-4xl font-black uppercase tracking-tight text-black mb-16">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map((p) => (
              <MinimalProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
