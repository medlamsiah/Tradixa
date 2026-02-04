export function Background() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-24 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-skybrand-200/60 blur-3xl" />
      <div className="absolute top-40 left-1/2 h-[360px] w-[720px] -translate-x-1/2 rounded-full bg-skybrand-400/20 blur-3xl" />
      <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(14,165,233,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,165,233,0.08)_1px,transparent_1px)] [background-size:56px_56px]" />
    </div>
  );
}
