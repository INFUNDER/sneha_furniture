'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

export default function EditProductForm({ product }: { product: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: product.title,
    description: product.description,
    price: product.price.toString(),
    discountPrice: product.discountPrice ? product.discountPrice.toString() : '',
    category: product.category,
    primaryMaterial: product.primaryMaterial || '',
    dimensions: product.dimensions || '',
    finish: product.finish || '',
    warranty: product.warranty || '',
    stock: product.stock.toString(),
    images: JSON.parse(product.images || '[]').join(', ')
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const imageArray = formData.images
      .split(',')
      .map((url: string) => url.trim())
      .filter((url: string) => url.length > 0);

    const payload = {
      ...formData,
      images: imageArray.length > 0 ? imageArray : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80']
    };

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        router.push('/admin/products');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update product');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 border border-gray-200">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <h1 className="text-3xl font-bold font-heading">Edit Product</h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-sm border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-sm shadow-sm border border-gray-200 space-y-8">
        
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-heading border-b pb-2">Basic Details</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Title *</label>
            <input required name="title" value={formData.title} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-sm px-4 py-2 focus:ring-1 focus:ring-primary outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full border border-gray-300 rounded-sm px-4 py-2 focus:ring-1 focus:ring-primary outline-none" ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 rounded-sm px-4 py-2 focus:ring-1 focus:ring-primary outline-none">
                <option value="Living Room">Living Room</option>
                <option value="Bedroom">Bedroom</option>
                <option value="Dining">Dining</option>
                <option value="Office">Office</option>
                <option value="Outdoor">Outdoor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
              <input required name="stock" value={formData.stock} onChange={handleChange} type="number" min="0" className="w-full border border-gray-300 rounded-sm px-4 py-2 focus:ring-1 focus:ring-primary outline-none" />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-heading border-b pb-2">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Regular Price (₹) *</label>
              <input required name="price" value={formData.price} onChange={handleChange} type="number" min="0" className="w-full border border-gray-300 rounded-sm px-4 py-2 focus:ring-1 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (₹) (Optional)</label>
              <input name="discountPrice" value={formData.discountPrice} onChange={handleChange} type="number" min="0" className="w-full border border-gray-300 rounded-sm px-4 py-2 focus:ring-1 focus:ring-primary outline-none" />
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-heading border-b pb-2">Specifications</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Material</label>
              <input name="primaryMaterial" value={formData.primaryMaterial} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-sm px-4 py-2 focus:ring-1 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Finish</label>
              <input name="finish" value={formData.finish} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-sm px-4 py-2 focus:ring-1 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
              <input name="dimensions" value={formData.dimensions} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-sm px-4 py-2 focus:ring-1 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warranty</label>
              <input name="warranty" value={formData.warranty} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-sm px-4 py-2 focus:ring-1 focus:ring-primary outline-none" />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-heading border-b pb-2">Media</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
            <ImageUpload 
              value={formData.images.split(',').filter(Boolean)} 
              onChange={(urls) => setFormData({ ...formData, images: urls.join(',') })} 
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-4">
          <Link href="/admin/products" className="px-6 py-3 border border-gray-300 rounded-sm text-gray-700 font-medium hover:bg-gray-50 transition">
            Cancel
          </Link>
          <button type="submit" disabled={loading} className="px-8 py-3 bg-primary text-white rounded-sm font-bold hover:bg-primary/90 transition disabled:bg-gray-400">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

      </form>
    </div>
  );
}
