import { NextResponse } from "next/server";
import { cookies } from "next/headers";
export async function POST() {
  const jar = cookies();
  for (const c of jar.getAll()) {
    if (c.name.toLowerCase().includes("next-auth")) jar.set(c.name, "", { maxAge: 0 });
  }
  return NextResponse.redirect(new URL("/fr", process.env.NEXTAUTH_URL ?? "http://localhost:3000"));
}
