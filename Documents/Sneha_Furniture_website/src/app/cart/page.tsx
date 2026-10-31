'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, X, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { productImage } from '@/lib/images';
import { displayTitle, formatPrice } from '@/lib/format';
import EmptyState from '@/components/EmptyState';
import PageHeader from '@/components/PageHeader';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total } = useCart();
  const count = items.reduce((n, i) => n + i.quantity, 0);

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your bag is empty"
        body="Find a piece you love and it will wait for you here."
        href="/shop"
        cta="Explore the collection"
      />
    );
  }

  return (
    <div className="pb-24">
      <PageHeader eyebrow="Shopping bag" title="Your bag">
        <p className="text-sm text-stone">{count} {count === 1 ? 'piece' : 'pieces'}</p>
      </PageHeader>

      <div className="max-w-[1440px] mx-auto px-5 md:px-10 pt-10 grid lg:grid-cols-[1.6fr_1fr] gap-12 lg:gap-16 items-start">
        <ul className="divide-y divide-line border-y border-line">
          {items.map((item) => {
            const atMax = item.stock !== undefined && item.quantity >= item.stock;
            return (
              <li key={item.id} className="py-6 grid grid-cols-[96px_1fr] sm:grid-cols-[128px_1fr] gap-5 sm:gap-8">
                <Link href={`/products/${item.id}`} className="relative aspect-[4/5] overflow-hidden rounded-xl bg-sand">
                  {item.image && <Image src={productImage(item.image, 300)} alt={item.title} fill sizes="128px" className="object-cover" unoptimized />}
                </Link>
                <div className="flex flex-col justify-between gap-4 min-w-0">
                  <div className="flex justify-between gap-4">
                    <div className="min-w-0">
                      <Link href={`/products/${item.id}`} className="font-display text-2xl leading-tight hover:text-brass transition-colors line-clamp-2">
                        {displayTitle(item.title)}
                      </Link>
                      <p className="text-sm text-stone mt-1">{formatPrice(item.price)} each</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${displayTitle(item.title)}`}
                      className="grid place-items-center w-10 h-10 shrink-0 rounded-full text-stone hover:bg-linen hover:text-ink transition-colors"
                    >
                      <X size={17} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center h-11 rounded-full border border-line px-1">
                      <button 
                        aria-label="Decrease quantity"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                        className="grid place-items-center w-9 h-9 rounded-full hover:bg-linen transition-colors disabled:opacity-40"
                      ><Minus size={14} /></button>
                      <span className="w-8 text-center text-sm font-semibold tabular-nums">{item.quantity}</span>
                      <button 
                        aria-label="Increase quantity"
                        disabled={atMax}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="grid place-items-center w-9 h-9 rounded-full hover:bg-linen transition-colors disabled:opacity-40"
                      ><Plus size={14} /></button>
                    </div>
                    <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="card p-8 lg:sticky lg:top-28">
          <h2 className="font-display text-3xl">Order summary</h2>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-stone">Subtotal</dt><dd>{formatPrice(total)}</dd></div>
            <div className="flex justify-between"><dt className="text-stone">Delivery</dt><dd className="text-brass font-semibold">Free</dd></div>
            <div className="flex justify-between pt-4 mt-4 border-t border-line text-base">
              <dt className="font-semibold">Total</dt>
              <dd className="font-display text-3xl">{formatPrice(total)}</dd>
            </div>
          </dl>
          <p className="text-xs text-stone mt-2">Inclusive of all taxes</p>
          <Link href="/checkout" className="btn btn-primary w-full mt-8">
            Checkout <ArrowRight size={16} />
          </Link>
          <Link href="/shop" className="block text-center mt-4 text-sm link-draw mx-auto w-fit">Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
}
