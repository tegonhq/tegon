/** Copyright (c) 2024, Tegon, all rights reserved. **/

module.exports = {
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/',
        destination: '/auth/signin',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' }, // replace this your actual origin
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,DELETE,PATCH,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
  devIndicators: {
    buildActivityPosition: 'bottom-right',
  },
  swcMinify: true,
  publicRuntimeConfig: {
    // Will be available on both server and client
    NEXT_PUBLIC_BASE_HOST: process.env.NEXT_PUBLIC_BASE_HOST,
  },
  output: 'standalone',
};
