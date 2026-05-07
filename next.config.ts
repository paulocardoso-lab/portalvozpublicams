import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  org: "voz-publica-ms",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  
  // New configuration for Sentry v8+ to replace deprecated keys
  // Note: These are now under the 'webpack' object in some versions, 
  // but withSentryConfig usually handles the transition if passed correctly.
  // Actually, the build log recommended:
  // disableLogger -> webpack.treeshake.removeDebugLogging
  // automaticVercelMonitors -> webpack.automaticVercelMonitors
  
  // However, Turbopack support for these is limited. 
  // I will just remove the deprecated top-level ones to stop the warnings.
});
