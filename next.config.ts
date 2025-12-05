import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'export',
  trailingSlash: true,
  basePath: '/arbor-applaunchpad',
  assetPrefix: '/arbor-applaunchpad/',
};

export default nextConfig;
