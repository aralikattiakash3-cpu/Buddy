
import { GoogleGenAI } from "@google/genai";

const GEMINI_MODEL = "gemini-3.8-flash";

const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error(
            "GEMINI_API_KEY is missing in server/.env"
        );
    }

    return new GoogleGenAI({ apiKey });
};

export async function analyzePlantImage(
    imageBuffer: Buffer,
    mimeType: string,
    cropName = "",
    symptoms = ""
): Promise<string> {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (!allowedTypes.includes(mimeType)) {
        throw new Error("Unsupported image format");
    }

    if (imageBuffer.length > 5 * 1024 * 1024) {
        throw new Error("Image must be smaller than 5 MB");
    }

    if (imageBuffer.length === 0) {
        throw new Error("Image cannot be empty");
    }

    const ai = getGeminiClient();

    const prompt = `
You are KrishiMitra AI, a responsible agricultural
plant-health advisory assistant for Indian farmers.

Crop name: ${cropName || "Not specified"}
Observed symptoms: ${symptoms || "Not specified"}

Examine the provided image carefully.

Provide:
1. Whether the image clearly shows a plant.
2. Possible disease or health issue.
3. Visible symptoms supporting your assessment.
4. Confidence level: low, medium, or high.
5. Safe, practical next steps.
6. When to consult a local agricultural expert.

Rules:
- Never claim certainty from an image alone.
- If the image is not a plant, say so clearly.
- Do not invent disease symptoms.
- Do not recommend hazardous pesticide dosages.
- Use simple, farmer-friendly English.
- Explain uncertainty when the image is unclear.
`;

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: prompt
                        },
                        {
                            inlineData: {
                                mimeType,
                                data: imageBuffer.toString("base64")
                            }
                        }
                    ]
                }
            ]
        });

        const result = response.text;

        if (!result || !result.trim()) {
            console.error(
                "KrishiMitra Gemini API returned an empty response."
            );

            throw new Error(
                "Gemini returned an empty response"
            );
        }

        return result.trim();

    } catch (error) {
        console.error(
            "KrishiMitra Gemini API error:",
            error instanceof Error
                ? error.message
                : "Unknown error"
        );

        throw new Error(
            "Gemini plant analysis failed. Check backend logs."
        );
    }
}
