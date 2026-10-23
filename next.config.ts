import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    const alwaysFresh = [
      {
        key: "Cache-Control",
        value: "public, max-age=0, must-revalidate",
      },
    ];

    return [
      { source: "/", headers: alwaysFresh },
      { source: "/blogs", headers: alwaysFresh },
      { source: "/contact", headers: alwaysFresh },
      { source: "/guide", headers: alwaysFresh },
      { source: "/learning/:path*.html", headers: alwaysFresh },
    ];
  },
};

export default nextConfig;
