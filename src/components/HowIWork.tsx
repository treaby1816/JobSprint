"use client";

import { motion } from "framer-motion";

const STEPS = [
    { num: "01", title: "Upload Your Résumé", desc: "Drop your existing CV or start fresh — JobSprint handles either.", icon: "📤" },
    { num: "02", title: "AI Optimises It", desc: "Gemini rewrites, formats, and keyword-optimises for ATS systems.", icon: "✨" },
    { num: "03", title: "Connect to Jobs", desc: "We match you with thousands of relevant openings instantly.", icon: "🔗" },
    { num: "04", title: "Auto Apply", desc: "JobSprint submits tailored applications on your behalf — 24/7.", icon: "⚡" },
    { num: "05", title: "Get Hired", desc: "Prep for interviews, ace exams, and land the role you deserve.", icon: "🎯" },
];

export default function HowIWork() {
    return (
        <section id="how-it-works" className="py-24 px-4 md:px-8 bg-brand-dark text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full -z-0">
                <div className="absolute top-20 left-10 w-72 h-72 bg-brand-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-20 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-brand-secondary text-sm font-semibold mb-4">
                        How I Work
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
                        From Upload to <span className="text-brand-primary">Hired</span> in 5 Steps
                    </h2>
                    <p className="text-white/50 max-w-xl mx-auto">
                        Simple, fast, automated. Let JobSprint do the heavy lifting.
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="relative">
                    {/* Connecting line */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary -translate-y-1/2 opacity-20" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                        {STEPS.map((s, i) => (
                            <motion.div
                                key={s.num}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                whileHover={{ y: -8 }}
                                className="group relative flex flex-col items-center text-center bg-white/5 hover:bg-brand-primary/10 p-6 rounded-2xl border border-white/5 hover:border-brand-primary/30 transition-all duration-300 shadow-xl hover:shadow-brand-primary/20 cursor-pointer"
                            >
                                {/* Circle */}
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-3xl mb-4 shadow-xl shadow-brand-primary/20 relative z-10 group-hover:scale-110 transition-transform">
                                    {s.icon}
                                </div>

                                {/* Number badge */}
                                <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-brand-secondary text-brand-dark text-xs font-extrabold flex items-center justify-center shadow-md z-20 group-hover:bg-brand-accent group-hover:scale-110 transition-all duration-300">
                                    {s.num}
                                </span>

                                <h3 className="text-lg font-bold mb-2 group-hover:text-brand-primary transition-colors">{s.title}</h3>
                                <p className="text-white/40 group-hover:text-white/70 text-sm leading-relaxed transition-colors">{s.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
