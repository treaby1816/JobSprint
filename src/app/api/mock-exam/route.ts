import { getModel, withRetry } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

/* ────────────────────────────────────────────────
   Treabyn Mock Exam Service — Gemini 2.0 Flash
   POST /api/mock-exam
   ──────────────────────────────────────────────── */

interface ExamInput {
    subject: string;
    difficulty: "easy" | "medium" | "hard";
    numberOfQuestions: number;
}

interface ExamQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

export async function POST(req: NextRequest) {
    try {
        const body: ExamInput = await req.json();

        if (!body.subject) {
            return NextResponse.json(
                { error: "Subject is required." },
                { status: 400 }
            );
        }

        const count = Math.min(body.numberOfQuestions || 10, 50);
        const difficulty = body.difficulty || "medium";
        const model = getModel();

        const prompt = `
You are an expert exam question generator specialising in real past examination papers.
Generate exactly ${count} multiple-choice questions for:

Subject: ${body.subject}
Difficulty: ${difficulty}

CRITICAL RULES:
1. Model your questions CLOSELY on real past examination questions from ${body.subject.includes("JAMB") ? "JAMB UTME" : body.subject.includes("WAEC") ? "WAEC WASSCE" : body.subject.includes("NECO") ? "NECO SSCE" : "official"} past papers from 2018–2024.
2. Use the EXACT phrasing style, question structure, and topic coverage that appear in official past papers.
3. Each question must have exactly 4 options (A, B, C, D). Only ONE is correct.
4. For Nigerian exams (JAMB, WAEC, NECO, Primary Six): use the current Nigerian curriculum/syllabus topics and include the kind of calculations, diagrams-described-in-text, and passage-based questions that actually appear in those exams.
5. For international exams (IELTS, TOEFL, PMP, ICAN): mirror the official question format and difficulty weighting.
6. Provide a clear, educational explanation for each correct answer.
7. Cover a broad range of topics within the subject — don't cluster on one area.
8. Vary question types: factual recall, application, analysis, and calculation where appropriate.
9. Questions must be factually accurate and current.

Output ONLY a valid JSON array (no markdown, no code fences, no extra text):
[
  {
    "id": 1,
    "question": "...",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "correctAnswer": "A",
    "explanation": "..."
  }
]
`;

        const questions: ExamQuestion[] = await withRetry(async () => {
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
            return JSON.parse(cleaned);
        });

        return NextResponse.json(
            { subject: body.subject, difficulty, totalQuestions: questions.length, questions },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error("Mock exam generation error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        const isRateLimit = message.toLowerCase().includes("429") || message.toLowerCase().includes("quota") || message.toLowerCase().includes("rate");
        return NextResponse.json(
            {
                error: isRateLimit
                    ? "AI is busy — too many requests. Please wait 30 seconds and try again."
                    : "Failed to generate exam questions.",
                details: message,
                retryable: isRateLimit,
            },
            { status: isRateLimit ? 429 : 500 }
        );
    }
}
