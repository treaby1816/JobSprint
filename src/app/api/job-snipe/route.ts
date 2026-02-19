/**
 * POST /api/job-snipe
 * Body: { role: string, window?: "h" | "d", limit?: number }
 * Returns: { jobs: SniperJob[] }
 */
import { NextResponse } from "next/server";
import { snipeJobs } from "@/services/job-sniper";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const role: string = body.role;
        const window: "h" | "d" = body.window ?? "h";
        const limit: number = body.limit ?? 20;

        if (!role) {
            return NextResponse.json({ error: "role is required" }, { status: 400 });
        }

        if (!process.env.SERPER_API_KEY) {
            return NextResponse.json(
                { error: "SERPER_API_KEY is not configured. Add it to .env.local." },
                { status: 500 }
            );
        }

        const jobs = await snipeJobs(role, limit, window);
        return NextResponse.json({ jobs, count: jobs.length, role, window });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Sniper failed.";
        console.error("[job-snipe]", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
