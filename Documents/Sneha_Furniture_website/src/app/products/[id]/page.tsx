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
import { displayTitle, formatPrice } from '@/lib/format';

// Shared between generateMetadata and the page so the product is fetched once per request.
const getProduct = cache((id: string) => prisma.product.findUnique({ where: { id } }));

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: 'Product not found' };

  const description = product.description.replace(/\s+/g, ' ').slice(0, 160);
  const image = parseImages(product.images)[0];
  return {
    title: displayTitle(product.title),
    description,
    alternates: { canonical: `/products/${product.id}` },
    openGraph: {
      title: `${displayTitle(product.title)} | ${BRAND_NAME}`,
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
      title: 'Description',
      defaultOpen: true,
      content: <p className="whitespace-pre-wrap">{product.description}</p>,
    },
  ];

  if (specsList.length > 0) {
    accordionItems.push({
      title: 'Specifications',
      defaultOpen: false,
      content: (
        <dl className="divide-y divide-line">
          {specsList.map((spec, i) => (
            <div key={i} className="grid grid-cols-[120px_1fr] gap-4 py-3">
              <dt className="text-stone">{spec.key}</dt>
              <dd className="text-ink">{spec.val}</dd>
            </div>
          ))}
        </dl>
      ),
    });
  }

  if (product.careInstructions) {
    accordionItems.push({
      title: 'Care & maintenance',
      defaultOpen: false,
      content: <p className="whitespace-pre-wrap">{product.careInstructions}</p>,
    });
  }

  accordionItems.push({
    title: 'Delivery & returns',
    defaultOpen: false,
    content: (
      <p className="whitespace-pre-wrap">
        {product.returnsPolicy ? `${product.returnsPolicy}\n\n` : ''}
        Free delivery on every order, usually within 5–7 business days of dispatch. Inspect your furniture at delivery and tell us within 48 hours about any damage or defect, and we will repair or replace it. See our <Link href="/shipping" className="underline">shipping</Link> and <Link href="/refund" className="underline">returns</Link> policies.
      </p>
    ),
  });

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

  const title = displayTitle(product.title);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <div className="max-w-[1440px] mx-auto px-5 md:px-10 pt-6 pb-20 md:pb-28">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-stone mb-6 md:mb-8">
          <Link href="/" className="link-draw">Home</Link>
          <ChevronRight size={12} aria-hidden="true" />
          <Link href="/shop" className="link-draw">Shop</Link>
          <ChevronRight size={12} aria-hidden="true" />
          <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="link-draw">{product.category}</Link>
          <ChevronRight size={12} aria-hidden="true" />
          <span className="text-ink truncate max-w-[220px]" aria-current="page">{title}</span>
        </nav>

        <div className="grid lg:grid-cols-[1.25fr_1fr] gap-10 lg:gap-16 items-start">
          {/* Images */}
          <ProductImageGallery images={images} title={title} />

          {/* Details */}
          <div className="lg:sticky lg:top-28 flex flex-col">
            <p className="eyebrow">{product.category}</p>
            <h1 className="font-display text-[clamp(2.5rem,4.5vw,3.75rem)] leading-[1.02] mt-4 text-balance">
              {title}
            </h1>

            <div className="flex items-center gap-3 mt-4 text-sm">
              {avgRating !== null ? (
                <a href="#reviews" className="flex items-center gap-2 link-draw">
                  <Star size={15} className="fill-brass text-brass" aria-hidden="true" />
                  <span className="font-semibold">{avgRating.toFixed(1)}</span>
                  <span className="text-stone">· {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</span>
                </a>
              ) : (
                <span className="text-stone">No reviews yet</span>
              )}
            </div>

            <div className="mt-8 flex items-baseline flex-wrap gap-x-4 gap-y-1">
              <span className="font-display text-4xl text-ink">{formatPrice(currentPrice)}</span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-stone line-through">{formatPrice(product.price)}</span>
                  <span className="rounded-full bg-linen text-brass text-xs font-semibold tracking-[0.12em] uppercase px-3 py-1">{discountPercentage}% off</span>
                </>
              )}
            </div>
            <p className="text-xs text-stone mt-2">Inclusive of all taxes · Free delivery</p>

            <p className="mt-8 text-stone leading-relaxed line-clamp-4">{product.description}</p>

            {specsList.length > 0 && (
              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-line py-6">
                {specsList.slice(0, 4).map((spec, i) => (
                  <div key={i}>
                    <dt className="field-label">{spec.key}</dt>
                    <dd className="mt-1.5 text-sm text-ink line-clamp-2">{spec.val}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-8">
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
            </div>

            <ProductAccordion items={accordionItems} />
          </div>
        </div>
      </div>

      <section id="reviews" className="bg-linen scroll-mt-24">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 py-20 md:py-28">
          <ReviewSection productId={product.id} reviews={reviews} reviewState={reviewState} />
        </div>
      </section>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-5 md:px-10 py-20 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <p className="eyebrow" data-reveal>You may also like</p>
              <h2 className="font-display text-5xl leading-none mt-5" data-reveal>More from {product.category}</h2>
            </div>
            <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="link-draw text-sm font-semibold tracking-[0.14em] uppercase">View all</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-12">
            {relatedProducts.map((p, i) => (
              <div key={p.id} data-reveal style={{ '--reveal-delay': `${i * 90}ms` } as React.CSSProperties}>
                <MinimalProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
