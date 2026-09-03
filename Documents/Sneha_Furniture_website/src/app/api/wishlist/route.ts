import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ items: [] }, { status: 401 });
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: session.id },
      select: { productId: true }
    });

    return NextResponse.json({ 
      items: wishlistItems.map(item => item.productId) 
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    // Check if it already exists
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.id,
          productId: productId
        }
      }
    });

    if (existingItem) {
      // Remove it (toggle off)
      await prisma.wishlistItem.delete({
        where: { id: existingItem.id }
      });
      return NextResponse.json({ added: false }, { status: 200 });
    } else {
      // Add it (toggle on)
      await prisma.wishlistItem.create({
        data: {
          userId: session.id,
          productId: productId
        }
      });
      return NextResponse.json({ added: true }, { status: 201 });
    }

  } catch (error) {
    console.error('Error toggling wishlist:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
