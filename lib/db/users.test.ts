import { describe, expect, it, vi } from "vitest";
import { dbFetchUserByEmail, dbRegisterUser } from "./users";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", async () => ({
    ...await vi.importActual("@/lib/prisma"),
    prisma: {
        user: {
            create: vi.fn(),
            findUnique: vi.fn(),
        },
    },
}));

const mockedCreate = vi.mocked(prisma.user.create);
const mockedFindUnique = vi.mocked(prisma.user.findUnique);

describe('dbRegisterUser', () => {
    it('returns a registered user', async () => {
        const user = {
            name: 'John Doe',
            email: 'john@example.com',
            hashedPassword: 'password123',
        };

        mockedCreate.mockResolvedValue({
            ...user,
        });

        const result = await dbRegisterUser(user);
        expect(result).toHaveProperty('name', user.name);
        expect(result).toHaveProperty('email', user.email);
        expect(result).toHaveProperty('hashedPassword', user.hashedPassword);
    });

    it('throws an error if database operation fails', async () => {
        mockedCreate.mockRejectedValue(new Error('Database error'));

        await expect(dbRegisterUser({
            name: 'Jane Doe',
            email: 'jane@example.com',
            hashedPassword: 'password456',
        })).rejects.toThrow('Database error');
    });
});

describe('dbFetchUserByEmail', () => {
    it('returns a user by email', async () => {
        const user = {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            hashedPassword: 'password123',
        };

        mockedFindUnique.mockResolvedValue(user);

        const result = await dbFetchUserByEmail('john@example.com');
        expect(result).toEqual(user);
    });

    it('returns null if user is not found', async () => {
        mockedFindUnique.mockResolvedValue(null);

        const result = await dbFetchUserByEmail('nonexistent@example.com');
        expect(result).toBeNull();
    });
});