"use client";
import { useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [googleMessage, setGoogleMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setGoogleMessage(null);
        try {
            const { error } = await supabaseBrowser.auth.signInWithPassword({ email, password });
            if (error) {
                setGoogleMessage(error.message);
                setTimeout(() => setGoogleMessage(null), 5000);
            } else {
                window.location.href = "/choose-plan";
            }
        } catch {
            setGoogleMessage("Sign in failed. Please try again.");
            setTimeout(() => setGoogleMessage(null), 5000);
        } finally { setLoading(false); }
    };

    const handleGoogleSignIn = async () => {
        try {
            const { error } = await supabaseBrowser.auth.signInWithOAuth({
                provider: "google",
                options: { redirectTo: `${window.location.origin}/choose-plan` },
            });
            if (error) {
                setGoogleMessage(error.message);
                setTimeout(() => setGoogleMessage(null), 6000);
            }
            // If no error, Supabase redirects to Google automatically
        } catch {
            setGoogleMessage("Google sign-in failed. Check your Supabase Google provider config.");
            setTimeout(() => setGoogleMessage(null), 6000);
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden">

            {/* ─── Animated Background ─── */}
            <div className="absolute inset-0 bg-brand-dark" />

            {/* Gradient mesh */}
            <div className="absolute inset-0 opacity-60"
                style={{
                    background: "radial-gradient(ellipse 80% 60% at 20% 30%, hsl(263 90% 35%) 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 80% 70%, hsl(180 80% 25%) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 50% 100%, hsl(300 70% 20%) 0%, transparent 70%)"
                }}
            />

            {/* Animated floating orbs */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-brand-primary/20 blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-brand-accent/15 blur-3xl animate-pulse" style={{ animationDuration: "6s", animationDelay: "2s" }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-secondary/10 blur-3xl animate-pulse" style={{ animationDuration: "8s", animationDelay: "1s" }} />

            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                    backgroundSize: "50px 50px"
                }}
            />

            {/* Floating career keywords */}
            {["Resume", "Hired!", "Interview", "Offer Letter", "Career", "JAMB", "WAEC", "Skills"].map((word, i) => (
                <div key={word}
                    className="absolute text-white/5 font-extrabold select-none pointer-events-none animate-fade-in-up"
                    style={{
                        fontSize: `${1.5 + (i % 3) * 1.2}rem`,
                        top: `${10 + (i * 11) % 80}%`,
                        left: `${5 + (i * 13) % 85}%`,
                        animationDelay: `${i * 0.3}s`,
                        transform: `rotate(${-15 + (i * 7) % 30}deg)`,
                    }}
                >
                    {word}
                </div>
            ))}

            {/* ─── Card ─── */}
            <div className="relative z-10 w-full max-w-md mx-4">
                {/* Glassmorphism card */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">

                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-xl">⚡</div>
                            <span className="text-2xl font-extrabold text-white">JobSprint</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-white mb-1">Welcome back</h1>
                        <p className="text-white/50 text-sm">Sign in to your career dashboard</p>
                    </div>

                    {/* Google Sign-In */}
                    <button onClick={handleGoogleSignIn} className="w-full h-12 rounded-xl bg-white text-brand-dark font-bold flex items-center justify-center gap-3 mb-4 hover:bg-white/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                        <svg width="20" height="20" viewBox="0 0 48 48">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                        </svg>
                        Continue with Google
                    </button>

                    {googleMessage && (
                        <div className="mb-4 p-3 rounded-xl bg-blue-500/20 border border-blue-400/30 text-sm text-blue-200">
                            ℹ️ {googleMessage}
                        </div>
                    )}

                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 h-px bg-white/20" />
                        <span className="text-white/40 text-sm">or</span>
                        <div className="flex-1 h-px bg-white/20" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-white/70 text-sm font-medium mb-1.5">Email address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30 transition-all"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-white/70 text-sm font-medium">Password</label>
                                <Link href="#" className="text-brand-primary text-xs font-semibold hover:underline">Forgot password?</Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full h-12 px-4 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30 transition-all"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors text-sm">
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full h-12 rounded-xl bg-gradient-to-r from-brand-primary to-brand-accent text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2">
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </span>
                            ) : "Sign In →"}
                        </button>
                    </form>

                    {/* Sign up link */}
                    <p className="text-center text-white/40 text-sm mt-6">
                        Don&apos;t have an account?{" "}
                        <Link href="/sign-up" className="text-brand-primary font-bold hover:underline">Create one free</Link>
                    </p>
                </div>

                {/* Back link */}
                <div className="text-center mt-6">
                    <Link href="/" className="text-white/30 text-sm hover:text-white/60 transition-colors">
                        ← Back to JobSprint
                    </Link>
                </div>
            </div>
        </div>
    );
}
