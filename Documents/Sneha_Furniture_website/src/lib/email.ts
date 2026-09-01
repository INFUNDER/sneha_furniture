import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Ensure this matches a domain you have verified in Resend (e.g., 'orders@snehafurniture.com')
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev'; 

export async function sendOrderConfirmationEmail(userEmail: string, orderData: any) {
  if (!resend) {
    console.warn('RESEND_API_KEY is not configured. Skipping email sent to', userEmail);
    return;
  }

  try {
    const data = await resend.emails.send({
      from: `Sneha Premium Furniture <${SENDER_EMAIL}>`,
      to: [userEmail],
      subject: `Order Confirmation - #${orderData.id.slice(-8).toUpperCase()}`,
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 4px; padding: 20px;">
          <h1 style="color: #111;">Thank you for your order!</h1>
          <p style="color: #444; font-size: 16px;">We have successfully received your payment of <strong>₹${orderData.totalAmount.toLocaleString('en-IN')}</strong>.</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; color: #666;">Order ID: <strong>#${orderData.id.slice(-8).toUpperCase()}</strong></p>
            <p style="margin: 5px 0 0 0; color: #666;">Status: <strong>${orderData.orderStatus}</strong></p>
          </div>
          <p style="color: #444;">We are preparing your premium furniture for shipment. You will receive another email when your order is out for delivery.</p>
          <br/>
          <p style="color: #888; font-size: 14px;">Regards,<br/>The Sneha Furniture Team</p>
        </div>
      `,
    });
    
    console.log('Order confirmation email sent successfully:', data.data?.id);
    return data;
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    throw error;
  }
}
