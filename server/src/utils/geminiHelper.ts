import { getGeminiClient, GEMINI_MODEL, isGeminiConfigured } from '../config/gemini.js';
import { MASTER_AGRICULTURAL_SYSTEM_PROMPT } from '../prompts/agriculture.prompts.js';
import { z } from 'zod';

export class GeminiServiceError extends Error {
  statusCode: number;
  code: string;
  details?: any;

  constructor(message: string, statusCode = 500, code = 'GEMINI_ERROR', details?: any) {
    super(message);
    this.name = 'GeminiServiceError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

/**
 * Executes a structured Gemini generation request with retry and schema validation.
 */
export async function executeStructuredGeminiRequest<T>(options: {
  prompt: string;
  schema: z.ZodType<T>;
  inlineImage?: {
    mimeType: string;
    data: Buffer;
  };
  temperature?: number;
  maxRetries?: number;
}): Promise<T> {
  if (!isGeminiConfigured()) {
    throw new GeminiServiceError(
      'Google Gemini API is not configured. Please add your GEMINI_API_KEY in the server/.env file to enable AI agricultural advisory.',
      503,
      'AI_SERVICE_UNCONFIGURED'
    );
  }

  const ai = getGeminiClient();
  const maxRetries = options.maxRetries ?? 2;
  let lastError: any = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const contents: any[] = [options.prompt];

      if (options.inlineImage) {
        contents.push({
          inlineData: {
            mimeType: options.inlineImage.mimeType,
            data: options.inlineImage.data.toString('base64'),
          },
        });
      }

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents,
        config: {
          systemInstruction: MASTER_AGRICULTURAL_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          temperature: options.temperature ?? 0.2,
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new GeminiServiceError('Empty response received from Gemini AI model', 502, 'EMPTY_AI_RESPONSE');
      }

      // Clean potential markdown fencing if present
      let cleanedText = responseText.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.slice(7);
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.slice(3);
      }
      if (cleanedText.endsWith('```')) {
        cleanedText = cleanedText.slice(0, -3);
      }
      cleanedText = cleanedText.trim();

      let parsedJson: any;
      try {
        parsedJson = JSON.parse(cleanedText);
      } catch (jsonErr: any) {
        throw new GeminiServiceError(
          `Failed to parse Gemini output as JSON: ${jsonErr.message}`,
          502,
          'INVALID_AI_JSON',
          { rawOutput: responseText }
        );
      }

      const validationResult = options.schema.safeParse(parsedJson);
      if (!validationResult.success) {
        throw new GeminiServiceError(
          'Gemini response did not conform to the expected agricultural data schema',
          502,
          'SCHEMA_VALIDATION_FAILED',
          validationResult.error.format()
        );
      }

      return validationResult.data;
    } catch (err: any) {
      lastError = err;
      if (err instanceof GeminiServiceError && err.code === 'AI_SERVICE_UNCONFIGURED') {
        throw err;
      }

      // Check if transient network/quota error for exponential backoff
      const isTransient =
        err?.status === 429 ||
        err?.status === 503 ||
        err?.message?.includes('RESOURCE_EXHAUSTED') ||
        err?.message?.includes('fetch failed') ||
        err?.message?.includes('ETIMEDOUT');

      if (attempt < maxRetries && isTransient) {
        const backoffMs = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, backoffMs));
        continue;
      }

      break;
    }
  }

  throw new GeminiServiceError(
    lastError?.message || 'Gemini AI service request failed',
    lastError?.statusCode || 500,
    lastError?.code || 'GEMINI_CALL_FAILED',
    lastError?.details
  );
}
