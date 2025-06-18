/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 15では App Router がデフォルトで有効
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
  // パフォーマンス最適化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // 画像最適化
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  // セキュリティヘッダー
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
