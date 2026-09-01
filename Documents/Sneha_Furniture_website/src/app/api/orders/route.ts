import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, total, address, paymentMethod, paymentStatus } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // 1. Determine User (Auth or Guest)
    let userId = null;
    const session = await getSession();

    if (session && session.id) {
      userId = session.id as string;
    }

    if (!userId) {
      // Find or create a Guest user
      let guestUser = await prisma.user.findUnique({ where: { email: 'guest@snehafurniture.com' } });
      if (!guestUser) {
        guestUser = await prisma.user.create({
          data: {
            name: 'Guest Customer',
            email: 'guest@snehafurniture.com',
            password: 'no-login-allowed',
            role: 'CUSTOMER'
          }
        });
      }
      userId = guestUser.id;
      console.log('Guest user created/found:', guestUser);
    }
    
    console.log('Attempting order creation with userId:', userId);

    // 2. Determine initial statuses
    let initialPaymentStatus = 'PENDING';
    if (paymentMethod === 'COD') initialPaymentStatus = 'COD';
    if (paymentStatus) initialPaymentStatus = paymentStatus; // e.g. 'PAID' from mock Razorpay or actual checkout

    // 3. Create the Order and OrderItems in a transaction
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount: total,
        paymentMethod,
        paymentStatus: initialPaymentStatus,
        shippingAddress: JSON.stringify(address),
        orderStatus: 'PENDING',
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: true
      }
    });

    // 4. Send Confirmation Email via Resend (Only if user is logged in with an email)
    if (session && session.email) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        await resend.emails.send({
          from: process.env.SENDER_EMAIL || 'onboarding@resend.dev',
          to: session.email as string,
          subject: `Order Confirmation #${order.id.slice(-8).toUpperCase()} - Sneha Furniture`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
              <h1 style="color: #9A7B4F;">Thank you for your order!</h1>
              <p>Hi ${session.name || 'Customer'},</p>
              <p>Your order has been placed successfully and is currently being processed.</p>
              <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <p><strong>Order ID:</strong> #${order.id.slice(-8).toUpperCase()}</p>
                <p><strong>Total Amount:</strong> ₹${order.totalAmount.toLocaleString('en-IN')}</p>
                <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
              </div>
              <p>You can track the status of your order in your Profile dashboard.</p>
              <p>Best regards,<br><strong>Sneha Premium Furniture</strong></p>
            </div>
          `
        });
        console.log('Confirmation email sent successfully!');
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }
    }

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to process order' }, { status: 500 });
  }
}
