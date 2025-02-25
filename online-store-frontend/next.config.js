/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // ✅ ใช้ output: export แทน next export
  reactStrictMode: true,
  images: {
    unoptimized: true, // ✅ ต้องใช้เมื่อ deploy แบบ static
  },
};

module.exports = nextConfig;
