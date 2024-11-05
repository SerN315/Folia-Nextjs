// next.config.mjs
import i18nConfig from './next-i18next.config.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: i18nConfig.i18n, // Access the `i18n` property here
  reactStrictMode: false,
  // useSuspense: false,
  // wait: true,
  // escapeValue: false, // Prevent HTML/React elements from being escaped
};

export default nextConfig;