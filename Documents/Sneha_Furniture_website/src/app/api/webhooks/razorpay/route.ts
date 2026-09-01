import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('RAZORPAY_WEBHOOK_SECRET is not defined');
      return NextResponse.json({ error: 'Webhook secret missing' }, { status: 500 });
    }

    if (!signature) {
      return NextResponse.json({ error: 'Signature missing' }, { status: 400 });
    }

    // Cryptographically verify the signature using HMAC SHA256
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Parse the verified payload
    const payload = JSON.parse(rawBody);

    // Handle the payment.captured event
    if (payload.event === 'payment.captured') {
      const paymentEntity = payload.payload.payment.entity;
      
      // We expect the order_id to be passed in the notes during order creation
      const localOrderId = paymentEntity.notes?.local_order_id;

      if (localOrderId) {
        // Mark the order as PAID in our database
        const updatedOrder = await prisma.order.update({
          where: { id: localOrderId },
          data: { 
            paymentStatus: 'PAID',
            orderStatus: 'PROCESSING'
          },
          include: { user: true }
        });

        console.log(`Successfully verified and updated order: ${localOrderId}`);

        // Send Confirmation Email
        await sendOrderConfirmationEmail(updatedOrder.user.email, updatedOrder);
      }
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
