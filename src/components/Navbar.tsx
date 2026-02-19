"use client";
import { useState } from "react";
import Link from "next/link";
import JobSprintLogo from "./TreabynLogo";

const NAV_LINKS = [
    { label: "Features", href: "/#features" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Testimonials", href: "/#testimonials" },
    { label: "FAQ", href: "/#faq" },
];

const MENU_COLORS = [
    "bg-brand-primary",
    "bg-brand-accent",
    "bg-brand-secondary",
    "bg-brand-primary/80",
    "bg-brand-accent/80",
];

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-brand-muted/50">
            <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 md:px-8">
                {/* Logo */}
                <Link href="/" className="flex-shrink-0">
                    <JobSprintLogo />
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map((l) => (
                        <a
                            key={l.href}
                            href={l.href}
                            className="px-4 py-2 text-sm font-medium text-brand-dark/70 hover:text-brand-primary transition-colors rounded-lg hover:bg-brand-primary/5"
                        >
                            {l.label}
                        </a>
                    ))}
                </nav>

                {/* Desktop Auth CTAs */}
                <div className="hidden md:flex items-center gap-3">
                    <Link
                        href="/sign-in"
                        className="h-10 px-5 rounded-full border-2 border-brand-muted text-sm font-semibold text-brand-dark hover:border-brand-primary hover:text-brand-primary transition-all inline-flex items-center justify-center"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/sign-up"
                        className="h-10 px-6 rounded-full bg-brand-primary text-white text-sm font-semibold shadow-lg shadow-brand-primary/25 hover:bg-brand-primary-hover transition-all hover:shadow-xl hover:-translate-y-0.5 relative overflow-hidden group inline-flex items-center justify-center"
                    >
                        <span className="relative z-10">Get Started Free</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-ripple" />
                    </Link>
                </div>

                {/* Hamburger */}
                <button
                    onClick={() => setOpen(!open)}
                    className="md:hidden flex flex-col gap-1.5 w-8 h-8 items-center justify-center"
                    aria-label="Toggle menu"
                >
                    <span className={`block w-6 h-0.5 bg-brand-dark transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
                    <span className={`block w-6 h-0.5 bg-brand-dark transition-all ${open ? "opacity-0" : ""}`} />
                    <span className={`block w-6 h-0.5 bg-brand-dark transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
                </button>
            </div>

            {/* Mobile menu */}
            <div
                className={`md:hidden fixed inset-0 top-16 z-40 transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
                <nav className="relative flex flex-col h-full">
                    {NAV_LINKS.map((l, i) => (
                        <a
                            key={l.href}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className={`flex items-center justify-center text-white text-lg font-bold tracking-widest uppercase ${MENU_COLORS[i]} transition-transform`}
                            style={{ flexBasis: "16.66%" }}
                        >
                            {l.label}
                        </a>
                    ))}
                    {/* Mobile auth links */}
                    <div className="flex gap-4 items-center justify-center bg-brand-dark py-4 flex-1">
                        <Link href="/sign-in" onClick={() => setOpen(false)}
                            className="h-10 px-6 rounded-full border-2 border-white/30 text-white text-sm font-semibold hover:border-white transition-all inline-flex items-center justify-center">
                            Sign In
                        </Link>
                        <Link href="/sign-up" onClick={() => setOpen(false)}
                            className="h-10 px-6 rounded-full bg-brand-primary text-white text-sm font-semibold shadow-lg transition-all inline-flex items-center justify-center">
                            Get Started
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
}
