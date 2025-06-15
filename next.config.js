// File: next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Your existing setting - KEEP THIS

  // The new configuration for external images - ADD THIS
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hwzzhq9or22aznh7.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;