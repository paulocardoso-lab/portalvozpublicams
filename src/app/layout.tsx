import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

export const dynamic = 'force-dynamic';

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--vp-serif-display",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--vp-serif",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--vp-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--vp-mono",
});

import { getSiteSettings } from './actions/settings';

export async function generateMetadata(): Promise<Metadata> {
  let settings: Record<string, string> = {};
  try {
    settings = await getSiteSettings();
  } catch (err) {
    console.error('Failed to fetch site settings for metadata:', err);
  }
  
  const siteName = settings['SITE_NAME'] || "Voz Pública MS";
  const siteDesc = settings['SITE_DESCRIPTION'] || "Jornalismo independente para Mato Grosso do Sul";

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: siteDesc,
    openGraph: {
      title: siteName,
      description: siteDesc,
      siteName: siteName,
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description: siteDesc,
    },
  };
}

import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`dark ${playfair.variable} ${sourceSerif.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="vp-root min-h-full flex flex-col">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
