/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
      domains: [],
      formats: ['image/avif', 'image/webp'],
    },
    experimental: {
      serverActions: {
        bodySizeLimit: '2mb',
      },
    },
    // Environment variables that should be available on the client
    env: {
      NEXT_PUBLIC_APP_NAME: 'Cosmic Characters',
      NEXT_PUBLIC_APP_VERSION: '1.0.0',
    },
  }
  
  module.exports = nextConfig