/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  compiler: {
    removeConsole: true,
  },
  emotion: {
    sourceMap: false,
  },
};

module.exports = nextConfig;
