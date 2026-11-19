import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // خروجی مستقل برای Docker (infrastructure/docker/web)
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../../"),
  transpilePackages: ["@kidsworld/types"],
  poweredByHeader: false,
  async headers() {
    // محیط کودک و والدین هرگز نباید ایندکس شوند
    return [
      { source: "/kids/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/parent/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;
