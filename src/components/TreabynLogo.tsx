"use client";

import { Zap } from "lucide-react";

export default function JobSprintLogo({ className = "" }: { className?: string }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-brand-accent fill-brand-accent" />
            </div>
            <span className="text-xl font-extrabold tracking-tight italic">
                <span className="text-brand-primary">Job</span><span className="text-brand-dark">Sprint</span>
            </span>
        </div>
    );
}
