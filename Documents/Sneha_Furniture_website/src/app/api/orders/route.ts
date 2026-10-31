import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { createOrder, parseAddress, parseItems, restoreStock, OrderError } from '@/lib/orders';
import { getRazorpay, toPaise } from '@/lib/razorpay';
import { ONLINE_PAYMENTS_ENABLED } from '@/lib/site';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.id) {
    return NextResponse.json({ error: 'Please sign in to place an order' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const items = parseItems(body.items);
    const address = parseAddress(body.address);
    const paymentMethod = body.paymentMethod === 'ONLINE' ? 'RAZORPAY' : 'COD';

    const razorpay = paymentMethod === 'RAZORPAY' ? getRazorpay() : null;
    if (paymentMethod === 'RAZORPAY' && (!ONLINE_PAYMENTS_ENABLED || !razorpay)) {
      return NextResponse.json({ error: 'Online payment is not available yet' }, { status: 400 });
    }

    const order = await createOrder({ userId: session.id, items, address, paymentMethod });
    revalidatePath('/shop');

    if (paymentMethod === 'COD') {
      await sendOrderConfirmationEmail(session.email, session.name, order);
      return NextResponse.json({ success: true, order: { id: order.id } }, { status: 201 });
    }

    // Online payment: create the Razorpay order for the server-computed amount and
    // link it to our order so the verify endpoint and webhook can match them up.
    try {
      const rzpOrder = await razorpay!.orders.create({
        amount: toPaise(order.totalAmount),
        currency: 'INR',
        receipt: order.id,
        notes: { local_order_id: order.id },
      });
      return NextResponse.json({
        success: true,
        order: { id: order.id },
        razorpay: {
          keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          orderId: rzpOrder.id,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
        },
      }, { status: 201 });
    } catch (error) {
      console.error('Razorpay order creation failed:', error);
      await prisma.order.update({ where: { id: order.id }, data: { orderStatus: 'CANCELLED', paymentStatus: 'FAILED' } });
      await restoreStock(order.id);
      return NextResponse.json({ error: 'Could not start the payment. Please try again.' }, { status: 502 });
    }
  } catch (error) {
    if (error instanceof OrderError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: 'Failed to place order. Please try again.' }, { status: 500 });
  }
}
