import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'product.hstatic.net',
        port: '',
        pathname: '/**', // This allows any path on the domain
      },
    ]
  }
  /* config options here */
};

export default nextConfig;
