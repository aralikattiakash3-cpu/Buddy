# KrishiSeva AI — Local Setup & Development Guide

This guide details how to install, configure, and run the **AI-Powered Agriculture Crop Advisory Assistant** locally.

---

## 1. Prerequisites

- **Node.js**: v18.0.0 or later (v20+ recommended)
- **NPM**: v9.0.0 or later
- **Supabase Account**: [https://supabase.com](https://supabase.com) (Free tier is sufficient)
- **Google Gemini API Key**: [https://aistudio.google.com](https://aistudio.google.com) (Free or pay-as-you-go)

---

## 2. Repository Installation

Clone or open the repository workspace and install root and workspace dependencies:

```bash
# In the repository root:
npm install
```

This installs dependencies for both `server` (Node.js + Express + TypeScript) and `client` (React + Vite + Tailwind CSS).

---

## 3. Database & Authentication Setup (Supabase)

1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard) and click **New Project**.
2. Name your project (e.g. `krishiseva-ai`) and set a secure database password.
3. Once the database is provisioned, navigate to the **SQL Editor** on the left menu.
4. Copy the entire contents of `supabase/migrations/20261113000001_initial_schema.sql` and run it in the SQL Editor.
   - This creates all 9 production tables (`profiles`, `crop_recommendations`, `crop_advisories`, `disease_analyses`, `fertilizer_advisories`, `irrigation_advisories`, `chat_sessions`, `chat_messages`, `farming_activities`).
   - Enables Row Level Security (RLS) on all user-owned tables.
   - Creates the `crop-images` private storage bucket and access policies.
   - Installs triggers for auto-updating timestamps and creating user profiles upon registration.
5. In your Supabase dashboard, navigate to **Project Settings** -> **API**:
   - Copy **Project URL** (e.g. `https://xyzcompany.supabase.co`).
   - Copy **Project API Key (anon/public)**.
   - Copy **Project API Key (service_role)** (Keep this secret! Never expose to client).

---

## 4. Google Gemini AI Setup

1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Click **Get API Key** and generate a new key for your project.
3. Copy your Gemini API key.
4. Recommended model: `gemini-2.5-flash` (or `gemini-1.5-flash`).

---

## 5. Environment Variables Configuration

### A. Backend Configuration (`server/.env`)

Create or update `server/.env`:

```env
NODE_ENV=development
PORT=5000

CLIENT_URL=http://localhost:5173

# Supabase Credentials
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash

# Uploads & Rate Limiting
MAX_IMAGE_SIZE_MB=8
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=60

LOG_LEVEL=info
```

### B. Frontend Configuration (`client/.env`)

Create or update `client/.env`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

> **Security Rule**: The `VITE_` frontend variables only contain the public Anon key. Never include `SUPABASE_SERVICE_ROLE_KEY` or `GEMINI_API_KEY` in `client/.env`.

---

## 6. Running the Application

Open two terminal sessions or run concurrently:

### Terminal 1: Backend Server

```bash
npm --prefix server run dev
```

Output:
```
=======================================================
  KRISHISEVA AI: Agriculture Crop Advisory Server   
  Environment: development
  Listening on: http://localhost:5000
  Supabase: Connected
  Gemini AI: Active (gemini-2.5-flash)
=======================================================
```

### Terminal 2: Frontend Client

```bash
npm --prefix client run dev
```

Output:
```
  VITE v6.x.x  ready in 300 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open your browser to `http://localhost:5173`.

---

## 7. Verification Steps

1. Visit `http://localhost:5173/` and verify the Landing Page loads.
2. Click **Get Started Free** and register a new farmer account.
3. Go to **Farmer Profile** and fill in your district, soil type, and preferred language.
4. Test **Crop Recommendation**: Submit your state, soil type, and season to view AI-generated recommendations.
5. Test **Crop Disease Detection**: Upload a crop leaf photo to verify Gemini vision analysis.
6. Test **Kisan AI Chatbot**: Ask questions in English, Kannada, or Hindi.
7. Test **Advisory History** & **Download PDF Report**.
