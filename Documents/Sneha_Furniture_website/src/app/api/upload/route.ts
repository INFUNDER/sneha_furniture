import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { requireAdmin } from '@/lib/auth';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Issues a short-lived signature so admins can upload straight to Cloudinary.
export async function POST() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  if (!process.env.CLOUDINARY_API_SECRET) {
    return NextResponse.json({ error: 'Cloudinary is not configured' }, { status: 500 });
  }

  try {
    const timestamp = Math.round(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder: 'sneha_furniture' },
      process.env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json({ timestamp, signature });
  } catch {
    return NextResponse.json({ error: 'Failed to generate signature' }, { status: 500 });
  }
}
