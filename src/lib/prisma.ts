// Prisma client with lazy dynamic import
// This prevents build-time connection attempts in Next.js

let prismaInstance: Awaited<typeof import('@prisma/client')>['PrismaClient'] extends new () => infer T ? T : never;

export async function getPrisma() {
    if (!prismaInstance) {
        const { PrismaClient } = await import('@prisma/client');
        prismaInstance = new PrismaClient();
    }
    return prismaInstance;
}

// Type for the prisma instance
export type PrismaClientType = NonNullable<typeof prismaInstance>;
