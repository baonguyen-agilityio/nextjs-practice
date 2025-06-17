import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "valuable-health-c8a8ba9845.strapiapp.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
