import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Locale } from "@/i18n/locales";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AiAssistant } from "@/components/translator/ai-assistant";

export default async function Workspace({ params }: { params: { locale: Locale; orderId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return <main className="mx-auto max-w-5xl px-4 py-10">Veuillez vous connecter.</main>;

  const user = await prisma.user.findUnique({ where: { email: session.user.email }, include: { translatorProfile: true } });
  if (!user || user.role !== "TRANSLATOR") return <main className="mx-auto max-w-5xl px-4 py-10">Accès traducteur requis.</main>;

  const order = await prisma.order.findUnique({ where: { id: params.orderId } });
  if (!order) return <main className="mx-auto max-w-5xl px-4 py-10">Commande introuvable.</main>;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-extrabold">Workspace traduction</h1>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><div className="text-sm font-semibold text-slate-700">Texte source (à brancher)</div></CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">Ajoute ici l’extraction du document (PDF/DOCX/OCR) + segmentations.</p>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">Astuce: colle le texte source dans l’assistant IA à droite.</div>
          </CardContent>
        </Card>
        <AiAssistant orderId={order.id} />
      </div>
    </main>
  );
}
