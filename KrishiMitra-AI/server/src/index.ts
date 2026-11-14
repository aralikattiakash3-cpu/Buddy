import { app } from './app.js';
import { env } from './config/env.js';

const server = app.listen(env.PORT, () => {
  console.log(`===============================================`);
  console.log(`🌾 KrishiMitra AI Backend Server Started`);
  console.log(`🚀 Port: ${env.PORT}`);
  console.log(`🌍 Environment: ${env.NODE_ENV}`);
  console.log(`🩺 Health check: http://localhost:${env.PORT}/api/health`);
  console.log(`===============================================`);
});

// Graceful Shutdown
const handleShutdown = (signal: string) => {
  console.log(`Received ${signal}. Shutting down KrishiMitra server cleanly...`);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
