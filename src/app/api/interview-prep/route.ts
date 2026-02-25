import { getJsonModel, withRetry } from "@/lib/gemini";
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

interface InterviewQuestion {
    id: number;
    question: string;
    type: "technical" | "behavioral" | "situational";
    modelAnswer: string;
    tips: string;
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
        const model = getJsonModel();

        const prompt = `
You are an expert technical interviewer and career coach.
Generate exactly 5 interview questions and model answers for:

Role: ${body.role}
Seniority: ${level}

CRITICAL RULES:
1. Questions must be highly relevant to the role and seniority level.
2. Include a mix of technical, behavioral, and situational questions.
3. The "modelAnswer" should be a high-quality, structured response that a strong candidate would give.
4. The "tips" should provide actionable advice on how the candidate should approach answering the question.

Return a JSON array of objects with the following schema:
{
  "id": "number",
  "question": "string",
  "type": "technical | behavioral | situational",
  "modelAnswer": "string",
  "tips": "string"
}
`;

        const questions: InterviewQuestion[] = await withRetry(async () => {
            const result = await model.generateContent(prompt);
            let parsed = JSON.parse(result.response.text());

            // If the model wrapped the array in an object (e.g. { "questions": [...] })
            if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
                if (Array.isArray(parsed.questions)) parsed = parsed.questions;
                else if (Array.isArray(parsed.interviewQuestions)) parsed = parsed.interviewQuestions;
                else if (Array.isArray(parsed.data)) parsed = parsed.data;
                else throw new Error("AI returned JSON but no 'questions' array was found.");
            }

            if (!Array.isArray(parsed)) throw new Error("AI did not return an array of questions.");
            return parsed;
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
