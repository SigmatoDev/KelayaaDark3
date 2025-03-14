/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["kelayaaimages.s3.ap-south-1.amazonaws.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kelayaaimages.s3.ap-south-1.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
