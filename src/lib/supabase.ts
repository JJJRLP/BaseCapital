import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

// Check if Supabase is configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
    return !!(supabaseUrl && supabaseKey);
}

export function createClient(): SupabaseClient | null {
    if (!supabaseUrl || !supabaseKey) {
        // Return null during build time to prevent prerender errors
        if (typeof window === 'undefined') {
            return null;
        }
        console.error(
            'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
        );
        return null;
    }
    return createBrowserClient(supabaseUrl, supabaseKey);
}
