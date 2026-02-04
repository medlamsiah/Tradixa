import { Background } from "@/components/brand/background";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getMessages } from "@/i18n/getMessages";
import { Locale } from "@/i18n/locales";
import Link from "next/link";

export default function Home({ params }: { params: { locale: Locale } }) {
  const t = getMessages(params.locale) as any;

  return (
    <main className="relative">
      <Background />
      <section className="relative mx-auto max-w-6xl px-4 pt-12 pb-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">{t.hero.title}</h1>
            <p className="mt-4 text-lg text-slate-700">{t.hero.subtitle}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/${params.locale}/order/new`}><Button>{t.hero.cta}</Button></Link>
              <a href="#pricing"><Button variant="secondary">{t.hero.cta2}</Button></a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[t.features.f1,t.features.f2,t.features.f3,t.features.f4].map((x: string) => (
                <div key={x} className="flex items-start gap-2 rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm">
                  <div className="mt-1 h-2 w-2 rounded-full bg-skybrand-500" />
                  <div className="text-sm font-semibold text-slate-800">{x}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-slate-200 bg-white/70 p-5 shadow-sm">
              <img src="/images/hero-ai-placeholder.svg" alt="AI illustration" className="w-full rounded-2xl" />
            </div>
            <div className="pointer-events-none absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-skybrand-200/70 blur-2xl" />
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-2xl font-extrabold text-slate-900">{t.pricing.title}</h2>
        <p className="mt-2 text-sm text-slate-600">{t.pricing.note}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent>
              <div className="text-lg font-extrabold text-slate-900">{t.pricing.starter}</div>
              <div className="mt-2 text-sm text-slate-700">0,12€ / mot • 48h–72h</div>
              <div className="mt-4"><Link href={`/${params.locale}/order/new`}><Button variant="secondary">{t.hero.cta}</Button></Link></div>
            </CardContent>
          </Card>
          <Card className="border-skybrand-200">
            <CardContent>
              <div className="text-lg font-extrabold text-slate-900">{t.pricing.pro}</div>
              <div className="mt-2 text-sm text-slate-700">0,18€ / mot • 24h</div>
              <div className="mt-4"><Link href={`/${params.locale}/order/new`}><Button>{t.hero.cta}</Button></Link></div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
