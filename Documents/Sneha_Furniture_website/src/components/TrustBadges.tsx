import { Truck, ShieldCheck, TreePine, Award } from 'lucide-react';

export default function TrustBadges() {
  return (
    <div className="bg-[#FAFAFA] border-y border-gray-200 py-8 w-full">
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="bg-amber-100 p-3 rounded-full text-amber-700">
            <Truck size={24} />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-black">Safe Delivery</h3>
          <p className="text-xs text-gray-500 font-medium max-w-[200px]">Secure & reliable shipping across Dehradun</p>
        </div>
        
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="bg-emerald-100 p-3 rounded-full text-emerald-700">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-black">10 Year Warranty</h3>
          <p className="text-xs text-gray-500 font-medium max-w-[200px]">Comprehensive protection on all woodwork</p>
        </div>

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="bg-orange-100 p-3 rounded-full text-orange-700">
            <TreePine size={24} />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-black">100% Solid Wood</h3>
          <p className="text-xs text-gray-500 font-medium max-w-[200px]">Authentic Teak & Sheesham materials</p>
        </div>

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="bg-blue-100 p-3 rounded-full text-blue-700">
            <Award size={24} />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-black">Premium Quality</h3>
          <p className="text-xs text-gray-500 font-medium max-w-[200px]">Handcrafted by expert artisans</p>
        </div>
      </div>
    </div>
  );
}
