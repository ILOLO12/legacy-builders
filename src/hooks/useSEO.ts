import { useEffect } from "react";

const SITE_NAME = "Muller's Foundation (MUFO)";

export function useSEO(title: string, description?: string) {
  useEffect(() => {
    document.title = `${title} | ${SITE_NAME}`;

    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", description);
    }

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", window.location.origin + window.location.pathname);
  }, [title, description]);
}
