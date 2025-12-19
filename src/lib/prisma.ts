// Prisma client with lazy dynamic import
// This prevents build-time connection attempts in Next.js

import type { PrismaClient as PrismaClientType } from '@prisma/client';

let prismaInstance: PrismaClientType | null = null;

export async function getPrisma(): Promise<PrismaClientType> {
    if (!prismaInstance) {
        const { PrismaClient } = await import('@prisma/client');
        prismaInstance = new PrismaClient();
    }
    return prismaInstance;
}

// Re-export the type for external use
export type { PrismaClientType };
