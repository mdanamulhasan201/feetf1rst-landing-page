/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['192.168.4.3'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
      },
      {
        protocol: 'https',
        hostname: 'apparel-yourself-fairy-citysearch.trycloudflare.com',
      },
    ],
  },
}

export default nextConfig
