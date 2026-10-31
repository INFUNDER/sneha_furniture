import crypto from 'crypto';
import Razorpay from 'razorpay';

export function getRazorpay() {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export function toPaise(amountInRupees: number) {
  return Math.round(amountInRupees * 100);
}

// Constant-time HMAC-SHA256 check used for both checkout callbacks and webhooks.
export function verifyHmac(payload: string, signature: string, secret: string) {
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
