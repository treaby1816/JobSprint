"use client";
import { useState } from "react";

interface Props { open: boolean; onClose: () => void; }

interface Question {
    id?: string;
    exam_type: string;
    topic: string;
    question_text: string;
    options: string[];
    correct_answer: string;
    explanation: string;
}

const EXAM_PRESETS = [
    { name: "JAMB (UTME)", subjects: ["Mathematics", "English Language", "Physics", "Chemistry", "Biology", "Government", "Economics", "Literature-in-English", "Commerce", "CRK/IRK", "Geography"], icon: "🇳🇬" },
    { name: "WAEC (WASSCE)", subjects: ["Mathematics", "English Language", "Physics", "Chemistry", "Biology", "Economics", "Government", "Literature-in-English", "Commerce", "Accounting", "Geography", "Further Mathematics", "Civic Education", "Agricultural Science"], icon: "📋" },
    { name: "NECO (SSCE)", subjects: ["Mathematics", "English Language", "Physics", "Chemistry", "Biology", "Economics", "Government", "Commerce", "Accounting", "Agricultural Science", "Civic Education", "Computer Studies"], icon: "📝" },
    { name: "Primary Six", subjects: ["Mathematics", "English Language", "Basic Science", "Social Studies", "Civic Education", "Verbal Reasoning", "Quantitative Reasoning", "General Knowledge"], icon: "🎒" },
    { name: "IELTS", subjects: ["Reading", "Writing", "Listening", "Speaking"], icon: "🌍" },
    { name: "TOEFL", subjects: ["Reading Comprehension", "Listening", "Writing", "Speaking"], icon: "🇺🇸" },
    { name: "PMP", subjects: ["Project Initiation", "Project Planning", "Project Execution", "Monitoring & Controlling", "Project Closing"], icon: "📊" },
    { name: "ICAN", subjects: ["Financial Accounting", "Management Accounting", "Audit & Assurance", "Taxation", "Corporate Governance"], icon: "📈" },
    { name: "Custom", subjects: [], icon: "🎯" },
];

