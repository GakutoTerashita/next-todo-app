import { describe, expect, it, vi } from "vitest";
import { dbRegisterUser } from "./users";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", async () => ({
    ...await vi.importActual("@/lib/prisma"),
    prisma: {
        user: {
            create: vi.fn(),
        },
    },
}));

const mockedCreate = vi.mocked(prisma.user.create);

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