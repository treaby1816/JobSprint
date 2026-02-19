"use client";

import type { FeatureKey } from "@/app/page";

const FEATURES: { icon: string; title: string; desc: string; color: string; key: FeatureKey }[] = [
    {
        icon: "📄",
        title: "Resume Builder",
        desc: "AI crafts a professional résumé from your career details in minutes. Powered by Gemini.",
        color: "from-brand-primary to-brand-accent",
        key: "resume",
    },
    {
        icon: "🚀",
        title: "Job Automator",
        desc: "Auto-apply to matching jobs with tailored applications. 70% less time hunting.",
        color: "from-brand-secondary to-brand-primary",
        key: "job-automator",
    },
    {
        icon: "🎓",
        title: "Mock Exams",
        desc: "Simulate JAMB, IELTS, PMP, ICAN & more with AI-generated questions and instant feedback.",
        color: "from-brand-accent to-brand-secondary",
        key: "mock-exam",
    },
    {
        icon: "✉️",
        title: "Cover Letters",
        desc: "Generate role-specific cover letters that align perfectly with job descriptions.",
        color: "from-brand-primary to-brand-secondary",
        key: "cover-letter",
    },
    {
        icon: "🎤",
        title: "Interview Prep",
        desc: "Practice mock interviews with AI coaching and get actionable feedback.",
        color: "from-brand-accent to-brand-primary",
        key: "interview-prep",
    },
    {
        icon: "🎬",
        title: "Transcription",
        desc: "Transcribe audio and video files instantly. Perfect for meetings and lectures.",
        color: "from-brand-secondary to-brand-accent",
        key: "transcription",
    },
];

interface Props {
    onFeatureClick: (key: FeatureKey) => void;
}

export default function Features({ onFeatureClick }: Props) {
    return (
        <section id="features" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
                <span className="inline-block px-4 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-semibold mb-4">
                    Features
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
                    Everything You Need to{" "}
                    <span className="text-brand-primary">Land the Job</span>
                </h2>
                <p className="text-brand-dark/50 max-w-xl mx-auto">
                    One platform, six powerful AI tools. Click any feature to try it live.
                </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {FEATURES.map((f, i) => (
                    <button
                        key={f.title}
                        onClick={() => onFeatureClick(f.key)}
                        className="group relative bg-white rounded-2xl p-8 shadow-sm border border-brand-muted/50 hover:shadow-xl hover:shadow-brand-primary/10 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up text-left cursor-pointer"
                        style={{ animationDelay: `${i * 0.08}s` }}
                    >
                        {/* Blob icon */}
                        <div
                            className={`w-16 h-16 rounded-[40%_60%_70%_30%/40%_40%_60%_50%] bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl mb-5 animate-morph shadow-lg group-hover:scale-110 transition-transform`}
                        >
                            {f.icon}
                        </div>

                        <h3 className="text-xl font-bold mb-2 group-hover:text-brand-primary transition-colors">
                            {f.title}
                        </h3>
                        <p className="text-brand-dark/50 text-sm leading-relaxed mb-4">{f.desc}</p>

                        {/* Try Now CTA */}
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            Try Now <span className="transition-transform group-hover:translate-x-1">→</span>
                        </span>

                        {/* Hover corner glow */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-brand-primary/5 to-transparent rounded-tr-2xl rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                ))}
            </div>
        </section>
    );
}
