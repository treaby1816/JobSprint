"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import JobSprintLogo from "./TreabynLogo";
import type { FeatureKey } from "@/app/page";

const PRODUCT_LINKS: { label: string; key: FeatureKey }[] = [
    { label: "Resume Builder", key: "resume" },
    { label: "Job Automator", key: "job-automator" },
    { label: "Mock Exams", key: "mock-exam" },
    { label: "Cover Letters", key: "cover-letter" },
    { label: "Interview Prep", key: "interview-prep" },
];

const COMPANY_LINKS = ["About", "Blog", "Careers", "Contact"];
const LEGAL_LINKS = ["Privacy Policy", "Terms of Service", "Cookie Policy"];

interface Props {
    onFeatureClick: (key: FeatureKey) => void;
}

export default function Footer({ onFeatureClick }: Props) {
    return (
        <footer className="bg-brand-dark text-white pt-20 pb-8 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* CTA banner */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
                    whileHover={{
                        y: -8,
                        scale: 1.02,
                        boxShadow: "0 25px 60px -12px rgba(99, 102, 241, 0.4), 0 0 40px -8px rgba(168, 85, 247, 0.3)",
                    }}
                    className="relative rounded-2xl bg-gradient-to-r from-brand-primary to-brand-accent p-10 md:p-14 text-center mb-20 overflow-hidden cursor-pointer"
                    style={{ transition: "box-shadow 0.3s ease" }}
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_60%)]" />
                    <h2 className="text-2xl md:text-4xl font-extrabold mb-4 relative z-10">
                        Ready to Automate Your Career?
                    </h2>
                    <p className="text-white/70 mb-8 max-w-lg mx-auto relative z-10">
                        Join thousands of professionals who sprint to their dream jobs with JobSprint.
                    </p>
                    <Link
                        href="/sign-up"
                        className="inline-flex items-center justify-center h-14 px-10 rounded-full bg-white text-brand-primary font-bold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all relative z-10"
                    >
                        Get Started Free
                    </Link>
                </motion.div>

                {/* Footer grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
                    {/* Logo column */}
                    <div className="col-span-2 md:col-span-1">
                        <JobSprintLogo className="mb-4 [&_span]:text-white" />
                        <p className="text-white/40 text-sm leading-relaxed">
                            AI-powered career automation. Build. Apply. Get hired.
                        </p>
                        <div className="flex gap-3 mt-6">
                            {["𝕏", "in", "▶"].map((icon) => (
                                <a
                                    key={icon}
                                    href="#"
                                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold hover:bg-brand-primary transition-colors"
                                >
                                    {icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Product links — wired to modals */}
                    <div>
                        <h4 className="font-bold text-sm mb-4 text-white/80">Product</h4>
                        <ul className="space-y-2">
                            {PRODUCT_LINKS.map((link) => (
                                <li key={link.label}>
                                    <button
                                        onClick={() => onFeatureClick(link.key)}
                                        className="text-sm text-white/40 hover:text-brand-primary transition-colors cursor-pointer"
                                    >
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company links */}
                    <div>
                        <h4 className="font-bold text-sm mb-4 text-white/80">Company</h4>
                        <ul className="space-y-2">
                            {COMPANY_LINKS.map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-sm text-white/40 hover:text-brand-primary transition-colors">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal links */}
                    <div>
                        <h4 className="font-bold text-sm mb-4 text-white/80">Legal</h4>
                        <ul className="space-y-2">
                            {LEGAL_LINKS.map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-sm text-white/40 hover:text-brand-primary transition-colors">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 gap-4">
                    <p className="text-white/30 text-sm">© 2026 JobSprint. All rights reserved.</p>
                    <p className="text-white/30 text-sm">Built with speed by Treabyn</p>
                    <p className="text-white/30 text-sm">support@jobsprint.com</p>
                </div>
            </div>
        </footer>
    );
}
