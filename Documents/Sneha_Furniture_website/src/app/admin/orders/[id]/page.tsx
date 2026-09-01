import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, MapPin, CreditCard, User } from 'lucide-react';
import OrderStatusDropdown from '../OrderStatusDropdown';

export default async function AdminOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const order = await prisma.order.findUnique({
    where: { id: resolvedParams.id },
    include: {
      user: true,
      items: {
        include: { product: true }
      }
    }
  });

  if (!order) return notFound();

  let address = { name: '', street: '', city: '', state: '', pincode: '', phone: '' };
  try { address = JSON.parse(order.shippingAddress); } catch (e) {}

  return (
    <div className="space-y-6">
      <Link href="/admin/orders" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition">
        <ArrowLeft size={18} /> Back to Orders
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold font-heading">Order #{order.id}</h1>
          <p className="text-gray-500 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-sm font-medium text-gray-500">Update Status:</span>
          <OrderStatusDropdown orderId={order.id} currentStatus={order.orderStatus} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
            <User size={18} className="text-primary" /> Customer Details
          </div>
          <div className="text-gray-600 text-sm space-y-2">
            <p className="font-medium text-gray-900">{order.user?.name || address.name || 'Guest'}</p>
            <p>{order.user?.email || 'N/A'}</p>
            <p>Phone: {address.phone || 'N/A'}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
            <MapPin size={18} className="text-primary" /> Shipping Address
          </div>
          <div className="text-gray-600 text-sm space-y-1">
            <p>{address.street}</p>
            <p>{address.city}, {address.state} {address.pincode}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
            <CreditCard size={18} className="text-primary" /> Payment Info
          </div>
          <div className="text-gray-600 text-sm space-y-2">
            <div className="flex justify-between">
              <span>Method:</span>
              <span className="font-bold text-gray-900">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className={`font-bold ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-amber-600'}`}>
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold font-heading">Line Items</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium text-center">Quantity</th>
                <th className="px-6 py-4 font-medium text-right">Unit Price</th>
                <th className="px-6 py-4 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => {
                const images = JSON.parse(item.product.images || '[]');
                const coverImage = images[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=100&q=80';
                return (
                  <tr key={item.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img src={coverImage} alt={item.product.title} className="w-12 h-12 rounded-sm object-cover border border-gray-200" />
                        <Link href={`/products/${item.productId}`} className="font-medium text-gray-900 hover:text-primary transition line-clamp-1 max-w-[250px]">
                          {item.product.title}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-medium">{item.quantity}</td>
                    <td className="px-6 py-4 text-right text-gray-500">₹{item.price.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-gray-50 flex justify-end">
          <div className="w-full max-w-sm">
            <div className="flex justify-between items-center text-xl border-t border-gray-200 pt-4 mt-2">
              <span className="font-bold text-gray-900">Order Total</span>
              <span className="font-bold text-primary text-2xl">₹{order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
