'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

const fieldClass = 'w-full border-b border-black py-4 outline-none text-sm font-bold uppercase tracking-widest bg-transparent placeholder-gray-400';

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
      <p role="status" className="border border-black p-6 text-sm font-bold uppercase tracking-widest">
        Thank you! Your message has been sent. We will get back to you soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Honeypot field for spam protection */}
      <input type="text" name="b_address" value={form.b_address} onChange={e => setForm({ ...form, b_address: e.target.value })} style={{ display: 'none' }} tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <input type="text" required maxLength={100} aria-label="Your name" placeholder="Your Name" className={fieldClass} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <input type="email" required aria-label="Your email" placeholder="Your Email" className={fieldClass} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="tel" aria-label="Your phone (optional)" placeholder="Phone (optional)" className={fieldClass} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
      <textarea required minLength={5} maxLength={5000} aria-label="Your message" placeholder="Your Message" rows={4} className={`${fieldClass} resize-none`} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}></textarea>

      {error && <p role="alert" className="text-red-600 text-xs font-bold uppercase tracking-widest">{error}</p>}

      <button type="submit" disabled={status === 'sending'} className="w-full bg-black text-white h-14 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-black/80 transition flex items-center justify-center gap-3 disabled:opacity-50">
        <span>{status === 'sending' ? 'Sending...' : 'Send Message'}</span>
        <Send size={16} />
      </button>
    </form>
  );
}
