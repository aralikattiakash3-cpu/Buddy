import { createApp } from './app.js';
import { env } from './config/env.js';
import { isSupabaseConfigured } from './config/supabase.js';
import { isGeminiConfigured, GEMINI_MODEL } from './config/gemini.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`=======================================================`);
  console.log(`  KRISHISEVA AI: Agriculture Crop Advisory Server   `);
  console.log(`  Environment: ${env.NODE_ENV}`);
  console.log(`  Listening on: http://localhost:${env.PORT}`);
  console.log(`  Supabase: ${isSupabaseConfigured() ? 'Connected' : 'Not configured (set in server/.env)'}`);
  console.log(`  Gemini AI: ${isGeminiConfigured() ? `Active (${GEMINI_MODEL})` : 'Not configured (set in server/.env)'}`);
  console.log(`=======================================================`);
});

const gracefulShutdown = () => {
  console.log('Shutting down server gracefully...');
  server.close(() => {
    console.log('Server closed. Process terminating.');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
