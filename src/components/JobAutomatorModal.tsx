"use client";

import { useState } from "react";
import { Zap, Search, Sparkles, ExternalLink } from "lucide-react";

interface Props { open: boolean; onClose: () => void; }

interface SniperJob {
    title: string;
    company: string;
    url: string;
    platform: string;
    snippet?: string;
}

export default function JobAutomatorModal({ open, onClose }: Props) {
    const [role, setRole] = useState("");
    const [window, setWindow] = useState<"h" | "d">("d");
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState<SniperJob[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {
        if (!role.trim()) { setError("Enter a role to search for"); return; }
        setLoading(true); setError(null); setJobs([]); setSearched(false);
        try {
            const res = await fetch("/api/job-snipe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: role.trim(), window, limit: 15 }),
            });
            const data = await res.json();
            console.log("Job Automator API Response:", data);
            if (!res.ok) throw new Error(data.error || "Search failed");
            setJobs(data.jobs ?? []);
            setSearched(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally { setLoading(false); }
    };

    const resetAndClose = () => {
        setRole(""); setJobs([]); setError(null); setSearched(false);
        onClose();
    };

    if (!open) return null;

    const platformColor: Record<string, string> = {
        greenhouse: "bg-green-100 text-green-700",
        lever: "bg-blue-100 text-blue-700",
        ashby: "bg-purple-100 text-purple-700",
        other: "bg-gray-100 text-gray-600",
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" onClick={resetAndClose}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                            <Zap className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-extrabold text-brand-dark">Job Sniper</h2>
                            <p className="text-sm text-brand-dark/50">Search Greenhouse, Lever & Ashby for remote jobs</p>
                        </div>
                    </div>
                    <button onClick={resetAndClose} className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors text-lg font-bold">✕</button>
                </div>

                {/* Search Controls */}
                <div className="space-y-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <label className="text-xs font-semibold text-brand-dark/60 mb-1 block">Target Job Role</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-dark/30" />
                                <input
                                    value={role}
                                    onChange={e => setRole(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && handleSearch()}
                                    placeholder='e.g. "React Developer", "Data Analyst", "Product Manager"'
                                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-brand-muted bg-brand-light/30 text-brand-dark focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none text-sm"
                                />
                            </div>
                        </div>
                        <select
                            value={window}
                            onChange={e => setWindow(e.target.value as "h" | "d")}
                            className="h-12 px-4 rounded-xl border border-brand-muted bg-brand-light/30 text-brand-dark text-sm focus:border-brand-primary outline-none"
                        >
                            <option value="h">Last hour</option>
                            <option value="d">Last 24h</option>
                        </select>
                    </div>

                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="w-full h-12 rounded-xl bg-gradient-to-r from-brand-primary to-blue-700 text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Scanning job boards...
                            </>
                        ) : (
                            <>
                                <Zap className="w-4 h-4" />
                                Run Job Sniper
                            </>
                        )}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                        <p className="text-red-600 text-sm font-medium">⚠️ {error}</p>
                        {error.includes("SERPER") && (
                            <p className="text-xs text-red-400 mt-1">Add your <code className="bg-red-100 px-1 rounded">SERPER_API_KEY</code> to .env.local — get one free at <a href="https://serper.dev" target="_blank" rel="noreferrer" className="underline">serper.dev</a></p>
                        )}
                    </div>
                )}

                {/* Results */}
                {searched && jobs.length === 0 && !error && (
                    <div className="text-center py-10 text-brand-dark/40">
                        <p className="text-4xl mb-3">🔍</p>
                        <p className="font-semibold">No jobs found for &ldquo;{role}&rdquo;</p>
                        <p className="text-sm mt-1">Try broadening your search or switching to &ldquo;Last 24h&rdquo;</p>
                    </div>
                )}

                {jobs.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-bold text-brand-dark"><Sparkles className="w-4 h-4 inline mr-1 text-brand-primary" />{jobs.length} jobs found</p>
                        </div>
                        {jobs.map((job, i) => (
                            <div key={i} className="flex items-start justify-between gap-4 p-4 rounded-xl border border-brand-muted hover:border-brand-primary/30 hover:shadow-md transition-all bg-white">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-brand-dark text-sm truncate">{job.title}</h4>
                                    <p className="text-xs text-brand-dark/50">{job.company} • Remote</p>
                                    {job.snippet && (
                                        <p className="text-xs text-brand-dark/40 mt-1 line-clamp-2">{job.snippet}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${platformColor[job.platform] || platformColor.other}`}>
                                        {job.platform}
                                    </span>
                                    <a href={job.url} target="_blank" rel="noreferrer"
                                        className="w-9 h-9 rounded-lg bg-brand-primary/10 hover:bg-brand-primary hover:text-white text-brand-primary flex items-center justify-center transition-all">
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
