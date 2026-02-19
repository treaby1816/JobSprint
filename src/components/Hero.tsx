"use client";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
            {/* Background gradient blobs */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-10 -left-32 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-20 -right-32 w-80 h-80 bg-brand-secondary/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-accent/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
                {/* Pill badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 mb-8 animate-fade-in-up">
                    <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                    <span className="text-sm font-medium text-brand-primary">AI-Powered Career Suite</span>
                </div>

                {/* Main headline */}
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                    Automate Your Career.{" "}
                    <span className="font-kdam bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary bg-clip-text text-transparent animate-gradient animate-bubble-size inline-block">
                        Land Your Dream Job.
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-brand-dark/60 max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                    JobSprint builds your résumé, tailors cover letters, simulates exams,
                    and auto-applies to jobs — so you can focus on what matters.
                </p>

                {/* Stats bar */}
                <div className="flex flex-wrap justify-center gap-6 mb-10 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                    {[
                        { value: "40%", label: "More hires" },
                        { value: "70%", label: "Time saved" },
                        { value: "10k+", label: "Users" },
                    ].map((s) => (
                        <div key={s.label} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow-sm border border-brand-muted">
                            <span className="text-2xl font-extrabold text-brand-primary">{s.value}</span>
                            <span className="text-sm text-brand-dark/50">{s.label}</span>
                        </div>
                    ))}
                </div>

                {/* CTAs — "Try It Now" goes to /sign-up like the reference site */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                    <Link
                        href="/sign-up"
                        className="inline-flex items-center justify-center h-14 px-10 rounded-full bg-brand-primary text-white text-base font-bold shadow-xl shadow-brand-primary/25 hover:bg-brand-primary-hover transition-all hover:-translate-y-0.5 hover:shadow-2xl relative overflow-hidden group"
                    >
                        <span className="relative z-10">Try It Now — It&apos;s Free</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-ripple" />
                    </Link>
                    <a
                        href="#how-it-works"
                        className="inline-flex items-center justify-center h-14 px-10 rounded-full border-2 border-brand-dark/10 text-brand-dark font-bold hover:border-brand-primary hover:text-brand-primary transition-all hover:-translate-y-0.5"
                    >
                        See How It Works
                    </a>
                </div>
            </div>
        </section>
    );
}
