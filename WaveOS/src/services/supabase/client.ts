// Supabase client configuration

import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Edge function helpers
export const callEdgeFunction = async (functionName: string, body: any) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase.functions.invoke(functionName, {
    body,
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (error) {
    throw error;
  }

  return data;
};

// Beacon functions
export const registerBeacon = async () => {
  return callEdgeFunction('beacon-register', {});
};

export const resolveBeacon = async (beaconId: string) => {
  return callEdgeFunction('beacon-resolve', { beacon_id: beaconId });
};

export const createWave = async (receiverId: string) => {
  return callEdgeFunction('wave-handshake', { receiver_id: receiverId });
};

// Database helpers
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const updateProfile = async (updates: Partial<Database['public']['Tables']['profiles']['Update']>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getGhostZones = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('ghost_zones')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true);

  if (error) throw error;
  return data;
};

export const createGhostZone = async (zone: {
  name: string;
  latitude: number;
  longitude: number;
  radius_meters?: number;
}) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('ghost_zones')
    .insert({
      user_id: user.id,
      name: zone.name,
      latitude: zone.latitude,
      longitude: zone.longitude,
      radius_meters: zone.radius_meters || 100,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getActiveChats = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('chats')
    .select('*, wave:waves(*)')
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
    .eq('is_active', true)
    .gt('expires_at', new Date().toISOString());

  if (error) throw error;
  return data;
};

export const getChatMessages = async (chatId: string) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
};

export const sendChatMessage = async (chatId: string, content: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      chat_id: chatId,
      sender_id: user.id,
      content,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};


