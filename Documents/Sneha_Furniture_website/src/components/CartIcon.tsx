'use client';

import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function CartIcon() {
  const { items } = useCart();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <Link href="/cart" className="flex items-center gap-1 hover:opacity-70 transition">
      <span>CART</span>
      <span>({itemCount})</span>
    </Link>
  );
}
