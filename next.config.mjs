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
        hostname: 'download-rhode-ceremony-feet.trycloudflare.com',
      },
      {
        protocol: 'https',
        hostname: 'earnings-reporting-discharge-triple.trycloudflare.com',
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