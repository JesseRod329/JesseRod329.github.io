// Edge Function: beacon-register
// Registers a new ephemeral beacon ID for a user
// Called when rotating beacons

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Deactivate old active beacons for this user
    await supabaseClient
      .from('beacons')
      .update({ is_active: false })
      .eq('user_id', user.id)
      .eq('is_active', true)

    // Generate new ephemeral beacon ID (UUID-based, random)
    const beaconId = crypto.randomUUID().replace(/-/g, '').substring(0, 32).toUpperCase()

    // Set expiration (e.g., 1 hour from now)
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1)

    // Insert new beacon
    const { data: beacon, error: insertError } = await supabaseClient
      .from('beacons')
      .insert({
        user_id: user.id,
        beacon_id: beaconId,
        expires_at: expiresAt.toISOString(),
        is_active: true,
      })
      .select()
      .single()

    if (insertError) {
      throw insertError
    }

    // Update presence with new beacon ID
    const presenceExpiresAt = new Date()
    presenceExpiresAt.setMinutes(presenceExpiresAt.getMinutes() + 15) // Presence expires in 15 min

    await supabaseClient
      .from('presence')
      .upsert({
        user_id: user.id,
        beacon_id: beaconId,
        expires_at: presenceExpiresAt.toISOString(),
        last_seen_at: new Date().toISOString(),
      })

    return new Response(
      JSON.stringify({ beacon_id: beacon.beacon_id, expires_at: beacon.expires_at }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})


