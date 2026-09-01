'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function MinimalProductCard({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
  const images = JSON.parse(product.images || '[]');
  const coverImage = images[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.discountPrice || product.price,
      image: coverImage
    }, quantity);
  };

  return (
    <div className="flex flex-col">
      <Link href={`/products/${product.id}`} className="group block mb-6">
        <div className="aspect-[4/5] bg-[#F5F5F5] overflow-hidden">
          <img 
            src={coverImage} 
            alt={product.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
      </Link>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold font-sans text-black">{product.title}</h3>
          <p className="text-xl font-medium text-black mt-1">₹{(product.discountPrice || product.price).toLocaleString('en-IN')}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-between border border-black rounded-full px-6 py-2 w-32 h-14">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="text-black text-2xl hover:opacity-50 transition leading-none pb-1"
            >−</button>
            <span className="font-bold text-black text-lg">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="text-black text-2xl hover:opacity-50 transition leading-none pb-1"
            >+</button>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-black text-white h-14 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-black/80 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
