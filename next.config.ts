import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 旧版导航或外链可能仍指向已下线路由，避免用户看到裸 404
  async redirects() {
    return [
      { source: "/dashboard", destination: "/demos", permanent: true },
      { source: "/workflows", destination: "/demos", permanent: true },
      { source: "/agent", destination: "/demos", permanent: true },
    ];
  },
};

export default nextConfig;
