/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['192.168.7.12'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
      },
      {
        protocol: 'https',
           hostname: 'christmas-inside-workstation-irrigation.trycloudflare.com ',
      },
    ],
  },
}

export default nextConfig
