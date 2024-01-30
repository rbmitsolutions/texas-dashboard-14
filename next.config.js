/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ["localhost", "res.cloudinary.com", "i.ytimg.com"],
  },
  reactStrictMode: true, // Enable React strict mode for improved error handling
  compiler: {
    removeConsole: process.env.NEXT_PUBLIC_NODE_ENV !== "development", // Remove console.log in production
  },
};

const withPWA = require("next-pwa")({
  dest: "public", // Destination directory for the PWA files
  disable: process.env.NEXT_PUBLIC_NODE_ENV === "development", // Disable PWA in development mode
  // register: true, // Register the PWA service worker
  skipWaiting: true, // Skip waiting for service worker activation
});

module.exports = withPWA(nextConfig);

