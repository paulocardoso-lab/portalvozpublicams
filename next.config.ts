import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://www.google-analytics.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.supabase.co https://*.globo.com https://*.googleusercontent.com https://www.noticiasagricolas.com.br https://vozpublicams.com.br https://sitevozpublicamsoficial-paulocardoso-labs-projects.vercel.app",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://*.supabase.co https://*.ingest.sentry.io https://vitals.vercel-insights.com",
  "media-src 'self' https://*.supabase.co",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.globo.com",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "www.noticiasagricolas.com.br",
      },
      {
        protocol: "https",
        hostname: "vozpublicams.com.br",
      },
      {
        protocol: "https",
        hostname: "sitevozpublicamsoficial-paulocardoso-labs-projects.vercel.app",
      }
    ],
  },
};

export default nextConfig;
