/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
  serverExternalPackages: ["@node-rs/argon2"],
  transpilePackages: ['zod', '@hookform/resolvers'],
  webpack: (config) => {
    config.resolve.extensions.push('.mjs');
    return config;
  },
};

module.exports = nextConfig;
