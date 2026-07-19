import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import { useMemo } from "react";

/**
 * Fetches CMS overrides for a page slug and merges them onto the i18n
 * translation object. Any non-empty field in the DB replaces the translation.
 */
export function usePageContent<T extends Record<string, string>>(
  slug: string,
  fallback: T,
): T {
  const { lang } = useLanguage();

  const { data } = useQuery({
    queryKey: ["page-content", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("content")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return (data?.content as Record<string, Record<string, string>>) ?? {};
    },
    staleTime: 30_000,
  });

  return useMemo(() => {
    const overrides = data?.[lang] ?? {};
    const merged: Record<string, string> = { ...fallback };
    for (const [k, v] of Object.entries(overrides)) {
      if (typeof v === "string" && v.trim() !== "") merged[k] = v;
    }
    return merged as T;
  }, [data, lang, fallback]);
}
