# KrishiSeva AI — Production Deployment Guide

This guide details how to deploy the application to production hosting providers.

---

## Architecture Overview

```
Frontend (Vercel / Netlify)
   │
   ├── [HTTPS / CORS] ──> Backend (Render / Railway / VPS)
   │                           │
   │                           ├── [SDK / API] ──> Google Gemini AI
   │                           │
   └── [Auth / REST] ──────────┴─────────────────> Supabase PostgreSQL & Storage
```

---

## 1. Database Deployment (Supabase)

1. Create a production project in [Supabase](https://supabase.com).
2. Go to **SQL Editor** -> run `supabase/migrations/20261113000001_initial_schema.sql`.
3. In **Authentication** -> **URL Configuration**:
   - Set **Site URL** to your frontend production domain (e.g. `https://krishiseva.vercel.app`).
   - Add redirect URLs: `https://krishiseva.vercel.app/**`.
4. In **Storage**, ensure the `crop-images` bucket is private with RLS active.

---

## 2. Backend Deployment (Render / Railway)

### Using Render

1. Create a **New Web Service** connected to your repository.
2. Configure settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Environment**: Node
3. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (or Render's default)
   - `CLIENT_URL`: `https://krishiseva.vercel.app`
   - `SUPABASE_URL`: `https://your-project.supabase.co`
   - `SUPABASE_ANON_KEY`: `your-supabase-anon-key`
   - `SUPABASE_SERVICE_ROLE_KEY`: `your-supabase-service-role-key`
   - `GEMINI_API_KEY`: `your-google-gemini-api-key`
   - `GEMINI_MODEL`: `gemini-2.5-flash`
   - `MAX_IMAGE_SIZE_MB`: `8`
   - `RATE_LIMIT_WINDOW_MS`: `900000`
   - `RATE_LIMIT_MAX_REQUESTS`: `60`
4. Deploy the service. Verify `https://your-api.onrender.com/api/v1/health` returns status `ok`.

---

## 3. Frontend Deployment (Vercel)

1. In the [Vercel Dashboard](https://vercel.com), click **Add New Project**.
2. Select your repository.
3. Configure project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Set Environment Variables:
   - `VITE_SUPABASE_URL`: `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `your-supabase-anon-key`
   - `VITE_API_BASE_URL`: `https://your-api.onrender.com/api/v1`
5. Click **Deploy**.

---

## 4. Production Security Checklist

- [x] `SUPABASE_SERVICE_ROLE_KEY` is ONLY present on the backend.
- [x] `GEMINI_API_KEY` is ONLY present on the backend.
- [x] Helmet security headers active.
- [x] CORS restricted to production frontend origin.
- [x] Express rate limiter enabled on all `/api/v1` routes.
- [x] Image uploads validated for MIME type (`jpg`, `jpeg`, `png`, `webp`) and size (<= 8MB).
- [x] Row-Level Security (RLS) active on all PostgreSQL tables.
- [x] HTTPS enforced on frontend and backend.
- [x] All Gemini AI structured outputs validated with Zod before storage and delivery.
