// Follow this setup guide to integrate the Deno runtime:
// https://docs.supabase.com/guides/functions/deno

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { method, url } = req;
    
    // Only handle POST requests
    if (method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse request body
    const { callId, userId } = await req.json();

    if (!callId) {
      return new Response(JSON.stringify({ error: 'Missing call ID' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get call details
    const { data: call, error: callError } = await supabase
      .from('call_queue')
      .select('*')
      .eq('id', callId)
      .single();

    if (callError) {
      return new Response(JSON.stringify({ error: `Call fetch error: ${callError.message}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if the call belongs to the user (if userId is provided)
    if (userId && call.user_id !== userId) {
      return new Response(JSON.stringify({ error: 'Not authorized to cancel this call' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if the call can be cancelled
    if (call.status !== 'queued' && call.status !== 'scheduled') {
      return new Response(JSON.stringify({ 
        error: `Cannot cancel call with status: ${call.status}` 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Cancel the call
    const { data: updatedCall, error: updateError } = await supabase
      .from('call_queue')
      .update({ status: 'cancelled' })
      .eq('id', callId)
      .select()
      .single();

    if (updateError) {
      return new Response(JSON.stringify({ error: `Call cancel error: ${updateError.message}` }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create a call history record for tracking
    const { error: historyError } = await supabase
      .from('call_history')
      .insert({
        user_id: call.user_id,
        call_queue_id: call.id,
        provider_id: call.provider_id || null,
        assistant_id: null, // Will be populated by process-queue if applicable
        phone_number_id: null, // Will be populated by process-queue if applicable
        recipient_number: call.recipient_number,
        template_id: call.template_id,
        custom_variables: call.custom_variables,
        transcript: null,
        status: 'cancelled'
      });

    if (historyError) {
      console.error(`Error creating call history: ${historyError.message}`);
      // Continue anyway since the call is already cancelled
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Call successfully cancelled',
      status: updatedCall.status
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
