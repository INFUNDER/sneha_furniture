import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import OrderStatusDropdown from './OrderStatusDropdown';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center border-b border-black pb-8">
        <h1 className="text-4xl font-black uppercase tracking-tight">Order Management</h1>
      </div>

      <div className="border border-black bg-white">
        {orders.length === 0 ? (
          <div className="p-16 text-center">
            <h3 className="text-xl font-black uppercase tracking-widest opacity-50 mb-2">No Orders Yet</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-black text-white border-b border-black text-xs font-bold uppercase tracking-widest opacity-50">
                <tr>
                  <th className="px-8 py-4">ORDER ID</th>
                  <th className="px-8 py-4">DATE</th>
                  <th className="px-8 py-4">CUSTOMER</th>
                  <th className="px-8 py-4">PAYMENT</th>
                  <th className="px-8 py-4">TOTAL</th>
                  <th className="px-8 py-4">STATUS</th>
                  <th className="px-8 py-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="font-bold uppercase tracking-widest text-sm">
                {orders.map(order => {
                  let parsedAddress = { name: '', phone: '', city: '' };
                  try { parsedAddress = JSON.parse(order.shippingAddress); } catch (e) {}

                  return (
                    <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-8 py-6 text-xs">{order.id.slice(-8)}</td>
                      <td className="px-8 py-6">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td className="px-8 py-6">
                        <p>{parsedAddress.name || order.user?.name || 'Guest'}</p>
                        <p className="text-xs opacity-50">{parsedAddress.phone}</p>
                        <p className="text-xs opacity-50">{parsedAddress.city}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs opacity-50">{order.paymentMethod}</span>
                        <br/>
                        <span className={`text-xs ${order.paymentStatus === 'PAID' ? 'text-black' : 'opacity-50'}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-8 py-6">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                      <td className="px-8 py-6">
                        <OrderStatusDropdown orderId={order.id} currentStatus={order.orderStatus} />
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Link href={`/admin/orders/${order.id}`} className="hover:opacity-50 transition border-b border-black pb-1">
                          VIEW ITEMS
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
