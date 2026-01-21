import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'ftp.goit.study' }],
  },
  basePath: '/learn-lingo',
  assetPrefix: '/learn-lingo/',
};

export default nextConfig;
