import React from "react";
import { getCharges } from "@/app/actions/charges";
import { ChargesClient } from "./ChargesClient";
import { requireAdmin } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";

export default async function ChargesPage() {
  await requireAdmin(["SUPER_ADMIN", "EDITOR_CHIEF", "SECTION_EDITOR"]);
  const charges = await getCharges();

  return (
    <div className="p-7 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-[32px] font-black leading-tight text-vp-text">Charge do Dia.</h1>
        <p className="font-serif italic text-[15px] text-vp-text-3 mt-1">
          Gerencie as charges editoriais — upload manual ou gerado por IA a partir de uma materia.
        </p>
      </div>
      <ChargesClient initialCharges={charges} />
    </div>
  );
}
