// Sends two emails right after a Donate form submission: payment
// instructions to the donor (bank details or Mobile Money number, read
// from site_settings), and a notification to the org's contact email.
// Requires a RESEND_API_KEY secret. Without it configured, or while the
// notifications_enabled switch is off, this responds with { sent: false,
// reason: ... } instead of failing — the donations row is already saved
// by the time this runs, so a missing/broken email integration never
// blocks the donation pledge itself.
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
    const { name, email, amount, method, network, referenceCode } = await req.json();

    if (!name || !email || !amount || !method) {
      return new Response(JSON.stringify({ error: "name, email, amount et method sont requis." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

    const { data: settingsRows } = await supabase
      .from("site_settings")
      .select("key,value")
      .in("key", [
        "contact_email",
        "donation_bank_name",
        "donation_bank_holder",
        "donation_bank_account",
        "donation_bank_swift",
        "donation_mobile_number",
      ]);
    const settings = Object.fromEntries((settingsRows ?? []).map((r) => [r.key, r.value?.trim() ?? ""]));

    let paymentInstructions: string;
    if (method === "bank_transfer") {
      const hasBankInfo = settings.donation_bank_name || settings.donation_bank_account;
      paymentInstructions = hasBankInfo
        ? `
          <table style="width:100%; border-collapse:collapse; margin-top:12px;">
            ${settings.donation_bank_name ? `<tr><td style="padding:4px 8px; color:#888;">Banque</td><td style="padding:4px 8px;"><strong>${settings.donation_bank_name}</strong></td></tr>` : ""}
            ${settings.donation_bank_holder ? `<tr><td style="padding:4px 8px; color:#888;">Titulaire</td><td style="padding:4px 8px;"><strong>${settings.donation_bank_holder}</strong></td></tr>` : ""}
            ${settings.donation_bank_account ? `<tr><td style="padding:4px 8px; color:#888;">Compte / IBAN</td><td style="padding:4px 8px;"><strong>${settings.donation_bank_account}</strong></td></tr>` : ""}
            ${settings.donation_bank_swift ? `<tr><td style="padding:4px 8px; color:#888;">SWIFT / BIC</td><td style="padding:4px 8px;"><strong>${settings.donation_bank_swift}</strong></td></tr>` : ""}
          </table>
        `
        : `<p>Notre équipe vous recontactera très prochainement avec les coordonnées bancaires.</p>`;
    } else if (method === "mobile_money") {
      paymentInstructions = settings.donation_mobile_number
        ? `<p>Envoyez votre don via <strong>${network || "Mobile Money"}</strong> au numéro : <strong>${settings.donation_mobile_number}</strong></p>`
        : `<p>Notre équipe vous recontactera très prochainement avec le numéro Mobile Money à utiliser.</p>`;
    } else {
      paymentInstructions = `<p>Notre équipe vous recontactera très prochainement avec les instructions de paiement.</p>`;
    }

    const referenceBlock = referenceCode
      ? `
        <div style="background:#f4ede1; border:1px solid #d9c8a5; border-radius:8px; padding:14px 16px; margin:16px 0;">
          <p style="margin:0 0 6px; font-size:13px; color:#555;">Important : indiquez ce code en référence / motif de votre virement ou de votre transaction Mobile Money, pour que nous puissions confirmer que le paiement vient bien de vous :</p>
          <p style="margin:0; font-size:20px; font-weight:bold; letter-spacing:1px; color:#1a2b4c;">${referenceCode}</p>
        </div>
      `
      : "";

    const donorHtml = `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color:#1a2b4c;">Merci pour votre don, ${name} !</h2>
        <p>Nous avons bien enregistré votre intention de don de <strong>${amount} $</strong> à Muller's Foundation (MUFO).</p>
        ${referenceBlock}
        ${paymentInstructions}
        <p style="margin-top:24px;">Merci pour votre générosité et votre engagement à nos côtés.</p>
        <p style="color:#888; font-size:12px; margin-top:32px;">Muller's Foundation (MUFO) — mullerfoundation.org</p>
      </div>
    `;
    const donorSent = await sendEmail(email, "Instructions pour votre don à MUFO", donorHtml);

    let adminSent = false;
    const adminEmail = settings.contact_email;
    if (adminEmail) {
      const adminHtml = `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color:#1a2b4c;">Nouvelle intention de don</h2>
          <p><strong>${name}</strong> (${email}) vient de promettre un don de <strong>${amount} $</strong> via ${method === "bank_transfer" ? "virement bancaire" : "Mobile Money" + (network ? ` (${network})` : "")}.</p>
          ${referenceCode ? `<p>Code de référence à retrouver sur le relevé : <strong>${referenceCode}</strong></p>` : ""}
          <p>Consultez-la dans l'administration du site, section Dons.</p>
        </div>
      `;
      adminSent = await sendEmail(adminEmail, `Nouvelle intention de don — ${name}`, adminHtml);
    }

    return new Response(JSON.stringify({ sent: donorSent, adminNotified: adminSent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-donation-confirmation error", e);
    return new Response(JSON.stringify({ sent: false, reason: "internal_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
