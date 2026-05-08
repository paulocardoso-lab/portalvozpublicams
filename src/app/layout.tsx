import { Inter, Playfair_Display, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import React from 'react';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
});

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: {
    default: "Voz Pública MS — Jornalismo Independente em Mato Grosso do Sul",
    template: "%s | Voz Pública MS"
  },
  description: "Investigação, política, meio ambiente e poder em Mato Grosso do Sul. O portal que aprofunda as notícias que importam para o estado.",
  metadataBase: new URL('https://vozpublicams.com.br'),
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  openGraph: {
    title: "Voz Pública MS",
    description: "Jornalismo independente para Mato Grosso do Sul",
    url: "https://vozpublicams.com.br",
    siteName: "Voz Pública MS",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Voz Pública MS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Voz Pública MS",
    description: "Jornalismo independente para Mato Grosso do Sul",
    creator: "@vozpublicams",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#0e0e0d",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} ${playfair.variable} ${sourceSerif.variable} ${jetbrainsMono.variable} bg-vp-bg text-vp-text antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
