import { Request, Response, NextFunction } from 'express';
import { cropAdvisoryInputSchema } from '../schemas/index.js';
import { CropAdvisoryService } from '../services/cropAdvisory.service.js';

export class CropAdvisoryController {
  static async generate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const validatedInput = cropAdvisoryInputSchema.parse(req.body);

      const result = await CropAdvisoryService.generateAdvisory(
        validatedInput,
        userId,
        req.scopedSupabase
      );

      res.status(201).json({
        success: true,
        message: 'Crop advisory generated successfully',
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
      const list = await CropAdvisoryService.listUserAdvisories(
        userId,
        req.scopedSupabase
      );

      res.json({
        success: true,
        message: 'Crop advisories retrieved',
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

      const record = await CropAdvisoryService.getAdvisoryById(
        id,
        userId,
        req.scopedSupabase
      );

      if (!record) {
        res.status(404).json({
          success: false,
          message: 'Crop advisory not found',
          data: null,
          error: { code: 'NOT_FOUND' },
        });
        return;
      }

      res.json({
        success: true,
        message: 'Crop advisory retrieved',
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

      await CropAdvisoryService.deleteAdvisory(
        id,
        userId,
        req.scopedSupabase
      );

      res.json({
        success: true,
        message: 'Crop advisory deleted successfully',
        data: { id },
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
}
