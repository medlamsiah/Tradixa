import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const Schema = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email(),
  password: z.string().min(6).max(72),
  role: z.enum(["CLIENT","TRANSLATOR"]).default("CLIENT"),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });

  const { name, email, password, role } = parsed.data;
  const lower = email.toLowerCase();

  const exists = await prisma.user.findUnique({ where: { email: lower } });
  if (exists) return NextResponse.json({ error: "Email déjà utilisé." }, { status: 409 });

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email: lower, password: hash, role: role as any } });

  if (role === "TRANSLATOR") {
    await prisma.translatorProfile.create({ data: { userId: user.id, languages: "FR>EN, EN>FR, AR>FR", specialties: "general" } });
  }

  return NextResponse.json({ ok: true });
}
