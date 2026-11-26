// Sends two emails right after a Contact form submission: an
// acknowledgement to the sender, and a notification to the org's contact
// email (read from site_settings — public table, no auth needed here).
// Reuses the same RESEND_API_KEY / MEMBERSHIP_EMAIL_FROM secrets as every
// other confirmation function — no new secret required. No-ops gracefully
// without RESEND_API_KEY so it can never block a submission.
//
// Gated by its OWN switch (contact_confirmation_enabled), separate from the
// site-wide notifications_enabled (already on for membership/volunteer/
// donation emails) — this one stays off until the client pays for it,
// regardless of the other switch's state.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("MEMBERSHIP_EMAIL_FROM") || "MUFO <onboarding@resend.dev>";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
  });
  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return false;
  }
  return true;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject } = await req.json();

    if (!name || !email) {
      return new Response(JSON.stringify({ error: "name et email sont requis." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Dedicated activation switch (Admin -> Paramètres, super-admin only) —
    // independent from notifications_enabled, off by default.
    const { data: notifRow } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "contact_confirmation_enabled")
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

    const subjectLine = subject ? ` au sujet de « ${subject} »` : "";
    const senderHtml = `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color:#1a2b4c;">Merci pour votre message, ${name} !</h2>
        <p>Nous avons bien reçu votre demande${subjectLine} à Muller's Foundation (MUFO).</p>
        <p>Notre équipe va l'examiner et vous recontactera très prochainement.</p>
        <p style="margin-top:24px;">Merci pour votre confiance.</p>
        <p style="color:#888; font-size:12px; margin-top:32px;">Muller's Foundation (MUFO) — mullerfoundation.org</p>
      </div>
    `;
    const senderSent = await sendEmail(email, "Votre demande à MUFO a bien été reçue", senderHtml);

    let adminSent = false;
    const { data: settingRow } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "contact_email")
      .maybeSingle();
    const adminEmail = settingRow?.value?.trim();
    if (adminEmail) {
      const adminHtml = `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color:#1a2b4c;">Nouvelle demande de contact</h2>
          <p><strong>${name}</strong> (${email}) vient d'envoyer une demande${subjectLine}.</p>
          <p>Consultez-la dans l'administration du site, section Messages.</p>
        </div>
      `;
      adminSent = await sendEmail(adminEmail, `Nouvelle demande de contact — ${name}`, adminHtml);
    }

    return new Response(JSON.stringify({ sent: senderSent, adminNotified: adminSent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-contact-confirmation error", e);
    return new Response(JSON.stringify({ sent: false, reason: "internal_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
