"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Locale } from "@/i18n/locales";
import { getMessages } from "@/i18n/getMessages";

type Msg = { id: string; content: string; createdAt: string | Date; sender?: { name: string | null; email: string } };

export function ChatBox({ locale, orderId, initialMessages }: { locale: Locale; orderId: string; initialMessages: Msg[] }) {
  const t = getMessages(locale) as any;
  const [messages, setMessages] = useState<Msg[]>(() => initialMessages as any);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const id = setInterval(async () => {
      const res = await fetch(`/api/chat/${orderId}`);
      if (res.ok) {
        const j = await res.json();
        setMessages(j.messages);
      }
    }, 4000);
    return () => clearInterval(id);
  }, [orderId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages.length]);

  return (
    <div className="flex h-[420px] flex-col">
      <div className="flex-1 overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <div className="space-y-2">
          {messages.map((m) => (
            <div key={m.id} className="rounded-2xl bg-white p-3 shadow-sm">
              <div className="text-xs font-semibold text-slate-600">{m.sender?.name ?? m.sender?.email ?? "User"}</div>
              <div className="text-sm text-slate-900">{m.content}</div>
            </div>
          ))}
          {messages.length === 0 && <div className="text-sm text-slate-600">Aucun message.</div>}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <input className="flex-1 rounded-xl border border-slate-200 px-3 py-2" value={text} onChange={(e)=>setText(e.target.value)} placeholder="Message…" />
        <Button onClick={async () => {
          const value = text.trim(); if (!value) return;
          setText("");
          await fetch(`/api/chat/${orderId}`, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ content: value }) });
          const res = await fetch(`/api/chat/${orderId}`); if (res.ok) setMessages((await res.json()).messages);
        }}>{t.order.send}</Button>
      </div>
    </div>
  );
}
