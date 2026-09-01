import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Link from 'next/link';

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
  try { address = JSON.parse(order.shippingAddress); } catch (e) {}

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-24 bg-white min-h-screen">
      <Link href="/profile" className="inline-flex items-center text-sm font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition mb-16 border-b border-black pb-1">
        BACK TO PROFILE
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 border-b border-black pb-8">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tight">ORDER #{order.id.slice(-8).toUpperCase()}</h1>
          <p className="text-sm font-bold uppercase tracking-widest opacity-50 mt-4">PLACED ON {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <span className={`px-6 py-2 text-sm font-bold uppercase tracking-widest ${
          order.orderStatus === 'DELIVERED' ? 'bg-black text-white' : 
          'border border-black text-black'
        }`}>
          {order.orderStatus}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
        <div className="border border-black p-8">
          <div className="font-black text-xl uppercase mb-6 border-b border-black pb-4">
            SHIPPING ADDRESS
          </div>
          <div className="text-black text-sm font-bold uppercase tracking-widest space-y-2 opacity-70">
            <p className="opacity-100">{address.name}</p>
            <p>{address.street}</p>
            <p>{address.city}, {address.state} {address.pincode}</p>
            <p className="pt-4 mt-4 border-t border-gray-200">PHONE: {address.phone}</p>
          </div>
        </div>

        <div className="border border-black p-8">
          <div className="font-black text-xl uppercase mb-6 border-b border-black pb-4">
            PAYMENT INFO
          </div>
          <div className="text-black text-sm font-bold uppercase tracking-widest space-y-4">
            <div className="flex justify-between">
              <span className="opacity-50">METHOD:</span>
              <span>{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-50">STATUS:</span>
              <span className={order.paymentStatus === 'PAID' ? 'text-black' : 'opacity-50'}>
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="border border-black bg-black text-white p-8">
          <div className="font-black text-xl uppercase mb-6 border-b border-white pb-4">
            DELIVERY ESTIMATE
          </div>
          <div className="text-white text-sm font-bold uppercase tracking-widest space-y-4 opacity-70">
            <p>TYPICALLY DELIVERED WITHIN 5-7 BUSINESS DAYS FROM DISPATCH.</p>
            {order.trackingNumber && (
              <p className="mt-6 pt-6 border-t border-white opacity-100">
                TRACKING: {order.trackingNumber}
              </p>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-black uppercase tracking-tight mb-8 border-b border-black pb-4">PURCHASED ITEMS</h2>
      <div className="space-y-8">
        {order.items.map((item) => {
          const images = JSON.parse(item.product.images || '[]');
          const coverImage = images[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200&q=80';
          
          return (
            <div key={item.id} className="flex flex-col md:flex-row items-start md:items-center gap-8 border-b border-gray-200 pb-8">
              <div className="w-32 h-32 bg-[#F5F5F5] overflow-hidden flex-shrink-0">
                <img src={coverImage} alt={item.product.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow">
                <Link href={`/products/${item.productId}`} className="text-xl font-black uppercase hover:opacity-70 transition line-clamp-1">
                  {item.product.title}
                </Link>
                <p className="text-sm font-bold uppercase tracking-widest opacity-50 mt-2">QTY: {item.quantity}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xl font-black">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-16 pt-8 flex justify-end">
        <div className="w-full max-w-sm">
          <div className="flex justify-between items-center">
            <span className="font-bold text-sm uppercase tracking-widest opacity-50">TOTAL PAID</span>
            <span className="font-black text-4xl">₹{order.totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
