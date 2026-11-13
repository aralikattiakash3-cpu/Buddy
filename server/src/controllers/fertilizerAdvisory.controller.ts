import { Request, Response, NextFunction } from 'express';
import { fertilizerInputSchema } from '../schemas/index.js';
import { FertilizerAdvisoryService } from '../services/fertilizerAdvisory.service.js';

export class FertilizerAdvisoryController {
  static async generate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const validatedInput = fertilizerInputSchema.parse(req.body);

      const result = await FertilizerAdvisoryService.generateFertilizerGuidance(
        validatedInput,
        userId,
        req.scopedSupabase
      );

      res.status(201).json({
        success: true,
        message: 'Fertilizer advisory generated successfully',
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
      const list = await FertilizerAdvisoryService.listUserFertilizers(
        userId,
        req.scopedSupabase
      );

      res.json({
        success: true,
        message: 'Fertilizer advisories retrieved',
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

      const record = await FertilizerAdvisoryService.getFertilizerById(
        id,
        userId,
        req.scopedSupabase
      );

      if (!record) {
        res.status(404).json({
          success: false,
          message: 'Fertilizer advisory not found',
          data: null,
          error: { code: 'NOT_FOUND' },
        });
        return;
      }

      res.json({
        success: true,
        message: 'Fertilizer advisory retrieved',
        data: record,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
}
