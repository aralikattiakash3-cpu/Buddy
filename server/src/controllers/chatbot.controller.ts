import { Request, Response, NextFunction } from 'express';
import { chatMessageInputSchema } from '../schemas/index.js';
import { AgricultureChatService } from '../services/agricultureChat.service.js';

export class ChatbotController {
  static async createSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { title } = req.body;

      const session = await AgricultureChatService.createSession(
        userId,
        title,
        req.scopedSupabase
      );

      res.status(201).json({
        success: true,
        message: 'Chat session created',
        data: session,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }

  static async listSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const sessions = await AgricultureChatService.listSessions(
        userId,
        req.scopedSupabase
      );

      res.json({
        success: true,
        message: 'Chat sessions retrieved',
        data: sessions,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;

      const sessionData = await AgricultureChatService.getSessionWithMessages(
        id,
        userId,
        req.scopedSupabase
      );

      res.json({
        success: true,
        message: 'Session details retrieved',
        data: sessionData,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }

  static async sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;
      const validatedInput = chatMessageInputSchema.parse(req.body);

      const aiResponse = await AgricultureChatService.sendMessage(
        id,
        userId,
        validatedInput.message,
        validatedInput.language,
        req.scopedSupabase
      );

      res.json({
        success: true,
        message: 'Message processed successfully',
        data: aiResponse,
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;

      await AgricultureChatService.deleteSession(
        id,
        userId,
        req.scopedSupabase
      );

      res.json({
        success: true,
        message: 'Chat session deleted',
        data: { id },
        error: null,
      });
    } catch (err) {
      next(err);
    }
  }
}
