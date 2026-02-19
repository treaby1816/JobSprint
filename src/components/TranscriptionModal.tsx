"use client";
import { useState } from "react";

interface Props { open: boolean; onClose: () => void; }

type Action = "clean" | "summarize" | "minutes";

const ACTIONS: { id: Action; label: string; icon: string; desc: string }[] = [
    { id: "clean", label: "Clean Up", icon: "✨", desc: "Fix grammar, remove filler words, format paragraphs" },
    { id: "summarize", label: "Summarize", icon: "📋", desc: "Extract key points as bullet points" },
    { id: "minutes", label: "Meeting Minutes", icon: "📝", desc: "Convert to professional meeting minutes" },
];

export default function TranscriptionModal({ open, onClose }: Props) {
    const [text, setText] = useState("");
    const [action, setAction] = useState<Action>("clean");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (retryCount = 0) => {
        console.log("Submit clicked. Text length:", text.length, "Action:", action);
        if (!text.trim() || text.trim().length < 10) {
            setError("Please paste at least 10 characters of text.");
            return;
        }
        setLoading(true); setError(null); setResult(null);
        try {
            const res = await fetch("/api/transcription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, action }),
            });
            const data = await res.json();
            console.log("Transcription API Response:", data);
            if (!res.ok) {
                if (res.status === 429 && retryCount < 2) {
                    setError(`⏳ AI is busy, retrying in 5 seconds... (attempt ${retryCount + 2}/3)`);
                    await new Promise(r => setTimeout(r, 5000));
                    setError(null);
                    return handleSubmit(retryCount + 1);
                }
                throw new Error(data.error || "Transcription failed.");
            }
            setResult(data.result);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally { setLoading(false); }
    };

    const copyToClipboard = () => {
        if (result) navigator.clipboard.writeText(result);
    };

    const resetAndClose = () => { setResult(null); setError(null); setText(""); onClose(); };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" onClick={resetAndClose}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-2xl">📝</div>
                        <div>
                            <h2 className="text-2xl font-extrabold text-brand-dark">Transcription Tool</h2>
                            <p className="text-sm text-brand-dark/50">Clean up, summarize, or create meeting minutes from text</p>
                        </div>
                    </div>
                    <button onClick={resetAndClose} className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors text-lg font-bold">✕</button>
                </div>

                {result ? (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-green-600 font-bold text-sm">✅ {action === "clean" ? "Cleaned" : action === "summarize" ? "Summarized" : "Minutes generated"}!</span>
                        </div>
                        <div className="border border-brand-muted rounded-2xl p-6 mb-4 bg-brand-light/50 whitespace-pre-wrap text-sm text-brand-dark/80 leading-relaxed max-h-96 overflow-y-auto">
                            {result}
                        </div>
                        <div className="flex gap-3">
                            <button onClick={copyToClipboard} className="flex-1 h-12 rounded-full bg-brand-primary text-white font-bold hover:bg-brand-primary-hover transition-all">📋 Copy Result</button>
                            <button onClick={() => setResult(null)} className="h-12 px-6 rounded-full border-2 border-brand-muted font-bold text-brand-dark hover:border-brand-primary transition-all">← Edit</button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {/* Action Selector */}
                        <div>
                            <label className="font-bold text-sm text-brand-dark mb-3 block">What do you want to do?</label>
                            <div className="grid grid-cols-3 gap-3">
                                {ACTIONS.map(a => (
                                    <button key={a.id} onClick={() => setAction(a.id)}
                                        className={`p-4 rounded-xl border-2 text-left transition-all hover:-translate-y-0.5 ${action === a.id
                                            ? "border-brand-primary bg-brand-primary/5 shadow-lg"
                                            : "border-brand-muted hover:border-brand-primary/30"
                                            }`}>
                                        <span className="text-2xl block mb-1">{a.icon}</span>
                                        <span className="font-bold text-sm text-brand-dark block">{a.label}</span>
                                        <span className="text-xs text-brand-dark/50">{a.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Text Input */}
                        <div>
                            <label className="text-xs font-semibold text-brand-dark/60 mb-1 block">
                                Paste your text below {action === "clean" ? "(raw transcript, interview notes, voice-to-text output)" : action === "summarize" ? "(article, document, or any long text)" : "(meeting recording transcript or notes)"}
                            </label>
                            <textarea
                                value={text}
                                onChange={e => setText(e.target.value)}
                                placeholder={
                                    action === "clean"
                                        ? "e.g. So basically um what we discussed was that uh the project timeline needs to be like pushed back by two weeks because um the design team hasn't finished the mockups yet..."
                                        : action === "summarize"
                                            ? "Paste an article, email thread, document, or any long text you want summarized into bullet points..."
                                            : "Paste your meeting transcript here. Include speaker names if possible for better minutes formatting..."
                                }
                                rows={8}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 focus:border-brand-primary focus:bg-white text-slate-900 placeholder:text-slate-400 outline-none resize-none text-sm transition-all"
                            />
                            <p className="text-xs text-brand-dark/40 mt-1">{text.length} characters {text.length < 10 && text.length > 0 ? "— minimum 10 required" : ""}</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                <p className="text-red-600 text-sm font-medium">⚠️ {error}</p>
                                {error.includes("wait") && (
                                    <button onClick={() => handleSubmit()} className="mt-2 text-sm font-bold text-brand-primary hover:underline">🔄 Retry now</button>
                                )}
                            </div>
                        )}

                        <button onClick={() => handleSubmit()} disabled={loading}
                            className="w-full h-14 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </span>
                            ) : `📝 ${action === "clean" ? "Clean Up Text" : action === "summarize" ? "Summarize" : "Generate Minutes"}`}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
