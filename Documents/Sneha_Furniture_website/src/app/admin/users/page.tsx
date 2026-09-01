import { prisma } from '@/lib/prisma';

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: { orders: true }
      }
    }
  });

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center border-b border-black pb-8">
        <h1 className="text-4xl font-black uppercase tracking-tight">User Management</h1>
      </div>

      <div className="border border-black bg-white">
        {users.length === 0 ? (
          <div className="p-16 text-center">
            <h3 className="text-xl font-black uppercase tracking-widest opacity-50 mb-2">No Users Found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-black text-white border-b border-black text-xs font-bold uppercase tracking-widest opacity-50">
                <tr>
                  <th className="px-8 py-4">USER NAME</th>
                  <th className="px-8 py-4">EMAIL ADDRESS</th>
                  <th className="px-8 py-4">ROLE</th>
                  <th className="px-8 py-4">JOINED DATE</th>
                  <th className="px-8 py-4">ORDERS</th>
                  <th className="px-8 py-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="font-bold uppercase tracking-widest text-sm">
                {users.map(user => (
                  <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-8 py-6">{user.name}</td>
                    <td className="px-8 py-6 lowercase tracking-normal font-medium">{user.email}</td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1 text-xs border ${user.role === 'ADMIN' ? 'border-black bg-black text-white' : 'border-gray-200'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-6 opacity-50">
                      {new Date(user.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="px-8 py-6">
                      {user._count.orders}
                    </td>
                    <td className="px-8 py-6 text-right space-x-6">
                      <button className="hover:opacity-50 transition border-b border-black pb-1">EDIT</button>
                      {user.role !== 'ADMIN' && (
                        <button className="text-red-500 hover:opacity-50 transition border-b border-red-500 pb-1">BLOCK</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
