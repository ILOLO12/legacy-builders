import type { Publisher } from "./types.ts";

export const requiredSecret = "FACEBOOK_PAGE_TOKEN";

export const publish: Publisher = async (article) => {
  const token = Deno.env.get(requiredSecret);
  if (!token) {
    return { ok: false, error: "Compte Facebook non connecté — ajoutez le secret FACEBOOK_PAGE_TOKEN." };
  }

  // TODO once a Meta developer app + Page access token exist:
  // POST https://graph.facebook.com/v19.0/{page-id}/feed
  //   with message + link, Authorization via the page token above.
  return { ok: false, error: "Intégration Facebook pas encore implémentée (clé présente, code à compléter)." };
};
