import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const product = await prisma.product.update({
      where: { id },
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

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
