/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'kelayaaimages.s3.ap-south-1.amazonaws.com',
      // Add any other domains where your product images are hosted
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kelayaaimages.s3.ap-south-1.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
