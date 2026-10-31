import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { getRazorpay, toPaise, verifyHmac } from '@/lib/razorpay';

// Called by the checkout page after Razorpay reports a successful payment.
// The order is only marked PAID once the signature and amount are verified server-side.
export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const razorpay = getRazorpay();
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!razorpay || !secret) {
    return NextResponse.json({ error: 'Payments are not configured' }, { status: 500 });
  }

  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();
    if (![orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature].every((v) => typeof v === 'string' && v)) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    if (!verifyHmac(`${razorpay_order_id}|${razorpay_payment_id}`, razorpay_signature, secret)) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.userId !== session.id) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Make sure this Razorpay order really belongs to our order and was for the right amount.
    const rzpOrder = await razorpay.orders.fetch(razorpay_order_id);
    if (rzpOrder.notes?.local_order_id !== order.id || Number(rzpOrder.amount) !== toPaise(order.totalAmount)) {
      return NextResponse.json({ error: 'Payment does not match this order' }, { status: 400 });
    }

    const updated = await prisma.order.updateMany({
      where: { id: order.id, paymentStatus: { not: 'PAID' } },
      data: { paymentStatus: 'PAID', orderStatus: 'PROCESSING' },
    });

    if (updated.count > 0) {
      await sendOrderConfirmationEmail(session.email, session.name, { ...order, paymentStatus: 'PAID' });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
