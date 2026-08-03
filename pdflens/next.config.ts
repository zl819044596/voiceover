import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Disable image optimization since we're doing static export
  images: { unoptimized: true },
};

export default nextConfig;
