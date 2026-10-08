/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "i.ibb.co" },
    ],
  },

  // Browser calls /server/... and Next forwards it to Express.
  // This keeps the cookie first-party and removes CORS problems.
  async rewrites() {
    // Fallback so the dev server never crashes with "undefined/:path*"
    const serverUrl = (process.env.SERVER_URL || "http://localhost:5000").replace(/\/+$/, "");

    return [
      {
        source: "/server/:path*",
        destination: `${serverUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
