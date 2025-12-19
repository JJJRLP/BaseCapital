import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getPrisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface RegisterBody {
    email: string;
    password: string;
    displayName?: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: RegisterBody = await request.json();
        const { email, password, displayName } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const supabase = await createServerSupabaseClient();

        if (!supabase) {
            return NextResponse.json(
                { error: 'Service temporarily unavailable' },
                { status: 503 }
            );
        }

        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${request.nextUrl.origin}/auth/callback`,
            },
        });

        if (authError) {
            return NextResponse.json(
                { error: authError.message },
                { status: 400 }
            );
        }

        if (!authData.user) {
            return NextResponse.json(
                { error: 'Failed to create user' },
                { status: 500 }
            );
        }

        // Create user in Prisma database
        const prisma = await getPrisma();
        const user = await prisma.user.create({
            data: {
                id: authData.user.id,
                email: authData.user.email!,
                displayName: displayName || email.split('@')[0],
            },
        });

        return NextResponse.json({
            message: 'Registration successful. Please check your email to verify your account.',
            user: {
                id: user.id,
                email: user.email,
                displayName: user.displayName,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
