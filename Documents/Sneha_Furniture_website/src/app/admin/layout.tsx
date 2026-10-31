import Link from 'next/link';
import { assertAdminPage } from '@/lib/auth';
import LogoutButton from '@/components/LogoutButton';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // proxy.ts already redirects non-admins; this re-checks the role in the database.
  // Each admin page repeats the check because layouts and pages render in parallel.
  await assertAdminPage();

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-black flex flex-col">
        <div className="h-24 flex items-center px-8 border-b border-black">
          <Link href="/" className="text-xl font-black uppercase tracking-tight">SNEHA ADMIN</Link>
        </div>
        <nav className="p-8 flex flex-col space-y-6 text-sm font-bold uppercase tracking-widest flex-1">
          <Link href="/admin" className="hover:opacity-50 transition">Dashboard</Link>
          <Link href="/admin/products" className="hover:opacity-50 transition">Products</Link>
          <Link href="/admin/orders" className="hover:opacity-50 transition">Orders</Link>
          <Link href="/admin/users" className="hover:opacity-50 transition">Users</Link>
          <div className="flex-1"></div>
          <LogoutButton className="text-left uppercase text-red-600 hover:opacity-50 transition border-t border-black pt-6" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-24 bg-white border-b border-black flex items-center px-12">
          <h2 className="text-sm font-bold uppercase tracking-widest opacity-50">Admin Console</h2>
        </header>
        <div className="p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
