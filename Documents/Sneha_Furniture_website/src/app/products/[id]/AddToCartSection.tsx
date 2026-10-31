'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import WishlistButton from '@/components/WishlistButton';
import { Truck, ShieldCheck, RefreshCcw, Banknote, Check, Minus, Plus } from 'lucide-react';

type CartProduct = {
  id: string;
  title: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  warranty: string | null;
};

export default function AddToCartSection({ product, coverImage }: { product: CartProduct, coverImage: string }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const inStock = product.stock > 0;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.discountPrice ?? product.price,
      image: coverImage,
      stock: product.stock,
    }, quantity);

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  const perks = [
    { icon: Truck, label: 'Free delivery' },
    { icon: ShieldCheck, label: product.warranty ? `${product.warranty} warranty` : 'Manufacturer warranty' },
    { icon: RefreshCcw, label: 'Replacement for damage' },
    { icon: Banknote, label: 'Cash on delivery' },
  ];

  return (
    <div className="w-full">
      <div className="flex items-stretch gap-3">
        {/* Quantity */}
        <div className="flex items-center justify-between h-14 w-32 shrink-0 rounded-full border border-line px-2">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="grid place-items-center w-10 h-10 rounded-full hover:bg-linen transition-colors disabled:opacity-40"
          ><Minus size={15} /></button>
          <span className="font-semibold tabular-nums" aria-live="polite">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity(Math.max(1, Math.min(product.stock, quantity + 1)))}
            disabled={quantity >= product.stock}
            className="grid place-items-center w-10 h-10 rounded-full hover:bg-linen transition-colors disabled:opacity-40"
          ><Plus size={15} /></button>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!inStock}
          className={`btn flex-1 !min-h-14 ${isAdded ? 'bg-brass text-ivory' : 'btn-primary'}`}
        >
          {isAdded ? <><Check size={16} /> Added to bag</> : inStock ? 'Add to bag' : 'Sold out'}
        </button>

        <WishlistButton productId={product.id} className="!w-14 !h-14 shrink-0 border border-line !bg-transparent hover:!bg-linen" />
      </div>

      <p className="text-sm mt-4 min-h-5" aria-live="polite">
        {isAdded ? (
          <Link href="/cart" className="link-draw text-brass font-semibold">View your bag →</Link>
        ) : inStock && product.stock <= 3 ? (
          <span className="text-brass">Only {product.stock} left in stock</span>
        ) : inStock ? (
          <span className="text-stone">In stock, ready to deliver</span>
        ) : (
          <span className="text-stone">Currently unavailable. Call us to reserve the next piece.</span>
        )}
      </p>

      <ul className="mt-6 grid grid-cols-2 gap-3">
        {perks.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-3 rounded-xl bg-linen/70 px-4 py-3 text-xs text-ink">
            <Icon size={17} strokeWidth={1.5} className="text-brass shrink-0" aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
