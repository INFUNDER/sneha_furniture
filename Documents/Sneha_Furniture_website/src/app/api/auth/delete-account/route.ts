import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function DELETE() {
  try {
    const session = await getSession();
    
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.userId;

    // Delete reviews and wishlist items
    await prisma.review.deleteMany({ where: { userId } });
    await prisma.wishlistItem.deleteMany({ where: { userId } });

    // Orders might be kept for business/tax records. 
    // For compliance and simplicity, we delete the user's orders and their items.
    const userOrders = await prisma.order.findMany({ where: { userId } });
    const orderIds = userOrders.map(o => o.id);
    
    if (orderIds.length > 0) {
      await prisma.orderItem.deleteMany({ where: { orderId: { in: orderIds } } });
      await prisma.order.deleteMany({ where: { userId } });
    }

    // Finally delete user
    await prisma.user.delete({ where: { id: userId } });

    // Clear session
    const cookieStore = await cookies();
    cookieStore.set('session', '', { maxAge: -1 });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete account error:', error);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
