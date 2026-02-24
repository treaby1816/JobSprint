import { getModel, withRetry } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/* ────────────────────────────────────────────────
   Treabyn Resume Builder — Gemini 2.0 Flash
   POST /api/resume
   ──────────────────────────────────────────────── */

interface ResumeInput {
    name: string;
    email: string;
    phone: string;
    summary?: string;
    experience: { title: string; company: string; duration: string; description: string }[];
    education: { degree: string; institution: string; year: string }[];
    skills: string[];
}

export async function POST(req: NextRequest) {
    try {
        const body: ResumeInput = await req.json();

        if (!body.name || !body.email) {
            return NextResponse.json(
                { error: "Name and email are required." },
                { status: 400 }
            );
        }

        const model = getModel();

        const prompt = `
You are a professional résumé writer. Generate an ATS-optimised résumé in clean, structured HTML format.

Use the following candidate details:
- Name: ${body.name}
- Email: ${body.email}
- Phone: ${body.phone || "N/A"}
- Professional Summary: ${body.summary || "Generate a compelling 2-sentence summary based on the experience below."}

Experience:
${body.experience?.map((e) => `• ${e.title} at ${e.company} (${e.duration}): ${e.description}`).join("\n") || "No experience provided — generate a compelling entry-level profile."}

Education:
${body.education?.map((e) => `• ${e.degree} — ${e.institution} (${e.year})`).join("\n") || "N/A"}

Skills:
${body.skills?.join(", ") || "N/A"}

Requirements:
1. Output clean, printable HTML with inline CSS.
2. Use a modern, professional layout (single column, clear section headers).
3. Optimise for ATS — use standard section headings (Summary, Experience, Education, Skills).
4. Use action verbs and quantifiable achievements where possible.
5. Keep it to one page of content.
6. Do NOT include any markdown, code fences, or explanation — output HTML only.
`;

        const html = await withRetry(async () => {
            const result = await model.generateContent(prompt);
            return result.response.text();
        });

        return NextResponse.json({ html }, { status: 200 });
    } catch (error: unknown) {
        console.error("Resume generation error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        const isRateLimit = message.toLowerCase().includes("429") || message.toLowerCase().includes("quota") || message.toLowerCase().includes("rate");
        return NextResponse.json(
            {
                error: isRateLimit
                    ? "AI is busy — too many requests. Please wait 30 seconds and try again."
                    : "Failed to generate résumé.",
                details: message,
                retryable: isRateLimit,
            },
            { status: isRateLimit ? 429 : 500 }
        );
    }
}
