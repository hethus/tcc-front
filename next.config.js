/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/webp", "image/avif"],
    domains: ["i.imgur.com"],
  },
};

module.exports = nextConfig;
