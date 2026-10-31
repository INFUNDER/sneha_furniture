import type { Metadata } from 'next';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import AddToCartSection from './AddToCartSection';
import Link from 'next/link';
import MinimalProductCard from '@/components/MinimalProductCard';
import ReviewSection, { type ReviewState } from '@/components/ReviewSection';
import { getSession } from '@/lib/auth';
import ProductImageGallery from '@/components/ProductImageGallery';
import ProductAccordion from '@/components/ProductAccordion';
import { Star, ChevronRight } from 'lucide-react';
import { parseImages, productImage } from '@/lib/images';
import { BRAND_NAME, SITE_URL } from '@/lib/site';

// Shared between generateMetadata and the page so the product is fetched once per request.
const getProduct = cache((id: string) => prisma.product.findUnique({ where: { id } }));

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: 'Product not found' };

  const description = product.description.replace(/\s+/g, ' ').slice(0, 160);
  const image = parseImages(product.images)[0];
  return {
    title: product.title,
    description,
    alternates: { canonical: `/products/${product.id}` },
    openGraph: {
      title: `${product.title} | ${BRAND_NAME}`,
      description,
      url: `/products/${product.id}`,
      images: image ? [{ url: productImage(image, 1200) }] : undefined,
    },
  };
}

function parseSpecs(json: string | null): Record<string, unknown> {
  try {
    return json ? JSON.parse(json) : {};
  } catch {
    return {};
  }
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    notFound();
  }

  // Fetch related products (same category, excluding current)
  const relatedProducts = await prisma.product.findMany({
    where: {
      category: product.category,
      id: { not: product.id }
    },
    take: 4,
    orderBy: { createdAt: 'desc' }
  });

  // Fetch reviews
  const reviews = await prisma.review.findMany({
    where: { productId: product.id, status: 'APPROVED' },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' }
  });

  const session = await getSession();
  let reviewState: ReviewState = 'login';
  if (session?.id) {
    const [purchased, reviewed] = await Promise.all([
      prisma.orderItem.findFirst({
        where: { productId: product.id, order: { userId: session.id, orderStatus: { not: 'CANCELLED' } } },
        select: { id: true },
      }),
      prisma.review.findFirst({ where: { productId: product.id, userId: session.id }, select: { id: true } }),
    ]);
    reviewState = reviewed ? 'reviewed' : purchased ? 'can-review' : 'not-purchased';
  }

  const images = parseImages(product.images);

  // Generate specs
  const specsList: { key: string; val: string }[] = [];
  if (product.primaryMaterial) specsList.push({ key: 'Primary Material', val: product.primaryMaterial });
  if (product.dimensions) specsList.push({ key: 'Dimensions', val: product.dimensions });
  if (product.finish) specsList.push({ key: 'Finish', val: product.finish });
  if (product.warranty) specsList.push({ key: 'Warranty', val: product.warranty });
  Object.entries(parseSpecs(product.additionalSpecs)).forEach(([key, val]) => {
    specsList.push({ key, val: String(val) });
  });

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

  // Pricing: only show a discount when the product actually has one.
  const currentPrice = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice != null && product.discountPrice < product.price;
  const discountPercentage = hasDiscount ? Math.round(((product.price - currentPrice) / product.price) * 100) : 0;

  // Ratings come only from real, approved reviews.
  const avgRating = reviews.length > 0
    ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length
    : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: images.map((img) => (img.startsWith('/') ? `${SITE_URL}${img}` : productImage(img, 1200))),
    category: product.category,
    brand: { '@type': 'Brand', name: BRAND_NAME },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/products/${product.id}`,
      priceCurrency: 'INR',
      price: currentPrice,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    ...(avgRating !== null && {
      aggregateRating: { '@type': 'AggregateRating', ratingValue: avgRating.toFixed(1), reviewCount: reviews.length },
    }),
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Link href="/" className="hover:text-black">Home</Link>
          <ChevronRight size={14} />
          <Link href="/shop" className="hover:text-black">Shop</Link>
          <ChevronRight size={14} />
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-black">{product.category}</Link>
          <ChevronRight size={14} />
          <span className="text-black truncate max-w-[200px]">{product.title}</span>
        </nav>
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
              {avgRating !== null ? (
                <>
                  <div className="flex items-center bg-emerald-600 text-white px-2 py-0.5 rounded-sm text-sm font-bold">
                    {avgRating.toFixed(1)} <Star size={14} className="ml-1 fill-current" />
                  </div>
                  <a href="#reviews" className="text-sm font-medium text-blue-600 hover:underline">
                    {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                  </a>
                </>
              ) : (
                <span className="text-sm font-medium text-gray-500">No reviews yet</span>
              )}
            </div>

            {/* Pricing Section */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-3xl font-black text-gray-900">₹{currentPrice.toLocaleString('en-IN')}</span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-gray-400 line-through decoration-gray-400">₹{product.price.toLocaleString('en-IN')}</span>
                    <span className="text-sm font-bold text-emerald-600 tracking-wide">{discountPercentage}% OFF</span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500 font-medium">Inclusive of all taxes</p>
            </div>

            {/* Key Specs Highlights */}
            {specsList.length > 0 && (
              <div className="mb-10">
                <h2 className="text-sm font-black text-black mb-4 uppercase tracking-[0.2em] border-b-2 border-black pb-2">Highlights</h2>
                <div className="flex flex-col">
                  {specsList.slice(0, 6).map((spec, i) => (
                    <div key={i} className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-sm text-gray-500 font-medium w-1/3">{spec.key}</span>
                      <span className="text-sm font-bold text-black w-2/3 text-right">{spec.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <AddToCartSection
              product={{
                id: product.id,
                title: product.title,
                price: product.price,
                discountPrice: product.discountPrice,
                stock: product.stock,
                warranty: product.warranty,
              }}
              coverImage={productImage(images[0] || '', 200)}
            />

            <div className="mt-8">
              <ProductAccordion items={accordionItems} />
            </div>
          </div>
        </div>
      </div>

      <div id="reviews" className="max-w-[1400px] mx-auto px-6">
        <ReviewSection productId={product.id} reviews={reviews} reviewState={reviewState} />
      </div>

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
