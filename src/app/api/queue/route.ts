/**
 * GET /api/queue  — fetch today's job queue
 * POST /api/queue — add jobs to queue from sniper results
 */
import { NextResponse } from "next/server";
import { getTodayQueue, addJobsToQueue } from "@/lib/supabase";
import type { JobApplication } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        return NextResponse.json(
            { error: "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL to .env.local." },
            { status: 500 }
        );
    }
    try {
        const queue = await getTodayQueue();
        return NextResponse.json({ queue, count: queue.length });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to fetch queue.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        return NextResponse.json(
            { error: "Supabase is not configured." },
            { status: 500 }
        );
    }
    try {
        const body = await req.json();
        const jobs: Omit<JobApplication, "id" | "created_at">[] = body.jobs;

        if (!Array.isArray(jobs) || jobs.length === 0) {
            return NextResponse.json({ error: "jobs array is required." }, { status: 400 });
        }

        await addJobsToQueue(jobs);
        return NextResponse.json({ success: true, added: jobs.length });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to add to queue.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
