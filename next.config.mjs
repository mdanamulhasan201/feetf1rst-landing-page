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
        hostname: 'magical-char-florists-areas.trycloudflare.com',
      },
      {
        protocol: 'https',
        hostname: 'clip-gore-simpson-sox.trycloudflare.com',
      },

      {
        protocol: 'https',
        hostname: 'talking-ventures-theorem-seats.trycloudflare.com',
      }
      // 127.0.0.1
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '1971',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1971',
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