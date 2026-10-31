import { NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email';
import { rateLimit, clientIp } from '@/lib/rateLimit';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    // Honeypot: real visitors never see or fill this field.
    if (body.b_address) {
      return NextResponse.json({ success: true });
    }

    const name = typeof body.name === 'string' ? body.name.trim().slice(0, 100) : '';
    const email = typeof body.email === 'string' ? body.email.trim().slice(0, 254) : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim().slice(0, 20) : '';
    const message = typeof body.message === 'string' ? body.message.trim().slice(0, 5000) : '';

    if (!name || !EMAIL_RE.test(email) || message.length < 5) {
      return NextResponse.json({ error: 'Please enter your name, a valid email and a message' }, { status: 400 });
    }

    if (!rateLimit(`contact:${clientIp(request)}`, 5, 60 * 60 * 1000)) {
      return NextResponse.json({ error: 'Too many messages. Please call or WhatsApp us instead.' }, { status: 429 });
    }

    await sendContactEmail({ name, email, phone, message });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Could not send your message. Please call or WhatsApp us instead.' }, { status: 500 });
  }
}
