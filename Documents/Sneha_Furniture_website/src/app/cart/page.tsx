'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-40 text-center bg-white min-h-[70vh] flex flex-col items-center justify-center">
        <h1 className="text-4xl font-black uppercase tracking-widest mb-8">Your Cart is Empty</h1>
        <Link href="/shop" className="inline-flex items-center justify-center border border-black rounded-full px-12 py-4 text-sm font-bold tracking-widest uppercase hover:bg-black hover:text-white transition h-14">
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-24 bg-white min-h-screen">
      <h1 className="text-5xl font-black uppercase tracking-tight mb-16">CART</h1>
      
      <div className="flex flex-col lg:flex-row gap-24">
        <div className="flex-[2] flex flex-col gap-12">
          <div className="border-b border-black pb-4 hidden md:grid grid-cols-12 gap-4 text-xs font-bold uppercase tracking-widest opacity-50">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Total</div>
          </div>
          
          <div className="flex flex-col gap-12">
            {items.map((item) => (
              <div key={item.id} className="pb-12 border-b border-gray-200 flex flex-col md:grid md:grid-cols-12 md:items-center gap-6">
                <div className="col-span-6 flex gap-8 items-center">
                  <div className="w-32 h-32 bg-[#F5F5F5] overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-wide mb-4 line-clamp-2">{item.title}</h3>
                    <button onClick={() => removeFromCart(item.id)} className="text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition">
                      REMOVE
                    </button>
                  </div>
                </div>
                <div className="col-span-2 text-center font-medium text-lg">₹{item.price.toLocaleString('en-IN')}</div>
                <div className="col-span-2 flex justify-center">
                  <div className="flex items-center justify-between border border-black rounded-full px-4 py-1 w-24 h-10">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="text-black text-xl hover:opacity-50 transition leading-none pb-1"
                    >−</button>
                    <span className="font-bold text-black text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="text-black text-xl hover:opacity-50 transition leading-none pb-1"
                    >+</button>
                  </div>
                </div>
                <div className="col-span-2 text-right font-bold text-lg">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <div className="sticky top-32 border border-black p-8">
            <h2 className="text-2xl font-black uppercase tracking-widest mb-8 border-b border-black pb-4">Order Summary</h2>
            <div className="space-y-4 mb-12 text-sm font-bold uppercase tracking-wider">
              <div className="flex justify-between">
                <span className="opacity-50">Subtotal</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-50">Shipping</span>
                <span>FREE</span>
              </div>
              <div className="pt-4 border-t border-gray-200 flex justify-between font-black text-xl">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <Link href="/checkout" className="w-full flex items-center justify-center bg-black text-white h-14 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-black/80 transition">
              PROCEED TO CHECKOUT
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
