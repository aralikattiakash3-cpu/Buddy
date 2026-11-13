import { Request, Response, NextFunction } from 'express';
import { DiseaseDetectionService } from '../services/diseaseDetection.service.js';

export class DiseaseDetectionController {
  static async analyze(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const file = req.file;

      if (!file) {
        res.status(400).json({
          success: false,
          message: 'Crop image is required for disease analysis',
          data: null,
          error: {
            code: 'FILE_REQUIRED',
          },
        });
        return;
      }

      const metadata = {
        cropName: req.body.cropName,
        plantPart: req.body.plantPart,
        symptoms: req.body.symptoms,
        duration: req.body.duration,
        location: req.body.location,
      };

      const result = await DiseaseDetectionService.analyzeCropImage(
        file,
        metadata,
        userId,
        req.scopedSupabase
      );

      res.status(201).json({
        success: true,
        message: 'Crop health analysis completed successfully',
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
      const list = await DiseaseDetectionService.listUserAnalyses(
        userId,
        req.scopedSupabase
      );

      res.json({
        success: true,
        message: 'Disease analysis reports retrieved',
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

      const record = await DiseaseDetectionService.getAnalysisById(
        id,
        userId,
        req.scopedSupabase
      );

      if (!record) {
        res.status(404).json({
          success: false,
          message: 'Disease analysis report not found',
          data: null,
          error: { code: 'NOT_FOUND' },
        });
        return;
      }

      res.json({
        success: true,
        message: 'Disease analysis report retrieved',
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

      await DiseaseDetectionService.deleteAnalysis(
        id,
        userId,
        req.scopedSupabase
      );

      res.json({
        success: true,
        message: 'Disease analysis report deleted',
        data: { id },
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
}
