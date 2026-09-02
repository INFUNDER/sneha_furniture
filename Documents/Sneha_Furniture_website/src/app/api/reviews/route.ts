import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { productId, rating, comment } = body;

    if (!productId || !rating) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // 1. Create the Review
    const newReview = await prisma.review.create({
      data: {
        userId: session.id,
        productId,
        rating,
        comment,
        status: 'APPROVED' // Auto-approving for now based on schema default
      }
    });

    // 2. Recalculate average rating for the product
    const allReviews = await prisma.review.findMany({
      where: { productId, status: 'APPROVED' },
      select: { rating: true }
    });

    const reviewsCount = allReviews.length;
    const ratings = reviewsCount > 0 
      ? allReviews.reduce((acc, r) => acc + r.rating, 0) / reviewsCount 
      : 0;

    await prisma.product.update({
      where: { id: productId },
      data: {
        ratings,
        reviewsCount
      }
    });

    return NextResponse.json({ review: newReview }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
