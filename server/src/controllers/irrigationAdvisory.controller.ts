import { Request, Response, NextFunction } from 'express';
import { irrigationInputSchema } from '../schemas/index.js';
import { IrrigationAdvisoryService } from '../services/irrigationAdvisory.service.js';

export class IrrigationAdvisoryController {
  static async generate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const validatedInput = irrigationInputSchema.parse(req.body);

      const result = await IrrigationAdvisoryService.generateIrrigationGuidance(
        validatedInput,
        userId,
        req.scopedSupabase
      );

      res.status(201).json({
        success: true,
        message: 'Irrigation advisory generated successfully',
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
      const list = await IrrigationAdvisoryService.listUserIrrigations(
        userId,
        req.scopedSupabase
      );

      res.json({
        success: true,
        message: 'Irrigation advisories retrieved',
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

      const record = await IrrigationAdvisoryService.getIrrigationById(
        id,
        userId,
        req.scopedSupabase
      );

      if (!record) {
        res.status(404).json({
          success: false,
          message: 'Irrigation advisory not found',
          data: null,
          error: { code: 'NOT_FOUND' },
        });
        return;
      }

      res.json({
        success: true,
        message: 'Irrigation advisory retrieved',
        data: record,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
}
