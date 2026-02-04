import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Locale } from "@/i18n/locales";
import { getMessages } from "@/i18n/getMessages";

export function TopNav({ locale, session }: { locale: Locale; session: any }) {
  const t = getMessages(locale) as any;
  return (
    <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href={`/${locale}`} className="flex items-center"><Logo /></Link>

        <div className="flex items-center gap-2">
          <LangSwitch locale={locale} />
          {session?.user ? (
            <>
              <Link href={`/${locale}/dashboard/orders`}><Button variant="secondary">{t.nav.dashboard}</Button></Link>
              <form action={`/${locale}/auth/logout`} method="post">
                <Button type="submit" variant="ghost">{t.nav.logout}</Button>
              </form>
            </>
          ) : (
            <>
              <Link href={`/${locale}/auth/login`}><Button variant="ghost">{t.nav.login}</Button></Link>
              <Link href={`/${locale}/auth/register`}><Button>{t.nav.register}</Button></Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function LangSwitch({ locale }: { locale: Locale }) {
  const options: Locale[] = ["fr","en","ar"];
  return (
    <div className="hidden sm:flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-1 py-1">
      {options.map((l) => (
        <Link key={l} className={`rounded-lg px-2 py-1 text-xs font-semibold ${l===locale ? "bg-skybrand-600 text-white" : "text-slate-700 hover:bg-skybrand-50"}`} href={`/${l}`}>
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
