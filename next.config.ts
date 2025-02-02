import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["thumbs.dreamstime.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
