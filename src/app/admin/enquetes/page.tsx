import React from "react";
import { getPolls } from "@/app/actions/polls";
import { EnquetesClient } from "./EnquetesClient";
import { requireAdmin } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";

export default async function EnquetesAdminPage() {
  await requireAdmin(["SUPER_ADMIN", "EDITOR_CHIEF", "SECTION_EDITOR"]);
  const polls = await getPolls();

  return (
    <div className="p-7 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-[32px] font-black leading-tight text-vp-text">Enquetes.</h1>
        <p className="font-serif italic text-[15px] text-vp-text-3 mt-1">
          Consultas rápidas ao leitor — com prazo, limite de votos e proteção anti-robô.
        </p>
      </div>
      <EnquetesClient initialPolls={polls} />
    </div>
  );
}
