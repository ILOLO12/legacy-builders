import type { Publisher } from "./types.ts";

export const requiredSecret = "INSTAGRAM_ACCESS_TOKEN";

export const publish: Publisher = async (article) => {
  const token = Deno.env.get(requiredSecret);
  if (!token) {
    return { ok: false, error: "Compte Instagram non connecté — ajoutez le secret INSTAGRAM_ACCESS_TOKEN." };
  }
  if (!article.image_url) {
    return { ok: false, error: "Instagram exige une image — cet article n'en a pas." };
  }

  // TODO once an Instagram Business account + Graph API token exist:
  // 1. POST /{ig-user-id}/media with image_url + caption
  // 2. POST /{ig-user-id}/media_publish with the returned creation_id
  return { ok: false, error: "Intégration Instagram pas encore implémentée (clé présente, code à compléter)." };
};
