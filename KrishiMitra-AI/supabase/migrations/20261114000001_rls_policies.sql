-- ====================================================================
-- KRISHIMITRA AI — RLS POLICIES MIGRATION
-- File: 20261114000001_rls_policies.sql
-- ====================================================================
-- PURPOSE
--   pg_policies returns zero rows because the second schema migration
--   (20261113000001_krishimitra_schema.sql) was truncated before its
--   policy block was written.  This standalone migration applies every
--   required RLS policy idempotently — DROP POLICY IF EXISTS before
--   each CREATE POLICY — so it is safe to run multiple times.
--
-- WHAT THIS FILE DOES
--   • Verifies RLS is still enabled on all six tables (no-op if already on).
--   • Creates SELECT / INSERT / UPDATE / DELETE policies for:
--       profiles, advisory_reports, chat_sessions, chat_messages,
--       farming_tasks, notifications
--   • For chat_messages: access is derived from ownership of the
--     parent chat_sessions row (EXISTS sub-query), not a direct column.
--   • Drops the public plant-doctor-images bucket policy and replaces
--     it with owner-scoped policies: each farmer can only read/write/
--     delete objects whose storage path starts with their own user id.
--   • Does NOT drop tables, disable RLS, or modify table data.
-- ====================================================================

-- ----------------------------------------------------------------
-- 0. Confirm RLS is enabled (idempotent — safe if already enabled)
-- ----------------------------------------------------------------
ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisory_reports  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farming_tasks     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications     ENABLE ROW LEVEL SECURITY;


-- ====================================================================
-- TABLE 1: profiles
-- Identity column: id (equals auth.uid() directly)
-- ====================================================================

DROP POLICY IF EXISTS "profiles_select_own"  ON public.profiles;
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING ( auth.uid() = id );

DROP POLICY IF EXISTS "profiles_insert_own"  ON public.profiles;
CREATE POLICY "profiles_insert_own"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK ( auth.uid() = id );

DROP POLICY IF EXISTS "profiles_update_own"  ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING     ( auth.uid() = id )
  WITH CHECK( auth.uid() = id );

-- Farmers do not delete their own auth account via this table;
-- the CASCADE on auth.users handles cleanup automatically.


-- ====================================================================
-- TABLE 2: advisory_reports
-- Identity column: user_id
-- ====================================================================

DROP POLICY IF EXISTS "advisory_reports_select_own"  ON public.advisory_reports;
CREATE POLICY "advisory_reports_select_own"
  ON public.advisory_reports
  FOR SELECT
  TO authenticated
  USING ( auth.uid() = user_id );

DROP POLICY IF EXISTS "advisory_reports_insert_own"  ON public.advisory_reports;
CREATE POLICY "advisory_reports_insert_own"
  ON public.advisory_reports
  FOR INSERT
  TO authenticated
  WITH CHECK ( auth.uid() = user_id );

-- Reports are append-only; UPDATE is intentionally omitted to
-- preserve audit integrity of diagnostic results.

DROP POLICY IF EXISTS "advisory_reports_delete_own"  ON public.advisory_reports;
CREATE POLICY "advisory_reports_delete_own"
  ON public.advisory_reports
  FOR DELETE
  TO authenticated
  USING ( auth.uid() = user_id );


-- ====================================================================
-- TABLE 3: chat_sessions
-- Identity column: user_id
-- ====================================================================

DROP POLICY IF EXISTS "chat_sessions_select_own"  ON public.chat_sessions;
CREATE POLICY "chat_sessions_select_own"
  ON public.chat_sessions
  FOR SELECT
  TO authenticated
  USING ( auth.uid() = user_id );

DROP POLICY IF EXISTS "chat_sessions_insert_own"  ON public.chat_sessions;
CREATE POLICY "chat_sessions_insert_own"
  ON public.chat_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK ( auth.uid() = user_id );

DROP POLICY IF EXISTS "chat_sessions_update_own"  ON public.chat_sessions;
CREATE POLICY "chat_sessions_update_own"
  ON public.chat_sessions
  FOR UPDATE
  TO authenticated
  USING     ( auth.uid() = user_id )
  WITH CHECK( auth.uid() = user_id );

DROP POLICY IF EXISTS "chat_sessions_delete_own"  ON public.chat_sessions;
CREATE POLICY "chat_sessions_delete_own"
  ON public.chat_sessions
  FOR DELETE
  TO authenticated
  USING ( auth.uid() = user_id );


-- ====================================================================
-- TABLE 4: chat_messages
-- No direct user_id column.  Access is authorised via the parent
-- chat_sessions record — the EXISTS sub-query re-checks RLS on
-- chat_sessions, so a farmer can only reach messages that belong
-- to a session they own.
-- ====================================================================

