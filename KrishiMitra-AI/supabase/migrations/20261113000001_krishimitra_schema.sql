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