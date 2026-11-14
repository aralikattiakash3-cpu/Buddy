# KrishiMitra AI (ಕೃಷಿಮಿತ್ರ AI)

> **Speak. Diagnose. Decide. Grow.**  
> Intelligent Multilingual Agriculture Platform for Indian Farmers (Kannada • Hindi • English).

---

## 🌾 Overview
KrishiMitra AI is an AI-powered smart agriculture assistant designed to empower Indian farmers with:
- **AI Plant Doctor**: Multimodal leaf disease analysis and organic remedies.
- **Multilingual Voice Assistant**: Conversational farming guidance in Kannada, Hindi, and English.
- **Crop Recommendation Engine**: Location, soil, and climate-matched crop suggestions.
- **Agricultural Weather Hub**: Live Open-Meteo weather intelligence and farm alerts.
- **Soil & Irrigation Advisors**: Nutrient optimization and precision watering schedules.
- **Farming Action Planner**: Task tracking and field action management.

---

## 🛠️ Technology Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts, Sonner.
- **Backend**: Node.js, Express, TypeScript, `@google/genai` (Gemini API), Zod, Helmet, CORS, Express Rate Limit.
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS).
- **Weather API**: Open-Meteo.

---

## 📁 Repository Structure
```
KrishiMitra-AI/
├── client/          # Vite + React + TypeScript frontend
├── server/          # Express + TypeScript backend
├── supabase/        # Database migrations & RLS policies
├── docs/            # Architecture and system documentation
├── package.json     # Workspace management scripts
└── README.md
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
# In the client directory
cd client
npm install

# In the server directory
cd ../server
npm install
```

### 2. Configure Environment Variables
Copy the `.env.example` templates to `.env`:

**Server** (`server/.env`):
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your-supabase-service-role-secret-key
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash
```

**Client** (`client/.env`):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Run the Development Servers
```bash
# Run server (from root)
npm run dev:server

# Run client (from root)
npm run dev:client
```
- Client runs on: `http://localhost:5173`
- Backend API runs on: `http://localhost:5000`
- Health check: `http://localhost:5000/api/health`
