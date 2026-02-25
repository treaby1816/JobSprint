import { getJsonModel, withRetry } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

/* ────────────────────────────────────────────────
   Treabyn Mock Exam Service — Hybrid Cache
   POST /api/mock-exam
   ──────────────────────────────────────────────── */

interface ExamInput {
    subject: string;
    difficulty: "easy" | "medium" | "hard";
    numberOfQuestions: number;
}

export interface MockQuestion {
    id?: string;
    exam_type: string;
    topic: string;
    question_text: string;
    options: string[];
    correct_answer: string;
    explanation: string;
}

export async function POST(req: NextRequest) {
    try {
        const body: ExamInput = await req.json();

        if (!body.subject) {
            return NextResponse.json({ error: "Subject is required." }, { status: 400 });
        }

        const count = Math.min(body.numberOfQuestions || 10, 50);
        const difficulty = body.difficulty || "medium";

        // Parse exam_type and topic from the subject string
        // Example: "JAMB (UTME) — Physics" -> type: "JAMB (UTME)", topic: "Physics"
        let examType = "Custom";
        let topic = body.subject;
        if (body.subject.includes(" — ")) {
            const parts = body.subject.split(" — ");
            examType = parts[0];
            topic = parts[1];
        }

        console.log(`[Mock Exam] Request: ${examType} - ${topic} (limit ${count})`);

        // ==========================================
        // 1. HYBRID CACHE: Check Supabase First
        // ==========================================
        const { data: cachedQuestions, error: cacheError } = await supabase
            .from("mock_questions")
            .select("id, exam_type, topic, question_text, options, correct_answer, explanation")
            .eq("exam_type", examType)
            .ilike("topic", `%${topic}%`)
            .limit(count);

        if (cacheError) {
            console.error("Supabase Cache Error:", cacheError);
        }

        // If we found enough questions in the cache, return them immediately
        if (cachedQuestions && cachedQuestions.length >= count) {
            console.log(`[Mock Exam] Cache HIT (${cachedQuestions.length} questions)`);
            return NextResponse.json(
                { subject: body.subject, difficulty, source: "cache", totalQuestions: cachedQuestions.length, questions: cachedQuestions },
                { status: 200 }
            );
        }

        console.log(`[Mock Exam] Cache MISS (Found ${cachedQuestions?.length || 0}). Generating via Gemini...`);

        // ==========================================
        // 2. FALLBACK: Generate via Gemini 2.0 Flash
        // ==========================================
        const model = getJsonModel();
        const prompt = `
You are an expert exam question generator specialising in real past examination papers.
Generate exactly ${count} multiple-choice questions for:

Exam Type: ${examType}
Topic/Subject: ${topic}
Difficulty: ${difficulty}

CRITICAL RULES:
1. Model your questions CLOSELY on real past examination questions from ${examType.includes("JAMB") ? "JAMB UTME" : examType.includes("WAEC") ? "WAEC WASSCE" : examType.includes("NECO") ? "NECO SSCE" : "official"} past papers from 2018–2024.
2. Use the EXACT phrasing style, question structure, and topic coverage that appear in official past papers.
3. Each question must have exactly 4 options (A, B, C, D). Only ONE is correct.
4. For Nigerian exams (JAMB, WAEC, NECO, Primary Six): use the current Nigerian curriculum/syllabus topics.
5. Provide a clear, educational explanation for each correct answer.
6. Questions must be factually accurate and current.

Return a JSON array of objects with the following EXACT schema (do not wrap in markdown):
{
  "question_text": "string",
  "options": ["string", "string", "string", "string"],
  "correct_answer": "A | B | C | D",
  "explanation": "string"
}
`;

        const newQuestions: MockQuestion[] = await withRetry(async () => {
            const result = await model.generateContent(prompt);
            let parsed = JSON.parse(result.response.text());

            // Robust JSON extraction
            if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
                if (Array.isArray(parsed.questions)) parsed = parsed.questions;
                else if (Array.isArray(parsed.data)) parsed = parsed.data;
                else throw new Error("AI returned JSON but no 'questions' array was found.");
            }

            if (!Array.isArray(parsed)) throw new Error("AI did not return an array of questions.");

            // Map the parsed JSON to ensure it matches the database schema
            return parsed.map((q: any) => ({
                exam_type: examType,
                topic: topic,
                question_text: q.question_text || q.question || "",
                options: q.options || [],
                correct_answer: q.correct_answer || q.correctAnswer || "",
                explanation: q.explanation || ""
            }));
        });

        // ==========================================
        // 3. CACHE WRITE: Save to Supabase
        // ==========================================
        try {
            const { error: insertError } = await supabase
                .from("mock_questions")
                .insert(newQuestions);

            if (insertError) {
                console.error("Failed to cache new questions in Supabase:", insertError);
            } else {
                console.log(`[Mock Exam] Successfully cached ${newQuestions.length} new questions.`);
            }
        } catch (dbErr) {
            console.error("Database exception during cache write:", dbErr);
        }

        // Return the newly generated questions
        return NextResponse.json(
            { subject: body.subject, difficulty, source: "ai", totalQuestions: newQuestions.length, questions: newQuestions },
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
