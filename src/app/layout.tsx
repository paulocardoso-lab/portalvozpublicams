import { Inter, Playfair_Display, Source_Serif_4, JetBrains_Mono, Outfit } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import React from 'react';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Voz Pública MS",
  description: "Jornalismo independente para Mato Grosso do Sul",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} ${playfair.variable} ${sourceSerif.variable} ${jetbrainsMono.variable} ${outfit.variable} bg-vp-bg text-vp-text antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
