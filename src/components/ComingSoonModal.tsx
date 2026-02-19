"use client";
import { useState } from "react";

interface Props { open: boolean; onClose: () => void; feature: string; }

export default function ComingSoonModal({ open, onClose, feature }: Props) {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) setSubmitted(true);
    };

    const resetAndClose = () => { setSubmitted(false); setEmail(""); onClose(); };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" onClick={resetAndClose}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center" onClick={(e) => e.stopPropagation()}>
                <button onClick={resetAndClose} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-brand-muted flex items-center justify-center hover:bg-red-100 transition-colors text-lg">✕</button>

                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-secondary to-brand-primary flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🚀</span>
                </div>

                <h2 className="text-2xl font-extrabold text-brand-dark mb-2">{feature}</h2>
                <p className="text-brand-dark/50 mb-6">
                    This feature is currently under development. We&apos;re building something amazing — be the first to know when it launches!
                </p>

                {submitted ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <p className="text-green-700 font-semibold">🎉 You&apos;re on the list! We&apos;ll notify you at <strong>{email}</strong> when {feature} launches.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="your@email.com" required
                            className="flex-1 h-12 px-4 rounded-xl border border-brand-muted bg-brand-light/30 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none" />
                        <button type="submit" className="h-12 px-6 rounded-xl bg-brand-primary text-white font-bold hover:bg-brand-primary-hover transition-all">
                            Notify Me
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
