// next.config.mjs
import i18nConfig from './next-i18next.config.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: i18nConfig.i18n, // Access the `i18n` property here
  reactStrictMode: false,
  webpack(config, { isServer }) {
    // Enable source maps for client-side code (only in production)
    if (!isServer) {
      config.devtool = 'source-map'; // This generates source maps for client-side code
    }
    return config;
  },
};

export default nextConfig;
