// Sends the applicant a confirmation email right after they submit the
// Membership form. Requires a RESEND_API_KEY secret (https://resend.com —
// free tier works). Without it configured, this responds with
// { sent: false, reason: "not_configured" } instead of failing — the
// membership_signups row is already saved by the time this runs, so a
// missing/broken email integration never blocks the signup itself.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
// Until a sending domain is verified in Resend, only "onboarding@resend.dev"
// works as the From address. Replace once MUFO's own domain is verified.
const FROM_EMAIL = Deno.env.get("MEMBERSHIP_EMAIL_FROM") || "MUFO <onboarding@resend.dev>";

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

    const html = `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color:#1a2b4c;">Merci pour votre demande d'adhésion, ${name} !</h2>
        <p>Nous avons bien reçu votre demande d'adhésion au niveau <strong>${tier}</strong> à Muller's Foundation (MUFO).</p>
        <p>Notre équipe va l'examiner et vous recontactera très prochainement pour finaliser votre adhésion.</p>
        <p style="margin-top:24px;">Merci pour votre engagement à nos côtés.</p>
        <p style="color:#888; font-size:12px; margin-top:32px;">Muller's Foundation (MUFO) — mullerfoundation.org</p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject: "Votre demande d'adhésion à MUFO a bien été reçue",
        html,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Resend error", res.status, errText);
      return new Response(JSON.stringify({ sent: false, reason: "resend_error" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ sent: true }), {
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
