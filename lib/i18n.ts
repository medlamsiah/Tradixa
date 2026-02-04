import { Locale, locales } from "@/i18n/locales";
export function isLocale(v: string): v is Locale { return (locales as readonly string[]).includes(v); }
export function dir(locale: Locale) { return locale === "ar" ? "rtl" : "ltr"; }
