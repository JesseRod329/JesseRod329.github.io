// Edge Function: wave-handshake
// Handles mutual wave creation and chat initialization
// Called when both users wave at each other

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

    const { receiver_id } = await req.json()

    if (!receiver_id) {
      return new Response(
        JSON.stringify({ error: 'receiver_id required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (user.id === receiver_id) {
      return new Response(
        JSON.stringify({ error: 'Cannot wave to yourself' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Use service role for transaction
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check for existing wave
    const { data: existingWave } = await supabaseAdmin
      .from('waves')
      .select('*')
      .or(`initiator_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .or(`initiator_id.eq.${receiver_id},receiver_id.eq.${receiver_id}`)
      .single()

    if (existingWave) {
      // If wave exists and is mutual, return existing chat
      if (existingWave.status === 'mutual') {
        const { data: existingChat } = await supabaseAdmin
          .from('chats')
          .select('*')
          .eq('wave_id', existingWave.id)
          .eq('is_active', true)
          .single()

        if (existingChat) {
          return new Response(
            JSON.stringify({ wave: existingWave, chat: existingChat }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }

      // If receiver is accepting, make it mutual
      if (existingWave.receiver_id === user.id && existingWave.status === 'pending') {
        const expiresAt = new Date()
        expiresAt.setMinutes(expiresAt.getMinutes() + 5) // 5-minute chat

        const { data: updatedWave } = await supabaseAdmin
          .from('waves')
          .update({ status: 'mutual', mutual_at: new Date().toISOString() })
          .eq('id', existingWave.id)
          .select()
          .single()

        // Create chat
        const { data: chat } = await supabaseAdmin
          .from('chats')
          .insert({
            wave_id: updatedWave.id,
            user1_id: updatedWave.initiator_id,
            user2_id: updatedWave.receiver_id,
            expires_at: expiresAt.toISOString(),
            is_active: true,
          })
          .select()
          .single()

        return new Response(
          JSON.stringify({ wave: updatedWave, chat }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ wave: existingWave }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create new wave
    const { data: newWave } = await supabaseAdmin
      .from('waves')
      .insert({
        initiator_id: user.id,
        receiver_id: receiver_id,
        status: 'pending',
      })
      .select()
      .single()

    return new Response(
      JSON.stringify({ wave: newWave }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})


