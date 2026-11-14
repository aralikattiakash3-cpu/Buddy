# KrishiMitra AI — Supabase Database & Auth Setup Guide

Follow these simple steps to configure your Supabase PostgreSQL database, authentication, and Row Level Security.

---

## Step 1: Create or Open a Supabase Project
1. Log in to [Supabase Console](https://supabase.com/dashboard).
2. Click **New project**.
3. Choose a Name (e.g. `KrishiMitra-AI`), generate a strong Database Password, and select the region closest to your users (e.g., `South Asia (Mumbai)`).
4. Wait 1-2 minutes for the database cluster to finish provisioning.

---

## Step 2: Run the SQL Schema Migration
1. In the Supabase dashboard left sidebar, navigate to the **SQL Editor** (icon looking like `>_` or SQL terminal).
2. Click **+ New query**.
3. Open the file [supabase/migrations/20261113000001_krishimitra_schema.sql](../supabase/migrations/20261113000001_krishimitra_schema.sql) in this repository.
4. Copy the entire contents and paste it into the Supabase SQL Editor.
5. Click the green **Run** button (or press `Ctrl+Enter` / `Cmd+Enter`).
6. You should see `Success. No rows returned`.

This query creates:
- `profiles` table (farmer details)
- `advisory_reports` table (disease diagnostics & recommendations)
- `chat_sessions` & `chat_messages` tables (AI assistant conversations)
- `farming_tasks` table (farm action planner)
- `notifications` table (weather and task alerts)
- Performance indexes on all foreign keys
- **Row Level Security (RLS)** policies on all tables so farmers can only see their own records
- Automated trigger (`handle_new_user`) that auto-populates the farmer's profile when they sign up
- `plant-doctor-images` Supabase storage bucket for crop photos

---

## Step 3: Get Your Supabase API Keys
1. In the Supabase left sidebar, click the **Settings** (gear icon) -> **API** (or **Project Settings** -> **API**).
2. Locate the following keys:
   - **Project URL** (e.g. `https://xyzcompany.supabase.co`)
   - **anon / public key** (client-side safe publishable key)
   - **service_role key** (secret key — keep this strictly on your backend `.env`!)

---

## Step 4: Add to Environment Variables

### In `client/.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-publishable-key
VITE_API_BASE_URL=http://localhost:5000/api
```

### In `server/.env`:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your-service-role-secret-key
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash
```

---

## Step 5: Verify Auth in Supabase
1. In the Supabase left sidebar, go to **Authentication** -> **Providers** -> **Email**.
2. Make sure **Enable Email provider** is turned ON.
3. (Recommended for development/hackathons): Under **Email Auth**, disable **Confirm email** so farmers can sign in immediately without waiting for an email confirmation link.
