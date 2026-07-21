import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getSessionId } from "@/lib/sessionId";

/** Records a page view on every route change. Silently no-ops if the table isn't migrated yet. */
export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    supabase.from("page_views").insert({
      path: location.pathname,
      session_id: getSessionId(),
      referrer: document.referrer || null,
    }).then(({ error }) => {
      if (error) console.debug("page_views insert skipped:", error.message);
    });
  }, [location.pathname]);
}
