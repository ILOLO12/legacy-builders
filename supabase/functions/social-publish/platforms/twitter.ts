import type { Publisher } from "./types.ts";

export const requiredSecret = "TWITTER_BEARER_TOKEN";

export const publish: Publisher = async (article) => {
  const token = Deno.env.get(requiredSecret);
  if (!token) {
    return { ok: false, error: "Compte X/Twitter non connecté — ajoutez le secret TWITTER_BEARER_TOKEN (nécessite un abonnement API X payant)." };
  }

  // TODO once a paid X API plan + OAuth 2.0 user context token exist:
  // POST https://api.twitter.com/2/tweets with the article title + link.
  return { ok: false, error: "Intégration X/Twitter pas encore implémentée (clé présente, code à compléter)." };
};
