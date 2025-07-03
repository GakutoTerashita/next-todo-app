import { dbRegisterUser } from "@/lib/db/users";
import { describe, expect, it, vi } from "vitest";
import registerUser from "./registerUser";

vi.mock('@/lib/db/users', async () => ({
    ...await vi.importActual('@/lib/db/users'),
    dbRegisterUser: vi.fn(),
}));

const mockedDbRegisterUser = vi.mocked(dbRegisterUser);

describe('registerUser', () => {
    it('returns registered user data on success', async () => {
        const mockUser = {
            name: 'Test User',
            email: 'test@example.com',
        };

        mockedDbRegisterUser.mockResolvedValue({
            ...mockUser,
            hashedPassword: 'hashedPassword123',
        });

        const registeredUser = await registerUser({
            ...mockUser,
            password: 'password123',
        });

        const { name, email } = registeredUser;
        expect(name).toEqual(mockUser.name);
        expect(email).toEqual(mockUser.email);
    });

    it('throws an error if database operation fails', async () => {
        mockedDbRegisterUser.mockRejectedValue(new Error('Database error'));

        await expect(registerUser({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
        })).rejects.toThrow('Database error');
    });
});