/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/webp"],
    minimumCacheTTL: 86400,
    deviceSizes: [360, 640, 828, 1080, 1600],
    imageSizes: [64, 96, 128, 256],

    remotePatterns: [
      ...(process.env.NEXT_PUBLIC_SUPABASE_URL ? [{ protocol: "https", hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname, pathname: "/storage/v1/object/public/marketplace-images/**" }] : []),
      {
        protocol: "https",
        hostname: "ziuuektwmuwqdeiafnkz.supabase.co",
      },
      {
        protocol: "https",
        hostname: "www.laptap.in",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "laptap.in" }],
        destination: "https://www.laptap.in/:path*",
        permanent: true,
      },
    ];
  },
};

// Separate development output from production builds and dependency upgrades.
export default function config(phase) {
  return { ...nextConfig, distDir: process.env.LAPTAP_BUILD_DIR || (phase === 'phase-development-server' ? '.next-dev' : '.next') };
}
