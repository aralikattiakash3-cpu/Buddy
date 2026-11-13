import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service.js';

export class DashboardController {
  static async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const summary = await DashboardService.getSummary(userId, req.scopedSupabase);

      res.json({
        success: true,
        message: 'Dashboard summary retrieved',
        data: summary,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getRecentActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const activities = await DashboardService.getRecentActivities(userId, req.scopedSupabase);

      res.json({
        success: true,
        message: 'Recent farming activities retrieved',
        data: activities,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
}
