/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep audit/build output separate from a running local development server.
  distDir: process.env.LAPTAP_BUILD_DIR || ".next",
  reactStrictMode: true,
  images: {
    remotePatterns: [
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

export default nextConfig;
