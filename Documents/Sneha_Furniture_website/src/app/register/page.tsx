'use client';

import { useState } from 'react';
import Link from 'next/link';
import { safeRedirectPath } from '@/lib/site';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      if (res.ok) {
        const urlParams = new URLSearchParams(window.location.search);
        const callbackUrl = urlParams.get('callbackUrl');
        window.location.href = safeRedirectPath(callbackUrl);
      } else {
        const data = await res.json();
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6 py-24">
      <div className="w-full max-w-lg">
        <h1 className="text-5xl font-black font-sans text-center mb-16 uppercase tracking-tight">CREATE ACCOUNT</h1>
        
        {error && (
          <div className="border border-black p-4 text-sm font-bold uppercase tracking-widest mb-8 text-center bg-black text-white">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-12">
          <div>
            <input 
              type="text" 
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border-b border-black py-4 outline-none text-sm font-bold uppercase tracking-widest bg-transparent placeholder-gray-400"
              placeholder="FULL NAME"
            />
          </div>

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
              placeholder="PASSWORD (MIN. 8 CHARACTERS)"
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-4 pt-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                required 
                className="mt-1 w-4 h-4 rounded-none border-black text-black focus:ring-black accent-black"
              />
              <span className="text-xs font-bold uppercase tracking-widest opacity-80 group-hover:opacity-100 transition">
                I agree to the <Link href="/terms" className="border-b border-black pb-0.5">Terms of Service</Link> and <Link href="/privacy" className="border-b border-black pb-0.5">Privacy Policy</Link>
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                required 
                className="mt-1 w-4 h-4 rounded-none border-black text-black focus:ring-black accent-black"
              />
              <span className="text-xs font-bold uppercase tracking-widest opacity-80 group-hover:opacity-100 transition">
                I confirm that I am 18 years of age or older
              </span>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-black/80 transition disabled:opacity-50"
          >
            {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div className="mt-12 text-center text-sm font-bold uppercase tracking-widest">
          <span className="opacity-50">ALREADY REGISTERED? </span>
          <Link href="/login" className="border-b border-black hover:opacity-70 transition pb-1">
            SIGN IN
          </Link>
        </div>
      </div>
    </div>
  );
}
