import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const { participant_id, status } = await req.json();
    if (!participant_id || !status) {
      return new Response("Missing participant_id or status", { status: 400, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const resendFrom = Deno.env.get("RESEND_FROM");

    if (!supabaseUrl || !serviceRoleKey || !resendApiKey || !resendFrom) {
      return new Response("Missing environment variables", { status: 500, headers: corsHeaders });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false }
    });

    const { data: participant, error } = await supabase
      .from("event_participants")
      .select("id, email, full_name, status, event:events(id, title_fr, title_en, date, location, link)")
      .eq("id", participant_id)
      .single();

    if (error || !participant) {
      return new Response("Participant not found", { status: 404, headers: corsHeaders });
    }

    if (!participant.email) {
      return new Response("Participant email missing", { status: 400, headers: corsHeaders });
    }

    const event = participant.event;
    const dateValue = event?.date ? new Date(event.date) : null;
    const eventDate = dateValue
      ? dateValue.toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" })
      : "-";
    const eventTime = dateValue
      ? dateValue.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" })
      : "-";

    const statusLabel = status === "approved" ? "validée" : "refusée";
    const subject =
      status === "approved"
        ? "Participation validée - GDG UTBM"
        : "Participation refusée - GDG UTBM";

    const eventTitle = event?.title_fr || event?.title_en || "Événement";
    const eventLocation = event?.location || "Lieu à préciser";
    const eventLink = event?.link || "-";

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0b1324">
        <h2 style="margin:0 0 12px">Participation ${statusLabel}</h2>
        <p>Bonjour ${participant.full_name},</p>
        <p>Votre demande de participation à l'événement <strong>${eventTitle}</strong> a été ${statusLabel}.</p>
        <div style="margin:16px 0;padding:12px;border:1px solid #e5e7eb;border-radius:12px;background:#f8fafc">
          <p style="margin:0 0 6px"><strong>Date :</strong> ${eventDate}</p>
          <p style="margin:0 0 6px"><strong>Heure :</strong> ${eventTime}</p>
          <p style="margin:0 0 6px"><strong>Lieu :</strong> ${eventLocation}</p>
          <p style="margin:0"><strong>Lien :</strong> ${eventLink}</p>
        </div>
        <p>Merci pour votre intérêt.</p>
        <p>L'équipe GDG UTBM</p>
      </div>
    `;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: resendFrom,
        to: [participant.email],
        subject,
        html
      })
    });

    if (!resendRes.ok) {
      const err = await resendRes.text();
      return new Response(err, { status: 502, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response("Server error", { status: 500, headers: corsHeaders });
  }
});
