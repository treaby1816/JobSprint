/**
 * POST /api/resume-engine
 * Body: { masterProfile: string, jobDescription: string }
 * Returns: { resume: ATSResume }
 */
import { NextResponse } from "next/server";
import { generateATSResume } from "@/lib/resume-engine";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { masterProfile, jobDescription } = body;

        if (!masterProfile || !jobDescription) {
            return NextResponse.json(
                { error: "Both masterProfile and jobDescription are required." },
                { status: 400 }
            );
        }

        const resume = await generateATSResume(masterProfile, jobDescription);
        return NextResponse.json({ resume });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Resume engine failed.";
        const isRateLimit =
            message.toLowerCase().includes("429") ||
            message.toLowerCase().includes("quota") ||
            message.toLowerCase().includes("rate");

        console.error("[resume-engine]", message);
        return NextResponse.json(
            {
                error: isRateLimit
                    ? "AI is busy — too many requests. Please wait 30 seconds and try again."
                    : "Failed to generate ATS resume.",
                details: message,
                retryable: isRateLimit,
            },
            { status: isRateLimit ? 429 : 500 }
        );
    }
}
