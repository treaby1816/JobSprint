"use client";

import { useState, useEffect, useCallback } from "react";
import type { JobApplication, ApplicationStatus } from "@/lib/supabase";

const PLATFORM_COLORS: Record<string, string> = {
    greenhouse: "bg-green-500/20 text-green-400 border-green-500/30",
    lever: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    ashby: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    other: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
};

const STATUS_COLORS: Record<ApplicationStatus, string> = {
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    applied: "bg-green-500/20 text-green-400 border-green-500/30",
    failed: "bg-red-500/20 text-red-400 border-red-500/30",
    skipped: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
};

const STATUS_ICONS: Record<ApplicationStatus, string> = {
    pending: "⏳",
    applied: "✅",
    failed: "❌",
    skipped: "⏭️",
};

interface Props {
    onRefresh?: () => void;
}

export default function DailyQueue({ onRefresh }: Props) {
    const [queue, setQueue] = useState<JobApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchQueue = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/queue");
            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? "Failed to fetch queue");
            setQueue(data.queue ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not load queue.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchQueue(); }, [fetchQueue]);

    const handleApply = async (job: JobApplication) => {
        if (!job.id) return;
        setApplying(job.id);
        try {
            const res = await fetch("/api/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobId: job.id, jobUrl: job.url }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? "Apply failed");

            // Optimistically update
            setQueue(prev =>
                prev.map(j => j.id === job.id ? { ...j, status: "applied" } : j)
            );
        } catch (err) {
            alert(err instanceof Error ? err.message : "Apply failed.");
            setQueue(prev =>
                prev.map(j => j.id === job.id ? { ...j, status: "failed" } : j)
            );
        } finally {
            setApplying(null);
        }
    };

    const handleSkip = (id: string) => {
        setQueue(prev => prev.map(j => j.id === id ? { ...j, status: "skipped" } : j));
    };

    const applied = queue.filter(j => j.status === "applied").length;
    const pending = queue.filter(j => j.status === "pending").length;
    const progress = queue.length > 0 ? Math.round((applied / queue.length) * 100) : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
                <span className="ml-3 text-zinc-400 text-sm">Loading queue...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-6 text-center">
                <p className="text-red-400 mb-3">⚠️ {error}</p>
                {error.includes("Supabase") && (
                    <p className="text-zinc-500 text-sm">Add <code className="text-brand-primary">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="text-brand-primary">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your <code>.env.local</code> file.</p>
                )}
                <button onClick={fetchQueue} className="mt-4 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700 transition-colors">Retry</button>
            </div>
        );
    }

    if (queue.length === 0) {
        return (
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-12 text-center">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-white mb-2">Queue is empty</h3>
                <p className="text-zinc-500 text-sm mb-6">Run the Job Sniper to find fresh opportunities and add them to your queue.</p>
                <button onClick={onRefresh} className="px-6 py-2.5 rounded-full bg-brand-primary text-white font-semibold text-sm hover:bg-brand-primary-hover transition-all">
                    🎯 Run Sniper Now
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Progress header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-white">Today&apos;s Queue</h2>
                    <p className="text-zinc-500 text-sm">{applied} applied · {pending} pending · {queue.length} total</p>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-extrabold text-brand-primary">{applied}</span>
                    <span className="text-zinc-600 text-sm">/20</span>
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-zinc-800">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-accent transition-all duration-500"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                />
            </div>

            {/* Job rows */}
            <div className="space-y-3">
                {queue.map((job) => (
                    <div key={job.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${job.status === "applied"
                            ? "bg-green-500/5 border-green-500/20 opacity-70"
                            : job.status === "skipped"
                                ? "bg-zinc-900 border-zinc-800 opacity-50"
                                : "bg-zinc-900 border-zinc-800 hover:border-zinc-600"
                            }`}
                    >
                        {/* Platform badge */}
                        <span className={`hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${PLATFORM_COLORS[job.platform] ?? PLATFORM_COLORS.other}`}>
                            {job.platform}
                        </span>

                        {/* Job info */}
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white text-sm truncate">{job.title}</p>
                            <p className="text-zinc-500 text-xs truncate">{job.company || "Unknown Company"}</p>
                        </div>

                        {/* Status */}
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[job.status]}`}>
                            {STATUS_ICONS[job.status]} {job.status}
                        </span>

                        {/* Actions */}
                        <div className="flex gap-2 shrink-0">
                            <a href={job.url} target="_blank" rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors text-sm"
                                title="Open job">
                                🔗
                            </a>

                            {job.status === "pending" && (
                                <>
                                    <button
                                        onClick={() => handleApply(job)}
                                        disabled={applying === job.id}
                                        className="px-3 py-1.5 rounded-lg bg-brand-primary text-white text-xs font-bold hover:bg-brand-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {applying === job.id ? (
                                            <span className="flex items-center gap-1">
                                                <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                                                Applying…
                                            </span>
                                        ) : "⚡ Apply"}
                                    </button>
                                    <button
                                        onClick={() => handleSkip(job.id!)}
                                        className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800 transition-colors text-sm"
                                        title="Skip this job">
                                        ⏭
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
