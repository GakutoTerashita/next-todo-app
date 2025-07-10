import { dbRegisterUser } from "@/lib/db/users";
import { createSession } from "@/lib/session";
import { describe, expect, vi, it, afterEach } from "vitest";
import { validateSignupFormData } from "./helpers/validateFormData";
import { signup } from "./auth";
import { handleSignupError } from "./helpers/handleAuthError";
import { redirect } from "next/navigation";

vi.mock('@/lib/db/users', () => ({
    dbRegisterUser: vi.fn(),
}));

const mockedDbRegisterUser = vi.mocked(dbRegisterUser);

vi.mock('@/lib/session', () => ({
    createSession: vi.fn(),
}));

const mockedCreateSession = vi.mocked(createSession);

vi.mock('@/app/actions/auth/helpers/validateFormData', () => ({
    validateSignupFormData: vi.fn(),
}));

const mockedValidateSignupFormData = vi.mocked(validateSignupFormData);

vi.mock('./helpers/handleAuthError', async () => ({
    handleSignupError: vi.fn(),
}));

const mockedHandleSignupError = vi.mocked(handleSignupError);

vi.mock('next/navigation', () => ({
    redirect: vi.fn(),
}));

const mockedRedirect = vi.mocked(redirect);

describe('auth.ts', () => {
    describe('signup', () => {
        afterEach(() => {
            vi.clearAllMocks();
        });


        it('should register user, create session, and redirect on success', async () => {
            const validData = { name: 'Test User', email: 'test@example.com', password: 'password123' };
            mockedValidateSignupFormData.mockReturnValue(validData);
            const registeredUser = { id: '1', name: validData.name, email: validData.email, hashedPassword: 'hashed_password' };
            mockedDbRegisterUser.mockResolvedValue(registeredUser);

            const formData = new FormData();
            await signup({ errors: {} }, formData);

            // 1. ユーザー登録が呼ばれたか
            expect(mockedDbRegisterUser).toHaveBeenCalledWith(expect.objectContaining({
                name: validData.name,
                email: validData.email,
            }));

            // 2. セッション作成が呼ばれたか
            expect(mockedCreateSession).toHaveBeenCalledWith(registeredUser.name);

            // 3. リダイレクトが呼ばれたか
            expect(mockedRedirect).toHaveBeenCalledWith('/');
        });

        it('should not create session or redirect if user registration fails', async () => {
            const validData = { name: 'Test User', email: 'test@example.com', password: 'password123' };
            mockedValidateSignupFormData.mockReturnValue(validData);
            const dbError = new Error('DB Error');
            mockedDbRegisterUser.mockRejectedValue(dbError);
            mockedHandleSignupError.mockReturnValue({ errors: { general: ['DB Error'] } });

            const formData = new FormData();
            const result = await signup({ errors: {} }, formData);

            // DB登録は試みられる
            expect(mockedDbRegisterUser).toHaveBeenCalled();
            // セッション作成とリダイレクトは呼ばれない
            expect(mockedCreateSession).not.toHaveBeenCalled();
            expect(mockedRedirect).not.toHaveBeenCalled();
            // エラーハンドラが呼ばれ、その結果が返される
            expect(mockedHandleSignupError).toHaveBeenCalledWith(dbError);
            expect(result).toEqual({ errors: { general: ['DB Error'] } });
        });

        it('refuses invalid form data. should not perform create session, redirect or user registration.', async () => {
            const errors = { name: ['Name is required'], email: ['Email is invalid'], password: ['Password must be at least 6 characters'] };
            mockedValidateSignupFormData.mockReturnValue({ errors });

            const formData = new FormData();
            const result = await signup({ errors: {} }, formData);

            expect(result).toEqual({ errors });
            expect(mockedDbRegisterUser).not.toHaveBeenCalled();
            expect(mockedCreateSession).not.toHaveBeenCalled();
            expect(mockedRedirect).not.toHaveBeenCalled();
        });
    });
});