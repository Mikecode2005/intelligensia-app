import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {dynamic: 30,
    },
  }, 
  serverExternalPackages: ["@node-rs/argon2"],
};
module.exports = {
  webpack: (config: any) => {
    config.resolve.extensions.push('.mjs')
    return config
  },
  transpilePackages: ['zod', '@hookform/resolvers']
}
export default nextConfig;
