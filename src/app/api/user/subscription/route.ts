import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getPrisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface CreateSubscriptionBody {
    planId: string;
    planName: string;
    txHash?: string;
}

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
        const subscription = await prisma.subscription.findUnique({
            where: { userId: authUser.id },
        });

        return NextResponse.json({ subscription });
    } catch (error) {
        console.error('Subscription fetch error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body: CreateSubscriptionBody = await request.json();
        const { planId, planName, txHash } = body;

        if (!planId || !planName) {
            return NextResponse.json(
                { error: 'Plan ID and name are required' },
                { status: 400 }
            );
        }

        const prisma = await getPrisma();

        // Upsert subscription (create or update)
        const subscription = await prisma.subscription.upsert({
            where: { userId: authUser.id },
            create: {
                planId,
                planName,
                txHash,
                userId: authUser.id,
            },
            update: {
                planId,
                planName,
                txHash,
                startedAt: new Date(),
                status: 'active',
            },
        });

        return NextResponse.json({ subscription });
    } catch (error) {
        console.error('Create subscription error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

interface UpdateSubscriptionBody {
    status?: string;
    expiresAt?: string;
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

        const body: UpdateSubscriptionBody = await request.json();

        const prisma = await getPrisma();
        const subscription = await prisma.subscription.update({
            where: { userId: authUser.id },
            data: {
                status: body.status,
                expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
            },
        });

        return NextResponse.json({ subscription });
    } catch (error) {
        console.error('Update subscription error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