DROP POLICY IF EXISTS "chat_messages_select_own_sessions"  ON public.chat_messages;
CREATE POLICY "chat_messages_select_own_sessions"
  ON public.chat_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM   public.chat_sessions cs
      WHERE  cs.id      = chat_messages.session_id
      AND    cs.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "chat_messages_insert_own_sessions"  ON public.chat_messages;
CREATE POLICY "chat_messages_insert_own_sessions"
  ON public.chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM   public.chat_sessions cs
      WHERE  cs.id      = chat_messages.session_id
      AND    cs.user_id = auth.uid()
    )
  );

-- Messages are immutable once written; UPDATE / DELETE on
-- individual messages is intentionally not granted.  Deleting a
-- chat_sessions row cascades to its messages automatically.


-- ====================================================================
-- TABLE 5: farming_tasks
-- Identity column: user_id
-- ====================================================================

DROP POLICY IF EXISTS "farming_tasks_select_own"  ON public.farming_tasks;
CREATE POLICY "farming_tasks_select_own"
  ON public.farming_tasks
  FOR SELECT
  TO authenticated
  USING ( auth.uid() = user_id );

DROP POLICY IF EXISTS "farming_tasks_insert_own"  ON public.farming_tasks;
CREATE POLICY "farming_tasks_insert_own"
  ON public.farming_tasks
  FOR INSERT
  TO authenticated
  WITH CHECK ( auth.uid() = user_id );

DROP POLICY IF EXISTS "farming_tasks_update_own"  ON public.farming_tasks;
CREATE POLICY "farming_tasks_update_own"
  ON public.farming_tasks
  FOR UPDATE
  TO authenticated
  USING     ( auth.uid() = user_id )
  WITH CHECK( auth.uid() = user_id );

DROP POLICY IF EXISTS "farming_tasks_delete_own"  ON public.farming_tasks;
CREATE POLICY "farming_tasks_delete_own"
  ON public.farming_tasks
  FOR DELETE
  TO authenticated
  USING ( auth.uid() = user_id );


-- ====================================================================
-- TABLE 6: notifications
-- Identity column: user_id
-- Farmers read and mark-read their own notifications.
-- Only the backend service-role key may insert notifications.
-- ====================================================================

DROP POLICY IF EXISTS "notifications_select_own"  ON public.notifications;
CREATE POLICY "notifications_select_own"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING ( auth.uid() = user_id );

DROP POLICY IF EXISTS "notifications_update_own"  ON public.notifications;
CREATE POLICY "notifications_update_own"
  ON public.notifications
  FOR UPDATE
  TO authenticated
  USING     ( auth.uid() = user_id )
  WITH CHECK( auth.uid() = user_id );

-- INSERT and DELETE are reserved for the service-role key (backend).
-- The anon / authenticated roles cannot insert or delete notifications.


-- ====================================================================
-- STORAGE: plant-doctor-images bucket
-- ====================================================================
-- Make the bucket private.  Objects must be accessed via signed URLs
-- or the owner's own session.  This replaces the previous public=true
-- bucket policy that exposed all images to anyone with the URL.
-- ====================================================================

UPDATE storage.buckets
SET    public = false
WHERE  id = 'plant-doctor-images';

-- Remove the old blanket policies that applied to all authenticated
-- users regardless of which user owns the object.
DROP POLICY IF EXISTS "Authenticated farmers can upload crop photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view plant doctor photos"          ON storage.objects;

-- ---- New owner-scoped storage policies ----
-- Convention: objects are stored at path  <user_id>/<filename>
-- auth.uid()::text matches the leading path segment.

DROP POLICY IF EXISTS "storage_plant_doctor_insert_own" ON storage.objects;
CREATE POLICY "storage_plant_doctor_insert_own"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'plant-doctor-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "storage_plant_doctor_select_own" ON storage.objects;
CREATE POLICY "storage_plant_doctor_select_own"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'plant-doctor-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "storage_plant_doctor_delete_own" ON storage.objects;
CREATE POLICY "storage_plant_doctor_delete_own"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'plant-doctor-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ====================================================================
-- VERIFICATION QUERY (run this in Supabase SQL Editor to confirm)
-- ====================================================================
-- SELECT schemaname, tablename, policyname, cmd, roles
-- FROM   pg_policies
-- WHERE  schemaname IN ('public', 'storage')
-- ORDER  BY tablename, cmd;
--
-- Expected: at least 18 rows covering all six tables and storage.
-- ====================================================================
