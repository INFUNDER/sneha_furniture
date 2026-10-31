import Link from 'next/link';
import Image from 'next/image';
import WishlistButton from './WishlistButton';
import { parseImages, productImage, PLACEHOLDER_IMAGE } from '@/lib/images';
import { discountPercent, displayTitle, formatPrice } from '@/lib/format';

type CardProduct = {
  id: string;
  title: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  images: string;
  category?: string;
};

export default function MinimalProductCard({
  product,
  priority = false,
}: {
  product: CardProduct;
  priority?: boolean;
}) {
  const images = parseImages(product.images);
  const cover = images[0] || PLACEHOLDER_IMAGE;
  const alt = images[1];
  const title = displayTitle(product.title);

  // Only show a struck-through price when there is a real discount on the regular price.
  const currentPrice = product.discountPrice ?? product.price;
  const off = discountPercent(product.price, product.discountPrice);
  const soldOut = product.stock < 1;

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand">
        <Link href={`/products/${product.id}`} aria-label={title} className="absolute inset-0">
          <Image
            src={productImage(cover, 700)}
            alt={title}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 33vw, 50vw"
            className={`object-cover transition-[transform,opacity] duration-[1.2s] ease-out-soft group-hover:scale-[1.04] ${alt ? 'md:group-hover:opacity-0' : ''}`}
            unoptimized
          />
          {alt && (
            <Image
              src={productImage(alt, 700)}
              alt=""
              fill
              sizes="(min-width: 1280px) 22vw, (min-width: 768px) 33vw, 50vw"
              className="hidden md:block object-cover opacity-0 scale-[1.06] transition-[transform,opacity] duration-[1.2s] ease-out-soft group-hover:opacity-100 group-hover:scale-100"
              unoptimized
            />
          )}
        </Link>

        <div className="absolute top-3 left-3 flex gap-2 pointer-events-none">
          {soldOut ? (
            <span className="rounded-full bg-ink text-ivory text-[10px] font-semibold tracking-[0.16em] uppercase px-3 py-1.5">Sold out</span>
          ) : off > 0 ? (
            <span className="rounded-full bg-ivory/90 backdrop-blur text-brass text-[10px] font-semibold tracking-[0.16em] uppercase px-3 py-1.5">{off}% off</span>
          ) : null}
        </div>

        <div className="absolute top-3 right-3">
          <WishlistButton productId={product.id} />
        </div>

        <span className="absolute bottom-3 left-3 right-3 hidden md:flex items-center justify-center h-11 rounded-full bg-ivory/90 backdrop-blur text-[11px] font-semibold tracking-[0.18em] uppercase text-ink translate-y-3 opacity-0 transition-all duration-500 ease-out-soft group-hover:translate-y-0 group-hover:opacity-100 pointer-events-none">
          View piece
        </span>
      </div>

      <Link href={`/products/${product.id}`} className="pt-4 flex flex-col gap-1">
        {product.category && (
          <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-stone">{product.category}</span>
        )}
        <h3 className="font-display text-[22px] leading-snug text-ink line-clamp-2">{title}</h3>
        <div className="flex items-baseline gap-2.5 mt-1">
          <span className="text-[15px] font-semibold text-ink">{formatPrice(currentPrice)}</span>
          {off > 0 && <span className="text-sm text-stone line-through">{formatPrice(product.price)}</span>}
        </div>
      </Link>
    </article>
  );
}
