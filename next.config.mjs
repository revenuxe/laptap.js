/** @type {import('next').NextConfig} */
const nextConfig = {
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
