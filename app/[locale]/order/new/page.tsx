"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getMessages } from "@/i18n/getMessages";
import { Locale } from "@/i18n/locales";

const LANGS = ["FR","EN","AR","ES","DE","IT"];

export default function NewOrder({ params }: { params: { locale: Locale } }) {
  const t = getMessages(params.locale) as any;
  const [sourceLang, setSourceLang] = useState("FR");
  const [targetLang, setTargetLang] = useState("EN");
  const [category, setCategory] = useState("general");
  const [certified, setCertified] = useState(false);
  const [express, setExpress] = useState(false);
  const [wordsEstimate, setWordsEstimate] = useState(500);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const base = express ? 0.18 : 0.12;
  const total = Math.round(wordsEstimate * base * 100 + (certified ? 1500 : 0));
  const display = (total / 100).toFixed(2);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-extrabold">{t.order.newTitle}</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold">{t.order.sourceLang}</label>
          <select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={sourceLang} onChange={(e)=>setSourceLang(e.target.value)}>
            {LANGS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold">{t.order.targetLang}</label>
          <select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={targetLang} onChange={(e)=>setTargetLang(e.target.value)}>
            {LANGS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold">{t.order.category}</label>
          <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={category} onChange={(e)=>setCategory(e.target.value)} />
        </div>

        <div className="sm:col-span-2 flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={certified} onChange={(e)=>setCertified(e.target.checked)} />{t.order.certified}</label>
          <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={express} onChange={(e)=>setExpress(e.target.checked)} />{t.order.express}</label>
        </div>

        <div>
          <label className="block text-sm font-semibold">{t.order.words}</label>
          <input type="number" min={1} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={wordsEstimate} onChange={(e)=>setWordsEstimate(parseInt(e.target.value || "0",10))} />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold">{t.order.notes}</label>
          <textarea className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" rows={4} value={notes} onChange={(e)=>setNotes(e.target.value)} />
        </div>

        <div className="sm:col-span-2 flex items-center justify-between rounded-2xl border border-slate-200 bg-skybrand-50 p-4">
          <div className="text-sm text-slate-700">
            <div className="font-semibold">Total estimé</div>
            <div>{display} €</div>
          </div>

          <Button disabled={loading || sourceLang===targetLang} onClick={async () => {
            setLoading(true);
            const res = await fetch("/api/orders/create-and-checkout", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ sourceLang, targetLang, category, certified, express, wordsEstimate, notes, locale: params.locale }) });
            const j = await res.json().catch(()=>({}));
            setLoading(false);
            if (j?.url) window.location.href = j.url;
            else alert(j?.error ?? "Erreur");
          }}>{t.order.create}</Button>
        </div>
      </div>
    </main>
  );
}
