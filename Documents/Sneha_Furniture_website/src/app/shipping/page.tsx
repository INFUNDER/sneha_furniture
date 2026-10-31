import PolicyLayout from '@/components/PolicyLayout';
import type { Metadata } from 'next';
import Link from 'next/link';
import { BRAND_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy',
  description: `Delivery charges, timelines and tracking for ${BRAND_NAME} orders.`,
};


export default function ShippingPolicy() {
  return (
    <PolicyLayout title="Shipping and Delivery Policy" current="/shipping">
        <p><strong>Last updated:</strong> October 2026</p>

        <h2>1. Delivery Charges</h2>
        <p>Delivery is currently free on all orders. If this ever changes, any delivery charge will be shown clearly at checkout before you place your order.</p>

        <h2>2. Processing Time</h2>
        <p>All orders are processed within 2-3 business days. We will contact you on the phone number you provide to confirm a delivery date. If we are experiencing a high volume of orders, shipments may be delayed by a few days.</p>

        <h2>3. Delivery Estimates</h2>
        <p>Once dispatched, orders are typically delivered within 5-7 business days. Delays can occasionally occur due to unforeseen logistics issues or public holidays; we will keep you informed if your delivery is delayed.</p>

        <h2>4. Order Tracking</h2>
        <p>You can see the status of your order at any time from your profile page. Where a courier is used, the tracking number will be shown there once your order has shipped.</p>

        <h2>5. Damage in Transit</h2>
        <p>Please inspect your furniture at delivery. If anything arrives damaged, notify us within 48 hours with photographs and we will take care of it as described in our <Link href="/refund" >Refund and Cancellation Policy</Link>. You do not need to file a claim with the carrier yourself.</p>
    </PolicyLayout>
  );
}
