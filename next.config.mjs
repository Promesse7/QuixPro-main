/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa'

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: function (config) {
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
  disable: true, // Temporarily disable PWA to diagnose build issues
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
