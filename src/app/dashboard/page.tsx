"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";

/* ── Feature modals (reuse from landing page) ── */
import MockExamModal from "@/components/MockExamModal";
import CoverLetterModal from "@/components/CoverLetterModal";
import ResumeModal from "@/components/ResumeModal";
import InterviewPrepModal from "@/components/InterviewPrepModal";
import TranscriptionModal from "@/components/TranscriptionModal";
import JobAutomatorModal from "@/components/JobAutomatorModal";

/* ── Feature card data ── */
const FEATURES = [
    {
        id: "job-automator",
        icon: "🎯",
        title: "Job Sniper",
        desc: "Search Greenhouse, Lever & Ashby for fresh remote jobs in real time.",
        gradient: "from-blue-600 to-purple-600",
        badge: "Live",
    },
    {
        id: "resume-builder",
        icon: "📄",
        title: "Resume Builder",
        desc: "Paste your profile + JD → get an ATS-optimised résumé in seconds.",
        gradient: "from-amber-500 to-orange-600",
        badge: "AI",
    },
    {
        id: "mock-exam",
        icon: "🎓",
        title: "Mock Exams",
        desc: "JAMB, WAEC, NECO, IELTS & more — past-question style with explanations.",
        gradient: "from-emerald-500 to-teal-600",
        badge: "AI",
    },
    {
        id: "cover-letter",
        icon: "✉️",
        title: "Cover Letter",
        desc: "Generate a tailored cover letter that matches any job description.",
        gradient: "from-pink-500 to-rose-600",
        badge: "AI",
    },
    {
        id: "interview-prep",
        icon: "🎤",
        title: "Interview Prep",
        desc: "Practice interview questions with model answers for any role.",
        gradient: "from-cyan-500 to-blue-600",
        badge: "AI",
    },
    {
        id: "transcription",
        icon: "📝",
        title: "Transcription",
        desc: "Clean up text, summarize documents, or generate meeting minutes with AI.",
        gradient: "from-violet-500 to-purple-600",
        badge: "AI",
    },
];

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [showWelcome, setShowWelcome] = useState(false);
    const [activeModal, setActiveModal] = useState<string | null>(null);

    /* ── Check auth state on mount ── */
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabaseBrowser.auth.getUser();
            setUser(user);
            setLoadingAuth(false);

            /* Show welcome toast for new sessions */
            if (user) {
                const lastWelcome = sessionStorage.getItem("jobsprint_welcomed");
                if (!lastWelcome) {
                    setShowWelcome(true);
                    sessionStorage.setItem("jobsprint_welcomed", "true");
                    setTimeout(() => setShowWelcome(false), 4000);
                }
            }
        };
        checkUser();
    }, []);

    const handleSignOut = async () => {
        await supabaseBrowser.auth.signOut();
        router.push("/");
    };

    const openModal = (id: string) => {
        if (!user) {
            router.push("/sign-in");
            return;
        }
        if (id === "resume-builder") {
            /* Scroll to resume section or open inline */
            setActiveModal("resume-builder");
        } else if (id === "transcription") {
            setActiveModal("transcription");
        } else {
            setActiveModal(id);
        }
    };

    const displayName = user?.user_metadata?.name
        || user?.user_metadata?.full_name
        || user?.email?.split("@")[0]
        || "there";
    const firstName = displayName.split(" ")[0];

    return (
        <div className="min-h-screen bg-zinc-950 text-white">

            {/* ── Welcome Toast ── */}
            {showWelcome && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-fade-in-up">
                    <div className="bg-gradient-to-r from-brand-primary to-brand-accent text-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-2">
                        🎉 Welcome to JobSprint, {firstName}! Pick a feature below to get started.
                    </div>
                </div>
            )}

            {/* ── Header ── */}
            <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
                <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-4 md:px-8">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-sm font-extrabold">⚡</div>
                            <span className="font-extrabold text-white">JobSprint</span>
                        </Link>
                        <span className="text-zinc-700 text-sm">/</span>
                        <span className="text-zinc-400 text-sm font-medium">Dashboard</span>
                    </div>

                    <div className="flex items-center gap-3">
                        {loadingAuth ? (
                            <div className="w-20 h-8 rounded-full bg-zinc-800 animate-pulse" />
                        ) : user ? (
                            <>
                                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/60 border border-zinc-700">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-[10px] font-bold">
                                        {firstName[0]?.toUpperCase()}
                                    </div>
                                    <span className="text-zinc-300 text-sm">{firstName}</span>
                                </div>
                                <button onClick={handleSignOut}
                                    className="h-8 px-4 rounded-full border border-zinc-700 text-zinc-400 text-sm font-medium hover:border-red-500 hover:text-red-400 transition-all">
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <Link href="/sign-in"
                                className="h-8 px-4 rounded-full border border-zinc-700 text-zinc-300 text-sm font-medium hover:border-brand-primary hover:text-white transition-all inline-flex items-center justify-center">
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* ── Main Content ── */}
            <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">

                {/* Hero greeting */}
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                        Hey {firstName} 👋
                    </h1>
                    <p className="text-zinc-500 text-lg">
                        What would you like to do today? Pick a feature to get started.
                    </p>
                </div>

                {/* Feature cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {FEATURES.map(f => (
                        <button
                            key={f.id}
                            onClick={() => openModal(f.id)}
                            disabled={f.badge === "Soon"}
                            className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-left hover:border-zinc-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {/* Badge */}
                            <span className={`absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${f.badge === "Live" ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                                f.badge === "AI" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" :
                                    "bg-zinc-700/50 text-zinc-500 border border-zinc-600/30"
                                }`}>
                                {f.badge}
                            </span>

                            {/* Icon */}
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                                {f.icon}
                            </div>

                            {/* Text */}
                            <h3 className="text-lg font-extrabold text-white mb-1">{f.title}</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>

                            {/* Hover arrow */}
                            {f.badge !== "Soon" && (
                                <div className="mt-4 flex items-center gap-1 text-brand-primary text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                    Open →
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* ── Inline Resume Builder Removed in favor of Modal ── */}
            </main>

            {/* ── Modals ── */}
            <ResumeModal open={activeModal === "resume-builder"} onClose={() => setActiveModal(null)} />
            <JobAutomatorModal open={activeModal === "job-automator"} onClose={() => setActiveModal(null)} />
            <MockExamModal open={activeModal === "mock-exam"} onClose={() => setActiveModal(null)} />
            <CoverLetterModal open={activeModal === "cover-letter"} onClose={() => setActiveModal(null)} />
            <InterviewPrepModal open={activeModal === "interview-prep"} onClose={() => setActiveModal(null)} />
            <TranscriptionModal open={activeModal === "transcription"} onClose={() => setActiveModal(null)} />
        </div>
    );
}
