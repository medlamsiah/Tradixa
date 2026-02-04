"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function AiAssistant({ orderId }: { orderId: string }) {
  const [mode, setMode] = useState<"rewrite"|"terminology"|"qa">("rewrite");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-semibold text-slate-700">Assistant IA (aide au traducteur)</div>
          <select className="rounded-xl border border-slate-200 px-2 py-1 text-xs font-semibold" value={mode} onChange={(e)=>setMode(e.target.value as any)}>
            <option value="rewrite">Reformulation</option>
            <option value="terminology">Terminologie</option>
            <option value="qa">Vérification (QA)</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <textarea className="h-40 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm" placeholder="Collez ici votre texte…" value={input} onChange={(e)=>setInput(e.target.value)} />
        <div className="mt-3 flex justify-end">
          <Button disabled={loading || input.trim().length===0} onClick={async () => {
            setLoading(true); setOutput("");
            const res = await fetch("/api/ai/assist", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ orderId, type: mode, text: input }) });
            const j = await res.json().catch(()=>({}));
            setLoading(false);
            setOutput(j?.result ?? j?.error ?? "Erreur");
          }}>{loading ? "..." : "Générer"}</Button>
        </div>
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 whitespace-pre-wrap">
          {output || "Résultat IA apparaîtra ici (branche OPENAI_API_KEY)."}
        </div>
      </CardContent>
    </Card>
  );
}
