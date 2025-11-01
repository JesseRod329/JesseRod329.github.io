// Edge Function: beacon-resolve
// Resolves a beacon ID to user info (server-side only)
// Only returns user info if mutual wave exists (privacy protection)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
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

    const { beacon_id } = await req.json()

    if (!beacon_id) {
      return new Response(
        JSON.stringify({ error: 'beacon_id required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Use service role to bypass RLS and check beacon→user mapping
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Find active beacon
    const { data: beacon, error: beaconError } = await supabaseAdmin
      .from('beacons')
      .select('user_id, expires_at')
      .eq('beacon_id', beacon_id)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (beaconError || !beacon) {
      return new Response(
        JSON.stringify({ error: 'Beacon not found or expired' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if users are blocked
    const { data: blocks } = await supabaseAdmin
      .from('blocks')
      .select('id')
      .or(`blocker_id.eq.${user.id},blocked_id.eq.${user.id}`)
      .or(`blocker_id.eq.${beacon.user_id},blocked_id.eq.${beacon.user_id}`)

    if (blocks && blocks.length > 0) {
      return new Response(
        JSON.stringify({ error: 'User blocked' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if mutual wave exists
    const { data: wave } = await supabaseAdmin
      .from('waves')
      .select('id')
      .or(`initiator_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .or(`initiator_id.eq.${beacon.user_id},receiver_id.eq.${beacon.user_id}`)
      .eq('status', 'mutual')
      .single()

    if (!wave) {
      // Return minimal info: just a count or generic "user nearby"
      return new Response(
        JSON.stringify({ nearby: true, user_id: null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Mutual wave exists - return user profile (limited fields)
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .eq('id', beacon.user_id)
      .eq('is_active', true)
      .single()

    if (!profile) {
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ nearby: true, user: profile }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})


