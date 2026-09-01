'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProductActions({ id }: { id: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to delete product');
      }
    } catch (e) {
      alert('An error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-4 items-center">
      <Link href={`/admin/products/${id}/edit`} className="text-indigo-600 hover:text-indigo-900 font-medium">
        Edit
      </Link>
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
}
