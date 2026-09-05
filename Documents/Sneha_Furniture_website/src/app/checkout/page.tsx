'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: 'Dehradun',
    state: 'Uttarakhand',
    pincode: ''
  });

  if (items.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-40 text-center bg-white min-h-[70vh] flex flex-col items-center justify-center">
        <h1 className="text-4xl font-black uppercase tracking-widest mb-8">Your Cart is Empty</h1>
      </div>
    );
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (paymentMethod === 'COD') {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items, total, address, paymentMethod: 'COD' })
        });
        if (res.ok) {
          clearCart();
          router.push('/checkout/success');
        }
      } else {
        const res = await fetch('/api/payments/razorpay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: total })
        });
        const orderData = await res.json();

        if (orderData.mockMode) {
           alert("Razorpay API Keys not found in .env. Proceeding with Mock Order Placement!");
           const orderRes = await fetch('/api/orders', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ items, total, address, paymentMethod: 'RAZORPAY_MOCK', paymentStatus: 'PAID' })
           });
           if (orderRes.ok) {
             clearCart();
             router.push('/checkout/success');
           }
           return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "SNEHA FURNITURES",
          description: "Furniture Order",
          order_id: orderData.id,
          handler: async function (response: any) {
             const orderRes = await fetch('/api/orders', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ items, total, address, paymentMethod: 'RAZORPAY', paymentStatus: 'PAID', razorpayPaymentId: response.razorpay_payment_id })
             });
             if (orderRes.ok) {
               clearCart();
               router.push('/checkout/success');
             }
          },
          prefill: {
            name: address.name,
            contact: address.phone,
          },
          theme: {
            color: "#000000"
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      console.error(err);
      alert('Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-24 bg-white min-h-screen">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <h1 className="text-5xl font-black uppercase tracking-tight mb-16">CHECKOUT</h1>
      
      <form onSubmit={handleCheckout} className="flex flex-col lg:flex-row gap-24">
        
        <div className="flex-[2] space-y-16">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-widest mb-8 border-b border-black pb-4">Shipping Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input required type="text" placeholder="FULL NAME" className="border-b border-black py-4 outline-none text-sm font-bold uppercase tracking-widest bg-transparent placeholder-gray-400" value={address.name} onChange={e => setAddress({...address, name: e.target.value})} />
              <input required type="text" placeholder="PHONE NUMBER" className="border-b border-black py-4 outline-none text-sm font-bold uppercase tracking-widest bg-transparent placeholder-gray-400" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} />
              <input required type="text" placeholder="STREET ADDRESS" className="border-b border-black py-4 outline-none text-sm font-bold uppercase tracking-widest bg-transparent placeholder-gray-400 md:col-span-2" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
              <input required type="text" placeholder="CITY" className="border-b border-black py-4 outline-none text-sm font-bold uppercase tracking-widest bg-transparent placeholder-gray-400" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
              <input required type="text" placeholder="STATE" className="border-b border-black py-4 outline-none text-sm font-bold uppercase tracking-widest bg-transparent placeholder-gray-400" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} />
              <input required type="text" placeholder="PINCODE" className="border-b border-black py-4 outline-none text-sm font-bold uppercase tracking-widest bg-transparent placeholder-gray-400 md:col-span-2" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black uppercase tracking-widest mb-8 border-b border-black pb-4">Payment Method</h2>
            <div className="space-y-4 font-bold uppercase tracking-widest text-sm">
              <label className={`flex items-center gap-4 p-6 border transition ${paymentMethod === 'ONLINE' ? 'border-black bg-black text-white' : 'border-gray-200 text-black hover:border-black'}`}>
                <input type="radio" name="payment" value="ONLINE" checked={paymentMethod === 'ONLINE'} onChange={() => setPaymentMethod('ONLINE')} className="sr-only" />
                <span>Online Payment (Razorpay) <span className="text-red-500 opacity-80 text-xs ml-2">(Coming Soon)</span></span>
              </label>
              <label className={`flex items-center gap-4 p-6 border transition cursor-pointer ${paymentMethod === 'COD' ? 'border-black bg-black text-white' : 'border-gray-200 text-black hover:border-black'}`}>
                <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="sr-only" />
                <span>Cash on Delivery</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="sticky top-32 border border-black p-8">
            <h2 className="text-2xl font-black uppercase tracking-widest mb-8 border-b border-black pb-4">Order Summary</h2>
            <div className="space-y-6 mb-12">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-4">
                    <span className="opacity-50">{item.quantity}X</span>
                    <span className="line-clamp-1 max-w-[150px]">{item.title}</span>
                  </div>
                  <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-black pt-6 space-y-4 text-sm font-bold uppercase tracking-widest">
               <div className="flex justify-between"><span className="opacity-50">Subtotal</span><span>₹{total.toLocaleString('en-IN')}</span></div>
               <div className="flex justify-between font-black text-xl mt-4"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div>
            </div>

            <button type="submit" disabled={loading || paymentMethod === 'ONLINE'} className="w-full mt-12 bg-black text-white h-14 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-black/80 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'PROCESSING...' : paymentMethod === 'ONLINE' ? 'COMING SOON' : 'PLACE ORDER'}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
