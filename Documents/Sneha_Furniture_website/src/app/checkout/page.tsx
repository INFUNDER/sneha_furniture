'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import Image from 'next/image';
import { Lock } from 'lucide-react';
import { BRAND_NAME, ONLINE_PAYMENTS_ENABLED } from '@/lib/site';
import { productImage } from '@/lib/images';
import { displayTitle, formatPrice } from '@/lib/format';
import EmptyState from '@/components/EmptyState';
import PageHeader from '@/components/PageHeader';

type RazorpaySuccess = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type RazorpayInstance = { open: () => void };
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}


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
    return <EmptyState title="Your bag is empty" body="Add a piece to your bag to check out." href="/shop" cta="Explore the collection" />;
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

  const field = (key: keyof typeof address, label: string, props: React.InputHTMLAttributes<HTMLInputElement>, wide = false) => (
    <label className={wide ? 'md:col-span-2' : ''}>
      <span className="field-label">{label}</span>
      <input
        required
        className="field"
        value={address[key]}
        onChange={(e) => setAddress({ ...address, [key]: props.inputMode === 'numeric' ? e.target.value.replace(key === 'phone' ? /[^\d+]/g : /\D/g, '') : e.target.value })}
        {...props}
      />
    </label>
  );

  return (
    <div className="pb-24">
      {ONLINE_PAYMENTS_ENABLED && <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />}

      <PageHeader eyebrow="Secure checkout" title="Almost home." intro="Tell us where your furniture is going. We will call you to confirm a delivery date." />

      <form onSubmit={handleCheckout} className="max-w-[1440px] mx-auto px-5 md:px-10 pt-12 grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16 items-start">
        <div className="space-y-14">
          <section>
            <h2 className="font-display text-3xl flex items-baseline gap-4"><span className="text-brass text-xl">01</span> Delivery details</h2>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
              {field('name', 'Full name', { autoComplete: 'name', maxLength: 100 }, true)}
              {field('phone', 'Mobile number', { type: 'tel', autoComplete: 'tel', inputMode: 'numeric', placeholder: '10-digit mobile number', pattern: '(\\+?91)?[6-9][0-9]{9}', title: 'Enter a valid 10-digit Indian mobile number' })}
              {field('pincode', 'Pincode', { autoComplete: 'postal-code', inputMode: 'numeric', placeholder: '6 digits', pattern: '[1-9][0-9]{5}', maxLength: 6, title: 'Enter a valid 6-digit pincode' })}
              {field('street', 'Street address', { autoComplete: 'street-address', maxLength: 300, placeholder: 'House, street, area' }, true)}
              {field('city', 'City', { autoComplete: 'address-level2' })}
              {field('state', 'State', { autoComplete: 'address-level1' })}
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl flex items-baseline gap-4"><span className="text-brass text-xl">02</span> Payment</h2>
            <div className="mt-8 grid gap-3" role="radiogroup" aria-label="Payment method">
              <label className={`flex items-center gap-4 rounded-2xl border p-5 cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-ink bg-[#FBF8F3]' : 'border-line hover:border-stone'}`}>
                <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="accent-[#1F1A17] w-4 h-4" />
                <span>
                  <span className="block font-semibold">Cash on delivery</span>
                  <span className="block text-sm text-stone">Pay when your furniture arrives.</span>
                </span>
              </label>
              {ONLINE_PAYMENTS_ENABLED ? (
                <label className={`flex items-center gap-4 rounded-2xl border p-5 cursor-pointer transition-colors ${paymentMethod === 'ONLINE' ? 'border-ink bg-[#FBF8F3]' : 'border-line hover:border-stone'}`}>
                  <input type="radio" name="payment" value="ONLINE" checked={paymentMethod === 'ONLINE'} onChange={() => setPaymentMethod('ONLINE')} className="accent-[#1F1A17] w-4 h-4" />
                  <span>
                    <span className="block font-semibold">Pay online</span>
                    <span className="block text-sm text-stone">UPI, cards and netbanking via Razorpay.</span>
                  </span>
                </label>
              ) : (
                <p className="text-sm text-stone">Online payment is coming soon.</p>
              )}
            </div>
          </section>
        </div>

        <aside className="card p-8 lg:sticky lg:top-28">
          <h2 className="font-display text-3xl">Your order</h2>
          <ul className="mt-6 space-y-4">
            {items.map(item => (
              <li key={item.id} className="flex items-center gap-4">
                <span className="relative w-14 h-16 shrink-0 overflow-hidden rounded-lg bg-sand">
                  {item.image && <Image src={productImage(item.image, 160)} alt="" fill sizes="56px" className="object-cover" unoptimized />}
                  <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-ink text-ivory text-[10px] font-semibold grid place-items-center">{item.quantity}</span>
                </span>
                <span className="flex-1 min-w-0 text-sm line-clamp-2">{displayTitle(item.title)}</span>
                <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-6 pt-6 border-t border-line space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-stone">Subtotal</dt><dd>{formatPrice(total)}</dd></div>
            <div className="flex justify-between"><dt className="text-stone">Delivery</dt><dd className="text-brass font-semibold">Free</dd></div>
            <div className="flex justify-between items-baseline pt-4 border-t border-line">
              <dt className="font-semibold">Total</dt>
              <dd className="font-display text-3xl">{formatPrice(total)}</dd>
            </div>
          </dl>
          <p className="text-xs text-stone mt-2">Inclusive of all taxes. Final prices are confirmed when you place the order.</p>

          {error && (
            <p role="alert" className="mt-6 rounded-xl border border-red-700/40 bg-red-50 text-red-800 p-4 text-sm">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary w-full mt-6">
            {loading ? 'Placing order…' : paymentMethod === 'ONLINE' ? 'Pay now' : 'Place order'}
          </button>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-stone"><Lock size={12} aria-hidden="true" /> Your details are only used to deliver this order.</p>
        </aside>
      </form>
    </div>
  );
}
