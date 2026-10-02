import type { NextConfig } from "next";

// Security headers mirrored from Koto (koto/apps/web/next.config.js) — the
// same posture across every Overland Innovators property.
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const nextConfig: NextConfig = {
  // This build environment's Turbopack font-fetch subprocess doesn't
  // trust the system cert store by default, which breaks next/font's
  // build-time Google Fonts fetch with a TLS error (registry.npmjs.org
  // calls work fine, so it's cert-store scoping, not a network block).
  // Harmless to leave on for real deploys too.
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      // The 2021 static homepage — the new `/` route replaces it.
      { source: "/index.html", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
