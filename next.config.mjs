/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreDuringBuilds: true,
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
};

export default nextConfig;
