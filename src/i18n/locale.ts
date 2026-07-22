import type { Lang } from "./LanguageContext";

const LOCALE_MAP: Record<Lang, string> = {
  en: "en-US",
  fr: "fr-FR",
  es: "es-ES",
  de: "de-DE",
  pt: "pt-PT",
  it: "it-IT",
};

export function localeFor(lang: Lang): string {
  return LOCALE_MAP[lang] ?? "en-US";
}
