'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { BRAND_NAME, ONLINE_PAYMENTS_ENABLED } from '@/lib/site';

type RazorpaySuccess = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type RazorpayInstance = { open: () => void };
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

const inputClass = 'border-b border-black py-4 outline-none text-sm font-bold uppercase tracking-widest bg-transparent placeholder-gray-400';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE'>('COD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        <Link href="/shop" className="inline-flex items-center justify-center border border-black rounded-full px-12 py-4 text-sm font-bold tracking-widest uppercase hover:bg-black hover:text-white transition h-14">
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  }

  const finish = (orderId: string) => {
    clearCart();
    router.push(`/checkout/success?order=${encodeURIComponent(orderId)}`);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(({ id, quantity }) => ({ id, quantity })),
          address,
          paymentMethod,
        })
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'Could not place your order. Please try again.');
        setLoading(false);
        return;
      }

      if (paymentMethod === 'COD') {
        finish(data.order.id);
        return;
      }

      if (!window.Razorpay) {
        setError('Payment window failed to load. Please refresh and try again.');
        setLoading(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: data.razorpay.keyId,
        amount: data.razorpay.amount,
        currency: data.razorpay.currency,
        name: BRAND_NAME,
        description: 'Furniture Order',
        order_id: data.razorpay.orderId,
        handler: async (response: RazorpaySuccess) => {
          const verify = await fetch('/api/payments/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: data.order.id, ...response }),
          });
          if (verify.ok) {
            finish(data.order.id);
          } else {
            setError('We could not confirm your payment. If money was deducted, please contact us with your order ID.');
            setLoading(false);
          }
        },
        modal: { ondismiss: () => setLoading(false) },
        prefill: { name: address.name, contact: address.phone },
        theme: { color: '#000000' },
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      setError('Checkout failed. Please check your connection and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-24 bg-white min-h-screen">
      {ONLINE_PAYMENTS_ENABLED && <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />}

      <h1 className="text-5xl font-black uppercase tracking-tight mb-16">CHECKOUT</h1>

      <form onSubmit={handleCheckout} className="flex flex-col lg:flex-row gap-24">

        <div className="flex-[2] space-y-16">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-widest mb-8 border-b border-black pb-4">Shipping Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input required type="text" autoComplete="name" aria-label="Full name" placeholder="FULL NAME" maxLength={100} className={inputClass} value={address.name} onChange={e => setAddress({...address, name: e.target.value})} />
              <input required type="tel" autoComplete="tel" inputMode="numeric" aria-label="Phone number" placeholder="10-DIGIT MOBILE NUMBER" pattern="(\+?91)?[6-9][0-9]{9}" title="Enter a valid 10-digit Indian mobile number" className={inputClass} value={address.phone} onChange={e => setAddress({...address, phone: e.target.value.replace(/[^\d+]/g, '')})} />
              <input required type="text" autoComplete="street-address" aria-label="Street address" placeholder="STREET ADDRESS" maxLength={300} className={`${inputClass} md:col-span-2`} value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
              <input required type="text" autoComplete="address-level2" aria-label="City" placeholder="CITY" className={inputClass} value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
              <input required type="text" autoComplete="address-level1" aria-label="State" placeholder="STATE" className={inputClass} value={address.state} onChange={e => setAddress({...address, state: e.target.value})} />
              <input required type="text" autoComplete="postal-code" inputMode="numeric" aria-label="Pincode" placeholder="6-DIGIT PINCODE" pattern="[1-9][0-9]{5}" maxLength={6} title="Enter a valid 6-digit pincode" className={`${inputClass} md:col-span-2`} value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value.replace(/\D/g, '')})} />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black uppercase tracking-widest mb-8 border-b border-black pb-4">Payment Method</h2>
            <div className="space-y-4 font-bold uppercase tracking-widest text-sm">
              <label className={`flex items-center gap-4 p-6 border transition cursor-pointer ${paymentMethod === 'COD' ? 'border-black bg-black text-white' : 'border-gray-200 text-black hover:border-black'}`}>
                <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="sr-only" />
                <span>Cash on Delivery</span>
              </label>
              {ONLINE_PAYMENTS_ENABLED ? (
                <label className={`flex items-center gap-4 p-6 border transition cursor-pointer ${paymentMethod === 'ONLINE' ? 'border-black bg-black text-white' : 'border-gray-200 text-black hover:border-black'}`}>
                  <input type="radio" name="payment" value="ONLINE" checked={paymentMethod === 'ONLINE'} onChange={() => setPaymentMethod('ONLINE')} className="sr-only" />
                  <span>Online Payment (UPI, Cards, Netbanking)</span>
                </label>
              ) : (
                <p className="text-xs text-gray-500 normal-case tracking-normal font-medium">Online payment is coming soon. For now, please pay on delivery.</p>
              )}
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
               <div className="flex justify-between"><span className="opacity-50">Delivery</span><span>FREE</span></div>
               <div className="flex justify-between font-black text-xl mt-4"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div>
               <p className="text-xs font-medium normal-case tracking-normal opacity-50">Inclusive of all taxes. Final prices are confirmed when you place the order.</p>
            </div>

            {error && (
              <p role="alert" className="mt-8 border border-red-600 text-red-600 p-4 text-xs font-bold uppercase tracking-widest">{error}</p>
            )}

            <button type="submit" disabled={loading} className="w-full mt-8 bg-black text-white h-14 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-black/80 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'PROCESSING...' : paymentMethod === 'ONLINE' ? 'PAY NOW' : 'PLACE ORDER'}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
