// next.config.mjs
import i18nConfig from './next-i18next.config.js';

const rawBackendUrl =
  process.env.BACKEND_URL || "https://personalhub-back.onrender.com";
const backendUrl = rawBackendUrl.replace(/\/+$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: i18nConfig.i18n,
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;