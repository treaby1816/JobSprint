"use client";
import { useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function SignUpPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [googleMessage, setGoogleMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirm) return alert("Passwords don't match!");
        setLoading(true);
        setGoogleMessage(null);
        try {
            const { data, error } = await supabaseBrowser.auth.signUp({
                email,
                password,
                options: { data: { full_name: fullName } },
            });
            if (error) {
                setGoogleMessage(error.message);
                setTimeout(() => setGoogleMessage(null), 5000);
            } else if (data.session) {
                // User is auto-confirmed (or confirmation disabled)
                window.location.href = "/choose-plan";
            } else {
                setGoogleMessage("✅ Account created! Check your email to confirm, then sign in.");
            }
        } catch {
            setGoogleMessage("Sign up failed. Please try again.");
            setTimeout(() => setGoogleMessage(null), 5000);
        } finally { setLoading(false); }
    };

    const handleGoogleSignUp = async () => {
        try {
            const { error } = await supabaseBrowser.auth.signInWithOAuth({
                provider: "google",
                options: { redirectTo: `${window.location.origin}/choose-plan` },
            });
            if (error) {
                setGoogleMessage(error.message);
                setTimeout(() => setGoogleMessage(null), 6000);
            }
        } catch {
            setGoogleMessage("Google sign-up failed. Check your Supabase Google provider config.");
            setTimeout(() => setGoogleMessage(null), 6000);
        } finally { setLoading(false); }
    };

    const stats = [
        { num: "12K+", label: "Users hired" },
        { num: "98%", label: "Satisfaction" },
        { num: "3min", label: "Avg résumé time" },
    ];

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden py-12">

            {/* ─── Animated Background ─── */}
            <div className="absolute inset-0 bg-brand-dark" />

            {/* Gradient mesh — different from sign-in */}
            <div className="absolute inset-0 opacity-70"
                style={{
                    background: "radial-gradient(ellipse 80% 60% at 80% 20%, hsl(180 80% 25%) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 10% 80%, hsl(263 90% 30%) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 50% 50%, hsl(300 60% 15%) 0%, transparent 70%)"
                }}
            />

            {/* Animated blobs */}
            <div className="absolute top-10 right-10 w-80 h-80 rounded-full bg-brand-accent/20 blur-3xl animate-pulse" style={{ animationDuration: "5s" }} />
            <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-brand-primary/15 blur-3xl animate-pulse" style={{ animationDuration: "7s", animationDelay: "1s" }} />
            <div className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full bg-brand-secondary/20 blur-3xl animate-pulse" style={{ animationDuration: "9s", animationDelay: "3s" }} />

            {/* Grid */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                    backgroundSize: "50px 50px"
                }}
            />

            {/* Floating words */}
            {["Build", "Apply", "Succeed", "IELTS", "PMP", "LinkedIn", "Growth", "Dream Job"].map((word, i) => (
                <div key={word}
                    className="absolute text-white/5 font-extrabold select-none pointer-events-none"
                    style={{
                        fontSize: `${1.2 + (i % 3) * 1.3}rem`,
                        top: `${8 + (i * 12) % 82}%`,
                        left: `${3 + (i * 11) % 88}%`,
                        transform: `rotate(${-20 + (i * 9) % 40}deg)`,
                    }}
                >
                    {word}
                </div>
            ))}

            {/* ─── Two-Column Layout ─── */}
            <div className="relative z-10 w-full max-w-5xl mx-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                {/* Left — Pitch panel */}
                <div className="hidden lg:block">
                    <div className="inline-flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-xl">⚡</div>
                        <span className="text-2xl font-extrabold text-white">JobSprint</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
                        Your AI-powered<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">career co-pilot.</span>
                    </h1>
                    <p className="text-white/50 mb-8 leading-relaxed">
                        Join 12,000+ professionals using JobSprint to build résumés, practice exams, and automate job applications — all in one place.
                    </p>

                    {/* Stats */}
                    <div className="flex gap-6 mb-10">
                        {stats.map(s => (
                            <div key={s.label}>
                                <div className="text-2xl font-extrabold text-white">{s.num}</div>
                                <div className="text-white/40 text-sm">{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Feature list */}
                    {[
                        "📄 AI résumé builder in 3 minutes",
                        "🎓 JAMB, WAEC, NECO, IELTS simulators",
                        "✉️ Cover letters tailored to every job",
                        "🎤 Interview prep with model answers",
                    ].map(f => (
                        <div key={f} className="flex items-center gap-3 mb-3">
                            <div className="w-5 h-5 rounded-full bg-brand-primary/20 border border-brand-primary/50 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-brand-primary" />
                            </div>
                            <span className="text-white/60 text-sm">{f}</span>
                        </div>
                    ))}
                </div>

                {/* Right — Sign Up Card */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">

                    <div className="text-center mb-6 lg:hidden">
                        <div className="inline-flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-base">⚡</div>
                            <span className="text-xl font-extrabold text-white">JobSprint</span>
                        </div>
                    </div>

                    <h2 className="text-2xl font-extrabold text-white mb-1">Create your account</h2>
                    <p className="text-white/40 text-sm mb-6">Free forever. No credit card needed.</p>

                    {/* Google */}
                    <button onClick={handleGoogleSignUp} className="w-full h-12 rounded-xl bg-white text-brand-dark font-bold flex items-center justify-center gap-3 mb-4 hover:bg-white/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                        <svg width="18" height="18" viewBox="0 0 48 48">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                        </svg>
                        Sign up with Google
                    </button>

                    {googleMessage && (
                        <div className="mb-4 p-3 rounded-xl bg-blue-500/20 border border-blue-400/30 text-sm text-blue-200">
                            ℹ️ {googleMessage}
                        </div>
                    )}

                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex-1 h-px bg-white/20" />
                        <span className="text-white/40 text-sm">or</span>
                        <div className="flex-1 h-px bg-white/20" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            placeholder="Full Name"
                            required
                            className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30 transition-all"
                        />
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Email address"
                            required
                            className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30 transition-all"
                        />
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Create password"
                                required
                                className="w-full h-12 px-4 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30 transition-all"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors text-sm">
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        <input
                            type="password"
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            placeholder="Confirm password"
                            required
                            className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30 transition-all"
                        />

                        <label className="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} required className="mt-1 accent-brand-primary" />
                            <span className="text-white/40 text-xs">I agree to JobSprint&apos;s <a href="#" className="text-brand-primary hover:underline">Terms of Service</a> and <a href="#" className="text-brand-primary hover:underline">Privacy Policy</a></span>
                        </label>

                        <button type="submit" disabled={loading || !agreed}
                            className="w-full h-12 rounded-xl bg-gradient-to-r from-brand-primary to-brand-accent text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating account...
                                </span>
                            ) : "Create Free Account →"}
                        </button>
                    </form>

                    <p className="text-center text-white/40 text-sm mt-5">
                        Already have an account?{" "}
                        <Link href="/sign-in" className="text-brand-primary font-bold hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>

            {/* Back */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                <Link href="/" className="text-white/30 text-sm hover:text-white/60 transition-colors">← Back to JobSprint</Link>
            </div>
        </div>
    );
}
