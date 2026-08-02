import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Cloudflare Pages serves from root, no basePath needed
  trailingSlash: false,
  images: {
    unoptimized: true, // Cloudflare Pages doesn't support next/image optimization
  },
};

export default nextConfig;
