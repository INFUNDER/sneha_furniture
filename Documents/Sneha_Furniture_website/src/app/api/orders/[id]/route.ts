import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { restoreStock } from '@/lib/orders';

const STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const existing = await prisma.order.findUnique({ where: { id }, select: { orderStatus: true } });
    if (!existing) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    if (existing.orderStatus === 'CANCELLED' && status !== 'CANCELLED') {
      return NextResponse.json({ error: 'Cancelled orders cannot be reopened. Ask the customer to order again.' }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { orderStatus: status }
    });

    // Cancelling puts the reserved stock back on sale.
    if (status === 'CANCELLED' && existing.orderStatus !== 'CANCELLED') {
      await restoreStock(id);
    }

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
