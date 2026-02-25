"use client";
import { useState } from "react";

interface Props { open: boolean; onClose: () => void; }

interface InterviewQuestion {
    id: number;
    question: string;
    category: string;
    modelAnswer: string;
    coachingTip: string;
}

export default function InterviewPrepModal({ open, onClose }: Props) {
    const [role, setRole] = useState("");
    const [industry, setIndustry] = useState("");
    const [difficulty, setDifficulty] = useState<"entry" | "mid" | "senior">("mid");
    const [numQuestions, setNumQuestions] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [userAnswer, setUserAnswer] = useState("");
    const [showModel, setShowModel] = useState(false);
    const [step, setStep] = useState<"setup" | "practice" | "done">("setup");

    const handleGenerate = async () => {
        if (!role) { setError("Please enter a role."); return; }
        setLoading(true); setError(null);
        try {
            const res = await fetch("/api/interview-prep", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role, industry, difficulty, numberOfQuestions: numQuestions }),
            });
            const data = await res.json();
            console.log("Interview Prep API Response:", data);
            if (!res.ok) throw new Error(data.error || "Failed to generate questions.");
            setQuestions(data.questions);
            setCurrentQ(0);
            setUserAnswer("");
            setShowModel(false);
            setStep("practice");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally { setLoading(false); }
    };

    const revealAnswer = () => setShowModel(true);

    const nextQuestion = () => {
        if (currentQ < questions.length - 1) {
            setCurrentQ(currentQ + 1);
            setUserAnswer("");
            setShowModel(false);
        } else {
            setStep("done");
        }
    };

    const resetAll = () => { setStep("setup"); setQuestions([]); setCurrentQ(0); setUserAnswer(""); setShowModel(false); setError(null); };
    const resetAndClose = () => { resetAll(); onClose(); };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" onClick={resetAndClose}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-accent to-brand-primary flex items-center justify-center text-2xl">🎤</div>
                        <div>
                            <h2 className="text-2xl font-extrabold text-brand-dark">Interview Prep</h2>
                            <p className="text-sm text-brand-dark/50">Practice with AI-generated questions</p>
                        </div>
                    </div>
                    <button onClick={resetAndClose} className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors text-lg font-bold">✕</button>
                </div>

                {step === "setup" && (
                    <div className="space-y-5">
                        <div>
                            <label className="text-xs font-semibold text-brand-dark/60 mb-1 block">Target Role *</label>
                            <input value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Software Engineer, Product Manager" className="w-full h-12 px-4 rounded-xl border border-brand-muted bg-brand-light/30 text-slate-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-brand-dark/60 mb-1 block">Industry (optional)</label>
                            <input value={industry} onChange={e => setIndustry(e.target.value)} placeholder="e.g. FinTech, Healthcare" className="w-full h-12 px-4 rounded-xl border border-brand-muted bg-brand-light/30 text-slate-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="font-bold text-sm text-brand-dark mb-2 block">Experience Level</label>
                                <div className="flex gap-2">
                                    {(["entry", "mid", "senior"] as const).map(d => (
                                        <button key={d} onClick={() => setDifficulty(d)}
                                            className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${difficulty === d ? "bg-brand-primary text-white shadow-md" : "bg-brand-light border border-brand-muted text-brand-dark"}`}>
                                            {d === "entry" ? "Entry" : d === "mid" ? "Mid-Level" : "Senior"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="font-bold text-sm text-brand-dark mb-2 block">Questions: {numQuestions}</label>
                                <input type="range" min={3} max={10} value={numQuestions} onChange={e => setNumQuestions(Number(e.target.value))} className="w-full accent-brand-primary" />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                <p className="text-red-600 text-sm font-medium">⚠️ {error}</p>
                                {error.includes("wait") && (
                                    <button onClick={handleGenerate} className="mt-2 text-sm font-bold text-brand-primary hover:underline">🔄 Retry now</button>
                                )}
                            </div>
                        )}

                        <button onClick={handleGenerate} disabled={loading}
                            className="w-full h-14 rounded-full bg-gradient-to-r from-brand-accent to-brand-primary text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Preparing interview...
                                </span>
                            ) : "🎤 Start Practice"}
                        </button>
                    </div>
                )}

                {step === "practice" && questions[currentQ] && (
                    <div>
                        <div className="flex items-center justify-between mb-4 text-sm">
                            <span className="font-bold text-brand-dark">Q{currentQ + 1} of {questions.length}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${questions[currentQ].category === "behavioral" ? "bg-blue-100 text-blue-700" : questions[currentQ].category === "technical" ? "bg-purple-100 text-purple-700" : "bg-orange-100 text-orange-700"}`}>
                                {questions[currentQ].category}
                            </span>
                        </div>

                        <div className="w-full h-2 rounded-full bg-brand-muted mb-6">
                            <div className="h-full rounded-full bg-gradient-to-r from-brand-accent to-brand-primary transition-all" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
                        </div>

                        <h3 className="text-lg font-bold text-brand-dark mb-5">{questions[currentQ].question}</h3>

                        <textarea value={userAnswer} onChange={e => setUserAnswer(e.target.value)} placeholder="Type your answer here... (practice answering before revealing the model answer)" rows={4} className="w-full px-4 py-3 rounded-xl border border-brand-muted bg-brand-light/30 text-slate-900 focus:border-brand-primary outline-none resize-none mb-4" />

                        {!showModel ? (
                            <button onClick={revealAnswer} className="w-full h-12 rounded-full bg-brand-primary/10 text-brand-primary font-bold hover:bg-brand-primary/20 transition-all mb-3">
                                👁️ Reveal Model Answer
                            </button>
                        ) : (
                            <div className="space-y-3 mb-4">
                                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                    <p className="text-sm font-semibold text-green-800 mb-1">✅ Model Answer</p>
                                    <p className="text-sm text-green-700">{questions[currentQ].modelAnswer}</p>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <p className="text-sm font-semibold text-blue-800 mb-1">💡 Coaching Tip</p>
                                    <p className="text-sm text-blue-700">{questions[currentQ].coachingTip}</p>
                                </div>
                            </div>
                        )}

                        {showModel && (
                            <button onClick={nextQuestion}
                                className="w-full h-12 rounded-full bg-brand-primary text-white font-bold hover:bg-brand-primary-hover transition-all">
                                {currentQ < questions.length - 1 ? "Next Question →" : "Finish Practice 🏁"}
                            </button>
                        )}
                    </div>
                )}

                {step === "done" && (
                    <div className="text-center py-6">
                        <div className="text-6xl mb-4">🎉</div>
                        <h3 className="text-2xl font-extrabold text-brand-dark mb-2">Practice Complete!</h3>
                        <p className="text-brand-dark/50 mb-6">You practiced {questions.length} interview questions for <strong className="text-brand-primary">{role}</strong>. Keep practising to build confidence!</p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={resetAll} className="h-12 px-8 rounded-full bg-brand-primary text-white font-bold hover:bg-brand-primary-hover transition-all">🔄 Practice Again</button>
                            <button onClick={resetAndClose} className="h-12 px-8 rounded-full border-2 border-brand-muted font-bold text-brand-dark hover:border-brand-primary transition-all">Close</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
