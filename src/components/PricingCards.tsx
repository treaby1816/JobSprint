"use client";
import { useRouter } from "next/navigation";

const PLANS = [
    {
        name: "Free",
        price: "$0",
        period: "forever",
        features: [
            "1 résumé build per month",
            "5 job applications",
            "Basic exam simulator",
            "Community support",
        ],
        cta: "Start Free",
        popular: false,
    },
    {
        name: "Per Use",
        price: "$2.99",
        period: "per action",
        features: [
            "Pay only when you use it",
            "Unlimited résumé builds",
            "10 job applications per purchase",
            "Full exam simulator",
            "Cover letter generator",
        ],
        cta: "Buy Credits",
        popular: false,
    },
    {
        name: "Per Week",
        price: "$9.99",
        period: "/ week",
        features: [
            "Unlimited résumé builds",
            "50 job applications / week",
            "Unlimited mock exams",
            "Interview prep AI",
            "Priority support",
        ],
        cta: "Start Weekly",
        popular: true,
    },
    {
        name: "Per Month",
        price: "$29.99",
        period: "/ month",
        features: [
            "Everything in Weekly",
            "Unlimited job applications",
            "Audio & video transcription",
            "Advanced analytics",
            "Dedicated account manager",
        ],
        cta: "Go Monthly",
        popular: false,
    },
];

export default function PricingCards() {
    const router = useRouter();

    const handlePlanSelect = () => {
        // All plans redirect to sign-up (like the reference site)
        router.push("/sign-up");
    };

    return (
        <section id="pricing" className="py-24 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-semibold mb-4">
                        Pricing
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
                        <span className="text-brand-primary">Job Automator</span> Plans
                    </h2>
                    <p className="text-brand-dark/50 max-w-xl mx-auto">
                        Flexible pricing that scales with your career ambitions. Start free, upgrade when ready.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {PLANS.map((p, i) => (
                        <div
                            key={p.name}
                            className={`relative flex flex-col rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl animate-fade-in-up ${p.popular
                                ? "bg-gradient-to-br from-brand-primary to-brand-accent text-white shadow-xl shadow-brand-primary/30 scale-105 lg:scale-105 z-10"
                                : "bg-white text-brand-dark shadow-sm border border-brand-muted/50 hover:shadow-brand-primary/10"
                                }`}
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            {/* Popular badge */}
                            {p.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand-secondary text-brand-dark text-xs font-extrabold shadow-md">
                                    Most Popular
                                </div>
                            )}

                            <h3 className={`text-lg font-bold mb-1 ${p.popular ? "text-white" : "text-brand-dark"}`}>{p.name}</h3>

                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-extrabold">{p.price}</span>
                                <span className={`text-sm ${p.popular ? "text-white/60" : "text-brand-dark/40"}`}>{p.period}</span>
                            </div>

                            <hr className={`mb-6 ${p.popular ? "border-white/20" : "border-brand-muted"}`} />

                            <ul className="flex-1 space-y-3 mb-8">
                                {p.features.map((f) => (
                                    <li key={f} className="flex items-start gap-2 text-sm">
                                        <span className={`mt-0.5 text-base ${p.popular ? "text-brand-secondary" : "text-brand-primary"}`}>✓</span>
                                        <span className={p.popular ? "text-white/80" : "text-brand-dark/60"}>{f}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={handlePlanSelect}
                                className={`w-full h-12 rounded-full font-bold text-sm transition-all relative overflow-hidden group cursor-pointer ${p.popular
                                    ? "bg-white text-brand-primary hover:bg-brand-light shadow-lg"
                                    : "bg-brand-primary text-white hover:bg-brand-primary-hover shadow-md shadow-brand-primary/20"
                                    }`}
                            >
                                <span className="relative z-10">{p.cta}</span>
                                {!p.popular && (
                                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-ripple" />
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
