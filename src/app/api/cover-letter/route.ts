import { getModel, withRetry } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/* ────────────────────────────────────────────────
   Treabyn Cover Letter — Gemini 2.0 Flash
   POST /api/cover-letter
   ──────────────────────────────────────────────── */

interface CoverLetterInput {
    jobTitle: string;
    company: string;
    jobDescription: string;
    candidateName: string;
    candidateSummary: string;
    skills: string[];
}

export async function POST(req: NextRequest) {
    try {
        const body: CoverLetterInput = await req.json();

        if (!body.jobTitle || !body.company || !body.candidateName) {
            return NextResponse.json(
                { error: "Job title, company, and candidate name are required." },
                { status: 400 }
            );
        }

        const model = getModel();

        const prompt = `
You are a professional cover letter writer. Write a compelling, tailored cover letter.

Candidate: ${body.candidateName}
Professional Summary: ${body.candidateSummary || "Experienced professional"}
Key Skills: ${body.skills?.join(", ") || "Not specified"}

Target Job: ${body.jobTitle} at ${body.company}
Job Description: ${body.jobDescription || "Not provided — write a general letter for this role."}

Requirements:
1. Professional, warm, and confident tone.
2. 3-4 paragraphs max.
3. Highlight relevant skills and experience.
4. Show enthusiasm for the specific company.
5. Include a strong opening hook and closing call-to-action.
6. Output ONLY the cover letter text — no markdown, no code fences, no explanation.
`;

        const coverLetter = await withRetry(async () => {
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            return text.replace(/```markdown\n?/g, "").replace(/```\n?/g, "").trim();
        });

        return NextResponse.json({ coverLetter }, { status: 200 });
    } catch (error: unknown) {
        console.error("Cover letter generation error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        const isRateLimit = message.toLowerCase().includes("429") || message.toLowerCase().includes("quota") || message.toLowerCase().includes("rate");
        return NextResponse.json(
            {
                error: isRateLimit
                    ? "AI is busy — too many requests. Please wait 30 seconds and try again."
                    : "Failed to generate cover letter.",
                details: message,
                retryable: isRateLimit,
            },
            { status: isRateLimit ? 429 : 500 }
        );
    }
}
