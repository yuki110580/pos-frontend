/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://api.pos-app.example.com',
  },
}

module.exports = nextConfig
