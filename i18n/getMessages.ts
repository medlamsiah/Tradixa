import { Locale } from "./locales";
import fr from "./messages/fr.json";
import en from "./messages/en.json";
import ar from "./messages/ar.json";

export function getMessages(locale: Locale) {
  if (locale === "en") return en;
  if (locale === "ar") return ar;
  return fr;
}
