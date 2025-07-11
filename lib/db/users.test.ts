import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { dbFetchUserByEmail, dbRegisterUser } from "./users";
import { Prisma, PrismaClient } from "@prisma/client";
import { setupTestDb, teardownTestDB } from "./test-utils";

let prisma: PrismaClient;
let dbName: string;

vi.mock('@/lib/prisma', () => ({
    get prisma() {
        return prisma;
    }
}));

beforeAll(async () => {
    const setup = setupTestDb();
    prisma = setup.prisma;
    dbName = setup.dbName;
});

afterAll(async () => {
    await teardownTestDB(prisma, dbName);
});

beforeEach(async () => {
    await prisma.user.deleteMany();
});

describe('dbRegisterUser', () => {
    it('returns a registered user', async () => {
        const user = {
            name: 'John Doe',
            email: 'john@example.com',
            hashedPassword: 'password123',
        };

        const result = await dbRegisterUser(user);
        expect(result).toHaveProperty('name', user.name);
        expect(result).toHaveProperty('email', user.email);
        expect(result).toHaveProperty('hashedPassword', user.hashedPassword);
    });

    it('registers a user', async () => {
        const user = {
            name: 'Jane Doe',
            email: 'jane@example.com',
            hashedPassword: 'password456',
        };

        await dbRegisterUser(user);

        const regUser = await prisma.user.findUnique({
            where: { email: user.email },
        });
        expect(regUser).toHaveProperty('name', user.name);
        expect(regUser).toHaveProperty('email', user.email);
        expect(regUser).toHaveProperty('hashedPassword', user.hashedPassword);
    });

    it('throws an error if attempt user\'s email already exists', async () => {
        const user = {
            name: 'Jane Doe',
            email: 'jane@example.com',
            hashedPassword: 'password456',
        };
        await dbRegisterUser(user);

        const another = {
            name: 'Jane Smith',
            email: 'jane@example.com',
            hashedPassword: 'password789',
        };
        await expect(dbRegisterUser(another)).rejects.toThrowError(Prisma.PrismaClientKnownRequestError);
    });
});

describe('dbFetchUserByEmail', () => {
    it('returns a user by email', async () => {
        const user = {
            name: 'John Doe',
            email: 'john@example.com',
            hashedPassword: 'password123',
        };

        await dbRegisterUser(user);

        const result = await dbFetchUserByEmail('john@example.com');

        expect(result).toBeTruthy();
        expect(result?.name).toBe('John Doe');
        expect(result?.email).toBe('john@example.com');
        expect(result?.hashedPassword).toBe('password123');
    });

    it('returns null if user is not found', async () => {
        const result = await dbFetchUserByEmail('nonexistent@example.com');
        expect(result).toBeNull();
    });
});