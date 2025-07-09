import { dbFetchUserByEmail, dbRegisterUser } from "@/lib/db/users";
import { createSession, deleteSession } from "@/lib/session";
import { describe, expect, vi, it } from "vitest";
import { registerUserAndCreateSession } from "./auth";

vi.mock('@/lib/db/users', () => ({
    dbFetchUserByEmail: vi.fn(),
    dbRegisterUser: vi.fn(),
}));

const mockedDbFetchUserByEmail = vi.mocked(dbFetchUserByEmail);
const mockedDbRegisterUser = vi.mocked(dbRegisterUser);

vi.mock('@/lib/session', () => ({
    deleteSession: vi.fn(),
    createSession: vi.fn(),
}));

const mockedCreateSession = vi.mocked(createSession);
const mockedDeleteSession = vi.mocked(deleteSession);

describe('registerUserAndCreateSession', () => {
    it('create a session for a newly registered user name', async () => {
        const validatedSignupData = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'password123',
        };

        mockedDbRegisterUser.mockResolvedValue({
            ...validatedSignupData,
            hashedPassword: 'hashed_password',
        });

        await registerUserAndCreateSession(validatedSignupData);

        expect(mockedCreateSession).toHaveBeenCalledWith(validatedSignupData.name);
    });
});