import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { parseProductInput } from '@/lib/productInput';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const ids = searchParams.get('ids');

    // ?ids=a,b,c is used by the cart to refresh prices and stock.
    if (ids) {
      const products = await prisma.product.findMany({
        where: { id: { in: ids.split(',').slice(0, 100) } },
        select: { id: true, title: true, price: true, discountPrice: true, stock: true },
      });
      return NextResponse.json({ products }, { status: 200 });
    }

    const where = category ? { category } : {};

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ products }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const parsed = parseProductInput(await request.json());
    if ('error' in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const product = await prisma.product.create({ data: parsed.value });

    revalidatePath('/');
    revalidatePath('/shop');

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