export default function MockExamModal({ open, onClose }: Props) {
    const [step, setStep] = useState<"setup" | "quiz" | "results">("setup");
    const [selectedExam, setSelectedExam] = useState<string | null>(null);
    const [subject, setSubject] = useState("");
    const [customSubject, setCustomSubject] = useState("");
    const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
    const [numQuestions, setNumQuestions] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [showExplanation, setShowExplanation] = useState(false);

    const selectedPreset = EXAM_PRESETS.find(e => e.name === selectedExam);

    const handleGenerate = async (retryCount = 0) => {
        const subjectFinal = selectedExam === "Custom" ? customSubject : subject;
        if (!subjectFinal) { setError("Please select a subject."); return; }
        setLoading(true); setError(null);
        try {
            const examContext = selectedExam && selectedExam !== "Custom" ? `${selectedExam} — ` : "";
            const res = await fetch("/api/mock-exam", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subject: `${examContext}${subjectFinal}`,
                    difficulty,
                    numberOfQuestions: numQuestions,
                }),
            });
            const data = await res.json();
            console.log("Mock Exam API Response:", data);

            if (!res.ok) {
                throw new Error(data.details || data.error || `Server responded with status ${res.status}`);
            }
            if (!data.questions || data.questions.length === 0) {
                throw new Error("No questions were generated. Please try again.");
            }
            setQuestions(data.questions);
            setCurrentQ(0);
            setAnswers({});
            setShowExplanation(false);
            setStep("quiz");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Something went wrong.";
            setError(msg);
        } finally { setLoading(false); }
    };

    const selectAnswer = (answer: string) => {
        if (answers[currentQ] !== undefined) return;
        setAnswers({ ...answers, [currentQ]: answer });
        setShowExplanation(true);
    };

    const nextQuestion = () => {
        if (currentQ < questions.length - 1) {
            setCurrentQ(currentQ + 1);
            setShowExplanation(false);
        } else {
            setStep("results");
        }
    };

    const score = Object.entries(answers).filter(([i, a]) => {
        const q = questions[Number(i)];
        return q && a.startsWith(q.correct_answer);
    }).length;

    const resetAll = () => { setStep("setup"); setQuestions([]); setAnswers({}); setCurrentQ(0); setError(null); };
    const resetAndClose = () => { resetAll(); onClose(); };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" onClick={resetAndClose}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-accent to-brand-secondary flex items-center justify-center text-2xl">🎓</div>
                        <div>
                            <h2 className="text-2xl font-extrabold text-brand-dark">Mock Exam Simulator</h2>
                            <p className="text-sm text-brand-dark/50">JAMB • WAEC • NECO • Primary Six • IELTS • PMP</p>
                        </div>
                    </div>
                    <button onClick={resetAndClose} className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors text-lg font-bold">✕</button>
                </div>

                {step === "setup" && (
                    <div className="space-y-5">
                        {/* Exam Type Selector */}
                        <div>
                            <h3 className="font-bold text-brand-dark mb-3">Choose Exam Type</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {EXAM_PRESETS.map(ex => (
                                    <button key={ex.name} onClick={() => { setSelectedExam(ex.name); setSubject(""); }}
                                        className={`p-4 rounded-xl border-2 text-left transition-all hover:-translate-y-0.5 ${selectedExam === ex.name ? "border-brand-primary bg-brand-primary/5 shadow-lg" : "border-brand-muted hover:border-brand-primary/30"}`}>
                                        <span className="text-2xl block mb-1">{ex.icon}</span>
                                        <span className="font-bold text-sm text-brand-dark">{ex.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Subject Selector */}
                        {selectedExam && selectedExam !== "Custom" && selectedPreset && (
                            <div>
                                <h3 className="font-bold text-brand-dark mb-3">Select Subject</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedPreset.subjects.map(s => (
                                        <button key={s} onClick={() => setSubject(s)}
                                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${subject === s ? "bg-brand-primary text-white shadow-md" : "bg-brand-light border border-brand-muted text-brand-dark hover:border-brand-primary"}`}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedExam === "Custom" && (
                            <input value={customSubject} onChange={e => setCustomSubject(e.target.value)} placeholder="Enter your subject (e.g. Organic Chemistry, Data Structures)" className="w-full h-12 px-4 rounded-xl border border-brand-muted bg-brand-light/30 text-slate-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none" />
                        )}

                        {/* Difficulty & Count */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="font-bold text-sm text-brand-dark mb-2 block">Difficulty</label>
                                <div className="flex gap-2">
                                    {(["easy", "medium", "hard"] as const).map(d => (
                                        <button key={d} onClick={() => setDifficulty(d)}
                                            className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${difficulty === d ? "bg-brand-primary text-white shadow-md" : "bg-brand-light border border-brand-muted text-brand-dark"}`}>
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="font-bold text-sm text-brand-dark mb-2 block">Questions: {numQuestions}</label>
                                <input type="range" min={5} max={30} value={numQuestions} onChange={e => setNumQuestions(Number(e.target.value))} className="w-full accent-brand-primary" />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                <p className="text-red-600 text-sm font-medium">⚠️ {error}</p>
                                {error && (
                                    <button onClick={() => handleGenerate()} className="mt-2 text-sm font-bold text-brand-primary hover:underline">🔄 Try Again</button>
                                )}
                            </div>
                        )}

                        <button onClick={() => handleGenerate()} disabled={loading || !selectedExam}
                            className="w-full h-14 rounded-full bg-gradient-to-r from-brand-accent to-brand-secondary text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Generating Questions (may take ~15s)...
                                </span>
                            ) : "🎓 Start Exam"}
                        </button>
                    </div>
                )}

                {step === "quiz" && questions[currentQ] && (
                    <div>
                        {/* Progress */}
                        <div className="flex items-center justify-between mb-4 text-sm">
                            <span className="font-bold text-brand-dark">Question {currentQ + 1} of {questions.length}</span>
                            <span className="text-brand-dark/50">Score: {score}/{Object.keys(answers).length}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-brand-muted mb-6">
                            <div className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-accent transition-all" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
                        </div>

                        {/* Question */}
                        <h3 className="text-lg font-bold text-brand-dark mb-5">{questions[currentQ].question_text}</h3>

                        {/* Options */}
                        <div className="space-y-3 mb-5">
                            {questions[currentQ].options.map((opt) => {
                                const letter = opt.charAt(0);
                                const isSelected = answers[currentQ] === opt;
                                const isCorrect = questions[currentQ].correct_answer === letter;
                                const answered = answers[currentQ] !== undefined;

                                let styles = "border-brand-muted hover:border-brand-primary/30 bg-white text-slate-900";
                                if (answered && isCorrect) styles = "border-green-500 bg-green-50 text-green-800";
                                else if (answered && isSelected && !isCorrect) styles = "border-red-500 bg-red-50 text-red-800";

                                return (
                                    <button key={opt} onClick={() => selectAnswer(opt)}
                                        disabled={answered}
                                        className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-sm ${styles} disabled:cursor-default`}>
                                        {opt} {answered && isCorrect && "✅"} {answered && isSelected && !isCorrect && "❌"}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Explanation */}
                        {showExplanation && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
                                <p className="text-sm font-semibold text-blue-800 mb-1">💡 Explanation</p>
                                <p className="text-sm text-blue-700">{questions[currentQ].explanation}</p>
                            </div>
                        )}

                        {answers[currentQ] !== undefined && (
                            <button onClick={nextQuestion}
                                className="w-full h-12 rounded-full bg-brand-primary text-white font-bold hover:bg-brand-primary-hover transition-all">
                                {currentQ < questions.length - 1 ? "Next Question →" : "See Results 🎯"}
                            </button>
                        )}
                    </div>
                )}

                {step === "results" && (
                    <div className="text-center">
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl font-extrabold text-white">{Math.round((score / questions.length) * 100)}%</span>
                        </div>
                        <h3 className="text-2xl font-extrabold text-brand-dark mb-2">Exam Complete!</h3>
                        <p className="text-brand-dark/50 mb-2">You scored <strong className="text-brand-primary">{score}</strong> out of <strong>{questions.length}</strong> questions.</p>
                        <p className="text-sm text-brand-dark/40 mb-6">
                            {score / questions.length >= 0.8 ? "🌟 Excellent! You're well prepared!" : score / questions.length >= 0.5 ? "👍 Good effort! Keep practising to improve." : "📚 Keep studying — you'll get there!"}
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={resetAll} className="h-12 px-8 rounded-full bg-brand-primary text-white font-bold hover:bg-brand-primary-hover transition-all">🔄 Try Again</button>
                            <button onClick={resetAndClose} className="h-12 px-8 rounded-full border-2 border-brand-muted font-bold text-brand-dark hover:border-brand-primary transition-all">Close</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
