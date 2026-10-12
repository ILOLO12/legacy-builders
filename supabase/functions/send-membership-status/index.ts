// Emails a membership applicant when an admin/editor approves or rejects
// their request. Admin/editor-only (checked via the caller's JWT).
// Requires RESEND_API_KEY — no-ops gracefully if absent.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("MEMBERSHIP_EMAIL_FROM") || "MUFO <onboarding@resend.dev>";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

async function hasEditorAccess(supabase: ReturnType<typeof createClient>, authHeader: string | null): Promise<boolean> {
  if (!authHeader) return false;
  const token = authHeader.replace("Bearer ", "");
  const { data: userData } = await supabase.auth.getUser(token);
  if (!userData?.user) return false;
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userData.user.id)
    .in("role", ["admin", "editor"]);
  return !!data && data.length > 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  try {
    if (!(await hasEditorAccess(supabase, req.headers.get("Authorization")))) {
      return new Response(JSON.stringify({ error: "Accès réservé aux administrateurs et éditeurs." }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { name, email, status } = await req.json();
    if (!name || !email || !["approved", "rejected"].includes(status)) {
      return new Response(JSON.stringify({ error: "name, email et status (approved|rejected) sont requis." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Post-payment activation switch (Admin -> Paramètres, super-admin only).
    const { data: notifRow } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "notifications_enabled")
      .maybeSingle();
    if (notifRow?.value !== "true") {
      return new Response(JSON.stringify({ sent: false, reason: "notifications_disabled" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ sent: false, reason: "not_configured" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const approved = status === "approved";
    const html = `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color:#1a2b4c;">${approved ? "Votre adhésion a été acceptée !" : "Concernant votre demande d'adhésion"}</h2>
        <p>Bonjour ${name},</p>
        ${
          approved
            ? "<p>Bonne nouvelle : votre adhésion à Muller's Foundation (MUFO) a été validée. Bienvenue parmi nous !</p>"
            : "<p>Après examen, nous ne sommes pas en mesure de donner suite à votre demande d'adhésion pour le moment. N'hésitez pas à nous recontacter pour en savoir plus.</p>"
        }
        <p style="color:#888; font-size:12px; margin-top:32px;">Muller's Foundation (MUFO) — mullerfoundation.org</p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject: approved ? "Votre adhésion à MUFO a été acceptée" : "Votre demande d'adhésion à MUFO",
        html,
      }),
    });

    if (!res.ok) {
      console.error("Resend error", res.status, await res.text());
      return new Response(JSON.stringify({ sent: false, reason: "resend_error" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ sent: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-membership-status error", e);
    return new Response(JSON.stringify({ sent: false, reason: "internal_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
