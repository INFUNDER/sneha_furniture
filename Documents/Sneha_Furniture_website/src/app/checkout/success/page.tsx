import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ArmchairMark from '@/components/ArmchairMark';

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams;
  const orderHref = order ? `/profile/orders/${encodeURIComponent(order)}` : '/profile';

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-5 py-24 text-center">
      <ArmchairMark className="draw-once w-24 text-brass" strokeWidth={1.6} />
      <p className="eyebrow mt-10">Order placed</p>
      <h1 className="font-display text-[clamp(3rem,7vw,5.5rem)] leading-[0.95] mt-5">
        Thank you. <em className="text-brass">It&apos;s on its way.</em>
      </h1>
      {order && (
        <p className="mt-6 text-sm tracking-[0.18em] uppercase text-stone">Order #{order.slice(-8).toUpperCase()}</p>
      )}
      <p className="mt-6 max-w-lg text-stone leading-relaxed">
        We have sent a confirmation to your email. Our team will call you shortly to confirm a delivery date that suits you.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
        <Link href={orderHref} className="btn btn-primary">Track your order</Link>
        <Link href="/shop" className="btn btn-outline">Continue shopping <ArrowRight size={16} /></Link>
      </div>
    </div>
  );
}
