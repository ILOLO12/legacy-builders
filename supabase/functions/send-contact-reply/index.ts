// Sends an admin/editor's reply to a contact message's sender, from the
// dashboard (Admin -> Messages). Admin/editor-only. The contact_messages
// row itself (reply_text/replied_at) is updated client-side by the caller
// after this succeeds — this function only sends the email.
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

    const { to, originalSubject, replyText } = await req.json();
    if (!to || !replyText?.trim()) {
      return new Response(JSON.stringify({ error: "to et replyText sont requis." }), {
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
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; white-space: pre-wrap;">
        ${replyText.trim().replace(/\n/g, "<br>")}
        <p style="color:#888; font-size:12px; margin-top:32px; white-space: normal;">Muller's Foundation (MUFO) — mullerfoundation.org</p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject: `Re: ${originalSubject || "Votre message à MUFO"}`,
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
    console.error("send-contact-reply error", e);
    return new Response(JSON.stringify({ sent: false, reason: "internal_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
