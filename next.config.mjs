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
        hostname: 'colours-venture-boutique-enrolled.trycloudflare.com',
      },
      {
        protocol: 'https',
        hostname: 'quotations-pierce-patrol-sur.trycloudflare.com',
      },

    ],
  },
}

export default nextConfig


// {
//   "message": "Invalid status",
//   "validStatuses": [
//       "In_bearbeitung",
//       "Versendet",
//       "Geliefert",
//       "Storniert"
//   ]
// }