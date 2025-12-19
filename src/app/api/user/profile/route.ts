import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getPrisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabase = await createServerSupabaseClient();

        if (!supabase) {
            return NextResponse.json(
                { error: 'Service temporarily unavailable' },
                { status: 503 }
            );
        }

        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const prisma = await getPrisma();
        let user = await prisma.user.findUnique({
            where: { id: authUser.id },
            include: {
                wallets: true,
                subscription: true,
                traderProfile: true,
            },
        });

        if (!user) {
            // Auto-create user from Supabase metadata (for Magic Link users)
            const displayName = authUser.user_metadata?.display_name || authUser.email?.split('@')[0] || 'Trader';
            user = await prisma.user.create({
                data: {
                    id: authUser.id,
                    email: authUser.email!,
                    displayName,
                    // status defaults to PENDING in schema
                },
                include: {
                    wallets: true,
                    subscription: true,
                    traderProfile: true,
                },
            });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Profile fetch error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

interface UpdateProfileBody {
    displayName?: string;
    avatarUrl?: string;
}

export async function PATCH(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();

        if (!supabase) {
            return NextResponse.json(
                { error: 'Service temporarily unavailable' },
                { status: 503 }
            );
        }

        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body: UpdateProfileBody = await request.json();

        const prisma = await getPrisma();
        const user = await prisma.user.update({
            where: { id: authUser.id },
            data: {
                displayName: body.displayName,
                avatarUrl: body.avatarUrl,
            },
        });

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
