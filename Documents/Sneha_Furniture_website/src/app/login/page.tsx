'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';
import { safeRedirectPath } from '@/lib/site';

export default function LoginPage() {
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
        window.location.href = safeRedirectPath(callbackUrl);
      } else {
        const data = await res.json();
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout eyebrow="Welcome back" title={<>Sign <em className="text-brass">in</em></>}>
      {error && (
        <p role="alert" className="mb-8 rounded-xl border border-red-700/40 bg-red-50 text-red-800 p-4 text-sm">{error}</p>
      )}

      <form onSubmit={handleLogin} className="space-y-8">
        <label className="block">
          <span className="field-label">Email address</span>
          <input type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className="field" />
        </label>
        <label className="block">
          <span className="field-label">Password</span>
          <input type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} className="field" />
        </label>
        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-10 text-sm text-stone">
        New to Sneha Furniture?{' '}
        <Link href="/register" className="link-draw text-ink font-semibold">Create an account</Link>
      </p>
    </AuthLayout>
  );
}
