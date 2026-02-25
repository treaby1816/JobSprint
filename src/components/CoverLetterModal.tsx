"use client";
import { useState } from "react";

interface Props { open: boolean; onClose: () => void; }

export default function CoverLetterModal({ open, onClose }: Props) {
    const [candidateName, setCandidateName] = useState("");
    const [candidateSummary, setCandidateSummary] = useState("");
    const [skills, setSkills] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [company, setCompany] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!jobTitle || !company || !candidateName) { setError("Job title, company, and your name are required."); return; }
        setLoading(true); setError(null); setResult(null);
        try {
            const res = await fetch("/api/cover-letter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jobTitle, company, jobDescription, candidateName, candidateSummary,
                    skills: skills.split(",").map(s => s.trim()).filter(Boolean),
                }),
            });
            const data = await res.json();
            console.log("Cover Letter API Response:", data);
            if (!res.ok) throw new Error(data.error || "Failed to generate cover letter.");
            if (!data.coverLetter) throw new Error("Received empty content from AI. Please try again.");
            setResult(data.coverLetter);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally { setLoading(false); }
    };

    const copyToClipboard = () => {
        if (result) navigator.clipboard.writeText(result);
    };

    const resetAndClose = () => { setResult(null); setError(null); onClose(); };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" onClick={resetAndClose}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-2xl">✉️</div>
                        <div>
                            <h2 className="text-2xl font-extrabold text-brand-dark">Cover Letter Generator</h2>
                            <p className="text-sm text-brand-dark/50">AI-tailored for every application</p>
                        </div>
                    </div>
                    <button onClick={resetAndClose} className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors text-lg font-bold">✕</button>
                </div>

                {result ? (
                    <div>
                        <div className="border border-brand-muted rounded-2xl p-6 mb-4 bg-brand-light/50 whitespace-pre-wrap text-sm text-brand-dark/80 leading-relaxed">{result}</div>
                        <div className="flex gap-3">
                            <button onClick={copyToClipboard} className="flex-1 h-12 rounded-full bg-brand-primary text-white font-bold hover:bg-brand-primary-hover transition-all">📋 Copy to Clipboard</button>
                            <button onClick={() => setResult(null)} className="h-12 px-6 rounded-full border-2 border-brand-muted font-bold text-brand-dark hover:border-brand-primary transition-all">← Edit</button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-brand-dark/60 mb-1 block">Your Full Name *</label>
                                <input value={candidateName} onChange={e => setCandidateName(e.target.value)} placeholder="e.g. Bami Adedeji" className="w-full h-12 px-4 rounded-xl border border-brand-muted bg-brand-light/30 text-slate-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-brand-dark/60 mb-1 block">Key Skills (comma-separated)</label>
                                <input value={skills} onChange={e => setSkills(e.target.value)} placeholder="e.g. React, Node.js, Project Management" className="w-full h-12 px-4 rounded-xl border border-brand-muted bg-brand-light/30 text-slate-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-brand-dark/60 mb-1 block">Professional Summary (optional — helps tailor the letter)</label>
                            <textarea value={candidateSummary} onChange={e => setCandidateSummary(e.target.value)} placeholder="e.g. 5 years experience in full-stack development with expertise in fintech..." rows={2} className="w-full px-4 py-3 rounded-xl border border-brand-muted bg-brand-light/30 text-slate-900 focus:border-brand-primary outline-none resize-none" />
                        </div>

                        <hr className="border-brand-muted" />
                        <h3 className="font-bold text-brand-dark text-sm">Target Job Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-brand-dark/60 mb-1 block">Job Title you&apos;re applying for *</label>
                                <input value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g. Frontend Developer, Data Analyst" className="w-full h-12 px-4 rounded-xl border border-brand-muted bg-brand-light/30 text-slate-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-brand-dark/60 mb-1 block">Company Name *</label>
                                <input value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Google, Interswitch, Paystack" className="w-full h-12 px-4 rounded-xl border border-brand-muted bg-brand-light/30 text-slate-900 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-brand-dark/60 mb-1 block">Job Description (paste it here — the more detail, the better your cover letter)</label>
                            <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} placeholder="Copy and paste the full job description from the listing..." rows={4} className="w-full px-4 py-3 rounded-xl border border-brand-muted bg-brand-light/30 text-slate-900 focus:border-brand-primary outline-none resize-none" />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                <p className="text-red-600 text-sm font-medium">⚠️ {error}</p>
                                {error.includes("wait") && (
                                    <button onClick={handleSubmit} className="mt-2 text-sm font-bold text-brand-primary hover:underline">🔄 Retry now</button>
                                )}
                            </div>
                        )}

                        <button onClick={handleSubmit} disabled={loading}
                            className="w-full h-14 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Writing your cover letter...
                                </span>
                            ) : "✉️ Generate Cover Letter"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
