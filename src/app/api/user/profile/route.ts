import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getPrisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const prisma = await getPrisma();
        const user = await prisma.user.findUnique({
            where: { id: authUser.id },
            include: {
                wallets: true,
                subscription: true,
                traderProfile: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
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
