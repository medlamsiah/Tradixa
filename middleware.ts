import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["fr", "en", "ar"] as const;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const hasLocale = LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `/fr${pathname}`;
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/((?!_next|api|.*\..*).*)"] };
