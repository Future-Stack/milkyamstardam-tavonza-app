import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: '/owner-dashboard/:path*',
        destination: '/admin-dashboard/:path*',
        permanent: false,
      },
      {
        source: '/owner-dashboard',
        destination: '/admin-dashboard',
        permanent: false,
      },
      {
        source: '/owner/:path*',
        destination: '/admin-dashboard/:path*',
        permanent: false,
      },
      {
        source: '/owner',
        destination: '/admin-dashboard',
        permanent: false,
      },
      {
        source: '/admin',
        destination: '/admin-dashboard',
        permanent: false,
      },
      {
        source: '/new-dashbord/owner/:path*',
        destination: '/new-dashbord/admin/:path*',
        permanent: false,
      },
      {
        source: '/new-dashbord/owner',
        destination: '/new-dashbord/admin',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
