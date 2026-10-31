import type { Metadata } from 'next';
import { BRAND_NAME, CONTACT_EMAIL, PHONES } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy',
  description: `Cancellation, return, replacement and refund terms for ${BRAND_NAME} orders.`,
};

const h2 = 'text-2xl font-bold text-black mt-8';

export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-black mb-8">Refund and Cancellation Policy</h1>
      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p><strong>Last updated:</strong> October 2026</p>

        <h2 className={h2}>1. Cancellations</h2>
        <p>You can cancel your order within 24 hours of placing it for a full refund. After 24 hours, preparation of your order begins and cancellations may not be accepted or may be subject to a cancellation fee of 20% of the total order value. Any fee will be explained to you before the cancellation is confirmed.</p>

        <h2 className={h2}>2. Damaged or Defective Products</h2>
        <p>Due to the premium and often made-to-order nature of our furniture, we accept returns only if the product arrives damaged in transit or has a manufacturing defect.</p>
        <p>Please inspect your furniture at delivery and notify us within 48 hours of delivery with photographs of the damage or defect. We will arrange a repair, replacement of the affected part or product, or a refund. You do not need to claim from the delivery company yourself.</p>

        <h2 className={h2}>3. Refunds</h2>
        <p>Once a return or cancellation is approved, refunds are issued to the original payment method (or by bank transfer/UPI for Cash on Delivery orders) within 5-7 business days.</p>

        <h2 className={h2}>4. Warranty</h2>
        <p>Warranty periods are listed on each product page. Warranty covers manufacturing defects under normal household use and does not cover wear and tear, misuse or damage after delivery.</p>

        <h2 className={h2}>5. Contact</h2>
        <p>To request a cancellation, return or warranty repair, email <a href={`mailto:${CONTACT_EMAIL}`} className="underline">{CONTACT_EMAIL}</a> or call {PHONES.map((p) => p.display).join(' / ')} with your order ID.</p>
      </div>
    </div>
  );
}
