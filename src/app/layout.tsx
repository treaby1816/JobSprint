import type { Metadata } from "next";
import { Inter, Kdam_Thmor_Pro } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const kdam = Kdam_Thmor_Pro({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-kdam",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JobSprint - Automate Your Career Growth",
  description:
    "Automate job applications, build resumes, simulate exams, and land your dream job. JobSprint — your all-in-one AI-powered career suite.",
  keywords:
    "JobSprint, Career Automator, Resume Builder, Job Automation, Mock Exams, AI Career, Cover Letter, Interview Prep",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${kdam.variable}`}>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
