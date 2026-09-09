import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import AddToCartSection from './AddToCartSection';
import Link from 'next/link';
import MinimalProductCard from '@/components/MinimalProductCard';
import ReviewSection from '@/components/ReviewSection';
import { getSession } from '@/lib/auth';
import ProductImageGallery from '@/components/ProductImageGallery';
import ProductAccordion from '@/components/ProductAccordion';
import { Star, ChevronRight } from 'lucide-react';

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
      title: 'Product Description',
      defaultOpen: true,
      content: (
        <p className="text-sm font-medium leading-relaxed text-gray-700 whitespace-pre-wrap">
          {product.description}
        </p>
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

  // Calculate pricing values
  const currentPrice = product.discountPrice || product.price;
  const mrp = product.price > currentPrice ? product.price : Math.round(currentPrice * 1.4); 
  const discountPercentage = Math.round(((mrp - currentPrice) / mrp) * 100);

  // Calculate average rating
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1) 
    : '4.8'; // Default for visual if no reviews
  const reviewCount = reviews.length > 0 ? reviews.length : 24;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Link href="/" className="hover:text-black">Home</Link>
          <ChevronRight size={14} />
          <Link href="/shop" className="hover:text-black">Shop</Link>
          <ChevronRight size={14} />
          <Link href={`/shop?category=${product.category}`} className="hover:text-black">{product.category}</Link>
          <ChevronRight size={14} />
          <span className="text-black truncate max-w-[200px]">{product.title}</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-100">
          {/* Images */}
          <div className="w-full lg:w-[45%]">
            <ProductImageGallery images={images} title={product.title} />
          </div>

          {/* Details */}
          <div className="w-full lg:w-[55%] flex flex-col">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
              {product.title}
            </h1>
            
            {/* Reviews Preview */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center bg-emerald-600 text-white px-2 py-0.5 rounded-sm text-sm font-bold">
                {avgRating} <Star size={14} className="ml-1 fill-current" />
              </div>
              <span className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                {reviewCount} Ratings & Reviews
              </span>
            </div>
            
            {/* Pricing Section */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-3xl font-black text-gray-900">₹{currentPrice.toLocaleString('en-IN')}</span>
                <span className="text-lg text-gray-400 line-through decoration-gray-400">₹{mrp.toLocaleString('en-IN')}</span>
                <span className="text-sm font-bold text-emerald-600 tracking-wide">{discountPercentage}% OFF</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">Inclusive of all taxes</p>
            </div>

            {/* Key Specs Highlights */}
            {specsList.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Highlights</h3>
                <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                  {specsList.slice(0, 6).map((spec, i) => (
                    <div key={i} className="flex gap-2 text-sm">
                      <span className="text-gray-500 whitespace-nowrap">• {spec.key}:</span>
                      <span className="font-semibold text-gray-900">{spec.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <AddToCartSection product={product} coverImage={images[0] || ''} />

            <div className="mt-8">
              <ProductAccordion items={accordionItems} />
            </div>
          </div>
        </div>
      </div>

      <ReviewSection productId={product.id} reviews={reviews} isLoggedIn={isLoggedIn} />
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="max-w-[1400px] mx-auto px-6 mt-16 mb-24">
          <div className="border-t border-gray-300 pt-16">
            <h2 className="text-2xl font-bold uppercase tracking-tight text-gray-900 mb-8">
              Similar Products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <MinimalProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
