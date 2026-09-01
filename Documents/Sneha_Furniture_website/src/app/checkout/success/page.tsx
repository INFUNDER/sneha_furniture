import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <CheckCircle size={80} className="text-green-500 mb-6" />
      <h1 className="text-4xl font-bold font-heading mb-4 text-gray-900">Order Successful!</h1>
      <p className="text-lg text-gray-600 max-w-lg mx-auto mb-8">
        Thank you for choosing Sneha Premium Furniture. Your order has been placed successfully. 
        We are preparing your premium items for dispatch.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link 
          href="/profile" 
          className="bg-primary text-white px-8 py-3 rounded-sm font-bold hover:bg-primary/90 transition flex items-center gap-2"
        >
          Track Order
        </Link>
        <Link 
          href="/shop" 
          className="text-primary font-bold hover:underline px-8 py-3 flex items-center gap-2"
        >
          Continue Shopping <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
