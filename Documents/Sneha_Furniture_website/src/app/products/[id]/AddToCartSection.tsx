'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import WishlistButton from '@/components/WishlistButton';
import { Truck, ShieldCheck, RefreshCcw, CreditCard } from 'lucide-react';

export default function AddToCartSection({ product, coverImage }: { product: any, coverImage: string }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.discountPrice || product.price,
      image: coverImage
    }, quantity);
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="mb-8 w-full">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        {/* Quantity Selector */}
        <div className="flex items-center justify-between border border-gray-300 rounded-sm px-4 py-2 w-32 h-12 bg-white">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="text-gray-600 text-xl hover:text-black transition pb-1"
          >−</button>
          <span className="font-bold text-black text-lg">{quantity}</span>
          <button 
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="text-gray-600 text-xl hover:text-black transition pb-1"
          >+</button>
        </div>
        
        {/* Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAdded}
          className={`flex-1 h-12 rounded-sm font-bold text-sm tracking-wider uppercase transition shadow-sm ${
            isAdded ? 'bg-emerald-600 text-white' :
            product.stock > 0 ? 'bg-[#f3724c] text-white hover:bg-[#d95a36]' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isAdded ? 'ADDED TO CART ✓' : product.stock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
        </button>

        {/* Wishlist Button */}
        <div className="flex items-center justify-center h-12 w-12 border border-gray-300 rounded-sm hover:bg-gray-50 transition bg-white shrink-0">
          <WishlistButton productId={product.id} className="!relative !top-auto !right-auto !bg-transparent text-gray-600" />
        </div>
      </div>
      
      {product.stock > 0 && product.stock <= 5 && (
        <p className="text-[#d95a36] font-bold text-xs mt-3 tracking-wider">Hurry! Only {product.stock} left in stock.</p>
      )}

      {/* Trust Highlights under Add to Cart */}
      <div className="mt-8 grid grid-cols-2 gap-4 border-t border-gray-200 pt-6">
        <div className="flex items-center gap-3">
          <Truck className="text-emerald-600" size={20} />
          <span className="text-xs font-semibold text-gray-700">Free Delivery</span>
        </div>
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-blue-600" size={20} />
          <span className="text-xs font-semibold text-gray-700">10 Year Warranty</span>
        </div>
        <div className="flex items-center gap-3">
          <RefreshCcw className="text-orange-600" size={20} />
          <span className="text-xs font-semibold text-gray-700">7 Days Replacement</span>
        </div>
        <div className="flex items-center gap-3">
          <CreditCard className="text-purple-600" size={20} />
          <span className="text-xs font-semibold text-gray-700">EMI Available</span>
        </div>
      </div>
    </div>
  );
}
