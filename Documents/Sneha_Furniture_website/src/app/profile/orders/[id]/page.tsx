import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { displayTitle, formatPrice } from '@/lib/format';
import { parseImages, productImage } from '@/lib/images';

export default async function CustomerOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await getSession();

  if (!session || !session.id) return notFound();

  const userId = session.id as string;

  const order = await prisma.order.findUnique({
    where: { 
      id: resolvedParams.id,
      userId: userId // Ensure user can only view their own order
    },
    include: {
      items: {
        include: { product: true }
      }
    }
  });

  if (!order) return notFound();

  let address = { name: '', street: '', city: '', state: '', pincode: '', phone: '' };
  try { address = JSON.parse(order.shippingAddress); } catch {}

  const steps = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  const stepLabels = ['Order placed', 'Being prepared', 'On the way', 'Delivered'];
  const current = steps.indexOf(order.orderStatus);
  const cancelled = order.orderStatus === 'CANCELLED';

  return (
    <div className="max-w-[1100px] mx-auto px-5 md:px-10 py-10 md:py-16">
      <Link href="/profile" className="inline-flex items-center gap-2 text-sm text-stone link-draw">
        <ArrowLeft size={14} aria-hidden="true" /> My account
      </Link>

      <header className="mt-8 flex flex-wrap justify-between items-end gap-6 pb-8 border-b border-line">
        <div>
          <p className="eyebrow">Order #{order.id.slice(-8).toUpperCase()}</p>
          <h1 className="font-display text-5xl md:text-6xl leading-none mt-5">
            Placed {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </h1>
        </div>
      </header>

      {/* Progress */}
      {cancelled ? (
        <p className="mt-10 card p-6 text-stone">This order was cancelled. If you were charged, your refund is processed within 5–7 business days.</p>
      ) : (
        <ol className="mt-10 grid grid-cols-4 gap-2" aria-label="Order progress">
          {stepLabels.map((label, idx) => {
            const done = idx <= current;
            return (
              <li key={label} className="flex flex-col gap-3" aria-current={idx === current ? 'step' : undefined}>
                <span className={`h-1 rounded-full ${done ? 'bg-brass' : 'bg-line'}`} />
                <span className={`text-xs md:text-sm ${done ? 'text-ink font-semibold' : 'text-stone'}`}>{label}</span>
              </li>
            );
          })}
        </ol>
      )}

      <div className="mt-12 grid md:grid-cols-3 gap-5">
        <div className="card p-6">
          <h2 className="field-label">Delivering to</h2>
          <address className="not-italic mt-3 text-sm leading-relaxed">
            <span className="font-semibold">{address.name}</span><br />
            {address.street}<br />
            {address.city}, {address.state} {address.pincode}<br />
            <span className="text-stone">Phone: {address.phone}</span>
          </address>
        </div>
        <div className="card p-6">
          <h2 className="field-label">Payment</h2>
          <p className="mt-3 text-sm">{order.paymentMethod === 'COD' ? 'Cash on delivery' : 'Online (Razorpay)'}</p>
          <p className="mt-1 text-sm text-stone">{order.paymentStatus === 'PAID' ? 'Paid' : order.paymentStatus === 'COD' ? 'Pay when it arrives' : order.paymentStatus.toLowerCase()}</p>
        </div>
        <div className="card p-6">
          <h2 className="field-label">Delivery</h2>
          <p className="mt-3 text-sm leading-relaxed">Usually 5–7 business days from dispatch. We call before every delivery.</p>
          {order.trackingNumber && <p className="mt-2 text-sm text-stone">Tracking: {order.trackingNumber}</p>}
        </div>
      </div>

      <h2 className="font-display text-4xl mt-16 mb-6">Your pieces</h2>
      <ul className="divide-y divide-line border-y border-line">
        {order.items.map((item) => {
          const coverImage = productImage(parseImages(item.product.images)[0] || '', 240);
          return (
            <li key={item.id} className="py-5 flex items-center gap-5">
              <span className="relative w-20 h-24 shrink-0 overflow-hidden rounded-xl bg-sand">
                <Image src={coverImage} alt="" fill sizes="80px" className="object-cover" unoptimized />
              </span>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.productId}`} className="font-display text-2xl leading-tight hover:text-brass transition-colors line-clamp-2">
                  {displayTitle(item.product.title)}
                </Link>
                <p className="text-sm text-stone mt-1">Qty {item.quantity} · {formatPrice(item.price)} each</p>
              </div>
              <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 flex justify-end">
        <div className="w-full max-w-xs flex justify-between items-baseline">
          <span className="text-sm text-stone">{order.paymentStatus === 'PAID' ? 'Total paid' : 'Total payable'}</span>
          <span className="font-display text-4xl">{formatPrice(order.totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}
