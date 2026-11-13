-- Initial Schema for AI-Powered Agriculture Crop Advisory Assistant
-- Version: 20261113000001

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    state TEXT,
    district TEXT,
    village TEXT,
    preferred_language TEXT NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'kn', 'hi')),
    farming_experience TEXT,
    land_area NUMERIC(12,2),
    land_unit TEXT,
    farming_type TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Crop Recommendations Table
CREATE TABLE IF NOT EXISTS public.crop_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    soil_type TEXT NOT NULL,
    soil_ph NUMERIC(4,2),
    nitrogen NUMERIC(10,2),
    phosphorus NUMERIC(10,2),
    potassium NUMERIC(10,2),
    land_area NUMERIC(12,2) NOT NULL,
    land_unit TEXT NOT NULL,
    irrigation_type TEXT NOT NULL,
    water_availability TEXT NOT NULL,
    season TEXT NOT NULL,
    farming_objective TEXT NOT NULL,
    recommendations JSONB NOT NULL,
    confidence TEXT,
    ai_model TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Crop Advisories Table
CREATE TABLE IF NOT EXISTS public.crop_advisories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    crop_name TEXT NOT NULL,
    crop_variety TEXT,
    sowing_date DATE,
    growth_stage TEXT,
    soil_type TEXT,
    irrigation_type TEXT,
    location JSONB,
    advisory JSONB NOT NULL,
    ai_model TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Disease Analyses Table
CREATE TABLE IF NOT EXISTS public.disease_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    crop_name TEXT,
    plant_part TEXT,
    image_path TEXT,
    symptoms TEXT,
    analysis JSONB NOT NULL,
    confidence TEXT,
    ai_model TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Fertilizer Advisories Table
CREATE TABLE IF NOT EXISTS public.fertilizer_advisories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    crop_name TEXT NOT NULL,
    growth_stage TEXT,
    soil_type TEXT,
    soil_ph NUMERIC(4,2),
    nitrogen NUMERIC(10,2),
    phosphorus NUMERIC(10,2),
    potassium NUMERIC(10,2),
    advisory JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Irrigation Advisories Table
CREATE TABLE IF NOT EXISTS public.irrigation_advisories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    crop_name TEXT NOT NULL,
    growth_stage TEXT,
    soil_type TEXT,
    irrigation_type TEXT,
    water_availability TEXT,
    advisory JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Chat Sessions Table
CREATE TABLE IF NOT EXISTS public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Agriculture Conversation',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Farming Activities Table
CREATE TABLE IF NOT EXISTS public.farming_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    crop_name TEXT,
    activity_type TEXT NOT NULL,
    description TEXT,
    activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_crop_recommendations_user ON public.crop_recommendations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crop_advisories_user ON public.crop_advisories(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_disease_analyses_user ON public.disease_analyses(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fertilizer_advisories_user ON public.fertilizer_advisories(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_irrigation_advisories_user ON public.irrigation_advisories(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON public.chat_sessions(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON public.chat_messages(session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_farming_activities_user ON public.farming_activities(user_id, activity_date DESC);

-- Updated At Trigger Function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_chat_sessions_updated_at ON public.chat_sessions;
CREATE TRIGGER trigger_chat_sessions_updated_at
BEFORE UPDATE ON public.chat_sessions
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto create profile on auth.user sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, preferred_language)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fertilizer_advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.irrigation_advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farming_activities ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Crop Recommendations Policies
CREATE POLICY "Users can view own recommendations" ON public.crop_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own recommendations" ON public.crop_recommendations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own recommendations" ON public.crop_recommendations FOR DELETE USING (auth.uid() = user_id);

-- Crop Advisories Policies
CREATE POLICY "Users can view own crop advisories" ON public.crop_advisories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own crop advisories" ON public.crop_advisories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own crop advisories" ON public.crop_advisories FOR DELETE USING (auth.uid() = user_id);

-- Disease Analyses Policies
CREATE POLICY "Users can view own disease analyses" ON public.disease_analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own disease analyses" ON public.disease_analyses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own disease analyses" ON public.disease_analyses FOR DELETE USING (auth.uid() = user_id);

-- Fertilizer Advisories Policies
CREATE POLICY "Users can view own fertilizer advisories" ON public.fertilizer_advisories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own fertilizer advisories" ON public.fertilizer_advisories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own fertilizer advisories" ON public.fertilizer_advisories FOR DELETE USING (auth.uid() = user_id);

-- Irrigation Advisories Policies
CREATE POLICY "Users can view own irrigation advisories" ON public.irrigation_advisories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own irrigation advisories" ON public.irrigation_advisories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own irrigation advisories" ON public.irrigation_advisories FOR DELETE USING (auth.uid() = user_id);

-- Chat Sessions Policies
CREATE POLICY "Users can view own chat sessions" ON public.chat_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own chat sessions" ON public.chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own chat sessions" ON public.chat_sessions FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own chat sessions" ON public.chat_sessions FOR DELETE USING (auth.uid() = user_id);

-- Chat Messages Policies
CREATE POLICY "Users can view own chat messages" ON public.chat_messages FOR SELECT USING (
    auth.uid() = user_id AND session_id IN (SELECT id FROM public.chat_sessions WHERE user_id = auth.uid())
);
CREATE POLICY "Users can insert own chat messages" ON public.chat_messages FOR INSERT WITH CHECK (
    auth.uid() = user_id AND session_id IN (SELECT id FROM public.chat_sessions WHERE user_id = auth.uid())
);
CREATE POLICY "Users can delete own chat messages" ON public.chat_messages FOR DELETE USING (
    auth.uid() = user_id AND session_id IN (SELECT id FROM public.chat_sessions WHERE user_id = auth.uid())
);

-- Farming Activities Policies
CREATE POLICY "Users can view own farming activities" ON public.farming_activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own farming activities" ON public.farming_activities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own farming activities" ON public.farming_activities FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own farming activities" ON public.farming_activities FOR DELETE USING (auth.uid() = user_id);

-- Storage bucket creation and policy (for crop disease images)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('crop-images', 'crop-images', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload crop images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'crop-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can read own crop images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'crop-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own crop images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'crop-images' AND auth.uid()::text = (storage.foldername(name))[1]);
