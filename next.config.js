/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
});

const nextConfig = withPWA({
  images: {
    domains: ["localhost", "res.cloudinary.com", "i.ytimg.com"],
  },
  pwa: {
    disable: process.env.NEXT_PUBLIC_NODE_ENV === "development",
  },
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NEXT_PUBLIC_NODE_ENV !== "development", // Remove console.log in production
  },
});

module.exports = nextConfig;
