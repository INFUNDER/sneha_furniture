import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const productId = typeof body.productId === 'string' ? body.productId : '';
    const rating = Number(body.rating);
    const comment = typeof body.comment === 'string' ? body.comment.trim().slice(0, 2000) : '';

    if (!productId || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Please choose a rating from 1 to 5 stars' }, { status: 400 });
    }

    if (!rateLimit(`review:${session.id}`, 10, 60 * 60 * 1000)) {
      return NextResponse.json({ error: 'Too many reviews. Please try again later.' }, { status: 429 });
    }

    // Only verified buyers can review, and only once per product.
    const purchased = await prisma.orderItem.findFirst({
      where: { productId, order: { userId: session.id, orderStatus: { not: 'CANCELLED' } } },
      select: { id: true },
    });
    if (!purchased) {
      return NextResponse.json({ error: 'Only customers who have ordered this product can review it' }, { status: 403 });
    }

    const existing = await prisma.review.findFirst({ where: { userId: session.id, productId }, select: { id: true } });
    if (existing) {
      return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 409 });
    }

    // 1. Create the Review
    const newReview = await prisma.review.create({
      data: {
        userId: session.id,
        productId,
        rating,
        comment: comment || null,
        status: 'APPROVED'
      }
    });

    // 2. Recalculate average rating for the product
    const stats = await prisma.review.aggregate({
      where: { productId, status: 'APPROVED' },
      _avg: { rating: true },
      _count: true,
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        ratings: stats._avg.rating ?? 0,
        reviewsCount: stats._count
      }
    });

    revalidatePath(`/products/${productId}`);

    return NextResponse.json({ review: newReview }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
