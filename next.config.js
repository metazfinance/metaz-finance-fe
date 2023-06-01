/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  compiler: {
    removeConsole: false,
  },
  emotion: {
    sourceMap: false,
  },
};

module.exports = nextConfig;
