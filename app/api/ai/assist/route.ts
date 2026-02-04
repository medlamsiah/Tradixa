import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const Schema = z.object({
  orderId: z.string().optional(),
  type: z.enum(["rewrite","terminology","qa"]),
  text: z.string().min(1).max(12000),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(()=> ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  await prisma.aiRequest.create({
    data: {
      userId: user.id,
      orderId: parsed.data.orderId ?? null,
      type: parsed.data.type,
      prompt: parsed.data.text.slice(0, 2000),
      result: null,
    }
  });

  const result =
`[STUB IA]
Type: ${parsed.data.type}
Branche OPENAI_API_KEY + SDK dans /app/api/ai/assist/route.ts
Texte reçu (${parsed.data.text.length} caractères).`;

  return NextResponse.json({ result });
}
