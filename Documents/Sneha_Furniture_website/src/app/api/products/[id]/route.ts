import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { parseProductInput } from '@/lib/productInput';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;

    // Never delete order history. Products that were ordered should be set to 0 stock instead.
    const orderedCount = await prisma.orderItem.count({ where: { productId: id } });
    if (orderedCount > 0) {
      return NextResponse.json(
        { error: 'This product appears in past orders and cannot be deleted. Set its stock to 0 to hide it from sale.' },
        { status: 409 }
      );
    }

    await prisma.$transaction([
      prisma.wishlistItem.deleteMany({ where: { productId: id } }),
      prisma.review.deleteMany({ where: { productId: id } }),
      prisma.product.delete({ where: { id } }),
    ]);

    revalidatePath('/');
    revalidatePath('/shop');

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const parsed = parseProductInput(await request.json());
    if ('error' in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: parsed.value,
    });

    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath(`/products/${id}`);

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
