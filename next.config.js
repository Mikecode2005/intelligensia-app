const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
  serverExternalPackages: ["@node-rs/argon2"],
  webpack: (config) => {
    config.resolve.extensions.push('.mjs');
    return config;
  },
  transpilePackages: ['zod', '@hookform/resolvers'],
};

module.exports = nextConfig;