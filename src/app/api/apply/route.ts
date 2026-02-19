/**
 * POST /api/apply
 * Body: { jobId: string, jobUrl: string }
 *
 * Launches a Puppeteer browser, navigates to the job URL,
 * and attempts to pre-fill the application form.
 *
 * For Vercel/production: set BROWSERLESS_TOKEN env var to use
 * Browserless.io instead of local Chromium.
 */
import { NextResponse } from "next/server";
import { updateJobStatus } from "@/lib/supabase";

export async function POST(req: Request) {
    const body = await req.json();
    const { jobId, jobUrl } = body;

    if (!jobId || !jobUrl) {
        return NextResponse.json(
            { error: "jobId and jobUrl are required." },
            { status: 400 }
        );
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        return NextResponse.json(
            { error: "Supabase is not configured." },
            { status: 500 }
        );
    }

    try {
        // Dynamic import so build doesn't fail if puppeteer is not installed
        const puppeteer = await import("puppeteer");

        const browserlessToken = process.env.BROWSERLESS_TOKEN;
        const browser = browserlessToken
            ? await puppeteer.default.connect({
                browserWSEndpoint: `wss://chrome.browserless.io?token=${browserlessToken}`,
            })
            : await puppeteer.default.launch({
                headless: true,
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
            });

        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 900 });
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        );

        await page.goto(jobUrl, { waitUntil: "networkidle2", timeout: 30000 });

        // ── Auto-fill common application form fields ──────────────────────────
        // This is a best-effort fill. Each ATS has different field names.
        const userProfile = {
            firstName: process.env.APPLICANT_FIRST_NAME ?? "",
            lastName: process.env.APPLICANT_LAST_NAME ?? "",
            email: process.env.APPLICANT_EMAIL ?? "",
            phone: process.env.APPLICANT_PHONE ?? "",
            linkedIn: process.env.APPLICANT_LINKEDIN ?? "",
            portfolio: process.env.APPLICANT_PORTFOLIO ?? "",
        };

        // Try common input selectors for first name
        const firstNameSelectors = [
            'input[name="first_name"]', 'input[id*="first"]', 'input[placeholder*="First"]',
        ];
        for (const sel of firstNameSelectors) {
            try { await page.type(sel, userProfile.firstName, { delay: 20 }); break; } catch { /* skip */ }
        }

        const lastNameSelectors = [
            'input[name="last_name"]', 'input[id*="last"]', 'input[placeholder*="Last"]',
        ];
        for (const sel of lastNameSelectors) {
            try { await page.type(sel, userProfile.lastName, { delay: 20 }); break; } catch { /* skip */ }
        }

        const emailSelectors = [
            'input[type="email"]', 'input[name="email"]', 'input[id*="email"]',
        ];
        for (const sel of emailSelectors) {
            try { await page.type(sel, userProfile.email, { delay: 20 }); break; } catch { /* skip */ }
        }

        const phoneSelectors = [
            'input[type="tel"]', 'input[name="phone"]', 'input[id*="phone"]',
        ];
        for (const sel of phoneSelectors) {
            try { await page.type(sel, userProfile.phone, { delay: 20 }); break; } catch { /* skip */ }
        }

        // Take screenshot as proof of pre-fill
        const screenshot = await page.screenshot({ encoding: "base64", type: "png" });

        await browser.close();

        // Update Supabase status
        await updateJobStatus(jobId, "applied");

        return NextResponse.json({
            success: true,
            jobId,
            message: "Form pre-filled successfully.",
            screenshot: `data:image/png;base64,${screenshot}`,
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Auto-apply failed.";
        console.error("[apply]", message);

        try {
            await updateJobStatus(jobId, "failed");
        } catch { /* silent */ }

        return NextResponse.json({ error: message }, { status: 500 });
    }
}
