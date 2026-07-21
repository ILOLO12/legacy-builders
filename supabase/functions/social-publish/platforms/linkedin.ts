import type { Publisher } from "./types.ts";

export const requiredSecret = "LINKEDIN_ACCESS_TOKEN";

export const publish: Publisher = async (article) => {
  const token = Deno.env.get(requiredSecret);
  if (!token) {
    return { ok: false, error: "Compte LinkedIn non connecté — ajoutez le secret LINKEDIN_ACCESS_TOKEN." };
  }

  // TODO once a LinkedIn developer app with Community Management API access exists:
  // POST https://api.linkedin.com/v2/ugcPosts with the organization URN + article text/link.
  return { ok: false, error: "Intégration LinkedIn pas encore implémentée (clé présente, code à compléter)." };
};
