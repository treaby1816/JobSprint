"use client";

const TESTIMONIALS = [
    {
        name: "Adaeze O.",
        role: "Software Engineer",
        quote: "JobSprint built my résumé in 3 minutes and got me callbacks within a week. I was genuinely blown away.",
        avatar: "AO",
    },
    {
        name: "James T.",
        role: "Marketing Manager",
        quote: "The Job Automator saved me 20+ hours a week. I went from 0 interviews to 5 in my first month.",
        avatar: "JT",
    },
    {
        name: "Funmi A.",
        role: "Data Analyst",
        quote: "Mock exams on JobSprint helped me pass my professional certification on the first try. Incredible tool.",
        avatar: "FA",
    },
    {
        name: "David K.",
        role: "Product Designer",
        quote: "Cover letters used to take me hours. JobSprint does it in seconds — and they're actually good!",
        avatar: "DK",
    },
];

export default function Testimonials() {
    return (
        <section id="testimonials" className="py-24 px-4 md:px-8 bg-brand-muted/30">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-semibold mb-4">
                        Testimonials
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
                        What Our <span className="text-brand-primary">Users</span> Say
                    </h2>
                    <p className="text-brand-dark/50 max-w-xl mx-auto">
                        Real stories from real people who accelerated their careers with JobSprint.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {TESTIMONIALS.map((t, i) => (
                        <div
                            key={t.name}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-brand-muted/50 hover:shadow-xl hover:shadow-brand-primary/10 transition-all hover:-translate-y-1 animate-fade-in-up"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            {/* Quotation */}
                            <div className="text-4xl text-brand-primary/20 font-serif mb-2">&ldquo;</div>
                            <p className="text-brand-dark/60 text-sm leading-relaxed mb-6">{t.quote}</p>

                            <div className="flex items-center gap-3 mt-auto">
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white text-sm font-bold">
                                    {t.avatar}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-brand-dark">{t.name}</p>
                                    <p className="text-xs text-brand-dark/40">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
