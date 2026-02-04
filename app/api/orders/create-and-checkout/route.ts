import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { z } from "zod";

const Schema = z.object({
  sourceLang: z.string().min(2).max(5),
  targetLang: z.string().min(2).max(5),
  category: z.string().min(1).max(80),
  certified: z.boolean().default(false),
  express: z.boolean().default(false),
  wordsEstimate: z.number().int().positive().max(500000),
  notes: z.string().max(2000).optional(),
  locale: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { sourceLang, targetLang, category, certified, express, wordsEstimate, notes, locale } = parsed.data;

  const base = express ? 0.18 : 0.12;
  const totalAmount = Math.round(wordsEstimate * base * 100 + (certified ? 1500 : 0));

  const order = await prisma.order.create({
    data: { clientId: user.id, sourceLang, targetLang, category, certified, express, wordsEstimate, notes: notes ?? null, totalAmount, currency: "EUR", status: "DRAFT" },
  });

  const chat = await prisma.chat.create({ data: { orderId: order.id } });
  await prisma.chatParticipant.createMany({ data: [{ chatId: chat.id, userId: user.id }], skipDuplicates: true });

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;
  if (!stripeKey || !priceId) {
    return NextResponse.json({ error: "Stripe non configuré (STRIPE_SECRET_KEY / STRIPE_PRICE_ID)." }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" } as any);
  const success = (process.env.STRIPE_SUCCESS_URL ?? `http://localhost:3000/${locale ?? "fr"}/dashboard/orders`) + `&order=${order.id}`;
  const cancel = process.env.STRIPE_CANCEL_URL ?? `http://localhost:3000/${locale ?? "fr"}/order/new`;

  const sessionStripe = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: success,
    cancel_url: cancel,
    metadata: { orderId: order.id },
  });

  await prisma.payment.create({ data: { orderId: order.id, stripeSessionId: sessionStripe.id, status: "pending" } });
  return NextResponse.json({ url: sessionStripe.url });
}
