import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMessages } from "@/i18n/getMessages";
import { Locale } from "@/i18n/locales";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChatBox } from "@/components/chat/chat-box";

export default async function OrderDetail({ params }: { params: { locale: Locale; id: string } }) {
  const t = getMessages(params.locale) as any;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return <main className="mx-auto max-w-4xl px-4 py-10">Veuillez vous connecter.</main>;

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return null;

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { chat: { include: { messages: { include: { sender: true }, orderBy: { createdAt: "asc" } } } } },
  });

  if (!order || order.clientId !== user.id) return <main className="mx-auto max-w-4xl px-4 py-10">Commande introuvable.</main>;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-extrabold">{t.order.detail}</h1>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader><div className="text-sm font-semibold text-slate-700">Résumé</div></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><span className="font-semibold">Statut:</span> {order.status}</div>
            <div><span className="font-semibold">Langues:</span> {order.sourceLang} → {order.targetLang}</div>
            <div><span className="font-semibold">Catégorie:</span> {order.category}</div>
            <div><span className="font-semibold">Total:</span> {(order.totalAmount/100).toFixed(2)} {order.currency}</div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><div className="text-sm font-semibold text-slate-700">{t.order.chat}</div></CardHeader>
          <CardContent>
            <ChatBox locale={params.locale} orderId={order.id} initialMessages={order.chat?.messages ?? []} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
