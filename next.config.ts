import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  compress: true,
  poweredByHeader: false,
  images: {
    qualities: [70, 75, 80, 85],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 430, 768, 1024, 1280, 1440, 1920],
    remotePatterns: [
      new URL("https://i.wfolio.com/**"),
      new URL("https://vp.wfolio.com/**"),
      new URL("https://i.ytimg.com/**"),
    ],
    unoptimized: process.env.NEXT_PUBLIC_UNOPTIMIZED_IMAGES === "1",
  },
};

export default nextConfig;
