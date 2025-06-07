/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",       // บอก next ว่า export เป็น static site
  reactStrictMode: true,  // เปิด Strict Mode ของ React
  trailingSlash: true,    // ให้ URL ลงท้ายด้วย /
  basePath: '/shop',      // ตั้ง path ย่อยเป็น /shop
  images: {
    domains: ['organeh.com'],
    unoptimized: true,    // ปิดการ optimize รูป สำหรับ static export
  }
}

module.exports = nextConfig;
