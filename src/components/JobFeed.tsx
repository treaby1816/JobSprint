"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
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
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: false, margin: "-80px" }}
                    transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
                    className="text-center mb-10"
                >
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
                </motion.div>

                {/* Cards Container */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 overflow-hidden px-2 pb-4 pt-2 -mx-2">
                    {DEMO_JOBS.map((job, i) => (
                        <motion.div
                            key={job.id}
                            initial={{
                                opacity: 0,
                                y: 60,
                                scale: 0.9,
                                rotateX: 15,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                                rotateX: 0,
                            }}
                            viewport={{ once: false, margin: "-60px" }}
                            transition={{
                                duration: 0.8,
                                delay: i * 0.15,
                                ease: [0.21, 0.47, 0.32, 0.98]
                            }}
                        >
                            <JobCard
                                title={job.title}
                                company={job.company}
                                matchScore={job.matchScore}
                                detectedAgo={job.detectedAgo}
                                applying={applying === job.id}
                                onApply={() => handleApply(job.id, job.title)}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Toast */}
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        className="fixed bottom-6 left-1/2 z-[100]"
                    >
                        <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-2xl">
                            <span>⚡</span>
                            <span>{toast}</span>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
