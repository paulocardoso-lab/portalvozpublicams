import React from "react";
import { getActiveCharge } from "@/app/actions/charges";
import { ChargeCard } from "./ChargeCard";

export async function ChargeSidebar() {
  const charge = await getActiveCharge().catch(() => null);
  if (!charge) return null;

  return (
    <ChargeCard
      id={charge.id}
      imageUrl={charge.imageUrl}
      caption={charge.caption}
      credit={charge.credit}
      publishedAt={charge.publishedAt}
    />
  );
}
