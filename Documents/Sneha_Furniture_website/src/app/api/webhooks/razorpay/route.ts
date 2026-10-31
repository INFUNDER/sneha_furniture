import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { toPaise, verifyHmac } from '@/lib/razorpay';

// Backup path for marking orders paid, in case the customer closes the tab
// before the checkout page calls /api/payments/razorpay/verify.
export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('RAZORPAY_WEBHOOK_SECRET is not defined');
      return NextResponse.json({ error: 'Webhook secret missing' }, { status: 500 });
    }

    if (!signature || !verifyHmac(rawBody, signature, webhookSecret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);

    if (payload.event === 'payment.captured') {
      const paymentEntity = payload.payload.payment.entity;
      // Set in notes when the Razorpay order is created in /api/orders.
      const localOrderId = paymentEntity.notes?.local_order_id;

      if (localOrderId) {
        const order = await prisma.order.findUnique({ where: { id: localOrderId }, include: { user: true } });

        if (order && Number(paymentEntity.amount) === toPaise(order.totalAmount)) {
          // updateMany with a status filter makes this idempotent: Razorpay retries webhooks.
          const updated = await prisma.order.updateMany({
            where: { id: order.id, paymentStatus: { not: 'PAID' } },
            data: { paymentStatus: 'PAID', orderStatus: 'PROCESSING' },
          });

          if (updated.count > 0) {
            await sendOrderConfirmationEmail(order.user.email, order.user.name, { ...order, paymentStatus: 'PAID' });
          }
        } else {
          console.error(`Webhook payment for ${localOrderId} did not match an order or amount`);
        }
      }
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
