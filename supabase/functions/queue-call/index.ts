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
    const { userId, template_id, recipient_number, scheduled_time, custom_variables } = await req.json();

    if (!userId || !template_id || !recipient_number) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check user subscription
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*, subscription_plans!inner(*)')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();

    if (subscriptionError) {
      return new Response(JSON.stringify({ error: `Subscription check error: ${subscriptionError.message}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!subscription) {
      return new Response(JSON.stringify({ error: 'No active subscription found' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check call limit
    if (subscription.calls_used >= subscription.subscription_plans.call_limit) {
      return new Response(JSON.stringify({ error: 'Call limit reached for current subscription' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get template details
    const { data: template, error: templateError } = await supabase
      .from('call_templates')
      .select('*')
      .eq('id', template_id)
      .single();

    if (templateError) {
      return new Response(JSON.stringify({ error: `Template fetch error: ${templateError.message}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate required variables
    if (template.required_variables && template.required_variables.length > 0) {
      const missingVariables = template.required_variables.filter(
        variable => !custom_variables || !custom_variables[variable]
      );
      
      if (missingVariables.length > 0) {
        return new Response(JSON.stringify({ 
          error: `Missing required variables: ${missingVariables.join(', ')}` 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Queue the call
    const { data: queuedCall, error: queueError } = await supabase
      .from('call_queue')
      .insert({
        user_id: userId,
        recipient_number,
        scheduled_time: scheduled_time || null,
        status: scheduled_time ? 'scheduled' : 'queued',
        priority: 1, // Default priority
        template_id,
        custom_variables: custom_variables || {}
      })
      .select()
      .single();

    if (queueError) {
      return new Response(JSON.stringify({ error: `Call queue error: ${queueError.message}` }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Increment calls_used in subscription
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({ calls_used: subscription.calls_used + 1 })
      .eq('id', subscription.id);

    if (updateError) {
      console.error(`Error updating subscription usage: ${updateError.message}`);
      // Continue anyway since the call is already queued
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Call successfully queued',
      callId: queuedCall.id
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
