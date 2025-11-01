-- WaveOS MVP Database Schema
-- Creates all tables with proper relationships and constraints

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis" SCHEMA extensions;

-- Profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

-- Beacons table (ephemeral IDs, server-managed)
CREATE TABLE public.beacons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  beacon_id TEXT UNIQUE NOT NULL, -- Ephemeral BLE beacon identifier
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL, -- Automatic expiration for rotation
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

-- Ghost zones (safe zones where beacons are disabled)
CREATE TABLE public.ghost_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., "Home", "Work"
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  radius_meters INTEGER DEFAULT 100 NOT NULL, -- Radius in meters
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL
);

-- Blocks table (user blocking relationships)
CREATE TABLE public.blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blocker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(blocker_id, blocked_id),
  CHECK (blocker_id != blocked_id)
);

-- Reports table (user reporting system)
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed'))
);

-- Waves table (mutual wave handshakes)
CREATE TABLE public.waves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  initiator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'mutual', 'expired', 'declined')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  mutual_at TIMESTAMPTZ,
  UNIQUE(initiator_id, receiver_id),
  CHECK (initiator_id != receiver_id)
);

-- Chats table (5-minute timed chat sessions)
CREATE TABLE public.chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wave_id UUID NOT NULL REFERENCES public.waves(id) ON DELETE CASCADE,
  user1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL, -- 5 minutes from started_at
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  CHECK (user1_id != user2_id)
);

-- Chat messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_read BOOLEAN DEFAULT FALSE NOT NULL
);

-- Presence table (ephemeral presence tracking)
CREATE TABLE public.presence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  beacon_id TEXT NOT NULL, -- Current ephemeral beacon ID
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  last_seen_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL -- Auto-cleanup stale presence
);

-- Indexes for performance
CREATE INDEX idx_beacons_user_id ON public.beacons(user_id);
CREATE INDEX idx_beacons_beacon_id ON public.beacons(beacon_id);
CREATE INDEX idx_beacons_expires_at ON public.beacons(expires_at) WHERE is_active = TRUE;
CREATE INDEX idx_beacons_active ON public.beacons(user_id, is_active) WHERE is_active = TRUE;

CREATE INDEX idx_ghost_zones_user_id ON public.ghost_zones(user_id);
CREATE INDEX idx_ghost_zones_location ON public.ghost_zones USING GIST(ST_SetSRID(ST_MakePoint(longitude, latitude), 4326));

CREATE INDEX idx_blocks_blocker ON public.blocks(blocker_id);
CREATE INDEX idx_blocks_blocked ON public.blocks(blocked_id);

CREATE INDEX idx_waves_initiator ON public.waves(initiator_id, status);
CREATE INDEX idx_waves_receiver ON public.waves(receiver_id, status);
CREATE INDEX idx_waves_mutual ON public.waves(status) WHERE status = 'mutual';

CREATE INDEX idx_chats_wave_id ON public.chats(wave_id);
CREATE INDEX idx_chats_users ON public.chats(user1_id, user2_id, is_active) WHERE is_active = TRUE;
CREATE INDEX idx_chats_expires_at ON public.chats(expires_at) WHERE is_active = TRUE;

CREATE INDEX idx_chat_messages_chat_id ON public.chat_messages(chat_id, created_at);
CREATE INDEX idx_chat_messages_sender ON public.chat_messages(sender_id);

CREATE INDEX idx_presence_user_id ON public.presence(user_id);
CREATE INDEX idx_presence_beacon_id ON public.presence(beacon_id);
CREATE INDEX idx_presence_expires_at ON public.presence(expires_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


