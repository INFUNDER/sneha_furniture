'use client';

import { useState } from 'react';
import { Truck, MapPin } from 'lucide-react';

export default function PincodeEstimator() {
  const [pincode, setPincode] = useState('');
  const [estimate, setEstimate] = useState<{ message: string; isPriority: boolean } | null>(null);

  const checkDelivery = () => {
    if (!pincode || pincode.length !== 6) return;
    
    // Check if it's a Dehradun or Uttarakhand Pincode
    if (pincode.startsWith('248') || pincode.startsWith('24')) {
      setEstimate({
        message: 'Priority Delivery (1-2 Days) & Showroom Pickup Available',
        isPriority: true
      });
    } else {
      setEstimate({
        message: 'Standard Delivery (5-7 Days)',
        isPriority: false
      });
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-sm p-5 mb-8">
      <h4 className="flex items-center gap-2 font-medium text-gray-900 mb-3 text-sm">
        <Truck size={18} className="text-primary" /> Delivery Estimate
      </h4>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Enter 6-digit Pincode" 
            maxLength={6}
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
            className="w-full border border-gray-300 rounded-sm pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button 
          onClick={checkDelivery}
          className="bg-gray-900 text-white px-4 py-2 text-sm rounded-sm hover:bg-gray-800 transition"
        >
          Check
        </button>
      </div>
      {estimate && (
        <div className={`mt-3 text-sm font-medium ${estimate.isPriority ? 'text-green-600' : 'text-gray-700'}`}>
          ✓ {estimate.message}
        </div>
      )}
    </div>
  );
}
