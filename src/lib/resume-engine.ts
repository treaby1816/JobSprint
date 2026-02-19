/**
 * Treabyn Chameleon Resume Engine
 * ────────────────────────────────
 * Takes a user's master profile and a specific job description,
 * then uses Gemini 2.0 Flash to generate an ATS-optimized resume.
 *
 * Rules enforced via prompt:
 * - Buzzword ban (synergy, go-getter, etc.)
 * - Keyword mirroring from JD
 * - JSON-only output (parseable, ATS-safe, no graphics)
 * - Metric-based language
 */

import { getModel, withRetry } from "./gemini";

export interface ResumeSection {
    company?: string;
    role?: string;
    duration?: string;
    bullets: string[];
}

export interface ATSResume {
    summary: string;
    skills: string[];
    experience: ResumeSection[];
    education: ResumeSection[];
    certifications?: string[];
    atsScore: number; // Estimated 0–100 ATS match score
    keywordsMatched: string[]; // Keywords from JD found in output
    keywordsMissed: string[];  // Keywords from JD not found (for user review)
}

const BUZZWORD_BAN = [
    "synergy", "go-getter", "passionate", "leverage", "innovative",
    "thought leader", "guru", "ninja", "rockstar", "wizard",
    "dynamic", "proactive", "self-starter", "team player", "detail-oriented",
    "hard-working", "motivated", "driven", "results-driven", "impactful",
    "outside the box", "value-add", "circle back", "deep dive",
];

const RESUME_SCHEMA = `{
  "summary": "string (2-3 sentences, metric-focused, no buzzwords)",
  "skills": ["string", "..."],
  "experience": [
    {
      "company": "string",
      "role": "string",
      "duration": "string",
      "bullets": ["Improved X by Y% by doing Z", "..."]
    }
  ],
  "education": [
    {
      "role": "Degree Name",
      "company": "Institution Name",
      "duration": "Year",
      "bullets": []
    }
  ],
  "certifications": ["string"],
  "atsScore": 85,
  "keywordsMatched": ["keyword1", "keyword2"],
  "keywordsMissed": ["keyword3"]
}`;

export async function generateATSResume(
    masterProfile: string,
    jobDescription: string
): Promise<ATSResume> {
    const buzzwordList = BUZZWORD_BAN.join(", ");

    const prompt = `You are an elite ATS resume optimization engine. Your job is to rewrite the user's master profile to perfectly target the given job description.

STRICT RULES (violation = failure):
1. BUZZWORD BAN — NEVER use these words: ${buzzwordList}. Replace vague descriptions with METRICS (e.g., "Improved API response time by 40%").
2. KEYWORD MIRRORING — Extract every technical skill, tool, and requirement from the JD. Ensure each appears naturally in the resume output. List which were matched and which were missed.
3. JSON ONLY — Return ONLY valid JSON. No markdown, no explanations, no \`\`\`json blocks.
4. ATS FORMAT — No columns, no graphics, no tables. Plain text bullets only.
5. METRIC LANGUAGE — Every experience bullet must contain a number, percentage, or scale (e.g., "$2M", "10K users", "3x faster").

JOB DESCRIPTION:
${jobDescription}

USER'S MASTER PROFILE:
${masterProfile}

Return a JSON object matching this exact schema:
${RESUME_SCHEMA}`;

    const model = getModel();

    const rawText = await withRetry(async () => {
        const result = await model.generateContent(prompt);
        return result.response.text();
    });

    // Clean and parse JSON
    const cleaned = rawText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

    const parsed: ATSResume = JSON.parse(cleaned);
    return parsed;
}
