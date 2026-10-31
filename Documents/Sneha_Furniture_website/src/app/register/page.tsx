'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';
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
    <AuthLayout eyebrow="Join us" title={<>Create an <em className="text-brass">account</em></>}>
      {error && (
        <p role="alert" className="mb-8 rounded-xl border border-red-700/40 bg-red-50 text-red-800 p-4 text-sm">{error}</p>
      )}

      <form onSubmit={handleRegister} className="space-y-8">
        <label className="block">
          <span className="field-label">Full name</span>
          <input type="text" required autoComplete="name" maxLength={100} value={name} onChange={e => setName(e.target.value)} className="field" />
        </label>
        <label className="block">
          <span className="field-label">Email address</span>
          <input type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className="field" />
        </label>
        <label className="block">
          <span className="field-label">Password</span>
          <input type="password" required minLength={8} autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} className="field" aria-describedby="pw-hint" />
          <span id="pw-hint" className="block mt-2 text-xs text-stone">At least 8 characters.</span>
        </label>

        <div className="space-y-4 text-sm text-stone">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" required className="mt-0.5 w-4 h-4 accent-[#1F1A17]" />
            <span>I agree to the <Link href="/terms" className="underline underline-offset-2 text-ink">Terms</Link> and <Link href="/privacy" className="underline underline-offset-2 text-ink">Privacy Policy</Link></span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" required className="mt-0.5 w-4 h-4 accent-[#1F1A17]" />
            <span>I confirm that I am 18 years of age or older</span>
          </label>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-10 text-sm text-stone">
        Already have an account?{' '}
        <Link href="/login" className="link-draw text-ink font-semibold">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
