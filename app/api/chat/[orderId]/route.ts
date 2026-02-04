import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

export async function GET(_: Request, { params }: { params: { orderId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const chat = await prisma.chat.findUnique({
    where: { orderId: params.orderId },
    include: { messages: { include: { sender: true }, orderBy: { createdAt: "asc" } } },
  });

  return NextResponse.json({ messages: chat?.messages ?? [] });
}

const PostSchema = z.object({ content: z.string().min(1).max(2000) });

export async function POST(req: Request, { params }: { params: { orderId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const parsed = PostSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const chat = await prisma.chat.findUnique({ where: { orderId: params.orderId } });
  if (!chat) return NextResponse.json({ error: "Chat not found" }, { status: 404 });

  await prisma.message.create({ data: { chatId: chat.id, senderId: user.id, content: parsed.data.content } });
  return NextResponse.json({ ok: true });
}
