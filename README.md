# KrishiSeva AI — AI-Powered Agriculture Crop Advisory Assistant

A production-grade, full-stack agricultural decision-support web application designed for Indian farmers. KrishiSeva AI integrates **Google Gemini AI** (`@google/genai`), **Supabase Authentication & PostgreSQL**, **Node.js/Express**, and **React with TypeScript & Tailwind CSS** to deliver actionable, localized farming advice.

---

## 🌟 Key Capabilities

1. **Intelligent Crop Recommendation Engine**: Suggests the top 5 most suitable crops based on soil type, soil pH, NPK levels, farm location, season (Kharif, Rabi, Zaid), land area, and water availability.
2. **Crop Cultivation Advisory Guide**: Generates comprehensive lifecycle cultivation guides — land prep, seed selection, spacing, growth stages, irrigation, nutrient plans, weed management, and harvesting.
3. **AI Crop Health & Disease Detection**: Multimodal image analysis using Gemini Vision to evaluate uploaded photos of leaves and stems, identifying visible symptoms, possible conditions, abiotic causes, and preventive actions.
4. **Fertilizer & Nutrient Guidance**: Crop and stage-specific nutrient management balancing chemical and organic options (FYM, vermicompost, Jeevamrutha).
5. **Irrigation & Water Management**: Tailored watering guidance based on growth phase, soil water-holding capacity, and irrigation facilities (drip, sprinkler, canal, rainfed).
6. **Kisan AI Interactive Chatbot**: Conversational assistant supporting **English**, **Kannada (ಕನ್ನಡ)**, and **Hindi (हिन्दी)** with context-aware responses and follow-up prompts.
7. **Advisory History & PDF Reports**: Saves previous recommendations with full ownership isolation; farmers can download official, printable PDF advisory reports with disclaimers.
8. **Farmer Dashboard**: Real-time dashboard statistics derived from authenticated PostgreSQL records, tracking recent farm activities and recommendations.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, React Router DOM, React Hook Form, Zod, Sonner, Lucide React, jsPDF |
| **Backend** | Node.js, Express.js, TypeScript, Zod, Multer, Helmet, CORS, Express-Rate-Limit, Morgan |
| **Database & Auth** | Supabase PostgreSQL, Supabase Auth, Row-Level Security (RLS), Supabase Storage |
| **AI Integration** | Google Gemini (`@google/genai` official SDK, `gemini-2.5-flash`), Structured JSON Output, Multimodal Vision |

---

## 📁 Repository Structure

```text
buddyas/
├── client/                     # React Frontend (Vite + TypeScript)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Layout, common, and advisory components
│   │   ├── contexts/           # AuthContext (Supabase) & LanguageContext (EN/KN/HI)
│   │   ├── lib/                # Supabase browser client
│   │   ├── pages/              # All 15 application routes
│   │   ├── services/           # Authenticated API client
│   │   ├── types/              # TypeScript interfaces
│   │   ├── utils/              # Constants, PDF generator
│   │   ├── App.tsx             # Route definitions & protected guards
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── server/                     # Node.js + Express Backend API
│   ├── src/
│   │   ├── config/             # Zod environment, Gemini, Supabase clients
│   │   ├── controllers/        # REST controllers
│   │   ├── middleware/         # Auth, error handling, rate limiting, upload
│   │   ├── prompts/            # Master Agricultural System & Task Prompts
│   │   ├── routes/             # API routes (/api/v1)
│   │   ├── schemas/            # Zod request & AI response schemas
│   │   ├── services/           # Gemini AI services & DB operations
│   │   ├── utils/              # Resilient Gemini execution helper
│   │   ├── app.ts              # Express configuration & security
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── supabase/                   # Database migrations & seeds
│   ├── migrations/
│   │   └── 20261113000001_initial_schema.sql  # Production PostgreSQL DDL + RLS
│   └── seed.sql
│
├── docs/                       # Comprehensive documentation
│   ├── SETUP.md                # Local installation guide
│   ├── API.md                  # REST API reference
│   ├── DATABASE.md             # Schema, RLS, and storage rules
│   └── DEPLOYMENT.md           # Production deployment (Render + Vercel)
│
├── package.json                # Root workspaces
└── README.md
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Files
- Copy `server/.env.example` to `server/.env` and provide your `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `GEMINI_API_KEY`.
- Copy `client/.env.example` to `client/.env` with your public `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

### 3. Setup Database
Run `supabase/migrations/20261113000001_initial_schema.sql` in your Supabase project's SQL Editor.

### 4. Run Development Servers
```bash
# Terminal 1: Backend API
npm --prefix server run dev

# Terminal 2: Frontend App
npm --prefix client run dev
```

Visit `http://localhost:5173`.

---

## 📖 Detailed Guides

- [Setup & Local Development Guide](docs/SETUP.md)
- [REST API Reference](docs/API.md)
- [Database & Row-Level Security Architecture](docs/DATABASE.md)
- [Production Deployment Guide](docs/DEPLOYMENT.md)

---

## ⚠️ Agricultural Decision-Support Disclaimer

Recommendations provided by KrishiSeva AI are generated using agricultural principles and general agro-climatic conditions. They serve as decision-support guidance and do not replace professional laboratory soil analysis or diagnostic advice from certified agricultural extension officers (Krishi Vigyan Kendra). Always adhere to local state agricultural guidelines before chemical application.

---

## 📄 License

MIT License. Designed and built for the farming community.
