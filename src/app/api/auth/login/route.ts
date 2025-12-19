import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

interface LoginBody {
    email: string;
    password: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: LoginBody = await request.json();
        const { email, password } = body;

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

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 401 }
            );
        }

        return NextResponse.json({
            message: 'Login successful',
            user: {
                id: data.user.id,
                email: data.user.email,
            },
            session: {
                accessToken: data.session.access_token,
                expiresAt: data.session.expires_at,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
