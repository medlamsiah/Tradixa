"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getMessages } from "@/i18n/getMessages";
import { Locale } from "@/i18n/locales";

export default function Register({ params }: { params: { locale: Locale } }) {
  const t = getMessages(params.locale) as any;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CLIENT" | "TRANSLATOR">("CLIENT");
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-extrabold">{t.nav.register}</h1>
      <div className="mt-6 space-y-3">
        <label className="block text-sm font-semibold">{t.auth.name}</label>
        <input className="w-full rounded-xl border border-slate-200 px-3 py-2" value={name} onChange={(e)=>setName(e.target.value)} />
        <label className="block text-sm font-semibold">{t.auth.email}</label>
        <input className="w-full rounded-xl border border-slate-200 px-3 py-2" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <label className="block text-sm font-semibold">{t.auth.password}</label>
        <input className="w-full rounded-xl border border-slate-200 px-3 py-2" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />

        <label className="block text-sm font-semibold">{t.auth.role}</label>
        <select className="w-full rounded-xl border border-slate-200 px-3 py-2" value={role} onChange={(e)=>setRole(e.target.value as any)}>
          <option value="CLIENT">{t.auth.client}</option>
          <option value="TRANSLATOR">{t.auth.translator}</option>
        </select>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button className="w-full" onClick={async () => {
          setError(null);
          const res = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password, role }) });
          const j = await res.json().catch(()=>({}));
          if (!res.ok) setError(j?.error ?? "Erreur.");
          else window.location.href = `/${params.locale}/auth/login`;
        }}>{t.auth.submit}</Button>
      </div>
    </main>
  );
}
