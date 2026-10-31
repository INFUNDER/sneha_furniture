import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next's image optimizer is off to avoid memory spikes on the Render instance;
    // product images are resized by Cloudinary instead (see src/lib/images.ts).
    unoptimized: true,
  },
};

export default nextConfig;
