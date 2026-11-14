
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { env } from './config/env.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

// API Routers
import { healthRouter } from './routes/health.routes.js';
import { tasksRouter } from './routes/tasks.routes.js';
import { reportsRouter } from './routes/reports.routes.js';
import { plantDoctorRouter } from './routes/plantDoctor.routes.js';
import { assistantRouter } from './routes/assistant.routes.js';

export const app = express();

// ==========================================
// SECURITY
// ==========================================

app.use(helmet());

// ==========================================
// CORS CONFIGURATION
// ==========================================

app.use(
  cors({
    origin: [
      env.FRONTEND_URL,
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5174',
    ],
    credentials: true,
    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
  })
);

// ==========================================
// BODY PARSERS
// ==========================================

app.use(express.json({ limit: '10mb' }));

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  })
);

// ==========================================
// RATE LIMITING
// ==========================================

app.use('/api', apiRateLimiter);

// ==========================================
// HEALTH CHECK
// ==========================================

app.use('/api', healthRouter);

// ==========================================
// FARMER TASKS
// ==========================================

app.use('/api', tasksRouter);

// ==========================================
// FARMING REPORTS
// ==========================================

app.use('/api', reportsRouter);

// ==========================================
// AI PLANT DOCTOR
// ==========================================
// POST /api/plant-doctor/analyze
// Router must define POST /analyze

app.use('/api/plant-doctor', plantDoctorRouter);

// ==========================================
// MULTILINGUAL AI FARMING ASSISTANT
// ==========================================
// POST /api/assistant/chat
// Supports:
// Kannada, Hindi, English,
// Tamil, Telugu, Marathi

app.use('/api/assistant', assistantRouter);

// ==========================================
// API 404 HANDLER
// ==========================================

app.use('/api/*', (_req, res) => {
  res.status(404).json({
    status: 'error',
    message:
      'Requested API endpoint was not found on KrishiMitra AI backend.',
  });
});

// ==========================================
// CENTRALIZED ERROR HANDLER
// ==========================================

app.use(errorHandler);
