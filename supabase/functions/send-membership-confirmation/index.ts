// Sends two emails right after a Membership form submission: a
// confirmation to the applicant, and a notification to the org's contact
// email (read from site_settings — public table, no auth needed here).
// Requires a RESEND_API_KEY secret (https://resend.com — free tier works).
// Without it configured, this responds with { sent: false, reason:
// "not_configured" } instead of failing — the membership_signups row is
// already saved by the time this runs, so a missing/broken email
// integration never blocks the signup itself.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
// Until a sending domain is verified in Resend, only "onboarding@resend.dev"
// works as the From address. Replace once MUFO's own domain is verified.
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
    const { name, email, tier } = await req.json();

    if (!name || !email || !tier) {
      return new Response(JSON.stringify({ error: "name, email et tier sont requis." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ sent: false, reason: "not_configured" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const applicantHtml = `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color:#1a2b4c;">Merci pour votre demande d'adhésion, ${name} !</h2>
        <p>Nous avons bien reçu votre demande d'adhésion au niveau <strong>${tier}</strong> à Muller's Foundation (MUFO).</p>
        <p>Notre équipe va l'examiner et vous recontactera très prochainement pour finaliser votre adhésion.</p>
        <p style="margin-top:24px;">Merci pour votre engagement à nos côtés.</p>
        <p style="color:#888; font-size:12px; margin-top:32px;">Muller's Foundation (MUFO) — mullerfoundation.org</p>
      </div>
    `;
    const applicantSent = await sendEmail(email, "Votre demande d'adhésion à MUFO a bien été reçue", applicantHtml);

    // Notify the org's own contact address, read from site_settings (public, no auth required to read it).
    let adminSent = false;
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: settingRow } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "contact_email")
      .maybeSingle();
    const adminEmail = settingRow?.value?.trim();
    if (adminEmail) {
      const adminHtml = `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color:#1a2b4c;">Nouvelle demande d'adhésion</h2>
          <p><strong>${name}</strong> (${email}) vient de soumettre une demande d'adhésion — niveau <strong>${tier}</strong>.</p>
          <p>Consultez-la dans l'administration du site, section Adhésions.</p>
        </div>
      `;
      adminSent = await sendEmail(adminEmail, `Nouvelle demande d'adhésion — ${name}`, adminHtml);
    }

    return new Response(JSON.stringify({ sent: applicantSent, adminNotified: adminSent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-membership-confirmation error", e);
    return new Response(JSON.stringify({ sent: false, reason: "internal_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
