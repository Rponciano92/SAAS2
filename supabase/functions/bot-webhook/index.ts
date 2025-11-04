import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface WebhookPayload {
  meeting_id: string;
  event: 'bot_joined' | 'recording_started' | 'recording_completed' | 'bot_left' | 'error';
  data?: {
    recording_url?: string;
    video_url?: string;
    audio_url?: string;
    duration?: number;
    started_at?: string;
    ended_at?: string;
    error_message?: string;
  };
  timestamp?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const payload: WebhookPayload = await req.json();
    console.log("Received webhook:", payload);

    if (!payload.meeting_id || !payload.event) {
      return new Response(
        JSON.stringify({ error: "Invalid payload: missing meeting_id or event" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    switch (payload.event) {
      case 'bot_joined':
        await supabase
          .from('meetings')
          .update({
            status: 'in_progress',
            bot_joined_at: new Date().toISOString(),
          })
          .eq('id', payload.meeting_id);

        console.log(`Bot joined meeting: ${payload.meeting_id}`);
        break;

      case 'recording_started':
        await supabase
          .from('meetings')
          .update({
            status: 'recording',
            recording_started_at: payload.data?.started_at || new Date().toISOString(),
          })
          .eq('id', payload.meeting_id);

        console.log(`Recording started for meeting: ${payload.meeting_id}`);
        break;

      case 'recording_completed':
        await supabase
          .from('meetings')
          .update({
            status: 'processing',
            recording_url: payload.data?.recording_url,
            video_url: payload.data?.video_url,
            audio_url: payload.data?.audio_url,
            duration: payload.data?.duration,
            ended_at: payload.data?.ended_at || new Date().toISOString(),
          })
          .eq('id', payload.meeting_id);

        console.log(`Recording completed for meeting: ${payload.meeting_id}`);
        break;

      case 'bot_left':
        await supabase
          .from('meetings')
          .update({
            bot_left_at: new Date().toISOString(),
          })
          .eq('id', payload.meeting_id);

        console.log(`Bot left meeting: ${payload.meeting_id}`);
        break;

      case 'error':
        await supabase
          .from('meetings')
          .update({
            status: 'failed',
            error_message: payload.data?.error_message || 'Unknown error from bot',
          })
          .eq('id', payload.meeting_id);

        console.error(`Error in meeting ${payload.meeting_id}:`, payload.data?.error_message);
        break;

      default:
        console.warn(`Unknown event type: ${payload.event}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Webhook processed for meeting ${payload.meeting_id}`,
        event: payload.event,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error processing webhook:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});