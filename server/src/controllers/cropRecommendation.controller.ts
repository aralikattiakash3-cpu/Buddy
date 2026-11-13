import { Request, Response, NextFunction } from 'express';
import { cropRecommendationInputSchema } from '../schemas/index.js';
import { CropRecommendationService } from '../services/cropRecommendation.service.js';

export class CropRecommendationController {
  static async generate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const validatedInput = cropRecommendationInputSchema.parse(req.body);

      const result = await CropRecommendationService.generateRecommendations(
        validatedInput,
        userId,
        req.scopedSupabase
      );

      res.status(201).json({
        success: true,
        message: 'Crop recommendations generated successfully',
        data: result,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const list = await CropRecommendationService.listUserRecommendations(
        userId,
        req.scopedSupabase
      );

      res.json({
        success: true,
        message: 'Crop recommendations retrieved',
        data: list,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;

      const record = await CropRecommendationService.getRecommendationById(
        id,
        userId,
        req.scopedSupabase
      );

      if (!record) {
        res.status(404).json({
          success: false,
          message: 'Crop recommendation not found',
          data: null,
          error: { code: 'NOT_FOUND' },
        });
        return;
      }

      res.json({
        success: true,
        message: 'Crop recommendation retrieved',
        data: record,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;

      await CropRecommendationService.deleteRecommendation(
        id,
        userId,
        req.scopedSupabase
      );

      res.json({
        success: true,
        message: 'Recommendation report deleted successfully',
        data: { id },
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
}
