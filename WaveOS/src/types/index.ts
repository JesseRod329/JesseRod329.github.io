// TypeScript types for WaveOS

export interface Profile {
  id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface Beacon {
  id: string;
  user_id: string;
  beacon_id: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
}

export interface Wave {
  id: string;
  initiator_id: string;
  receiver_id: string;
  status: 'pending' | 'mutual' | 'expired' | 'declined';
  created_at: string;
  mutual_at?: string;
}

export interface Chat {
  id: string;
  wave_id: string;
  user1_id: string;
  user2_id: string;
  started_at: string;
  expires_at: string;
  is_active: boolean;
}

export interface ChatMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export interface GhostZone {
  id: string;
  user_id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
  created_at: string;
  is_active: boolean;
}

export interface Presence {
  id: string;
  user_id: string;
  beacon_id: string;
  latitude?: number;
  longitude?: number;
  last_seen_at: string;
  expires_at: string;
}

export interface NearbyUser {
  beacon_id: string;
  user?: Profile;
  nearby: boolean;
}

export type RootStackParamList = {
  Onboarding: undefined;
  Discovery: undefined;
  WaveHandshake: { receiverId: string };
  Chat: { chatId: string };
};


