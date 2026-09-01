'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function AddToCartSection({ product, coverImage }: { product: any, coverImage: string }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.discountPrice || product.price,
      quantity: quantity,
      image: coverImage
    });
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="mb-12">
      <div className="flex items-center gap-6">
        <div className="flex items-center justify-between border border-black rounded-full px-6 py-2 w-40 h-16">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="text-black text-2xl hover:opacity-50 transition leading-none pb-1"
          >−</button>
          <span className="font-bold text-black text-xl">{quantity}</span>
          <button 
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="text-black text-2xl hover:opacity-50 transition leading-none pb-1"
          >+</button>
        </div>
        
        <button 
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAdded}
          className={`flex-1 h-16 rounded-full font-bold text-sm tracking-widest uppercase transition ${
            isAdded ? 'bg-black text-white' :
            product.stock > 0 ? 'bg-black text-white hover:bg-black/80' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isAdded ? 'ADDED ✓' : product.stock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
        </button>
      </div>
      
      {product.stock > 0 && product.stock <= 5 && (
        <p className="text-black font-bold uppercase text-xs mt-4 tracking-widest opacity-50">ONLY {product.stock} LEFT IN STOCK</p>
      )}
    </div>
  );
}
