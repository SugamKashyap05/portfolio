/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  basePath: "/portfolio",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
