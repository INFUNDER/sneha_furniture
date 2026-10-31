'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import WishlistButton from '@/components/WishlistButton';
import { Truck, ShieldCheck, RefreshCcw, Banknote } from 'lucide-react';

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

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.discountPrice ?? product.price,
      image: coverImage,
      stock: product.stock,
    }, quantity);

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="mb-10 w-full">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        {/* Quantity Selector */}
        <div className="flex items-center justify-between border-2 border-gray-900 px-6 py-4 w-full sm:w-40 h-14 bg-white">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="text-gray-400 text-2xl hover:text-black transition pb-1"
          >−</button>
          <span className="font-bold text-black text-xl" aria-live="polite">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity(Math.max(1, Math.min(product.stock, quantity + 1)))}
            className="text-gray-400 text-2xl hover:text-black transition pb-1"
          >+</button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAdded}
          className={`flex-1 h-14 font-black text-base tracking-[0.2em] uppercase transition shadow-md ${
            isAdded ? 'bg-emerald-600 text-white' :
            product.stock > 0 ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isAdded ? 'ADDED TO CART ✓' : product.stock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
        </button>

        {/* Wishlist Button */}
        <div className="flex items-center justify-center h-14 w-14 border-2 border-gray-900 hover:bg-gray-50 transition bg-white shrink-0">
          <WishlistButton productId={product.id} className="!relative !top-auto !right-auto !bg-transparent text-gray-900" />
        </div>
      </div>

      {product.stock > 0 && product.stock <= 3 && (
        <p className="text-red-600 font-bold text-sm mt-4 tracking-wider">Only {product.stock} left in stock.</p>
      )}

      {/* Trust Highlights under Add to Cart (kept in line with the shipping and refund policies) */}
      <div className="mt-8 grid grid-cols-2 gap-4 border-t border-gray-200 pt-6">
        <div className="flex items-center gap-3">
          <Truck className="text-emerald-600" size={20} />
          <span className="text-xs font-semibold text-gray-700">Free Delivery</span>
        </div>
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-blue-600" size={20} />
          <span className="text-xs font-semibold text-gray-700">{product.warranty ? `${product.warranty} Warranty` : 'Manufacturer Warranty'}</span>
        </div>
        <div className="flex items-center gap-3">
          <RefreshCcw className="text-orange-600" size={20} />
          <span className="text-xs font-semibold text-gray-700">Replacement for Damage or Defects</span>
        </div>
        <div className="flex items-center gap-3">
          <Banknote className="text-purple-600" size={20} />
          <span className="text-xs font-semibold text-gray-700">Cash on Delivery</span>
        </div>
      </div>
    </div>
  );
}
