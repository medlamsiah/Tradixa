import React from "react";
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" };
export function Button({ variant = "primary", className = "", ...props }: Props) {
  const base = "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition shadow-sm focus:outline-none focus:ring-2 focus:ring-skybrand-400";
  const styles = {
    primary: "bg-skybrand-600 text-white hover:bg-skybrand-700",
    secondary: "bg-skybrand-50 text-skybrand-900 hover:bg-skybrand-100",
    ghost: "bg-transparent text-skybrand-700 hover:bg-skybrand-50",
  } as const;
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />;
}
