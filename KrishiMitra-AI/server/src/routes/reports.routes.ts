import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getReports } from '../controllers/reports.controller.js';

export const reportsRouter = Router();

reportsRouter.use(requireAuth);
reportsRouter.get('/reports', getReports);
