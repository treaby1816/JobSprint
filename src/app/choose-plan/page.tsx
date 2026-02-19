"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";

const PLANS = [
    {
        id: "free",
        name: "Free",
        price: "$0",
        period: "forever",
        popular: false,
        features: [
            "1 résumé build per month",
            "5 job applications",
            "Basic exam simulator",
            "Community support",
        ],
        cta: "Start Free",
    },
    {
        id: "per-use",
        name: "Per Use",
        price: "$2.99",
        period: "per action",
        popular: false,
        features: [
            "Pay only when you use it",
            "Unlimited résumé builds",
            "10 job applications per purchase",
            "Full exam simulator",
            "Cover letter generator",
        ],
        cta: "Buy Credits",
    },
    {
        id: "per-week",
        name: "Per Week",
        price: "$9.99",
        period: "/ week",
        popular: true,
        features: [
            "Unlimited résumé builds",
            "50 job applications / week",
            "Unlimited mock exams",
            "Interview prep AI",
            "Priority support",
        ],
        cta: "Start Weekly",
    },
    {
        id: "per-month",
        name: "Per Month",
        price: "$29.99",
        period: "/ month",
        popular: false,
        features: [
            "Everything in Weekly",
            "Unlimited job applications",
            "Audio & video transcription",
            "Advanced analytics",
            "Dedicated account manager",
        ],
        cta: "Go Monthly",
    },
];

export default function ChoosePlanPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabaseBrowser.auth.getUser();
            setUser(user);
            setLoadingAuth(false);
            if (!user) router.push("/sign-in");
        };
        getUser();
    }, [router]);

    const displayName = user?.user_metadata?.name
        || user?.user_metadata?.full_name
        || user?.email?.split("@")[0]
        || "there";

    const handleSelectPlan = (planId: string) => {
        setSelectedPlan(planId);

        if (planId === "free") {
            sessionStorage.setItem("jobsprint_plan", "free");
            sessionStorage.setItem("jobsprint_welcomed", "");
            router.push("/dashboard");
        } else if (planId === "per-use" || planId === "per-week" || planId === "per-month") {
            // Placeholder for payment integration (Stripe/Paystack)
            sessionStorage.setItem("jobsprint_plan", planId);
            sessionStorage.setItem("jobsprint_welcomed", "");
            router.push("/dashboard");
        }
    };

    if (loadingAuth) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">

            {/* Background effects */}
            <div className="absolute inset-0 opacity-40"
                style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, hsl(220 80% 25%) 0%, transparent 70%)" }} />
            <div className="absolute top-20 left-1/4 w-72 h-72 bg-brand-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-xl">⚡</div>
                        <span className="text-2xl font-extrabold text-white">JobSprint</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
                        Welcome, {displayName}! 🎉
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-xl mx-auto">
                        Flexible pricing that scales with your career ambitions. Start free, upgrade when ready.
                    </p>
                </div>

                {/* Plan cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {PLANS.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative bg-zinc-900 border rounded-3xl p-7 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${plan.popular
                                    ? "border-brand-primary shadow-lg shadow-brand-primary/10 scale-[1.02]"
                                    : "border-zinc-800"
                                }`}
                        >
                            {/* Popular badge */}
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="bg-gradient-to-r from-brand-primary to-brand-accent text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            {/* Plan name */}
                            <h3 className="text-lg font-extrabold text-white mb-1">{plan.name}</h3>

                            {/* Price */}
                            <div className="mb-5">
                                <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                                {plan.period && <span className="text-zinc-500 text-sm ml-1">{plan.period}</span>}
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-8 flex-1">
                                {plan.features.map(f => (
                                    <li key={f} className="flex items-start gap-2.5 text-sm">
                                        <span className="text-brand-primary mt-0.5">✓</span>
                                        <span className="text-zinc-300">{f}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <button
                                onClick={() => handleSelectPlan(plan.id)}
                                disabled={selectedPlan === plan.id}
                                className={`w-full h-12 rounded-xl font-bold text-sm transition-all disabled:opacity-50 ${plan.popular
                                        ? "bg-gradient-to-r from-brand-primary to-blue-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                        : "bg-zinc-800 text-white border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-700"
                                    }`}
                            >
                                {selectedPlan === plan.id ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Loading...
                                    </span>
                                ) : plan.cta}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Footer links */}
                <div className="text-center mt-10 space-y-2">
                    <p className="text-zinc-600 text-sm">All plans include a 7-day money-back guarantee.</p>
                    <a href="/" className="text-zinc-500 text-sm hover:text-white transition-colors">← Back to Home</a>
                </div>
            </div>
        </div>
    );
}
