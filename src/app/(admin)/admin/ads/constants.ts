export const AD_SLOTS = [
  "Leaderboard topo (728×90)",
  "Billboard inline (970×120)",
  "Retângulo sidebar (300×250)",
  "Skyscraper (300×600)",
  "Nativo in-feed",
] as const;

export type AdSlot = typeof AD_SLOTS[number];
