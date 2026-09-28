import type { NextConfig } from "next";

// Security headers mirrored from Koto (koto/apps/web/next.config.js) — the
// same posture across every Overland Innovators property.
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
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
  async rewrites() {
    return [
      // Bluehost/Apache auto-appended index.html for a bare directory
      // request; Next's public/ folder doesn't. This preserved legacy
      // mini-site (public/hosted/impact-report-2020/index.html) needs it
      // spelled out explicitly. The trailing-slash variant doesn't need
      // its own entry — Next's default trailing-slash normalization
      // redirects it to the no-slash form before rewrites run, so it
      // lands here anyway (confirmed: 308 -> this rule -> 200).
      {
        source: "/hosted/impact-report-2020",
        destination: "/hosted/impact-report-2020/index.html",
      },
    ];
  },
};

export default nextConfig;
