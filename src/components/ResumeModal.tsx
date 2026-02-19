"use client";
import { useState } from "react";

interface Props { open: boolean; onClose: () => void; }

interface Experience { title: string; company: string; duration: string; description: string; }
interface Education { degree: string; institution: string; year: string; }

export default function ResumeModal({ open, onClose }: Props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [summary, setSummary] = useState("");
    const [skills, setSkills] = useState("");
    const [experiences, setExperiences] = useState<Experience[]>([{ title: "", company: "", duration: "", description: "" }]);
    const [educations, setEducations] = useState<Education[]>([{ degree: "", institution: "", year: "" }]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const addExp = () => setExperiences([...experiences, { title: "", company: "", duration: "", description: "" }]);
    const addEdu = () => setEducations([...educations, { degree: "", institution: "", year: "" }]);
    const updateExp = (i: number, key: keyof Experience, val: string) => { const c = [...experiences]; c[i][key] = val; setExperiences(c); };
    const updateEdu = (i: number, key: keyof Education, val: string) => { const c = [...educations]; c[i][key] = val; setEducations(c); };

    const handleSubmit = async () => {
        if (!name || !email) { setError("Name and email are required."); return; }
        setLoading(true); setError(null); setResult(null);
        try {
            const res = await fetch("/api/resume", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name, email, phone, summary,
                    experience: experiences.filter(e => e.title),
                    education: educations.filter(e => e.degree),
                    skills: skills.split(",").map(s => s.trim()).filter(Boolean),
                }),
            });
            const data = await res.json();
            console.log("Resume API Response:", data);
            if (!res.ok) throw new Error(data.error || "Failed to generate résumé.");
            if (!data.html) throw new Error("Received empty content from AI. Please try again.");
            setResult(data.html);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally { setLoading(false); }
    };

    const handlePrint = () => {
        const w = window.open("", "_blank");
        if (w && result) { w.document.write(result); w.document.close(); w.print(); }
    };

    const resetAndClose = () => { setResult(null); setError(null); onClose(); };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" onClick={resetAndClose}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-2xl">📄</div>
                        <div>
                            <h2 className="text-2xl font-extrabold text-brand-dark">AI Resume Builder</h2>
                            <p className="text-sm text-brand-dark/50">Powered by Gemini 2.0 Flash</p>
                        </div>
                    </div>
                    <button onClick={resetAndClose} className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors text-lg font-bold">✕</button>
                </div>

                {result ? (
                    <div>
                        <div className="border border-brand-muted rounded-2xl p-6 mb-4 bg-brand-light/50" dangerouslySetInnerHTML={{ __html: result }} />
                        <div className="flex gap-3">
                            <button onClick={handlePrint} className="flex-1 h-12 rounded-full bg-brand-primary text-white font-bold hover:bg-brand-primary-hover transition-all">🖨️ Print / Save as PDF</button>
                            <button onClick={() => setResult(null)} className="h-12 px-6 rounded-full border-2 border-brand-muted font-bold text-brand-dark hover:border-brand-primary transition-all">← Edit</button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {/* Personal Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-brand-dark/60 mb-1 block">Full Name *</label>
                                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. John Doe" className="w-full h-12 px-4 rounded-xl border border-brand-muted bg-brand-light/30 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-brand-dark/60 mb-1 block">Email Address *</label>
                                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="e.g. john@example.com" type="email" className="w-full h-12 px-4 rounded-xl border border-brand-muted bg-brand-light/30 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-brand-dark/60 mb-1 block">Phone Number</label>
                                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. +234 801 234 5678" className="w-full h-12 px-4 rounded-xl border border-brand-muted bg-brand-light/30 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-brand-dark/60 mb-1 block">Key Skills</label>
                                <input value={skills} onChange={e => setSkills(e.target.value)} placeholder="e.g. React, Node.js, Project Management" className="w-full h-12 px-4 rounded-xl border border-brand-muted bg-brand-light/30 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-brand-dark/60 mb-1 block">Professional Summary (Optional)</label>
                            <textarea value={summary} onChange={e => setSummary(e.target.value)} placeholder="Briefly describe your professional background..." rows={3} className="w-full px-4 py-3 rounded-xl border border-brand-muted bg-brand-light/30 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all resize-none" />
                        </div>

                        {/* Experience */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-brand-dark">Work Experience</h3>
                                <button onClick={addExp} className="text-sm text-brand-primary font-semibold hover:underline">+ Add More</button>
                            </div>
                            {experiences.map((exp, i) => (
                                <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 p-4 rounded-xl bg-brand-light/50 border border-brand-muted/50">
                                    <div>
                                        <label className="text-xs font-semibold text-brand-dark/60 mb-1 block">Job Title</label>
                                        <input value={exp.title} onChange={e => updateExp(i, "title", e.target.value)} placeholder="e.g. Product Manager" className="w-full h-10 px-3 rounded-lg border border-brand-muted bg-white focus:border-brand-primary outline-none text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-brand-dark/60 mb-1 block">Company</label>
                                        <input value={exp.company} onChange={e => updateExp(i, "company", e.target.value)} placeholder="e.g. Google" className="w-full h-10 px-3 rounded-lg border border-brand-muted bg-white focus:border-brand-primary outline-none text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-brand-dark/60 mb-1 block">Duration</label>
                                        <input value={exp.duration} onChange={e => updateExp(i, "duration", e.target.value)} placeholder="e.g. 2020 - 2023" className="w-full h-10 px-3 rounded-lg border border-brand-muted bg-white focus:border-brand-primary outline-none text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-brand-dark/60 mb-1 block">Key Achievement</label>
                                        <input value={exp.description} onChange={e => updateExp(i, "description", e.target.value)} placeholder="e.g. Increased revenue by 20%" className="w-full h-10 px-3 rounded-lg border border-brand-muted bg-white focus:border-brand-primary outline-none text-sm" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Education */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-brand-dark">Education</h3>
                                <button onClick={addEdu} className="text-sm text-brand-primary font-semibold hover:underline">+ Add More</button>
                            </div>
                            {educations.map((edu, i) => (
                                <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3 p-4 rounded-xl bg-brand-light/50 border border-brand-muted/50">
                                    <div>
                                        <label className="text-xs font-semibold text-brand-dark/60 mb-1 block">Degree</label>
                                        <input value={edu.degree} onChange={e => updateEdu(i, "degree", e.target.value)} placeholder="e.g. BSc Computer Science" className="w-full h-10 px-3 rounded-lg border border-brand-muted bg-white focus:border-brand-primary outline-none text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-brand-dark/60 mb-1 block">Institution</label>
                                        <input value={edu.institution} onChange={e => updateEdu(i, "institution", e.target.value)} placeholder="e.g. University of Lagos" className="w-full h-10 px-3 rounded-lg border border-brand-muted bg-white focus:border-brand-primary outline-none text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-brand-dark/60 mb-1 block">Year</label>
                                        <input value={edu.year} onChange={e => updateEdu(i, "year", e.target.value)} placeholder="e.g. 2022" className="w-full h-10 px-3 rounded-lg border border-brand-muted bg-white focus:border-brand-primary outline-none text-sm" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                <p className="text-red-600 text-sm font-medium">⚠️ {error}</p>
                                {error.includes("wait") && (
                                    <button onClick={handleSubmit} className="mt-2 text-sm font-bold text-brand-primary hover:underline">🔄 Retry now</button>
                                )}
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full h-14 rounded-full bg-gradient-to-r from-brand-primary to-brand-accent text-white font-bold text-lg shadow-xl shadow-brand-primary/25 hover:shadow-2xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Generating with AI (may take ~15s)...
                                </span>
                            ) : "✨ Generate My Résumé"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
