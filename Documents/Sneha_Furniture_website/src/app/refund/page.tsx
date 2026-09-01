export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-black mb-8">Refund and Cancellation Policy</h1>
      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-bold text-black mt-8">1. Cancellations</h2>
        <p>You can cancel your order within 24 hours of placing it for a full refund. After 24 hours, the manufacturing process begins and cancellations may not be accepted or may be subject to a cancellation fee of 20% of the total order value.</p>
        
        <h2 className="text-2xl font-bold text-black mt-8">2. Returns</h2>
        <p>Due to the premium and often custom nature of our furniture, we only accept returns if the product is delivered with a manufacturing defect or damage during transit.</p>
        <p>If you receive a damaged product, you must notify us within 48 hours of delivery with photographic evidence.</p>

        <h2 className="text-2xl font-bold text-black mt-8">3. Refunds</h2>
        <p>Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.</p>
        <p>If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within 5-7 business days.</p>

        <h2 className="text-2xl font-bold text-black mt-8">4. Exchange</h2>
        <p>We only replace items if they are defective or damaged. If you need to exchange it for the same item, contact our support team.</p>
      </div>
    </div>
  );
}
