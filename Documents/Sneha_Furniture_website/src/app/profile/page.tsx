'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type ProfileUser = { id: string; name: string; email: string; role: string };
type ProfileOrder = { id: string; createdAt: string; totalAmount: number; orderStatus: string };

export default function ProfilePage() {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [orders, setOrders] = useState<ProfileOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'orders'>('details');
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

  if (loading) return <div className="p-40 text-center font-black uppercase tracking-widest text-xl">LOADING...</div>;
  if (loadError) return <div className="p-40 text-center font-black uppercase tracking-widest text-xl">Could not load your profile. Please refresh the page.</div>;
  if (!user) return <div className="p-40 text-center font-black uppercase tracking-widest text-xl">Redirecting to sign in...</div>;

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-24 bg-white min-h-screen">
      <h1 className="text-5xl font-black uppercase tracking-tight mb-16">PROFILE</h1>
      
      <div className="flex flex-col md:flex-row gap-24">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="mb-12">
            <h2 className="text-2xl font-black uppercase tracking-widest">{user.name}</h2>
            <p className="text-sm font-bold uppercase tracking-widest opacity-50 mt-2">{user.email}</p>
          </div>

          <div className="flex flex-col space-y-6 text-sm font-bold uppercase tracking-widest">
            <button 
              onClick={() => setActiveTab('details')}
              className={`text-left transition-opacity ${activeTab === 'details' ? 'opacity-100 underline underline-offset-4' : 'opacity-50 hover:opacity-100'}`}
            >
              Account Details
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`text-left transition-opacity ${activeTab === 'orders' ? 'opacity-100 underline underline-offset-4' : 'opacity-50 hover:opacity-100'}`}
            >
              Order History
            </button>
            {user.role === 'ADMIN' && (
              <Link href="/admin" className="text-left opacity-50 hover:opacity-100 transition-opacity">
                Admin Dashboard
              </Link>
            )}
            <button onClick={handleLogout} className="text-left text-red-600 hover:opacity-70 transition-opacity pt-6 border-t border-black">
              SIGN OUT
            </button>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1">
          <div className="min-h-[400px]">
            {activeTab === 'details' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-2xl font-black uppercase tracking-widest mb-12 border-b border-black pb-4">Account Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-2xl mb-16">
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-widest opacity-50 mb-2">Full Name</label>
                    <div className="text-xl font-black uppercase">{user.name}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-widest opacity-50 mb-2">Email Address</label>
                    <div className="text-xl font-black uppercase">{user.email}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-widest opacity-50 mb-2">Account Role</label>
                    <div className="text-xl font-black uppercase">
                      {user.role}
                    </div>
                  </div>
                </div>

                <div className="pt-12 border-t border-black">
                  <h3 className="text-lg font-black uppercase tracking-widest text-red-600 mb-4">Danger Zone</h3>
                  <p className="text-sm font-bold opacity-70 mb-6">Permanently delete your account. Your wishlist and reviews are deleted; past orders are kept without your name or email, as required for tax records. This cannot be undone.</p>
                  <button 
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="border border-red-600 text-red-600 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition disabled:opacity-50"
                  >
                    {deleting ? 'Deleting...' : 'Delete My Account'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-2xl font-black uppercase tracking-widest mb-12 border-b border-black pb-4">Order History</h2>
                
                {orders.length === 0 ? (
                  <div className="text-center py-20">
                    <h3 className="text-2xl font-black uppercase tracking-widest opacity-50 mb-6">No orders yet</h3>
                    <Link href="/shop" className="border border-black rounded-full px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition inline-block">
                      START SHOPPING
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-black p-8">
                        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-8 border-b border-gray-200 pb-8">
                          <div>
                            <p className="text-sm font-bold uppercase tracking-widest opacity-50 mb-2">ORDER #{order.id.slice(-8).toUpperCase()}</p>
                            <p className="text-xl font-black uppercase">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          </div>
                          <div className="md:text-right">
                            <p className="text-sm font-bold uppercase tracking-widest opacity-50 mb-2">TOTAL AMOUNT</p>
                            <p className="text-2xl font-black">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest">
                          <div>
                            <span className="opacity-50 mr-4">STATUS:</span>
                            <span className={order.orderStatus === 'DELIVERED' ? 'text-black' : 'text-gray-500'}>
                              {order.orderStatus}
                            </span>
                          </div>
                          
                          <Link href={`/profile/orders/${order.id}`} className="border-b border-black hover:opacity-70 transition pb-1">
                            VIEW DETAILS
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
