/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      "res.cloudinary.com",
      "https://kelayaaimages.s3.ap-south-1.amazonaws.com",
    ], // Update with your actual S3 bucket name
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "https://kelayaaimages.s3.ap-south-1.amazonaws.com", // Change this to match your S3 URL format
      },
    ],
    formats: ["image/avif", "image/webp"], // Supports optimized formats
  },
};

module.exports = nextConfig;
