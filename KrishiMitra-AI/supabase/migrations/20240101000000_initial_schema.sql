-- ====================================================================
-- KRISHIMITRA AI (ಕೃಷಿಮಿತ್ರ AI) — COMPLETE PRODUCTION SUPABASE SCHEMA
-- Phase 2: Profiles, Advisory Reports, Tasks, Chat, Notifications & RLS
-- ====================================================================

-- 1. Enable pgcrypto / uuid-ossp for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing triggers if re-running
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- ====================================================================
-- TABLE 1: PROFILES (Farmer Details)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  state TEXT DEFAULT 'Karnataka',
  district TEXT DEFAULT 'Dharwad',
  preferred_language TEXT DEFAULT 'kn' CHECK (preferred_language IN ('kn', 'hi', 'en')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- TABLE 2: ADVISORY_REPORTS (Diagnostic & Recommendation History)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.advisory_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN ('plant_doctor', 'crop_advisor', 'soil_advisor', 'irrigation')),
  crop_name TEXT,
  input_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  result JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- TABLE 3: CHAT_SESSIONS (Multilingual AI Conversations)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Agricultural Advisory Session',
  language TEXT NOT NULL DEFAULT 'kn' CHECK (language IN ('kn', 'hi', 'en')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- TABLE 4: CHAT_MESSAGES (User & Assistant Dialogues)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- TABLE 5: FARMING_TASKS (Field Action Planner)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.farming_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- TABLE 6: NOTIFICATIONS (Weather Alerts & Reminders)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_advisory_reports_user_id ON public.advisory_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_advisory_reports_created_at ON public.advisory_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_farming_tasks_user_id ON public.farming_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_farming_tasks_due_date ON public.farming_tasks(due_date ASC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES — TOTAL DATA ISOLATION
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisory_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farming_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Farmers can view own profile" ON public.profiles;
CREATE POLICY "Farmers can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Farmers can update own profile" ON public.profiles;
CREATE POLICY "Farmers can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Farmers can insert own profile" ON public.profiles;
CREATE POLICY "Farmers can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Advisory Reports Policies
DROP POLICY IF EXISTS "Farmers can view own reports" ON public.advisory_reports;
CREATE POLICY "Farmers can view own reports"
  ON public.advisory_reports FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Farmers can insert own reports" ON public.advisory_reports;
CREATE POLICY "Farmers can insert own reports"
  ON public.advisory_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Farmers can delete own reports" ON public.advisory_reports;
CREATE POLICY "Farmers can delete own reports"
  ON public.advisory_reports FOR DELETE
  USING (auth.uid() = user_id);

-- Chat Sessions Policies
DROP POLICY IF EXISTS "Farmers can view own chat sessions" ON public.chat_sessions;
CREATE POLICY "Farmers can view own chat sessions"
  ON public.chat_sessions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Farmers can insert own chat sessions" ON public.chat_sessions;
CREATE POLICY "Farmers can insert own chat sessions"
  ON public.chat_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Farmers can update own chat sessions" ON public.chat_sessions;
CREATE POLICY "Farmers can update own chat sessions"
  ON public.chat_sessions FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Farmers can delete own chat sessions" ON public.chat_sessions;
CREATE POLICY "Farmers can delete own chat sessions"
  ON public.chat_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Chat Messages Policies
DROP POLICY IF EXISTS "Farmers can view messages of own sessions" ON public.chat_messages;
CREATE POLICY "Farmers can view messages of own sessions"
  ON public.chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_sessions
      WHERE chat_sessions.id = chat_messages.session_id
      AND chat_sessions.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Farmers can insert messages into own sessions" ON public.chat_messages;
CREATE POLICY "Farmers can insert messages into own sessions"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_sessions
      WHERE chat_sessions.id = chat_messages.session_id
      AND chat_sessions.user_id = auth.uid()
    )
  );

-- Farming Tasks Policies
DROP POLICY IF EXISTS "Farmers can view own tasks" ON public.farming_tasks;
CREATE POLICY "Farmers can view own tasks"
  ON public.farming_tasks FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Farmers can insert own tasks" ON public.farming_tasks;
CREATE POLICY "Farmers can insert own tasks"
  ON public.farming_tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Farmers can update own tasks" ON public.farming_tasks;
CREATE POLICY "Farmers can update own tasks"
  ON public.farming_tasks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Farmers can delete own tasks" ON public.farming_tasks;
CREATE POLICY "Farmers can delete own tasks"
  ON public.farming_tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Notifications Policies
DROP POLICY IF EXISTS "Farmers can view own notifications" ON public.notifications;
CREATE POLICY "Farmers can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Farmers can update own notifications" ON public.notifications;
CREATE POLICY "Farmers can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- ====================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    phone,
    state,
    district,
    preferred_language
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Kisan Bandhu'),
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'state', 'Karnataka'),
    COALESCE(NEW.raw_user_meta_data->>'district', 'Dharwad'),
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'kn')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    state = EXCLUDED.state,
    district = EXCLUDED.district,
    preferred_language = EXCLUDED.preferred_language,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ====================================================================
-- SUPABASE STORAGE: PLANT DOCTOR IMAGES BUCKET
-- ====================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('plant-doctor-images', 'plant-doctor-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: allow authenticated users to upload photos
DROP POLICY IF EXISTS "Authenticated farmers can upload crop photos" ON storage.objects;
CREATE POLICY "Authenticated farmers can upload crop photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'plant-doctor-images');

DROP POLICY IF EXISTS "Anyone can view plant doctor photos" ON storage.objects;
CREATE POLICY "Anyone can view plant doctor photos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'plant-doctor-images');
