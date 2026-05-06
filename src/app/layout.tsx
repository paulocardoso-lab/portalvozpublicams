import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
    <html lang="pt-BR" className={`dark ${playfair.variable} ${sourceSerif.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="vp-root min-h-full flex flex-col">{children}</body>
    </html>
  );
}
