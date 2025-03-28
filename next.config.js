/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.nba.com'],
  },
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig 