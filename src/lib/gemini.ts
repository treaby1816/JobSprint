import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

/* Shared Gemini configuration for all Treabyn API routes */

export const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY ?? "");

export const SAFETY_SETTINGS = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

export function getModel() {
    return genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        safetySettings: SAFETY_SETTINGS,
    });
}

/**
 * Retry wrapper with exponential backoff for Gemini API calls.
 * Handles 429 (rate limit) and 503 (overloaded) errors gracefully.
 */
export async function withRetry<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    baseDelay = 2000
): Promise<T> {
    let lastError: Error | null = null;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (err: unknown) {
            lastError = err instanceof Error ? err : new Error(String(err));
            const msg = lastError.message.toLowerCase();
            const isRetryable = msg.includes("429") || msg.includes("503") || msg.includes("resource") || msg.includes("quota") || msg.includes("rate") || msg.includes("overloaded");
            if (!isRetryable || attempt === maxRetries) throw lastError;
            const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
            await new Promise(res => setTimeout(res, delay));
        }
    }
    throw lastError;
}
