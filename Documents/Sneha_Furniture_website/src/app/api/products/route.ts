import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const where = category ? { category } : {};
    
    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // In a real app, verify the admin session here via getSession() or middleware
    const data = await request.json();
    
    const product = await prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        discountPrice: data.discountPrice ? parseFloat(data.discountPrice) : null,
        category: data.category,
        primaryMaterial: data.primaryMaterial,
        dimensions: data.dimensions,
        finish: data.finish,
        warranty: data.warranty,
        stock: parseInt(data.stock),
        images: JSON.stringify(data.images || []),
      }
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
