/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@teable/grid-table-kanban'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'ts-keycode-enum': require.resolve('ts-keycode-enum'),
      'ts-key-enum': require.resolve('ts-key-enum'),
    };
    return config;
  },
}

module.exports = nextConfig