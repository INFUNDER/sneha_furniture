import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminDashboard() {
  const productsCount = await prisma.product.count();
  const ordersCount = await prisma.order.count();
  const usersCount = await prisma.user.count();
  
  // Aggregate total sales
  const orders = await prisma.order.findMany({
    where: { paymentStatus: 'PAID' },
    orderBy: { createdAt: 'desc' }
  });
  const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });

  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-16">
      <h1 className="text-4xl font-black uppercase tracking-tight">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="border border-black p-8">
          <p className="text-sm font-bold uppercase tracking-widest opacity-50 mb-4">TOTAL SALES</p>
          <h3 className="text-3xl font-black uppercase">₹{totalSales.toLocaleString('en-IN')}</h3>
        </div>

        <div className="border border-black p-8">
          <p className="text-sm font-bold uppercase tracking-widest opacity-50 mb-4">TOTAL ORDERS</p>
          <h3 className="text-3xl font-black uppercase">{ordersCount}</h3>
        </div>

        <div className="border border-black p-8">
          <p className="text-sm font-bold uppercase tracking-widest opacity-50 mb-4">PRODUCTS</p>
          <h3 className="text-3xl font-black uppercase">{productsCount}</h3>
        </div>

        <div className="border border-black p-8">
          <p className="text-sm font-bold uppercase tracking-widest opacity-50 mb-4">CUSTOMERS</p>
          <h3 className="text-3xl font-black uppercase">{usersCount}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
        {/* Recent Orders */}
        <div className="border border-black">
          <div className="p-8 border-b border-black flex justify-between items-center bg-black text-white">
            <h2 className="text-lg font-black uppercase tracking-widest">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs font-bold uppercase tracking-widest hover:opacity-70 transition border-b border-white pb-1">
              VIEW ALL
            </Link>
          </div>
          <div className="p-0">
            {recentOrders.length === 0 ? (
              <div className="p-12 text-center text-sm font-bold uppercase tracking-widest opacity-50">No orders yet.</div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="border-b border-black text-xs font-bold uppercase tracking-widest opacity-50">
                  <tr>
                    <th className="px-8 py-4">ORDER ID</th>
                    <th className="px-8 py-4">CUSTOMER</th>
                    <th className="px-8 py-4">TOTAL</th>
                  </tr>
                </thead>
                <tbody className="font-bold uppercase tracking-widest text-sm">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-8 py-6">
                        <Link href={`/admin/orders/${order.id}`} className="hover:opacity-50">
                          #{order.id.slice(-6)}
                        </Link>
                      </td>
                      <td className="px-8 py-6">{order.user.name}</td>
                      <td className="px-8 py-6">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="border border-black">
          <div className="p-8 border-b border-black flex justify-between items-center bg-black text-white">
            <h2 className="text-lg font-black uppercase tracking-widest">New Customers</h2>
            <Link href="/admin/users" className="text-xs font-bold uppercase tracking-widest hover:opacity-70 transition border-b border-white pb-1">
              VIEW ALL
            </Link>
          </div>
          <div className="p-0">
            {recentUsers.length === 0 ? (
              <div className="p-12 text-center text-sm font-bold uppercase tracking-widest opacity-50">No users yet.</div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="border-b border-black text-xs font-bold uppercase tracking-widest opacity-50">
                  <tr>
                    <th className="px-8 py-4">NAME</th>
                    <th className="px-8 py-4">EMAIL</th>
                    <th className="px-8 py-4">DATE</th>
                  </tr>
                </thead>
                <tbody className="font-bold uppercase tracking-widest text-sm">
                  {recentUsers.map((u) => (
                    <tr key={u.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-8 py-6">{u.name}</td>
                      <td className="px-8 py-6 lowercase tracking-normal font-medium">{u.email}</td>
                      <td className="px-8 py-6">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
