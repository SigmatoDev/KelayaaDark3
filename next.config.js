/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'kelayaaimages.s3.ap-south-1.amazonaws.com',
      // Add any other domains you're using for images
    ],
  },
};

module.exports = nextConfig;
