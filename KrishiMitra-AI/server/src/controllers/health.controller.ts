import { Request, Response } from 'express';

const startTime = Date.now();

export const getHealth = (_req: Request, res: Response) => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

  return res.status(200).json({
    status: 'ok',
    service: 'KrishiMitra AI Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: uptimeSeconds,
    environment: process.env.NODE_ENV || 'development'
  });
};
