"use client";
import { useState } from "react";

const FAQS = [
    {
        q: "What is JobSprint?",
        a: "JobSprint is an AI-powered career suite that automates job applications, builds résumés, generates cover letters, simulates exams, and preps you for interviews — all from one platform.",
    },
    {
        q: "How does the Job Automator work?",
        a: "Upload or create your résumé, set your job preferences, and JobSprint automatically finds matching positions and submits tailored applications on your behalf — 24/7.",
    },
    {
        q: "Is the Resume Builder really powered by AI?",
        a: "Yes! JobSprint uses Google's Gemini 2.0 Flash model to generate, optimise, and format your résumé with ATS-friendly keywords based on your career details.",
    },
    {
        q: "Can I try JobSprint for free?",
        a: "Absolutely. Our Free plan gives you 1 résumé build/month and 5 job applications. Upgrade anytime for unlimited access.",
    },
    {
        q: "What exams can I simulate?",
        a: "JobSprint supports professional certifications, academic exams, technical assessments, and more. Our AI generates questions tailored to your specific subject and difficulty level.",
    },
    {
        q: "Is my data secure?",
        a: "100%. Your data is encrypted end-to-end and never shared with third parties. We follow strict privacy standards to keep your career information safe.",
    },
];

export default function FAQ() {
    const [openIdx, setOpenIdx] = useState<number | null>(null);

    return (
        <section id="faq" className="py-24 px-4 md:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-semibold mb-4">
                        FAQ
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
                        Frequently Asked <span className="text-brand-primary">Questions</span>
                    </h2>
                </div>

                {/* Accordion */}
                <div className="space-y-3">
                    {FAQS.map((faq, i) => {
                        const isOpen = openIdx === i;
                        return (
                            <div
                                key={i}
                                className={`rounded-xl border transition-all ${isOpen
                                    ? "border-brand-primary/30 shadow-md shadow-brand-primary/5 bg-white"
                                    : "border-brand-muted/50 bg-white hover:border-brand-primary/20"
                                    }`}
                            >
                                <button
                                    onClick={() => setOpenIdx(isOpen ? null : i)}
                                    className="w-full flex items-center justify-between px-6 py-5 text-left"
                                >
                                    <span className="font-semibold text-brand-dark pr-4">{faq.q}</span>
                                    <span
                                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen
                                            ? "bg-brand-primary text-white rotate-45"
                                            : "bg-brand-primary/10 text-brand-primary"
                                            }`}
                                    >
                                        +
                                    </span>
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                                        }`}
                                >
                                    <p className="px-6 pb-5 text-sm text-brand-dark/50 leading-relaxed">{faq.a}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
