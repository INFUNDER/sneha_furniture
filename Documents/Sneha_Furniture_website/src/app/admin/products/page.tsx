import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import ProductActions from './ProductActions';

export const dynamic = 'force-dynamic';

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center border-b border-black pb-8">
        <h1 className="text-4xl font-black uppercase tracking-tight">Products</h1>
        <Link href="/admin/products/new" className="bg-black text-white px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-black/80 transition">
          ADD PRODUCT
        </Link>
      </div>

      <div className="border border-black bg-white">
        <table className="w-full text-sm text-left">
          <thead className="border-b border-black text-xs font-bold uppercase tracking-widest opacity-50 bg-black text-white">
            <tr>
              <th className="px-8 py-4">PRODUCT</th>
              <th className="px-8 py-4">CATEGORY</th>
              <th className="px-8 py-4">PRICE</th>
              <th className="px-8 py-4">STOCK</th>
              <th className="px-8 py-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="font-bold uppercase tracking-widest text-sm">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center opacity-50">No products found.</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-8 py-6">
                    <div className="max-w-[200px] truncate">{product.title}</div>
                  </td>
                  <td className="px-8 py-6">{product.category}</td>
                  <td className="px-8 py-6">₹{product.price.toLocaleString('en-IN')}</td>
                  <td className="px-8 py-6">
                    {product.stock > 0 ? `${product.stock} IN STOCK` : <span className="opacity-50">OUT OF STOCK</span>}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <ProductActions id={product.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
