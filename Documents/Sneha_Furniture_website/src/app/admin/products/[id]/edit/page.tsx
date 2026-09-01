import { prisma } from '@/lib/prisma';
import EditProductForm from './EditProductForm';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <EditProductForm product={product} />
    </div>
  );
}
