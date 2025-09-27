/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
  serverExternalPackages: ["@node-rs/argon2"],
  transpilePackages: ["zod", "@hookform/resolvers"],
  webpack: (config) => {
    config.resolve.extensions.push(".mjs");
    return config;
  },
  images: {
    domains: [
      "placehold.co",
      "images.unsplash.com",
      "plus.unsplash.com", 
      "source.unsplash.com",
      "chat.stream-io-api.com",
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'chat.stream-io-api.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co', // Add this
      },
    ],
    dangerouslyAllowSVG: true, // Add this to allow SVG images
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // Add security policy
  },
};

module.exports = nextConfig;