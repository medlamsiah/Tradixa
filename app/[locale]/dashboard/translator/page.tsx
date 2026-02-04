import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Locale } from "@/i18n/locales";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function TranslatorDash({ params }: { params: { locale: Locale } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return <main className="mx-auto max-w-4xl px-4 py-10">Veuillez vous connecter.</main>;

  const user = await prisma.user.findUnique({ where: { email: session.user.email }, include: { translatorProfile: true } });
  if (!user || user.role !== "TRANSLATOR" || !user.translatorProfile) return <main className="mx-auto max-w-4xl px-4 py-10">Accès traducteur requis.</main>;

  const assignments = await prisma.order.findMany({ where: { translatorId: user.translatorProfile.id }, orderBy: { createdAt: "desc" } });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Espace traducteur</h1>
        <Link href={`/${params.locale}/dashboard/orders`}><Button variant="secondary">Dashboard client</Button></Link>
      </div>
      <div className="mt-6 space-y-3">
        {assignments.map((o) => (
          <div key={o.id} className="rounded-2xl border border-slate-200 p-4">
            <div className="text-sm font-semibold">{o.sourceLang} → {o.targetLang} • {o.category}</div>
            <div className="text-xs text-slate-600">Statut: {o.status}</div>
            <div className="mt-3"><Link href={`/${params.locale}/workspace/${o.id}`}><Button>Ouvrir workspace</Button></Link></div>
          </div>
        ))}
        {assignments.length === 0 && <div className="text-sm text-slate-600">Aucune mission pour le moment.</div>}
      </div>
    </main>
  );
}
