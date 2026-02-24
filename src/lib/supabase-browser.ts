/**
 * JobSprint — Browser-side Supabase Client (Lazy Singleton)
 * Uses NEXT_PUBLIC_ env vars (safe for client-side).
 * Lazy initialization prevents build-time crashes when env vars are missing.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

/**
 * Returns a Supabase client for browser use.
 * Created lazily on first call to avoid build-time errors
 * when NEXT_PUBLIC_SUPABASE_URL isn't available (e.g. Vercel static generation).
 */
function getClient(): SupabaseClient {
    if (_client) return _client;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

    _client = createClient(url, key);
    return _client;
}

/**
 * Proxy object that lazily initializes the Supabase client.
 * All property access is forwarded to the real client.
 * This allows `import { supabaseBrowser }` to work at module scope
 * without crashing during static page generation.
 */
export const supabaseBrowser: SupabaseClient = new Proxy({} as SupabaseClient, {
    get(_target, prop, receiver) {
        const client = getClient();
        const value = Reflect.get(client, prop, receiver);
        if (typeof value === "function") {
            return value.bind(client);
        }
        return value;
    },
});
