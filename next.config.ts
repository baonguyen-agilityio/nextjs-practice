import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "**",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "productive-basket-ba025cc887.strapiapp.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
