import { dbFetchUserByEmail } from "@/lib/db/users";
import { user } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";
import fetchUserByEmail from "./fetchUserByEmail";

vi.mock('@/lib/db/users', async () => ({
    ...await vi.importActual('@/lib/db/users'),
    dbFetchUserByEmail: vi.fn(),
}));

const mockedDbFetchUserByEmail = vi.mocked(dbFetchUserByEmail);

describe('fetchUserByEmail', () => {
    it('returns a user data on success', async () => {
        const mockUser: user = {
            name: 'Test User',
            email: 'test@example.com',
            hashedPassword: 'hashedPassword123',
        };

        mockedDbFetchUserByEmail.mockResolvedValueOnce(mockUser);

        const user = await fetchUserByEmail('test@example.com');

        expect(user).toEqual(mockUser);
    });

    it('throws an error if database operation fails', async () => {
        mockedDbFetchUserByEmail.mockRejectedValueOnce(new Error('Database error'));

        await expect(fetchUserByEmail('test@example.com')).rejects.toThrow('Database error');
    });

    it('returns null if user is not found', async () => {
        mockedDbFetchUserByEmail.mockResolvedValueOnce(null);

        const user = await fetchUserByEmail('test@example.com');

        expect(user).toBeNull();
    });
});