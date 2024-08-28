/** Copyright (c) 2024, Tegon, all rights reserved. **/

module.exports = {
  reactStrictMode: false,
  experimental: {
    scrollRestoration: true,
  },
  transpilePackages: ['geist', '@tegonhq/ui'],
  devIndicators: {
    buildActivityPosition: 'bottom-right',
  },
  swcMinify: true,
  output: 'standalone',
};
