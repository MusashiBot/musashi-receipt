/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@musashi/receipt-core"],
  experimental: {
    typedRoutes: false,
  },
};

export default nextConfig;
