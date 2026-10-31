import { Truck, ShieldCheck, Banknote, Store } from 'lucide-react';

// Keep these claims in line with the product data and the shipping/refund policies.
export default function TrustBadges() {
  return (
    <div className="bg-[#FAFAFA] border-y border-gray-200 py-8 w-full">
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="bg-amber-100 p-3 rounded-full text-amber-700">
            <Truck size={24} />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-black">Free Delivery</h3>
          <p className="text-xs text-gray-500 font-medium max-w-[200px]">Careful, free delivery on every order</p>
        </div>

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="bg-emerald-100 p-3 rounded-full text-emerald-700">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-black">Warranty Included</h3>
          <p className="text-xs text-gray-500 font-medium max-w-[200px]">Up to 36 months, as listed on each product</p>
        </div>

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="bg-orange-100 p-3 rounded-full text-orange-700">
            <Banknote size={24} />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-black">Cash on Delivery</h3>
          <p className="text-xs text-gray-500 font-medium max-w-[200px]">Pay when your furniture arrives</p>
        </div>

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="bg-blue-100 p-3 rounded-full text-blue-700">
            <Store size={24} />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-black">Visit Our Showroom</h3>
          <p className="text-xs text-gray-500 font-medium max-w-[200px]">See and feel every piece in Dehradun</p>
        </div>
      </div>
    </div>
  );
}
