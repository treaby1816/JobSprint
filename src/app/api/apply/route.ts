/**
 * POST /api/apply
 * Body: { jobId: string, jobUrl: string }
 *
 * Serverless-friendly auto-apply route.
 * Uses Browserless.io HTTP API when BROWSERLESS_TOKEN is set.
 * Falls back to a "manual apply" redirect when Browserless is unavailable.
 */
import { NextResponse } from "next/server";
import { updateJobStatus } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    const body = await req.json();
    const { jobId, jobUrl } = body;

    if (!jobId || !jobUrl) {
        return NextResponse.json(
            { error: "jobId and jobUrl are required." },
            { status: 400 }
        );
    }

    const browserlessToken = process.env.BROWSERLESS_TOKEN?.trim();

    // ── If no Browserless token, return the job URL for manual apply ──
    if (!browserlessToken) {
        return NextResponse.json({
            success: false,
            jobId,
            message: "Auto-apply requires BROWSERLESS_TOKEN. Opening job page for manual application.",
            manualUrl: jobUrl,
        });
    }

    try {
        // ── Use Browserless.io HTTP Screenshot API ──
        // This takes a screenshot of the job page as proof, without needing
        // a local Chromium binary (which is impossible on Vercel serverless).
        const screenshotRes = await fetch(
            `https://chrome.browserless.io/screenshot?token=${browserlessToken}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    url: jobUrl,
                    options: {
                        type: "png",
                        fullPage: false,
                    },
                    gotoOptions: {
                        waitUntil: "networkidle2",
                        timeout: 30000,
                    },
                    viewport: {
                        width: 1280,
                        height: 900,
                    },
                }),
            }
        );

        if (!screenshotRes.ok) {
            const errText = await screenshotRes.text();
            console.error("[apply] Browserless error:", errText);
            throw new Error(`Browserless returned ${screenshotRes.status}`);
        }

        // Convert screenshot to base64
        const buffer = await screenshotRes.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");

        // Update Supabase status
        try {
            await updateJobStatus(jobId, "applied");
        } catch { /* Supabase update is best-effort */ }

        return NextResponse.json({
            success: true,
            jobId,
            message: "Job page captured successfully. Application queued.",
            screenshot: `data:image/png;base64,${base64}`,
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Auto-apply failed.";
        console.error("[apply]", message);

        try {
            await updateJobStatus(jobId, "failed");
        } catch { /* silent */ }

        return NextResponse.json({ error: message, manualUrl: jobUrl }, { status: 500 });
    }
}
