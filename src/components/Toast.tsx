"use client";
import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
    message: string;
    type?: ToastType;
    onClose: () => void;
}

export default function Toast({ message, type = "info", onClose }: ToastProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
        const t = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300);
        }, 3500);
        return () => clearTimeout(t);
    }, [onClose]);

    const colors: Record<ToastType, string> = {
        success: "from-green-500 to-emerald-600",
        error: "from-red-500 to-rose-600",
        info: "from-brand-primary to-brand-accent",
    };

    return (
        <div
            className={`fixed bottom-6 right-6 z-[100] px-6 py-4 rounded-2xl bg-gradient-to-r ${colors[type]} text-white font-semibold shadow-2xl transition-all duration-300 ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
            <div className="flex items-center gap-3">
                <span className="text-lg">
                    {type === "success" ? "✅" : type === "error" ? "❌" : "💡"}
                </span>
                <span className="text-sm">{message}</span>
                <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="ml-2 opacity-70 hover:opacity-100">✕</button>
            </div>
        </div>
    );
}
