/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Environment Variables */
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  },

  /* This replaces the "Middleware" for API routing.
     It redirects any call to /api/... to your Flask server.
  */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*', // The Flask server URL
      },
    ];
  },

  /* Optional: If you are using Turbopack and want to silence specific warnings */
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;