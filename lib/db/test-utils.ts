import { PrismaClient } from "@prisma/client";
import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";

const databaseUrl = new URL(process.env.DATABASE_URL!);

export const setupTestDb = () => {
    const dbName = `test_${randomUUID().replace(/-/g, '')}`;
    const dbUrl = `${databaseUrl.protocol}//${databaseUrl.username}:${databaseUrl.password}@${databaseUrl.host}/${dbName}`;

    process.env.DATABASE_URL = dbUrl;

    execSync('npx prisma migrate deploy', {
        env: {
            ...process.env,
            DATABASE_URL: dbUrl
        },
        stdio: 'inherit',
    });

    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: dbUrl,
            },
        },
    });

    return { prisma, dbName };
};

export const teardownTestDB = async (prisma: PrismaClient, dbName: string) => {
    await prisma.$disconnect();

    const adminUrl = `${databaseUrl.protocol}//${databaseUrl.username}:${databaseUrl.password}@${databaseUrl.host}/mysql`;
    const adminPrisma = new PrismaClient({
        datasources: { db: { url: adminUrl } },
    });
    await adminPrisma.$executeRawUnsafe(`DROP DATABASE IF EXISTS \`${dbName}\``);
    await adminPrisma.$disconnect();
}