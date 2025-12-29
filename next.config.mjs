/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa'

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: function(config) {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
      ignored: /node_modules/,
    }
    return config
  }
}

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 24 * 60 * 60 // 24 hours
        }
      }
    }
  ]
})(nextConfig)
