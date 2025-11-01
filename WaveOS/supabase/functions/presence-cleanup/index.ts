// Edge Function: presence-cleanup
// Scheduled cleanup of stale presence data
// Should be called via Supabase cron or external scheduler

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  try {
    // Use service role for cleanup operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const now = new Date().toISOString()

    // Clean up expired presence records
    const { error: presenceError } = await supabaseAdmin
      .from('presence')
      .delete()
      .lt('expires_at', now)

    if (presenceError) {
      throw presenceError
    }

    // Clean up expired beacons
    const { error: beaconError } = await supabaseAdmin
      .from('beacons')
      .update({ is_active: false })
      .lt('expires_at', now)
      .eq('is_active', true)

    if (beaconError) {
      throw beaconError
    }

    // Clean up expired chats
    const { error: chatError } = await supabaseAdmin
      .from('chats')
      .update({ is_active: false })
      .lt('expires_at', now)
      .eq('is_active', true)

    if (chatError) {
      throw chatError
    }

    // Clean up expired waves (older than 24 hours)
    const yesterday = new Date()
    yesterday.setHours(yesterday.getHours() - 24)

    const { error: waveError } = await supabaseAdmin
      .from('waves')
      .update({ status: 'expired' })
      .lt('created_at', yesterday.toISOString())
      .eq('status', 'pending')

    if (waveError) {
      throw waveError
    }

    return new Response(
      JSON.stringify({ success: true, cleaned_at: now }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})


