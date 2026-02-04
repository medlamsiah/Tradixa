import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Locale } from "@/i18n/locales";

export default async function Admin({ params }: { params: { locale: Locale } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return <main className="mx-auto max-w-5xl px-4 py-10">Veuillez vous connecter.</main>;

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || user.role !== "ADMIN") return <main className="mx-auto max-w-5xl px-4 py-10">Accès admin requis.</main>;

  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { client: true } });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-extrabold">Admin</h1>
      <p className="mt-2 text-sm text-slate-600">Liste des 50 dernières commandes.</p>
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50"><tr><th className="p-3 text-left">Commande</th><th className="p-3 text-left">Client</th><th className="p-3 text-left">Statut</th><th className="p-3 text-left">Total</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-slate-100">
                <td className="p-3 font-mono text-xs">{o.id.slice(0,10)}…</td>
                <td className="p-3">{o.client.email}</td>
                <td className="p-3">{o.status}</td>
                <td className="p-3">{(o.totalAmount/100).toFixed(2)} {o.currency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
