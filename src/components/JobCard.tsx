"use client";

import { Bolt, Sparkles } from "lucide-react";

interface JobCardProps {
    title: string;
    company: string;
    matchScore: number;
    detectedAgo?: string;
    onApply?: () => void;
    applying?: boolean;
}

export default function JobCard({
    title,
    company,
    matchScore,
    detectedAgo = "8 mins ago",
    onApply,
    applying = false,
}: JobCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-600 hover:shadow-md dark:border-slate-800 dark:bg-slate-950">

            {/* Sprint Speed Indicator */}
            <div className="absolute top-0 right-0 rounded-bl-xl bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                <Bolt className="inline-block h-3 w-3 mr-1" />
                Detected {detectedAgo}
            </div>

            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-slate-500">{company} • Remote</p>
                </div>
            </div>

            {/* Gemini Match Score */}
            <div className="mt-4 flex items-center space-x-2 rounded-lg bg-blue-50 p-3 dark:bg-slate-900">
                <Sparkles className="h-5 w-5 text-purple-600 shrink-0" />
                <div className="flex-1">
                    <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-700 dark:text-slate-300">Gemini Match Score</span>
                        <span className="text-blue-700 dark:text-blue-400">{matchScore}%</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
                        <div
                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                            style={{ width: `${matchScore}%` }}
                        />
                    </div>
                </div>
            </div>

            <button
                onClick={onApply}
                disabled={applying}
                className="mt-4 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {applying ? (
                    <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Queuing…
                    </span>
                ) : (
                    "⚡ Auto-Apply (Sprint Mode)"
                )}
            </button>
        </div>
    );
}
