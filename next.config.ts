import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 430, 768, 1024, 1280, 1440, 1920, 2560],
    // Studio Kunal's photographs live on the studio's current CDN; YouTube
    // poster frames come from i.ytimg.com. Move originals into /public/images
    // when convenient — nothing else changes.
    remotePatterns: [
      new URL("https://i.wfolio.com/**"),
      new URL("https://vp.wfolio.com/**"),
      new URL("https://i.ytimg.com/**"),
    ],
    // Set NEXT_PUBLIC_UNOPTIMIZED_IMAGES=1 only for offline layout testing.
    unoptimized: process.env.NEXT_PUBLIC_UNOPTIMIZED_IMAGES === "1",
  },
};

export default nextConfig;
