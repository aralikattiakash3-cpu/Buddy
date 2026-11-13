# KrishiSeva AI — Database & Storage Architecture

The application uses **PostgreSQL** hosted on **Supabase** with **Row-Level Security (RLS)** strictly enforced on all tables.

---

## 1. Schema Diagram & Relationships

```
auth.users (Supabase Managed)
    ├── (1:1) profiles [id = auth.users.id]
    ├── (1:N) crop_recommendations [user_id = auth.users.id]
    ├── (1:N) crop_advisories [user_id = auth.users.id]
    ├── (1:N) disease_analyses [user_id = auth.users.id]
    ├── (1:N) fertilizer_advisories [user_id = auth.users.id]
    ├── (1:N) irrigation_advisories [user_id = auth.users.id]
    ├── (1:N) farming_activities [user_id = auth.users.id]
    └── (1:N) chat_sessions [user_id = auth.users.id]
                   └── (1:N) chat_messages [session_id = chat_sessions.id]
```

---

## 2. Table Specifications

### 2.1 `public.profiles`
Stores farmer profile attributes and preferences.
- `id`: UUID (Primary Key, Foreign Key -> `auth.users(id)` ON DELETE CASCADE)
- `full_name`: TEXT NOT NULL
- `email`: TEXT
- `phone`: TEXT
- `state`: TEXT
- `district`: TEXT
- `village`: TEXT
- `preferred_language`: TEXT NOT NULL DEFAULT 'en' CHECK IN ('en', 'kn', 'hi')
- `farming_experience`: TEXT
- `land_area`: NUMERIC(12,2)
- `land_unit`: TEXT
- `farming_type`: TEXT
- `created_at`, `updated_at`: TIMESTAMPTZ NOT NULL

### 2.2 `public.crop_recommendations`
Stores AI-generated crop recommendations.
- `id`: UUID PRIMARY KEY DEFAULT `gen_random_uuid()`
- `user_id`: UUID NOT NULL REFERENCES `auth.users(id)` ON DELETE CASCADE
- `state`, `district`, `soil_type`: TEXT NOT NULL
- `soil_ph`, `nitrogen`, `phosphorus`, `potassium`: NUMERIC
- `land_area`: NUMERIC(12,2) NOT NULL
- `land_unit`, `irrigation_type`, `water_availability`, `season`, `farming_objective`: TEXT NOT NULL
- `recommendations`: JSONB NOT NULL (Top 5 crops, suitability scores, risks)
- `confidence`: TEXT ('low', 'medium', 'high')
- `ai_model`: TEXT (e.g. 'gemini-2.5-flash')
- `created_at`: TIMESTAMPTZ NOT NULL

### 2.3 `public.crop_advisories`
Stores crop cultivation guides.
- `id`: UUID PRIMARY KEY
- `user_id`: UUID NOT NULL REFERENCES `auth.users(id)` ON DELETE CASCADE
- `crop_name`: TEXT NOT NULL
- `crop_variety`, `growth_stage`, `soil_type`, `irrigation_type`: TEXT
- `sowing_date`: DATE
- `location`: JSONB
- `advisory`: JSONB NOT NULL (Land prep, seeds, stages, IPM, harvest)
- `ai_model`: TEXT
- `created_at`: TIMESTAMPTZ NOT NULL

### 2.4 `public.disease_analyses`
Stores image-based crop disease and symptom analyses.
- `id`: UUID PRIMARY KEY
- `user_id`: UUID NOT NULL REFERENCES `auth.users(id)` ON DELETE CASCADE
- `crop_name`, `plant_part`, `image_path`, `symptoms`: TEXT
- `analysis`: JSONB NOT NULL (Observations, conditions, actions, preventions)
- `confidence`: TEXT
- `ai_model`: TEXT
- `created_at`: TIMESTAMPTZ NOT NULL

### 2.5 `public.fertilizer_advisories`
Nutrient management plans.
- `id`: UUID PRIMARY KEY
- `user_id`: UUID NOT NULL REFERENCES `auth.users(id)` ON DELETE CASCADE
- `crop_name`, `growth_stage`, `soil_type`: TEXT NOT NULL
- `soil_ph`, `nitrogen`, `phosphorus`, `potassium`: NUMERIC
- `advisory`: JSONB NOT NULL
- `created_at`: TIMESTAMPTZ NOT NULL

### 2.6 `public.irrigation_advisories`
Water management guidance.
- `id`: UUID PRIMARY KEY
- `user_id`: UUID NOT NULL REFERENCES `auth.users(id)` ON DELETE CASCADE
- `crop_name`, `growth_stage`, `soil_type`, `irrigation_type`, `water_availability`: TEXT NOT NULL
- `advisory`: JSONB NOT NULL
- `created_at`: TIMESTAMPTZ NOT NULL

### 2.7 `public.chat_sessions` & `public.chat_messages`
Conversations with the Kisan AI Assistant.
- `chat_sessions`: `id`, `user_id`, `title`, `created_at`, `updated_at`
- `chat_messages`: `id`, `session_id`, `user_id`, `role` ('user' | 'assistant'), `content`, `created_at`

### 2.8 `public.farming_activities`
Activity audit log shown on dashboard.
- `id`: UUID PRIMARY KEY
- `user_id`: UUID NOT NULL REFERENCES `auth.users(id)` ON DELETE CASCADE
- `crop_name`, `activity_type`, `description`: TEXT
- `activity_date`: DATE NOT NULL DEFAULT CURRENT_DATE
- `created_at`: TIMESTAMPTZ NOT NULL

---

## 3. Row-Level Security (RLS) Implementation

RLS is enabled on every table without exception:

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fertilizer_advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.irrigation_advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farming_activities ENABLE ROW LEVEL SECURITY;
```

Access policies enforce that `auth.uid() = user_id` for SELECT, INSERT, UPDATE, and DELETE. For `chat_messages`, both user ID and session ownership are verified.

---

## 4. Storage Bucket (`crop-images`)

- Bucket ID: `crop-images`
- Visibility: **Private** (Not public)
- Folder path pattern: `{user_id}/{timestamp}-{filename}`
- Policies: Authenticated users can only INSERT, SELECT, and DELETE objects where `auth.uid()::text = (storage.foldername(name))[1]`.
