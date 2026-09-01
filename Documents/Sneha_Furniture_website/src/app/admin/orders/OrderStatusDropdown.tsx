'use client';

import { useState } from 'react';

export default function OrderStatusDropdown({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setIsUpdating(true);

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) {
        setStatus(currentStatus);
        alert('Failed to update status');
      }
    } catch (err) {
      setStatus(currentStatus);
      alert('An error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select 
      value={status} 
      onChange={handleStatusChange} 
      disabled={isUpdating}
      className={`border rounded-sm text-xs px-2 py-1 focus:ring-1 focus:ring-primary outline-none ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''} ${status === 'DELIVERED' ? 'border-green-500 text-green-700 bg-green-50' : 'border-gray-300'}`}
    >
      <option value="PENDING">PENDING</option>
      <option value="PROCESSING">PROCESSING</option>
      <option value="SHIPPED">SHIPPED</option>
      <option value="DELIVERED">DELIVERED</option>
      <option value="CANCELLED">CANCELLED</option>
    </select>
  );
}
