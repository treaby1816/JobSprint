import { getModel, withRetry } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/* ────────────────────────────────────────────────
   Treabyn Interview Prep — Gemini 2.0 Flash
   POST /api/interview-prep
   ──────────────────────────────────────────────── */

interface InterviewInput {
    role: string;
    industry: string;
    difficulty: "entry" | "mid" | "senior";
    numberOfQuestions: number;
}

export async function POST(req: NextRequest) {
    try {
        const body: InterviewInput = await req.json();

        if (!body.role) {
            return NextResponse.json(
                { error: "Role is required." },
                { status: 400 }
            );
        }

        const count = Math.min(body.numberOfQuestions || 5, 15);
        const level = body.difficulty || "mid";
        const model = getModel();

        const prompt = `
You are an expert interview coach. Generate ${count} interview questions for the following:

Role: ${body.role}
Industry: ${body.industry || "General"}
Experience Level: ${level}

Requirements:
1. Mix behavioral, technical, and situational questions.
2. For each question, provide a model answer and coaching tip.
3. Questions should be realistic — the kind asked at top companies.
4. Vary difficulty within the set.

Output ONLY a valid JSON array (no markdown, no code fences):
[
  {
    "id": 1,
    "question": "...",
    "category": "behavioral|technical|situational",
    "modelAnswer": "...",
    "coachingTip": "..."
  }
]
`;

        const questions = await withRetry(async () => {
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
            return JSON.parse(cleaned);
        });

        return NextResponse.json(
            { role: body.role, difficulty: level, totalQuestions: questions.length, questions },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error("Interview prep error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        const isRateLimit = message.toLowerCase().includes("429") || message.toLowerCase().includes("quota") || message.toLowerCase().includes("rate");
        return NextResponse.json(
            {
                error: isRateLimit
                    ? "AI is busy — too many requests. Please wait 30 seconds and try again."
                    : "Failed to generate interview questions.",
                details: message,
                retryable: isRateLimit,
            },
            { status: isRateLimit ? 429 : 500 }
        );
    }
}
