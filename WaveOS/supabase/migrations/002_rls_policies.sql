-- WaveOS RLS Policies
-- Strict row-level security for all tables

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beacons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ghost_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presence ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can view other active profiles (for discovery)
CREATE POLICY "Users can view active profiles"
  ON public.profiles FOR SELECT
  USING (is_active = TRUE AND auth.uid() IS NOT NULL);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- BEACONS POLICIES
-- ============================================

-- Users can view their own active beacons
CREATE POLICY "Users can view own beacons"
  ON public.beacons FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own beacons (via edge function)
CREATE POLICY "Users can insert own beacons"
  ON public.beacons FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own beacons
CREATE POLICY "Users can update own beacons"
  ON public.beacons FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own beacons
CREATE POLICY "Users can delete own beacons"
  ON public.beacons FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- GHOST ZONES POLICIES
-- ============================================

-- Users can view their own ghost zones
CREATE POLICY "Users can view own ghost zones"
  ON public.ghost_zones FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own ghost zones
CREATE POLICY "Users can insert own ghost zones"
  ON public.ghost_zones FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own ghost zones
CREATE POLICY "Users can update own ghost zones"
  ON public.ghost_zones FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own ghost zones
CREATE POLICY "Users can delete own ghost zones"
  ON public.ghost_zones FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- BLOCKS POLICIES
-- ============================================

-- Users can view blocks where they are the blocker
CREATE POLICY "Users can view own blocks"
  ON public.blocks FOR SELECT
  USING (auth.uid() = blocker_id);

-- Users can insert blocks where they are the blocker
CREATE POLICY "Users can create own blocks"
  ON public.blocks FOR INSERT
  WITH CHECK (auth.uid() = blocker_id);

-- Users can delete their own blocks
CREATE POLICY "Users can delete own blocks"
  ON public.blocks FOR DELETE
  USING (auth.uid() = blocker_id);

-- ============================================
-- REPORTS POLICIES
-- ============================================

-- Users can view their own reports
CREATE POLICY "Users can view own reports"
  ON public.reports FOR SELECT
  USING (auth.uid() = reporter_id);

-- Users can insert their own reports
CREATE POLICY "Users can create own reports"
  ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

-- ============================================
-- WAVES POLICIES
-- ============================================

-- Users can view waves where they are initiator or receiver
CREATE POLICY "Users can view own waves"
  ON public.waves FOR SELECT
  USING (auth.uid() = initiator_id OR auth.uid() = receiver_id);

-- Users can insert waves where they are initiator
CREATE POLICY "Users can create waves"
  ON public.waves FOR INSERT
  WITH CHECK (auth.uid() = initiator_id);

-- Users can update waves where they are receiver (to accept/decline)
CREATE POLICY "Users can update received waves"
  ON public.waves FOR UPDATE
  USING (auth.uid() = receiver_id);

-- Edge function can update waves for mutual status
-- (This will be handled via service role, not RLS)

-- ============================================
-- CHATS POLICIES
-- ============================================

-- Users can view chats where they are a participant
CREATE POLICY "Users can view own chats"
  ON public.chats FOR SELECT
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Users can insert chats (via edge function)
CREATE POLICY "Users can create chats"
  ON public.chats FOR INSERT
  WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Users can update chats where they are a participant
CREATE POLICY "Users can update own chats"
  ON public.chats FOR UPDATE
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- ============================================
-- CHAT MESSAGES POLICIES
-- ============================================

-- Users can view messages in chats they're part of
CREATE POLICY "Users can view own chat messages"
  ON public.chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chats
      WHERE chats.id = chat_messages.chat_id
      AND (chats.user1_id = auth.uid() OR chats.user2_id = auth.uid())
    )
  );

-- Users can insert messages in chats they're part of
CREATE POLICY "Users can send messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.chats
      WHERE chats.id = chat_messages.chat_id
      AND (chats.user1_id = auth.uid() OR chats.user2_id = auth.uid())
      AND chats.is_active = TRUE
    )
  );

-- Users can update their own messages (mark as read, etc.)
CREATE POLICY "Users can update own messages"
  ON public.chat_messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.chats
      WHERE chats.id = chat_messages.chat_id
      AND (chats.user1_id = auth.uid() OR chats.user2_id = auth.uid())
    )
  );

-- ============================================
-- PRESENCE POLICIES
-- ============================================

-- Users can view their own presence
CREATE POLICY "Users can view own presence"
  ON public.presence FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert/update their own presence (via edge function)
CREATE POLICY "Users can update own presence"
  ON public.presence FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Presence is ephemeral and server-managed
-- Beacon→user resolution happens server-side only


