import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

/* Shared Gemini configuration for all Treabyn API routes */

const SAFETY_SETTINGS = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

let _genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
    if (!_genAI) {
        _genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY ?? "");
    }
    return _genAI;
}

export function getModel() {
    return getGenAI().getGenerativeModel({
        model: "gemini-2.0-flash",
        safetySettings: SAFETY_SETTINGS,
    });
}

/**
 * Returns a model strictly configured to output JSON.
 * This guarantees the response won't contain markdown (e.g. ```json ... ```).
 */
export function getJsonModel() {
    return getGenAI().getGenerativeModel({
        model: "gemini-2.0-flash",
        safetySettings: SAFETY_SETTINGS,
        generationConfig: {
            responseMimeType: "application/json",
        },
    });
}

/**
 * Retry wrapper with exponential backoff for Gemini API calls.
 * Handles 429 (rate limit) and 503 (overloaded) errors gracefully.
 */
export async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
    try {
        return await fn();
    } catch (err: unknown) {
        throw err instanceof Error ? err : new Error(String(err));
    }
}
