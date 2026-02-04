import "@/app/globals.css";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { TopNav } from "@/components/nav/top-nav";
import { dir, isLocale } from "@/lib/i18n";
import { getMessages } from "@/i18n/getMessages";
import { Locale } from "@/i18n/locales";

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? (params.locale as Locale) : "fr";
  // messages loaded to keep locale validated; you can integrate next-intl provider later if you want.
  getMessages(locale);

  const session = await getServerSession(authOptions);

  return (
    <html lang={locale} dir={dir(locale)}>
      <body>
        <TopNav locale={locale} session={session} />
        {children}
      </body>
    </html>
  );
}
