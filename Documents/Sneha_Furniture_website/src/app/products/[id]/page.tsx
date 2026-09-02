import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import AddToCartSection from './AddToCartSection';
import Link from 'next/link';
import MinimalProductCard from '@/components/MinimalProductCard';
import ReviewSection from '@/components/ReviewSection';
import { getSession } from '@/lib/auth';

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
  const coverImage = images[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-24 bg-white min-h-screen">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
        {/* Images */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <div className="bg-[#F5F5F5] aspect-[4/5] w-full overflow-hidden">
            <img src={coverImage} alt={product.title} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[coverImage, coverImage, coverImage].map((img, idx) => (
              <div key={idx} className="aspect-square bg-[#F5F5F5] overflow-hidden cursor-pointer opacity-50 hover:opacity-100 transition">
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
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

          <p className="text-xl leading-relaxed text-black mb-12">
            {product.description}
          </p>

          <AddToCartSection product={product} coverImage={coverImage} />

          {/* Specifications */}
          <div className="mt-16 border-t border-black pt-12">
            <h3 className="text-2xl font-black uppercase tracking-widest mb-8">Specifications</h3>
            <div className="flex flex-col gap-6">
              <div className="flex justify-between border-b border-gray-200 pb-4">
                <span className="font-bold uppercase tracking-widest text-sm opacity-50">Primary Material</span>
                <span className="font-bold text-black uppercase">{product.primaryMaterial || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-4">
                <span className="font-bold uppercase tracking-widest text-sm opacity-50">Dimensions</span>
                <span className="font-bold text-black uppercase">{product.dimensions || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-4">
                <span className="font-bold uppercase tracking-widest text-sm opacity-50">Finish</span>
                <span className="font-bold text-black uppercase">{product.finish || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-4">
                <span className="font-bold uppercase tracking-widest text-sm opacity-50">Warranty</span>
                <span className="font-bold text-black uppercase">{product.warranty || '1 YEAR STANDARD'}</span>
              </div>
            </div>
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
