/**
 * Treabyn Job Sniper Service
 * ──────────────────────────
 * Uses Serper.dev (Google Search API) to find freshly-posted remote jobs
 * directly on Greenhouse, Lever, and Ashby — bypassing slow job boards.
 *
 * Env required: SERPER_API_KEY
 */

export interface SniperJob {
    id: string;
    title: string;
    company: string;
    url: string;
    platform: "greenhouse" | "lever" | "ashby" | "other";
    snippet: string;
    discoveredAt: string; // ISO timestamp
}

interface SerperResult {
    title: string;
    link: string;
    snippet: string;
    date?: string;
}

interface SerperResponse {
    organic?: SerperResult[];
    error?: string;
}

const PLATFORMS = [
    { host: "greenhouse.io", label: "greenhouse" as const },
    { host: "lever.co", label: "lever" as const },
    { host: "ashbyhq.com", label: "ashby" as const },
];

function detectPlatform(url: string): SniperJob["platform"] {
    if (url.includes("greenhouse.io")) return "greenhouse";
    if (url.includes("lever.co")) return "lever";
    if (url.includes("ashbyhq.com")) return "ashby";
    return "other";
}

function extractCompany(url: string, platform: SniperJob["platform"]): string {
    try {
        const u = new URL(url);
        if (platform === "greenhouse") {
            // https://boards.greenhouse.io/companyname/jobs/...
            const parts = u.pathname.split("/").filter(Boolean);
            return parts[0] ?? "Unknown";
        }
        if (platform === "lever") {
            // https://jobs.lever.co/companyname/...
            const parts = u.pathname.split("/").filter(Boolean);
            return parts[0] ?? "Unknown";
        }
        if (platform === "ashby") {
            // https://jobs.ashbyhq.com/companyname/...
            const parts = u.pathname.split("/").filter(Boolean);
            return parts[0] ?? "Unknown";
        }
    } catch {
        // fallback
    }
    return "Unknown";
}

/**
 * Search for freshly posted remote jobs matching the given role.
 *
 * @param role       e.g. "Data Analyst", "Software Engineer"
 * @param maxResults Max total results to return (default: 20)
 * @param window     Freshness window: "h" = last hour, "d" = last day (default: "h")
 */
export async function snipeJobs(
    role: string,
    maxResults = 20,
    window: "h" | "d" = "h"
): Promise<SniperJob[]> {
    const apiKey = process.env.SERPER_API_KEY;
    if (!apiKey) {
        throw new Error("SERPER_API_KEY is not set in environment variables.");
    }

    const results: SniperJob[] = [];

    // Query each platform in parallel for speed
    const promises = PLATFORMS.map(async (platform) => {
        const query = `site:${platform.host} "Remote" "${role}"`;

        const response = await fetch("https://google.serper.dev/search", {
            method: "POST",
            headers: {
                "X-API-KEY": apiKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                q: query,
                num: Math.ceil(maxResults / PLATFORMS.length), // distribute quota
                tbs: `qdr:${window}`, // freshness filter: qdr:h = last hour
                gl: "us",
                hl: "en",
            }),
        });

        if (!response.ok) {
            console.error(`Serper error for ${platform.host}: ${response.status}`);
            return [];
        }

        const data: SerperResponse = await response.json();
        const organic = data.organic ?? [];

        return organic.map((item, idx): SniperJob => ({
            id: `${platform.label}-${Date.now()}-${idx}`,
            title: item.title.replace(/\s*[-|].*$/, "").trim(), // clean company suffix
            company: extractCompany(item.link, platform.label),
            url: item.link,
            platform: detectPlatform(item.link),
            snippet: item.snippet ?? "",
            discoveredAt: new Date().toISOString(),
        }));
    });

    const platformResults = await Promise.all(promises);
    for (const batch of platformResults) {
        results.push(...batch);
    }

    // Deduplicate by URL and cap at maxResults
    const seen = new Set<string>();
    return results.filter((job) => {
        if (seen.has(job.url)) return false;
        seen.add(job.url);
        return true;
    }).slice(0, maxResults);
}
