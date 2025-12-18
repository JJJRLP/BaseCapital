import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getPrisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface AddWalletBody {
    address: string;
    isPrimary?: boolean;
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
        const wallets = await prisma.wallet.findMany({
            where: { userId: authUser.id },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ wallets });
    } catch (error) {
        console.error('Wallets fetch error:', error);
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

        const body: AddWalletBody = await request.json();
        const { address, isPrimary = false } = body;

        if (!address) {
            return NextResponse.json(
                { error: 'Wallet address is required' },
                { status: 400 }
            );
        }

        const prisma = await getPrisma();

        // Check if wallet already exists
        const existingWallet = await prisma.wallet.findUnique({
            where: { address },
        });

        if (existingWallet) {
            return NextResponse.json(
                { error: 'Wallet already linked to an account' },
                { status: 400 }
            );
        }

        // If setting as primary, unset other primary wallets
        if (isPrimary) {
            await prisma.wallet.updateMany({
                where: { userId: authUser.id, isPrimary: true },
                data: { isPrimary: false },
            });
        }

        const wallet = await prisma.wallet.create({
            data: {
                address,
                isPrimary,
                userId: authUser.id,
            },
        });

        return NextResponse.json({ wallet });
    } catch (error) {
        console.error('Add wallet error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const address = searchParams.get('address');

        if (!address) {
            return NextResponse.json(
                { error: 'Wallet address is required' },
                { status: 400 }
            );
        }

        const prisma = await getPrisma();

        const wallet = await prisma.wallet.findFirst({
            where: { address, userId: authUser.id },
        });

        if (!wallet) {
            return NextResponse.json(
                { error: 'Wallet not found' },
                { status: 404 }
            );
        }

        await prisma.wallet.delete({
            where: { id: wallet.id },
        });

        return NextResponse.json({ message: 'Wallet removed successfully' });
    } catch (error) {
        console.error('Remove wallet error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
