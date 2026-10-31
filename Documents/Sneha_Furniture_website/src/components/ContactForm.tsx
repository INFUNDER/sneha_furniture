'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';



export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', b_address: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Could not send your message.');
        setStatus('error');
        return;
      }
      setStatus('sent');
      setForm({ name: '', email: '', phone: '', message: '', b_address: '' });
    } catch {
      setError('Could not send your message. Please check your connection.');
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div role="status" className="py-10 text-center">
        <p className="font-display text-4xl">Thank you.</p>
        <p className="mt-3 text-stone">Your message is on its way. We will reply within one working day.</p>
        <button type="button" onClick={() => setStatus('idle')} className="mt-8 link-draw text-sm font-semibold">Send another message</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Honeypot field for spam protection */}
      <input type="text" name="b_address" value={form.b_address} onChange={e => setForm({ ...form, b_address: e.target.value })} style={{ display: 'none' }} tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="grid sm:grid-cols-2 gap-8">
        <label className="block">
          <span className="field-label">Your name</span>
          <input type="text" required maxLength={100} autoComplete="name" className="field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </label>
        <label className="block">
          <span className="field-label">Phone (optional)</span>
          <input type="tel" autoComplete="tel" className="field" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        </label>
      </div>
      <label className="block">
        <span className="field-label">Email</span>
        <input type="email" required autoComplete="email" className="field" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      </label>
      <label className="block">
        <span className="field-label">Message</span>
        <textarea required minLength={5} maxLength={5000} rows={4} className="field resize-none" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}></textarea>
      </label>

      {error && <p role="alert" className="rounded-xl border border-red-700/40 bg-red-50 text-red-800 p-4 text-sm">{error}</p>}

      <button type="submit" disabled={status === 'sending'} className="btn btn-primary w-full sm:w-auto">
        {status === 'sending' ? 'Sending…' : 'Send message'} <Send size={15} />
      </button>
    </form>
  );
}
