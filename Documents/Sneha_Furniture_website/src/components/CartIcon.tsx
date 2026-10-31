'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export default function CartIcon() {
  const { items } = useCart();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <Link
      href="/cart"
      aria-label={`Shopping bag, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
      className="relative grid place-items-center w-11 h-11 rounded-full hover:bg-linen transition-colors"
    >
      <ShoppingBag size={19} strokeWidth={1.6} />
      {itemCount > 0 && (
        <span className="absolute top-1 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brass text-ivory text-[10px] font-semibold grid place-items-center">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
