"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { PodcastProvider } from "@/components/podcast/PodcastContext";
import { PodcastPlayerBar } from "@/components/podcast/PodcastPlayerBar";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PodcastProvider>
        {children}
        <PodcastPlayerBar />
      </PodcastProvider>
    </SessionProvider>
  );
}
