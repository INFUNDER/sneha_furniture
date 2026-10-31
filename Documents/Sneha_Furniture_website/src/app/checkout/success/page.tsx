import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { BRAND_NAME } from '@/lib/site';

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams;
  const orderHref = order ? `/profile/orders/${encodeURIComponent(order)}` : '/profile';

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <CheckCircle size={80} className="text-green-500 mb-6" />
      <h1 className="text-4xl font-bold font-heading mb-4 text-gray-900">Order Placed!</h1>
      {order && (
        <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Order #{order.slice(-8).toUpperCase()}</p>
      )}
      <p className="text-lg text-gray-600 max-w-lg mx-auto mb-8">
        Thank you for choosing {BRAND_NAME}. Your order has been placed successfully.
        We will contact you to confirm the delivery schedule.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          href={orderHref}
          className="bg-primary text-white px-8 py-3 rounded-sm font-bold hover:bg-primary/90 transition flex items-center gap-2"
        >
          Track Order
        </Link>
        <Link
          href="/shop"
          className="text-primary font-bold hover:underline px-8 py-3 flex items-center gap-2"
        >
          Continue Shopping <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
