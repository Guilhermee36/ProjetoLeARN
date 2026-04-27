/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["nextjs.org"],
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  }
};

module.exports = nextConfig;
