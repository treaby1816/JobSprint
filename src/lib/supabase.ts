/**
 * Treabyn — Supabase Client (Lazy Singleton)
 * Env required:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type ApplicationStatus = "pending" | "applied" | "failed" | "skipped";

export interface JobApplication {
    id?: string;
    title: string;
    company: string;
    url: string;
    platform: string;
    status: ApplicationStatus;
    applied_at?: string | null;
    created_at?: string;
}

/** Returns true if Supabase env vars are present */
export function isSupabaseConfigured(): boolean {
    return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

let _client: SupabaseClient | null = null;

/** Lazy singleton — only creates the client when first called */
export function getSupabase(): SupabaseClient {
    if (_client) return _client;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
        throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local");
    }
    _client = createClient(url, key);
    return _client;
}



/** Fetch all queued jobs created today */
export async function getTodayQueue(): Promise<JobApplication[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await getSupabase()
        .from("job_application_queue")
        .select("*")
        .gte("created_at", today.toISOString())
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data as JobApplication[]) ?? [];
}

/** Add multiple jobs to the queue (skip duplicates by URL) */
export async function addJobsToQueue(jobs: Omit<JobApplication, "id" | "created_at">[]): Promise<void> {
    const { error } = await getSupabase()
        .from("job_application_queue")
        .upsert(jobs, { onConflict: "url", ignoreDuplicates: true });

    if (error) throw new Error(error.message);
}

/** Update a job's status in the queue */
export async function updateJobStatus(
    id: string,
    status: ApplicationStatus,
    appliedAt?: string
): Promise<void> {
    const { error } = await getSupabase()
        .from("job_application_queue")
        .update({
            status,
            applied_at: appliedAt ?? (status === "applied" ? new Date().toISOString() : null),
        })
        .eq("id", id);

    if (error) throw new Error(error.message);
}
