import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

/** Simple fixed-window rate limit per client session. Fails open (allows the
 * request) if the table isn't migrated yet or on any unexpected error. */
async function checkRateLimit(supabase: ReturnType<typeof createClient>, sessionId: string): Promise<boolean> {
  try {
    const { data: row } = await supabase.from("chat_rate_limit").select("*").eq("session_id", sessionId).maybeSingle();
    const now = Date.now();

    if (!row || now - new Date(row.window_start).getTime() > RATE_LIMIT_WINDOW_MS) {
      await supabase.from("chat_rate_limit").upsert({ session_id: sessionId, window_start: new Date().toISOString(), count: 1 });
      return true;
    }

    if (row.count >= RATE_LIMIT_MAX) return false;

    await supabase.from("chat_rate_limit").update({ count: row.count + 1 }).eq("session_id", sessionId);
    return true;
  } catch {
    return true;
  }
}

async function logError(supabase: ReturnType<typeof createClient>, message: string, context: Record<string, unknown>) {
  await supabase.from("error_logs").insert({ source: "chat-assistant", message, context }).then(() => {}, () => {});
}

async function buildSystemPrompt(supabase: ReturnType<typeof createClient>): Promise<string> {
  const [{ data: settings }, { data: activities }, { data: articles }, { data: events }] = await Promise.all([
    supabase.from("site_settings").select("key,value"),
    supabase.from("activities").select("title,category,year").order("display_order").limit(10),
    supabase.from("articles").select("title,excerpt").eq("published", true).order("published_at", { ascending: false }).limit(5),
    supabase.from("events").select("title,event_date,location").order("event_date").limit(5),
  ]);

  const s: Record<string, string> = {};
  for (const row of settings ?? []) if (row.value) s[row.key] = row.value;

  const orgName = s.site_name || "MUFO";
  const tagline = s.site_tagline || "Muller's Foundation";
  const email = s.contact_email || "info@mullersfoundation.org";
  const phone = s.contact_phone || "";

  const timeline = (activities ?? []).filter((a) => a.category === "timeline")
    .map((a) => `- ${a.year ?? ""} ${a.title}`).join("\n");
  const projects = (activities ?? []).filter((a) => a.category === "project")
    .map((a) => `- ${a.title}`).join("\n");
  const news = (articles ?? []).map((a) => `- ${a.title}: ${a.excerpt ?? ""}`).join("\n");
  const upcoming = (events ?? []).map((e) =>
    `- ${e.title}${e.event_date ? " (" + new Date(e.event_date).toLocaleDateString() + ")" : ""}${e.location ? " @ " + e.location : ""}`
  ).join("\n");

  return `Tu es l'assistant virtuel officiel du site web de ${orgName} (${tagline}), une organisation humanitaire internationale fondée en 2021, basée à Kinshasa, en République Démocratique du Congo, avec des représentations aux États-Unis, en France et au Canada.

MISSION : Transformer le potentiel inexploité en opportunité durable à travers des programmes structurés en éducation, santé communautaire et développement durable.

LES TROIS PILIERS :
1. Éducation — programmes éducatifs et de mentorat pour enfants et jeunes
2. Santé communautaire — services de santé essentiels pour les communautés défavorisées
3. Philanthropie & Développement — initiatives de développement communautaire durable

CHRONOLOGIE / ACTIVITÉS :
${timeline || "(à compléter)"}

PROJETS PHARES :
${projects || "(à compléter)"}

ACTUALITÉS RÉCENTES :
${news || "(aucune actualité publiée pour le moment)"}

ÉVÉNEMENTS À VENIR :
${upcoming || "(aucun événement programmé pour le moment)"}

COMMENT FAIRE UN DON : virement bancaire, Mobile Money (M-Pesa, Orange Money, Airtel Money), PayPal, ou Zelle (US). La page /donate présente ces options avec la répartition des fonds (Éducation, Santé, Philanthropie, Administration).

ADHÉSION : trois paliers (Standard, Supporter, Ambassadeur) sur la page /membership, avec des avantages croissants (newsletter, rapport annuel, invitations, reconnaissance, tableau de bord d'impact personnel, etc.).

CONTACT : ${email}${phone ? " / " + phone : ""} — formulaire disponible sur /contact.

RÔLE : Réponds aux questions des visiteurs sur MUFO de façon chaleureuse, concise et professionnelle, en français ou en anglais selon la langue du visiteur. Oriente-les vers les bonnes pages du site (/donate, /membership, /contact, /activities, /news, /team, /founder, /history) quand c'est pertinent. Si tu ne connais pas une information précise (montants exacts, coordonnées bancaires détaillées, etc.), invite poliment le visiteur à utiliser le formulaire de contact plutôt que d'inventer une réponse. Ne donne jamais de conseils médicaux, juridiques ou financiers personnalisés. Reste toujours dans le rôle de l'assistant MUFO.

FORMAT : Réponds en texte brut uniquement. N'utilise aucune syntaxe Markdown (pas d'astérisques pour le gras, pas de dièses pour les titres, pas de tirets pour les listes) — l'interface qui affiche tes réponses ne l'interprète pas. Pour une liste, utilise des sauts de ligne simples ou des numéros suivis d'un point.`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  try {
    const { messages, session_id }: { messages: ChatMessage[]; session_id?: string } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages requis" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (session_id && !(await checkRateLimit(supabase, session_id))) {
      return new Response(JSON.stringify({ error: "Trop de messages envoyés, réessayez dans quelques minutes." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "L'assistant virtuel est temporairement indisponible. Merci de réessayer plus tard." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = await buildSystemPrompt(supabase);

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: systemPrompt }, ...messages.slice(-12)],
      }),
    });

    if (aiResponse.status === 429) {
      return new Response(JSON.stringify({ error: "Trop de demandes, réessayez dans un instant." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (aiResponse.status === 402) {
      return new Response(JSON.stringify({ error: "Crédits IA épuisés pour ce projet." }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!aiResponse.ok) {
      const text = await aiResponse.text();
      console.error("AI gateway error", aiResponse.status, text);
      await logError(supabase, `AI gateway error ${aiResponse.status}`, { body: text });
      return new Response(JSON.stringify({ error: "Erreur du service IA." }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiResponse.json();
    const reply = data.choices?.[0]?.message?.content ?? "Désolé, je n'ai pas pu générer de réponse.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("chat-assistant error", e);
    await logError(supabase, e instanceof Error ? e.message : "Erreur inconnue", {});
    return new Response(JSON.stringify({ error: "Erreur interne." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
