'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import Loading from '@/app/loading';
import { formatPrice } from '@/lib/format';

type ProfileUser = { id: string; name: string; email: string; role: string };
type ProfileOrder = { id: string; createdAt: string; totalAmount: number; orderStatus: string };

export default function ProfilePage() {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [orders, setOrders] = useState<ProfileOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'orders'>('orders');
  const [loadError, setLoadError] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to permanently delete your account? Your wishlist and reviews will be deleted. Past orders are kept only as required for tax records, without your name or email.')) return;
    setDeleting(true);
    const res = await fetch('/api/auth/delete-account', { method: 'DELETE' });
    if (res.ok) {
      window.location.href = '/';
    } else {
      setDeleting(false);
      alert('Sorry, we could not delete your account. Please try again or contact us.');
    }
  };

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then(res => res.json()),
      fetch('/api/orders/me').then(res => res.json())
    ]).then(([userData, ordersData]) => {
      if (!userData.user) {
        // Session expired or invalid
        window.location.href = '/login?callbackUrl=/profile';
        return;
      }
      setUser(userData.user);
      if (ordersData.orders) setOrders(ordersData.orders);
    }).catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  if (loading) return <Loading />;
  if (loadError) return <p className="min-h-[60vh] grid place-items-center text-stone px-5 text-center">Could not load your profile. Please refresh the page.</p>;
  if (!user) return <Loading />;

  const tab = (key: 'details' | 'orders', label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={activeTab === key}
      onClick={() => setActiveTab(key)}
      className={`h-11 px-5 rounded-full text-sm font-medium transition-colors ${activeTab === key ? 'bg-ink text-ivory' : 'border border-line hover:border-ink'}`}
    >
      {label}
    </button>
  );

  const statusTone = (status: string) =>
    status === 'DELIVERED' ? 'bg-ink text-ivory' : status === 'CANCELLED' ? 'bg-sand text-stone' : 'bg-linen text-brass';

  return (
    <div className="pb-24">
      <PageHeader eyebrow="My account" title={<>Hello, <em className="text-brass">{user.name.split(' ')[0]}</em></>} intro={user.email}>
        <div className="flex flex-wrap gap-3">
          {user.role === 'ADMIN' && <Link href="/admin" className="btn btn-outline">Admin dashboard</Link>}
          <button onClick={handleLogout} className="btn btn-outline">Sign out</button>
        </div>
      </PageHeader>

      <div className="max-w-[1440px] mx-auto px-5 md:px-10 pt-10">
        <div className="flex gap-2" role="tablist" aria-label="Account sections">
          {tab('orders', `Orders${orders.length ? ` (${orders.length})` : ''}`)}
          {tab('details', 'Account details')}
        </div>

        <div className="mt-10" role="tabpanel">
          {activeTab === 'orders' && (
            orders.length === 0 ? (
              <div className="card p-10 md:p-16 text-center">
                <p className="font-display text-4xl">No orders yet</p>
                <p className="mt-3 text-stone">When you place an order, you can follow it here.</p>
                <Link href="/shop" className="btn btn-primary mt-8">Start shopping</Link>
              </div>
            ) : (
              <ul className="grid md:grid-cols-2 gap-5">
                {orders.map((order) => (
                  <li key={order.id}>
                    <Link href={`/profile/orders/${order.id}`} className="card p-6 md:p-8 flex flex-col gap-6 hover:border-stone transition-colors group">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="text-xs tracking-[0.16em] uppercase text-stone">Order #{order.id.slice(-8).toUpperCase()}</p>
                          <p className="font-display text-2xl mt-2">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.12em] uppercase ${statusTone(order.orderStatus)}`}>
                          {order.orderStatus.toLowerCase()}
                        </span>
                      </div>
                      <div className="flex justify-between items-end">
                        <p className="font-semibold">{formatPrice(order.totalAmount)}</p>
                        <span className="text-sm link-draw group-hover:[background-size:100%_1px]">View details →</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )
          )}

          {activeTab === 'details' && (
            <div className="grid lg:grid-cols-2 gap-6">
              <dl className="card p-8 space-y-6">
                <div>
                  <dt className="field-label">Full name</dt>
                  <dd className="mt-2 text-lg">{user.name}</dd>
                </div>
                <div>
                  <dt className="field-label">Email address</dt>
                  <dd className="mt-2 text-lg break-all">{user.email}</dd>
                </div>
              </dl>
              <div className="card p-8">
                <h2 className="font-display text-3xl">Delete account</h2>
                <p className="mt-3 text-sm text-stone leading-relaxed">
                  Your wishlist and reviews are deleted. Past orders are kept without your name or email, as required for tax records. This cannot be undone.
                </p>
                <button 
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="btn mt-6 border border-red-700 text-red-700 hover:bg-red-700 hover:text-ivory"
                >
                  {deleting ? 'Deleting…' : 'Delete my account'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
