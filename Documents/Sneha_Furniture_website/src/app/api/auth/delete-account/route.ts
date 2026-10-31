import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { getSession, clearSessionCookie } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE() {
  try {
    const session = await getSession();

    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.id;
    const orderCount = await prisma.order.count({ where: { userId } });
    const unusablePassword = await bcrypt.hash(randomBytes(32).toString('hex'), 10);

    await prisma.$transaction(async (tx) => {
      await tx.review.deleteMany({ where: { userId } });
      await tx.wishlistItem.deleteMany({ where: { userId } });

      if (orderCount === 0) {
        await tx.user.delete({ where: { id: userId } });
      } else {
        // Orders must be kept for GST/tax records, so the account is anonymised
        // instead of deleted: it can no longer sign in or be identified by email.
        await tx.user.update({
          where: { id: userId },
          data: {
            name: 'Deleted user',
            email: `deleted-${userId}@deleted.invalid`,
            password: unusablePassword,
            role: 'CUSTOMER',
          },
        });
      }
    });

    await clearSessionCookie();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
