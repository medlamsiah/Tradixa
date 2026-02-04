import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getMessages } from "@/i18n/getMessages";
import { Locale } from "@/i18n/locales";

export default async function Orders({ params }: { params: { locale: Locale } }) {
  const t = getMessages(params.locale) as any;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return <main className="mx-auto max-w-3xl px-4 py-10">Veuillez vous connecter.</main>;

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return null;

  const orders = await prisma.order.findMany({ where: { clientId: user.id }, orderBy: { createdAt: "desc" } });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold">{t.dashboard.title}</h1>
        <Link href={`/${params.locale}/order/new`}><Button>{t.dashboard.new}</Button></Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr><th className="p-3 text-left">ID</th><th className="p-3 text-left">{t.dashboard.status}</th><th className="p-3 text-left">{t.dashboard.total}</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-slate-100">
                <td className="p-3 font-mono text-xs">{o.id.slice(0, 10)}…</td>
                <td className="p-3">{o.status}</td>
                <td className="p-3">{(o.totalAmount / 100).toFixed(2)} {o.currency}</td>
                <td className="p-3 text-right"><Link href={`/${params.locale}/order/${o.id}`}><Button variant="secondary">{t.dashboard.open}</Button></Link></td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td className="p-6 text-slate-600" colSpan={4}>Aucune commande pour le moment.</td></tr>}
          </tbody>
        </table>
      </div>
    </main>
  );
}
