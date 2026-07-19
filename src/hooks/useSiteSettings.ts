import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";

export const SITE_SETTINGS_DEFAULTS = {
  site_name: "MUFO",
  site_tagline: "Muller's Foundation",
  logo_url: "",
  contact_email: "info@mullersfoundation.org",
  contact_phone: "+243 000 000 000",
  footer_hq_text: "Kinshasa, DR Congo",
  footer_regions_text: "USA · France · Canada",
  social_facebook: "",
  social_twitter: "",
  social_instagram: "",
  social_linkedin: "",
  social_youtube: "",
} as const;

export type SiteSettings = typeof SITE_SETTINGS_DEFAULTS;

export function useSiteSettings(): SiteSettings {
  const { data } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("key,value");
      if (error) throw error;
      return data;
    },
    staleTime: 30_000,
  });

  return useMemo(() => {
    const merged: Record<string, string> = { ...SITE_SETTINGS_DEFAULTS };
    for (const row of data ?? []) {
      if (row.value != null && row.value.trim() !== "") merged[row.key] = row.value;
    }
    return merged as SiteSettings;
  }, [data]);
}
