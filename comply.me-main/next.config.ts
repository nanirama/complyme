import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Trailing slash configuration (migrated from Gatsby)
  trailingSlash: true,
  
  // Output configuration
  output: 'standalone',
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Allow images from our API route
    unoptimized: false,
  },
};

export default nextConfig;
