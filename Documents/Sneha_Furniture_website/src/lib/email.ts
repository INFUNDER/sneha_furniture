import { Resend } from 'resend';
import { BRAND_NAME, CONTACT_EMAIL } from '@/lib/site';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Ensure this matches a domain you have verified in Resend (e.g., 'orders@snehafurniture.in')
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev';

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

type OrderEmailData = {
  id: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
};

export async function sendOrderConfirmationEmail(to: string, customerName: string, order: OrderEmailData) {
  if (!resend) {
    console.warn('RESEND_API_KEY is not configured. Skipping order email.');
    return;
  }

  const shortId = order.id.slice(-8).toUpperCase();
  const paid = order.paymentStatus === 'PAID';

  try {
    await resend.emails.send({
      from: `${BRAND_NAME} <${SENDER_EMAIL}>`,
      to: [to],
      subject: `Order Confirmation #${shortId} - ${BRAND_NAME}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h1 style="color: #111;">Thank you for your order!</h1>
          <p>Hi ${escapeHtml(customerName || 'Customer')},</p>
          <p>${paid ? 'We have received your payment and your order is being processed.' : 'Your order has been placed successfully and is being processed.'}</p>
          <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p><strong>Order ID:</strong> #${shortId}</p>
            <p><strong>${paid ? 'Amount Paid' : 'Amount Payable'}:</strong> ₹${order.totalAmount.toLocaleString('en-IN')}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online (Razorpay)'}</p>
          </div>
          <p>You can track the status of your order from your profile page.</p>
          <p>Best regards,<br><strong>${BRAND_NAME}</strong></p>
        </div>
      `,
    });
  } catch (error) {
    // Email failure must never fail the order itself.
    console.error('Failed to send order confirmation email:', error);
  }
}

export async function sendContactEmail(data: { name: string; email: string; phone?: string; message: string }) {
  if (!resend) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  await resend.emails.send({
    from: `${BRAND_NAME} Website <${SENDER_EMAIL}>`,
    to: [CONTACT_EMAIL],
    replyTo: data.email,
    subject: `New website enquiry from ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>New enquiry from the website</h2>
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        ${data.phone ? `<p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${escapeHtml(data.message)}</p>
      </div>
    `,
  });
}
