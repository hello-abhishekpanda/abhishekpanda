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
      {
        source: "/registerSW.js",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
      {
        source: "/sw.js",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
      { source: "/", headers: alwaysFresh },
      { source: "/blogs", headers: alwaysFresh },
      { source: "/contact", headers: alwaysFresh },
      { source: "/guide", headers: alwaysFresh },
      { source: "/learning/:path*.html", headers: alwaysFresh },
    ];
  },
  async redirects() {
    return [
      {
        source: "/Abhishek.PNG",
        destination: "/profile.png",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
