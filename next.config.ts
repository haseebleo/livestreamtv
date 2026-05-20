import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "www.thesportsdb.com" },
      { protocol: "https", hostname: "assets.cricapi.com" },
    ],
  },
};

export default nextConfig;
