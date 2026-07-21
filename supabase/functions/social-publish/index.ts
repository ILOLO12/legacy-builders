import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { publish as publishFacebook, requiredSecret as fbSecret } from "./platforms/facebook.ts";
import { publish as publishInstagram, requiredSecret as igSecret } from "./platforms/instagram.ts";
import { publish as publishLinkedin, requiredSecret as liSecret } from "./platforms/linkedin.ts";
import { publish as publishTwitter, requiredSecret as twSecret } from "./platforms/twitter.ts";
import type { ArticleForPublishing, Publisher } from "./platforms/types.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

// Adding a new platform = one file in ./platforms + one entry here.
const PUBLISHERS: Record<string, { publish: Publisher; requiredSecret: string }> = {
  facebook: { publish: publishFacebook, requiredSecret: fbSecret },
  instagram: { publish: publishInstagram, requiredSecret: igSecret },
  linkedin: { publish: publishLinkedin, requiredSecret: liSecret },
  twitter: { publish: publishTwitter, requiredSecret: twSecret },
};

const MAX_ATTEMPTS = 3;

async function isAdmin(supabase: ReturnType<typeof createClient>, authHeader: string | null): Promise<boolean> {
  if (!authHeader) return false;
  const token = authHeader.replace("Bearer ", "");
  const { data: userData } = await supabase.auth.getUser(token);
  if (!userData?.user) return false;
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userData.user.id)
    .eq("role", "admin")
    .maybeSingle();
  return !!data;
}

async function attemptPublish(
  supabase: ReturnType<typeof createClient>,
  logId: string,
  platform: string,
  article: ArticleForPublishing,
) {
  const entry = PUBLISHERS[platform];
  const result = entry
    ? await entry.publish(article).catch((e) => ({ ok: false, error: e instanceof Error ? e.message : "Erreur inconnue" }))
    : { ok: false, error: `Plateforme inconnue: ${platform}` };

  await supabase.from("social_publish_log").update({
    status: result.ok ? "success" : "failed",
    error_message: result.ok ? null : result.error,
    updated_at: new Date().toISOString(),
  }).eq("id", logId);

  if (!result.ok) {
    await supabase.from("error_logs").insert({
      source: "social-publish",
      message: result.error ?? "Publication échouée",
      context: { platform, article_slug: article.slug },
    }).then(() => {}, () => {}); // error_logs may not exist yet — never let logging break the flow
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  try {
    const body = await req.json().catch(() => ({}));

    // Cron-triggered retry pass: re-attempt failed rows under the attempt limit.
    if (body.mode === "retry") {
      const { data: pending } = await supabase
        .from("social_publish_log")
        .select("id, platform, attempt_count, articles(title, title_fr, excerpt, excerpt_fr, slug, image_url)")
        .eq("status", "failed")
        .lt("attempt_count", MAX_ATTEMPTS);

      for (const row of pending ?? []) {
        const article = row.articles as unknown as ArticleForPublishing | null;
        if (!article) continue;
        await supabase.from("social_publish_log").update({ attempt_count: (row.attempt_count ?? 0) + 1 }).eq("id", row.id);
        await attemptPublish(supabase, row.id as string, row.platform as string, article);
      }

      return new Response(JSON.stringify({ retried: pending?.length ?? 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Normal publish request — admin only.
    if (!(await isAdmin(supabase, req.headers.get("Authorization")))) {
      return new Response(JSON.stringify({ error: "Accès réservé aux administrateurs." }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { article_id, platforms } = body as { article_id: string; platforms: string[] };
    if (!article_id || !Array.isArray(platforms) || platforms.length === 0) {
      return new Response(JSON.stringify({ error: "article_id et platforms sont requis." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: article, error: articleError } = await supabase
      .from("articles")
      .select("title, title_fr, excerpt, excerpt_fr, slug, image_url")
      .eq("id", article_id)
      .single();

    if (articleError || !article) {
      return new Response(JSON.stringify({ error: "Article introuvable." }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results: Record<string, { ok: boolean; error?: string }> = {};

    for (const platform of platforms) {
      const { data: logRow } = await supabase
        .from("social_publish_log")
        .insert({ article_id, platform, status: "pending", attempt_count: 1 })
        .select("id")
        .single();

      if (!logRow) continue;

      const entry = PUBLISHERS[platform];
      const result = entry
        ? await entry.publish(article as ArticleForPublishing).catch((e) => ({ ok: false, error: e instanceof Error ? e.message : "Erreur inconnue" }))
        : { ok: false, error: `Plateforme inconnue: ${platform}` };

      await supabase.from("social_publish_log").update({
        status: result.ok ? "success" : "failed",
        error_message: result.ok ? null : result.error,
        updated_at: new Date().toISOString(),
      }).eq("id", logRow.id);

      results[platform] = result;
    }

    // The article itself is already published on the site independently of
    // what happens here — a social failure never rolls that back.
    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("social-publish error", e);
    await supabase.from("error_logs").insert({
      source: "social-publish",
      message: e instanceof Error ? e.message : "Erreur inconnue",
      context: {},
    }).then(() => {}, () => {});
    return new Response(JSON.stringify({ error: "Erreur interne." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
