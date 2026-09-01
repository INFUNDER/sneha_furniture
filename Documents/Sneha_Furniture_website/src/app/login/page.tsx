'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const urlParams = new URLSearchParams(window.location.search);
        const callbackUrl = urlParams.get('callbackUrl');
        window.location.href = callbackUrl || '/profile';
      } else {
        const data = await res.json();
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6 py-24">
      <div className="w-full max-w-lg">
        <h1 className="text-5xl font-black font-sans text-center mb-16 uppercase tracking-tight">SIGN IN</h1>
        
        {error && (
          <div className="border border-black p-4 text-sm font-bold uppercase tracking-widest mb-8 text-center bg-black text-white">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-12">
          <div>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border-b border-black py-4 outline-none text-sm font-bold uppercase tracking-widest bg-transparent placeholder-gray-400"
              placeholder="EMAIL ADDRESS"
            />
          </div>
          
          <div>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border-b border-black py-4 outline-none text-sm font-bold uppercase tracking-widest bg-transparent placeholder-gray-400"
              placeholder="PASSWORD"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-black/80 transition disabled:opacity-50"
          >
            {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
          </button>
        </form>

        <div className="mt-12 text-center text-sm font-bold uppercase tracking-widest">
          <span className="opacity-50">NEW HERE? </span>
          <Link href="/register" className="border-b border-black hover:opacity-70 transition pb-1">
            CREATE ACCOUNT
          </Link>
        </div>
      </div>
    </div>
  );
}
