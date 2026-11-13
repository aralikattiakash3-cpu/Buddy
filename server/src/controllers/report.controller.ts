import { Request, Response, NextFunction } from 'express';
import { getSupabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';

export class ReportController {
  static async getReportData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const type = req.params.type as string;
      const id = req.params.id as string;

      if (!isSupabaseConfigured()) {
        res.json({
          success: true,
          message: 'Report data retrieved (dev placeholder)',
          data: {
            type,
            id,
            profile: { full_name: 'Farmer' },
            report: {},
          },
          error: null,
        });
        return;
      }

      const db = req.scopedSupabase || getSupabaseAdmin();

      // Fetch profile
      const { data: profile } = await db
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      let tableName = '';
      switch (type) {
        case 'crop-recommendation':
        case 'crop_recommendation':
          tableName = 'crop_recommendations';
          break;
        case 'crop-advisory':
        case 'crop_advisory':
          tableName = 'crop_advisories';
          break;
        case 'disease-detection':
        case 'disease_detection':
          tableName = 'disease_analyses';
          break;
        case 'fertilizer':
        case 'fertilizer-advisory':
          tableName = 'fertilizer_advisories';
          break;
        case 'irrigation':
        case 'irrigation-advisory':
          tableName = 'irrigation_advisories';
          break;
        default:
          res.status(400).json({
            success: false,
            message: `Unsupported report type: ${type}`,
            data: null,
            error: { code: 'INVALID_REPORT_TYPE' },
          });
          return;
      }

      const { data: report, error } = await db
        .from(tableName)
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error || !report) {
        res.status(404).json({
          success: false,
          message: 'Report not found or access denied',
          data: null,
          error: { code: 'NOT_FOUND' },
        });
        return;
      }

      res.json({
        success: true,
        message: 'Report data retrieved successfully',
        data: {
          type,
          id,
          profile,
          report,
          generatedAt: new Date().toISOString(),
        },
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
}
