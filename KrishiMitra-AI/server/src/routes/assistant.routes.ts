
import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';

export const assistantRouter = Router();

const languageNames: Record<string, string> = {
    kn: 'Kannada',
    hi: 'Hindi',
    en: 'English',
    ta: 'Tamil',
    te: 'Telugu',
    mr: 'Marathi',
};

const GEMINI_MODEL =
    process.env.GEMINI_MODEL?.trim() || 'gemini-3.8-flash';

const TIMEOUT_MS = 60000;
const MAX_ATTEMPTS = 3;

const sleep = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

function isTemporaryError(message: string): boolean {
    return /503|UNAVAILABLE|high demand|overloaded|429|RESOURCE_EXHAUSTED/i.test(
        message
    );
}

assistantRouter.post('/chat', async (req, res) => {
    try {
        const {
            message,
            language = 'en',
            history = [],
        } = req.body ?? {};

        if (typeof message !== 'string' || !message.trim()) {
            res.status(400).json({
                success: false,
                error: 'Please enter a farming question.',
            });
            return;
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey || apiKey.startsWith('placeholder-')) {
            res.status(503).json({
                success: false,
                error: 'Gemini API key is not configured.',
            });
            return;
        }

        const selectedLanguage =
            languageNames[language] || 'English';

        const recentHistory = Array.isArray(history)
            ? history
                .slice(-8)
                .filter(
                    (item) =>
                        item &&
                        (item.role === 'user' ||
                            item.role === 'assistant') &&
                        typeof item.content === 'string'
                )
            : [];

        const conversation = recentHistory
            .map(
                (item) =>
                    `${item.role === 'user' ? 'Farmer' : 'Assistant'}: ${item.content.slice(0, 1000)}`
            )
            .join('\n');

        const prompt = `
You are KrishiMitra AI, a responsible agricultural
assistant for Indian farmers.

Reply entirely in ${selectedLanguage}.
Use simple, practical, farmer-friendly language.

Help with:
- Crop diseases and prevention
- Irrigation
- Soil health
- Fertilizers and nutrients
- Sustainable farming
- Crop selection
- Weather-related farming precautions

Safety rules:
- Never confirm a crop disease without enough evidence.
- Never invent weather forecasts or soil test results.
- Do not recommend hazardous pesticide dosages.
- Recommend local agricultural experts when appropriate.
- Ask for clarification when needed.
- Keep answers concise.
- Respond briefly to greetings.

Previous conversation:
${conversation || 'No previous conversation.'}

Farmer's question:
${message.trim().slice(0, 4000)}

Answer in ${selectedLanguage}.
`;

        const ai = new GoogleGenAI({ apiKey });
        const controller = new AbortController();
        const startedAt = Date.now();

        const timeout = setTimeout(() => {
            controller.abort();
        }, TIMEOUT_MS);

        console.log(
            `[AI Assistant] Request received. Language: ${language}`
        );
        console.log(`[AI Assistant] Model: ${GEMINI_MODEL}`);

        try {
            for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
                if (controller.signal.aborted) {
                    break;
                }

                try {
                    console.log(
                        `[AI Assistant] Attempt ${attempt}/${MAX_ATTEMPTS}`
                    );

                    const response = await ai.models.generateContent({
                        model: GEMINI_MODEL,
                        contents: prompt,
                        config: {
                            abortSignal: controller.signal,
                            maxOutputTokens: 1024,
                            temperature: 0.5,
                        },
                    });

                    const reply = response.text?.trim();

                    if (!reply) {
                        res.status(502).json({
                            success: false,
                            error: 'Gemini returned an empty response.',
                        });
                        return;
                    }

                    console.log(
                        `[AI Assistant] Success in ${Date.now() - startedAt}ms`
                    );

                    res.status(200).json({
                        success: true,
                        reply,
                        language,
                    });
                    return;
                } catch (error) {
                    const errorMessage = getErrorMessage(error);

                    console.error(
                        `[AI Assistant] Attempt ${attempt} failed:`,
                        errorMessage
                    );

                    if (controller.signal.aborted) {
                        break;
                    }

                    const quotaExceeded =
                        /429|RESOURCE_EXHAUSTED|quota/i.test(errorMessage);

                    if (quotaExceeded) {
                        res.status(429).json({
                            success: false,
                            error:
                                'Gemini API quota or rate limit reached. Please try again later.',
                        });
                        return;
                    }

                    if (
                        isTemporaryError(errorMessage) &&
                        attempt < MAX_ATTEMPTS
                    ) {
                        const delay = attempt * 2000;
                        console.log(
                            `[AI Assistant] Retrying in ${delay / 1000}s...`
                        );

                        await sleep(delay);
                        continue;
                    }

                    if (isTemporaryError(errorMessage)) {
                        res.status(503).json({
                            success: false,
                            error:
                                'Gemini is experiencing high demand. Please try again shortly.',
                        });
                        return;
                    }

                    if (/404|NOT_FOUND/i.test(errorMessage)) {
                        res.status(502).json({
                            success: false,
                            error:
                                `Gemini model "${GEMINI_MODEL}" is unavailable.`,
                        });
                        return;
                    }

                    if (/401|403|API_KEY_INVALID|PERMISSION_DENIED/i.test(
                        errorMessage
                    )) {
                        res.status(502).json({
                            success: false,
                            error:
                                'Gemini API authentication failed. Check your API key.',
                        });
                        return;
                    }

                    res.status(502).json({
                        success: false,
                        error:
                            'Gemini API request failed. Check the backend terminal for details.',
                    });
                    return;
                }
            }

            res.status(504).json({
                success: false,
                error:
                    'Gemini did not respond within 60 seconds. Please try again.',
            });
        } finally {
            clearTimeout(timeout);
        }
    } catch (error) {
        console.error(
            '[AI Assistant] Unexpected error:',
            error
        );

        res.status(500).json({
            success: false,
            error: 'An unexpected server error occurred.',
        });
    }
});
