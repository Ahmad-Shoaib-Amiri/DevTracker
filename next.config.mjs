/** @type {import('next').NextConfig} */
const nextConfig = {
      allowedDevOrigins: [
    '10.10.10.24',
    'localhost',
    '127.0.0.1',
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
