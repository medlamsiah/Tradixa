import React from "react";
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div className="inline-flex items-center gap-2">
      <img src="/logo/logo.svg" alt="Tradexa" width={size} height={size} />
      <span className="font-extrabold tracking-tight text-slate-900">Tradexa</span>
    </div>
  );
}
