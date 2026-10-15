import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Bottom corners belong to the accessibility and WhatsApp widgets.
  devIndicators: { position: "top-left" },
};

export default nextConfig;
