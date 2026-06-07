import React from "react";
import { getAdminVoices } from "@/app/actions/voices";
import { VozesClient } from "./VozesClient";
import { requireAdmin } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";

export default async function VozesAdminPage() {
  await requireAdmin(["SUPER_ADMIN", "EDITOR_CHIEF", "SECTION_EDITOR"]);
  const voices = await getAdminVoices();

  return (
    <div className="p-7 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-[32px] font-black leading-tight text-vp-text">Vozes.</h1>
        <p className="font-serif italic text-[15px] text-vp-text-3 mt-1">
          Fragmentos enigmaticos de bastidores. Curtos, densos, sem autoria.
        </p>
      </div>
      <VozesClient initialVoices={voices} />
    </div>
  );
}
