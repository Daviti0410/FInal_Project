import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["thumbs.dreamstime.com"], // ✅ This should not be inside remotePatterns
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
