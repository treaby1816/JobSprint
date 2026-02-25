import { getModel, withRetry } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/* ────────────────────────────────────────────────
   Treabyn Transcription Service — Gemini 2.0 Flash
   POST /api/transcription
   ──────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { text, action = "clean" } = body;

        if (!text || typeof text !== "string" || text.trim().length < 10) {
            return NextResponse.json(
                { error: "Please provide text with at least 10 characters." },
                { status: 400 }
            );
        }

        const model = getModel();

        let prompt: string;

        switch (action) {
            case "clean":
                prompt = `
You are an expert transcription editor. Clean up the following raw text:
- Fix grammar, spelling, and punctuation
- Remove filler words (um, uh, like, you know)
- Keep the speaker's meaning and tone intact
- Break into proper paragraphs
- Do NOT add information that wasn't in the original

Raw text:
"""
${text}
"""

Return ONLY the cleaned transcript, nothing else.`;
                break;

            case "summarize":
                prompt = `
Summarize the following text concisely in bullet points:
- Capture all key points and action items
- Group related points together
- Keep it under 10 bullet points
- Use clear, professional language

Text:
"""
${text}
"""

Return ONLY the bullet-point summary.`;
                break;

            case "minutes":
                prompt = `
Convert the following text into professional meeting minutes:

Include these sections:
## Meeting Summary
(2-3 sentence overview)

## Key Points Discussed
(Numbered list of main topics)

## Action Items
(Bullet points with clear owners if mentioned)

## Decisions Made
(Any decisions or agreements reached)

Text:
"""
${text}
"""

Return ONLY the formatted meeting minutes in markdown.`;
                break;

            default:
                return NextResponse.json(
                    { error: "Invalid action. Use: clean, summarize, or minutes." },
                    { status: 400 }
                );
        }

        const result = await withRetry(async () => {
            const res = await model.generateContent(prompt);
            return res;
        });

        const rawText = result.response.text();
        const output = rawText.replace(/```markdown\n?/g, "").replace(/```\n?/g, "").trim();

        return NextResponse.json({ result: output, action });
    } catch (err: unknown) {
        console.error("Transcription error:", err);

        if (err instanceof Error && err.message?.includes("429")) {
            return NextResponse.json(
                { error: "AI is busy — too many requests. Please wait 30 seconds and try again." },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { error: "Failed to process transcription." },
            { status: 500 }
        );
    }
}
