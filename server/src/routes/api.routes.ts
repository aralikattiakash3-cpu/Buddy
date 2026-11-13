import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { ProfileController } from '../controllers/profile.controller.js';
import { CropRecommendationController } from '../controllers/cropRecommendation.controller.js';
import { CropAdvisoryController } from '../controllers/cropAdvisory.controller.js';
import { DiseaseDetectionController } from '../controllers/diseaseDetection.controller.js';
import { FertilizerAdvisoryController } from '../controllers/fertilizerAdvisory.controller.js';
import { IrrigationAdvisoryController } from '../controllers/irrigationAdvisory.controller.js';
import { ChatbotController } from '../controllers/chatbot.controller.js';
import { DashboardController } from '../controllers/dashboard.controller.js';
import { ReportController } from '../controllers/report.controller.js';
import { isSupabaseConfigured } from '../config/supabase.js';
import { isGeminiConfigured, GEMINI_MODEL } from '../config/gemini.js';

export const apiRouter = Router();

// ==========================================
// System Health Checks (Public)
// ==========================================
apiRouter.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'KrishiSeva AI API service is healthy',
    data: {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    error: null,
  });
});

apiRouter.get('/health/ready', (_req, res) => {
  const supabaseReady = isSupabaseConfigured();
  const geminiReady = isGeminiConfigured();

  res.json({
    success: true,
    message: 'Dependency readiness status',
    data: {
      services: {
        supabase: {
          configured: supabaseReady,
          status: supabaseReady ? 'ready' : 'unconfigured',
        },
        gemini: {
          configured: geminiReady,
          model: GEMINI_MODEL,
          status: geminiReady ? 'ready' : 'unconfigured',
        },
      },
      ready: true,
    },
    error: null,
  });
});

// ==========================================
// Protected Routes (Require Authentication)
// ==========================================

// Profile Routes
apiRouter.get('/profile', requireAuth, ProfileController.getProfile);
apiRouter.put('/profile', requireAuth, ProfileController.updateProfile);

// Crop Recommendations
apiRouter.post('/crop-recommendations', requireAuth, CropRecommendationController.generate);
apiRouter.get('/crop-recommendations', requireAuth, CropRecommendationController.list);
apiRouter.get('/crop-recommendations/:id', requireAuth, CropRecommendationController.getById);
apiRouter.delete('/crop-recommendations/:id', requireAuth, CropRecommendationController.delete);

// Crop Advisories
apiRouter.post('/crop-advisories', requireAuth, CropAdvisoryController.generate);
apiRouter.get('/crop-advisories', requireAuth, CropAdvisoryController.list);
apiRouter.get('/crop-advisories/:id', requireAuth, CropAdvisoryController.getById);
apiRouter.delete('/crop-advisories/:id', requireAuth, CropAdvisoryController.delete);

// Disease Detection
apiRouter.post(
  '/disease-detection',
  requireAuth,
  upload.single('image'),
  DiseaseDetectionController.analyze
);
apiRouter.get('/disease-detection', requireAuth, DiseaseDetectionController.list);
apiRouter.get('/disease-detection/:id', requireAuth, DiseaseDetectionController.getById);
apiRouter.delete('/disease-detection/:id', requireAuth, DiseaseDetectionController.delete);

// Fertilizer Advisory
apiRouter.post('/fertilizer-advisory', requireAuth, FertilizerAdvisoryController.generate);
apiRouter.get('/fertilizer-advisory', requireAuth, FertilizerAdvisoryController.list);
apiRouter.get('/fertilizer-advisory/:id', requireAuth, FertilizerAdvisoryController.getById);

// Irrigation Advisory
apiRouter.post('/irrigation-advisory', requireAuth, IrrigationAdvisoryController.generate);
apiRouter.get('/irrigation-advisory', requireAuth, IrrigationAdvisoryController.list);
apiRouter.get('/irrigation-advisory/:id', requireAuth, IrrigationAdvisoryController.getById);

// Chatbot Sessions & Messages
apiRouter.post('/chat/sessions', requireAuth, ChatbotController.createSession);
apiRouter.get('/chat/sessions', requireAuth, ChatbotController.listSessions);
apiRouter.get('/chat/sessions/:id', requireAuth, ChatbotController.getSession);
apiRouter.post('/chat/sessions/:id/messages', requireAuth, ChatbotController.sendMessage);
apiRouter.delete('/chat/sessions/:id', requireAuth, ChatbotController.deleteSession);

// Dashboard Analytics
apiRouter.get('/dashboard/summary', requireAuth, DashboardController.getSummary);
apiRouter.get('/dashboard/recent-activity', requireAuth, DashboardController.getRecentActivity);

// Printable Reports
apiRouter.get('/reports/:type/:id', requireAuth, ReportController.getReportData);
