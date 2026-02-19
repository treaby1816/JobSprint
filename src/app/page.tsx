"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowIWork from "@/components/HowIWork";
import PricingCards from "@/components/PricingCards";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import ResumeModal from "@/components/ResumeModal";
import MockExamModal from "@/components/MockExamModal";
import CoverLetterModal from "@/components/CoverLetterModal";
import InterviewPrepModal from "@/components/InterviewPrepModal";
import ComingSoonModal from "@/components/ComingSoonModal";
import JobAutomatorModal from "@/components/JobAutomatorModal";
import JobFeed from "@/components/JobFeed";
import Toast from "@/components/Toast";

export type FeatureKey = "resume" | "job-automator" | "mock-exam" | "cover-letter" | "interview-prep" | "transcription";

export default function Home() {
  const [activeModal, setActiveModal] = useState<FeatureKey | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
  }, []);

  const openFeature = useCallback((key: FeatureKey) => {
    if (!isAuthenticated) {
      router.push("/sign-up");
      return;
    }
    setActiveModal(key);
  }, [isAuthenticated, router]);

  const closeModal = useCallback(() => setActiveModal(null), []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features onFeatureClick={openFeature} />
        <JobFeed />
        <HowIWork />
        <PricingCards />
        <Testimonials />
        <FAQ />
      </main>
      <Footer onFeatureClick={openFeature} />

      {/* Modals */}
      <ResumeModal open={activeModal === "resume"} onClose={closeModal} />
      <MockExamModal open={activeModal === "mock-exam"} onClose={closeModal} />
      <CoverLetterModal open={activeModal === "cover-letter"} onClose={closeModal} />
      <InterviewPrepModal open={activeModal === "interview-prep"} onClose={closeModal} />
      <JobAutomatorModal open={activeModal === "job-automator"} onClose={closeModal} />
      <ComingSoonModal open={activeModal === "transcription"} onClose={closeModal} feature="Transcription" />

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
