"use client";

import { useState, useCallback } from "react";
import JobCard from "./JobCard";

const DEMO_JOBS = [
    {
        id: "demo-1",
        title: "React Developer",
        company: "TechVault Inc.",
        matchScore: 92,
        detectedAgo: "3 mins ago",
    },
    {
        id: "demo-2",
        title: "Data Analyst",
        company: "Finova Labs",
        matchScore: 87,
        detectedAgo: "8 mins ago",
    },
    {
        id: "demo-3",
        title: "Full-Stack Engineer",
        company: "CloudShift AI",
        matchScore: 94,
        detectedAgo: "12 mins ago",
    },
];

export default function JobFeed() {
    const [toast, setToast] = useState<string | null>(null);
    const [applying, setApplying] = useState<string | null>(null);

    const handleApply = useCallback((jobId: string, title: string) => {
        setApplying(jobId);
        setToast(null);
        setTimeout(() => {
            setApplying(null);
            setToast(`Application queued for rapid submission: ${title}`);
            setTimeout(() => setToast(null), 4000);
        }, 1500);
    }, []);

    return (
        <section className="py-16 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        Live Feed
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark mb-3">
                        Sprint <span className="text-brand-primary">Workflow</span>
                    </h2>
                    <p className="text-brand-dark/50 max-w-xl mx-auto">
                        Fresh jobs detected from Greenhouse, Lever & Ashby — matched by Gemini AI in real time.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {DEMO_JOBS.map((job) => (
                        <JobCard
                            key={job.id}
                            title={job.title}
                            company={job.company}
                            matchScore={job.matchScore}
                            detectedAgo={job.detectedAgo}
                            applying={applying === job.id}
                            onApply={() => handleApply(job.id, job.title)}
                        />
                    ))}
                </div>

                {/* Toast */}
                {toast && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-fade-in-up">
                        <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-2xl">
                            <span>⚡</span>
                            <span>{toast}</span>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
