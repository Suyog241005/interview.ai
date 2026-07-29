import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "../../"),
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: [
    "@interview.ai/ui",
    "@interview.ai/api",
    "@interview.ai/better-auth",
    "@interview.ai/types",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i,
      type: "asset/resource",
    });
    return config;
  },
};

export default nextConfig;
