/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qpkhthyrscwgxvknmllh.supabase.co",
        port: "",
        search: "",
      },
    ],
  },
  experimental: {
    reactCompiler: true,
  },
};

export default nextConfig;
