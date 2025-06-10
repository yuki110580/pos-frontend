/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  srcDir: 'src', // 👈 これを追加することで src/app が認識される
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://api.pos-app.example.com',
  },
}

module.exports = nextConfig
