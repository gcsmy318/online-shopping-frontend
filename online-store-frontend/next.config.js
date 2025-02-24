/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // ปิด image optimization สำหรับ static export
  },
};

module.exports = nextConfig;