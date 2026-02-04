"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { getMessages } from "@/i18n/getMessages";
import { Locale } from "@/i18n/locales";

export default function Login({ params }: { params: { locale: Locale } }) {
  const t = getMessages(params.locale) as any;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-extrabold">{t.nav.login}</h1>
      <div className="mt-6 space-y-3">
        <label className="block text-sm font-semibold">{t.auth.email}</label>
        <input className="w-full rounded-xl border border-slate-200 px-3 py-2" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <label className="block text-sm font-semibold">{t.auth.password}</label>
        <input className="w-full rounded-xl border border-slate-200 px-3 py-2" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button className="w-full" onClick={async () => {
          setError(null);
          const res = await signIn("credentials", { email, password, redirect: false });
          if (res?.error) setError("Identifiants invalides.");
          else window.location.href = `/${params.locale}/dashboard/orders`;
        }}>{t.auth.submit}</Button>
      </div>
    </main>
  );
}
