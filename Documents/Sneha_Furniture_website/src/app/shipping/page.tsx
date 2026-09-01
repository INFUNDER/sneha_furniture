export default function ShippingPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-black mb-8">Shipping and Delivery Policy</h1>
      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-bold text-black mt-8">1. Processing Time</h2>
        <p>All orders are processed within 2-3 business days. If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.</p>
        
        <h2 className="text-2xl font-bold text-black mt-8">2. Shipping Rates and Delivery Estimates</h2>
        <p>Shipping charges for your order will be calculated and displayed at checkout.</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Standard Delivery:</strong> 5-7 business days.</li>
          <li><strong>Premium White-Glove Delivery (Selected Cities):</strong> 3-5 business days (Includes assembly and placement).</li>
        </ul>
        <p>Delivery delays can occasionally occur due to unforeseen logistics issues or public holidays.</p>

        <h2 className="text-2xl font-bold text-black mt-8">3. Shipment Confirmation and Order Tracking</h2>
        <p>You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.</p>

        <h2 className="text-2xl font-bold text-black mt-8">4. Damages</h2>
        <p>Sneha Furniture is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim. Please save all packaging materials and damaged goods before filing a claim.</p>
      </div>
    </div>
  );
}
