import { GoogleGenAI } from '@google/genai';
import { env } from './env.js';

let genAIInstance: GoogleGenAI | null = null;

export const isGeminiConfigured = (): boolean => {
  return Boolean(env.GEMINI_API_KEY && env.GEMINI_API_KEY !== 'placeholder-gemini-key');
};

export const getGeminiClient = (): GoogleGenAI => {
  if (!isGeminiConfigured()) {
    throw new Error('GEMINI_API_KEY is not configured. Please provide a valid Gemini API key in your server environment variables.');
  }

  if (!genAIInstance) {
    genAIInstance = new GoogleGenAI({
      apiKey: env.GEMINI_API_KEY,
    });
  }

  return genAIInstance;
};

export const GEMINI_MODEL = env.GEMINI_MODEL || 'gemini-2.5-flash';
