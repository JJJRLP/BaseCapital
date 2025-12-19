import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getPrisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface ApplyBody {
    email: string;
    name: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: ApplyBody = await request.json();
        const { email, name } = body;

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const supabase = await createServerSupabaseClient();
        const prisma = await getPrisma();

        if (!supabase) {
            return NextResponse.json(
                { error: 'Service temporarily unavailable' },
                { status: 503 }
            );
        }

        // 1. Send Magic Link (OTP)
        // This handles both "Create User" (if new) and "Login" (if existing)
        const { data: authData, error: authError } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${request.nextUrl.origin}/auth/callback`,
                shouldCreateUser: true,
                data: {
                    display_name: name, // Store name in Supabase metadata
                }
            },
        });

        if (authError) {
            return NextResponse.json(
                { error: authError.message },
                { status: 400 }
            );
        }

        // 2. Ensure Prisma User Exists
        // We use upsert to handle both new and existing users safely
        // Note: we might not have the UUID if the user wasn't just created or returned by signInWithOtp in some cases,
        // but verifyOtp usually returns the session. wait... signInWithOtp does NOT return the user user object if they are new but unverified?
        // Actually signInWithOtp returns nothing useful about the user ID usually until they verify.
        // HOWEVER, we can upsert by email if we can find them, but Prisma ID is the Supabase UUID usually.
        // Problem: We don't have the UUID yet if they are brand new and unverified.
        // Solution: We can't create the Prisma record YET if we don't have the ID.
        // BUT, we need to store the `name` so when they DO verify, we create the Prisma record.
        // We stored `display_name` in Supabase metadata above.
        // So, we rely on a "Post-Auth-Hook" or the client side to sync the user after login.

        // ALTERNATIVE: Use Admin API (Service Role) to `getUserByEmail` or `inviteUserByEmail`.
        // If we use clean OTP, we just trust the metadata to carry over.

        // Let's rely on the `onAuthStateChange` in AuthContext + a "Sync" API to handle the Prisma creation if missing.
        // See: `src/contexts/AuthContext.tsx` -> `fetchProfile` call.

        return NextResponse.json({
            message: 'Magic link sent. Please check your email.',
        });

    } catch (error) {
        console.error('Application error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
