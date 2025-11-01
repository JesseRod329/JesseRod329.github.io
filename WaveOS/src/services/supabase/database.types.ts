// Database types (placeholder - generate with Supabase CLI)
// Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/services/supabase/database.types.ts

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
          is_active: boolean;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      beacons: {
        Row: {
          id: string;
          user_id: string;
          beacon_id: string;
          created_at: string;
          expires_at: string;
          is_active: boolean;
        };
        Insert: Omit<Database['public']['Tables']['beacons']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['beacons']['Insert']>;
      };
      waves: {
        Row: {
          id: string;
          initiator_id: string;
          receiver_id: string;
          status: 'pending' | 'mutual' | 'expired' | 'declined';
          created_at: string;
          mutual_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['waves']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['waves']['Insert']>;
      };
      chats: {
        Row: {
          id: string;
          wave_id: string;
          user1_id: string;
          user2_id: string;
          started_at: string;
          expires_at: string;
          is_active: boolean;
        };
        Insert: Omit<Database['public']['Tables']['chats']['Row'], 'id' | 'started_at'>;
        Update: Partial<Database['public']['Tables']['chats']['Insert']>;
      };
      chat_messages: {
        Row: {
          id: string;
          chat_id: string;
          sender_id: string;
          content: string;
          created_at: string;
          is_read: boolean;
        };
        Insert: Omit<Database['public']['Tables']['chat_messages']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['chat_messages']['Insert']>;
      };
      ghost_zones: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          latitude: number;
          longitude: number;
          radius_meters: number;
          created_at: string;
          is_active: boolean;
        };
        Insert: Omit<Database['public']['Tables']['ghost_zones']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['ghost_zones']['Insert']>;
      };
      blocks: {
        Row: {
          id: string;
          blocker_id: string;
          blocked_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['blocks']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['blocks']['Insert']>;
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string;
          reported_id: string;
          reason: string;
          details: string | null;
          created_at: string;
          status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
        };
        Insert: Omit<Database['public']['Tables']['reports']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['reports']['Insert']>;
      };
      presence: {
        Row: {
          id: string;
          user_id: string;
          beacon_id: string;
          latitude: number | null;
          longitude: number | null;
          last_seen_at: string;
          expires_at: string;
        };
        Insert: Omit<Database['public']['Tables']['presence']['Row'], 'id' | 'last_seen_at'>;
        Update: Partial<Database['public']['Tables']['presence']['Insert']>;
      };
    };
  };
};


