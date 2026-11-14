# KrishiMitra AI — System Architecture

## Overview
KrishiMitra AI is an intelligent, multilingual agriculture assistant designed for Indian farmers. The application is organized as a full-stack monorepo featuring a React Vite TypeScript frontend, an Express TypeScript backend, Supabase PostgreSQL with Row Level Security, Google Gemini multimodal AI capabilities, and Open-Meteo weather intelligence.

## Directory Structure
```
KrishiMitra-AI/
├── client/                     # Frontend SPA (React, TypeScript, Vite, Tailwind)
│   ├── src/
│   │   ├── components/         # Reusable UI & Layout components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── layouts/            # Public & Dashboard Layouts
│   │   ├── pages/              # 14 Application routes
│   │   ├── services/           # API and Supabase service clients
│   │   ├── types/              # TypeScript interface definitions
│   │   └── utils/              # Utility helpers
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── server/                     # Backend API (Node.js, Express, TypeScript)
│   ├── src/
│   │   ├── config/             # Environment validation with Zod
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Security, rate limiting & error handling
│   │   ├── routes/             # Express API routers
│   │   ├── schemas/            # Request validation schemas
│   │   ├── services/           # Gemini AI & Supabase services
│   │   └── utils/              # Helper utilities
│   ├── tsconfig.json
│   └── package.json
├── supabase/
│   └── migrations/             # SQL schema migrations with RLS policies
├── docs/                       # Architecture & API documentation
├── package.json                # Monorepo root scripts
└── README.md
```

## Security & Privacy Highlights
- Gemini API keys and Supabase secret keys remain strictly on the backend.
- Rate limiting protects backend endpoints against abuse.
- Input validation on all requests using Zod schemas.
- Helmet security headers and configured CORS origins.
- Supabase Row Level Security (RLS) ensures complete farmer data isolation.
