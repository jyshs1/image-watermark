import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages 静态导出模式
  output: "export",

  // Cloudflare Pages 不支持 Next.js Image Optimization API
  // 使用 Cloudflare Images 服务或禁用优化
  images: {
    unoptimized: true,
  },

  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  compress: true,
  poweredByHeader: false,

  // 注意: redirects 和 headers 配置已迁移到 public/_redirects 和 public/_headers
  // Cloudflare Pages 使用这些文件来处理重定向和响应头
};

export default nextConfig;
