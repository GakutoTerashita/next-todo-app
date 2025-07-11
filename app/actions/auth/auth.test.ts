import { dbFetchUserByEmail, dbRegisterUser } from "@/lib/db/users";
import { createSession } from "@/lib/session";
import { describe, expect, vi, it, afterEach } from "vitest";
import { validateSigninFormData, validateSignupFormData } from "./helpers/validateFormData";
import { login, signup } from "./auth";
import { redirect } from "next/navigation";
import { validatePassword } from "./helpers/validatePassword";

vi.mock('@/lib/db/users', () => ({
    dbRegisterUser: vi.fn(),
    dbFetchUserByEmail: vi.fn(),
}));

const mockedDbRegisterUser = vi.mocked(dbRegisterUser);
const mockedDbFetchUserByEmail = vi.mocked(dbFetchUserByEmail);

vi.mock('@/lib/session', () => ({
    createSession: vi.fn(),
}));

const mockedCreateSession = vi.mocked(createSession);

vi.mock('@/app/actions/auth/helpers/validateFormData', () => ({
    validateSignupFormData: vi.fn(),
    validateSigninFormData: vi.fn(),
}));

const mockedValidateSignupFormData = vi.mocked(validateSignupFormData);
const mockedValidateSigninFormData = vi.mocked(validateSigninFormData);

vi.mock('./helpers/validatePassword', () => ({
    validatePassword: vi.fn(),
}));

const mockedValidatePassword = vi.mocked(validatePassword);

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
            expect(mockedCreateSession).toHaveBeenCalledWith(registeredUser.email);

            // 3. リダイレクトが呼ばれたか
            expect(mockedRedirect).toHaveBeenCalledWith('/');
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

    describe('login', () => {
        afterEach(() => {
            vi.clearAllMocks();
        });

        it('should fetch user, create session, and redirect on successful login', async () => {
            const validData = { email: 'test@example.com', password: 'password123' };
            mockedValidateSigninFormData.mockReturnValue(validData);
            const fetchedUser = {
                name: 'Test User',
                email: validData.email,
                hashedPassword: 'hashed_password'
            };
            mockedDbFetchUserByEmail.mockResolvedValue(fetchedUser);
            mockedValidatePassword.mockResolvedValue(true);

            const formData = new FormData();
            await login({ errors: {} }, formData);

            // 1. ユーザー取得が呼ばれたか
            expect(mockedDbFetchUserByEmail).toHaveBeenCalledWith(validData.email);

            // 2. セッション作成が呼ばれたか
            expect(mockedCreateSession).toHaveBeenCalledWith(fetchedUser.email);

            // 3. リダイレクトが呼ばれたか
            expect(mockedRedirect).toHaveBeenCalledWith('/');
        });

        it('should not create session or redirect if user not found', async () => {
            const validData = { email: 'test@example.com', password: 'password123' };
            mockedValidateSigninFormData.mockReturnValue(validData);
            mockedDbFetchUserByEmail.mockResolvedValue(null);

            const formData = new FormData();
            await login({ errors: {} }, formData);

            // 1. ユーザー取得が呼ばれたか
            expect(mockedDbFetchUserByEmail).toHaveBeenCalledWith(validData.email);

            // 2. セッション作成は呼ばれなかったか
            expect(mockedCreateSession).not.toHaveBeenCalled();

            // 3. リダイレクトは呼ばれなかったか
            expect(mockedRedirect).not.toHaveBeenCalled();
        });

        it('should not create session or redirect if password is invalid', async () => {
            const validData = { email: 'test@example.com', password: 'wrongpassword' };
            mockedValidateSigninFormData.mockReturnValue(validData);
            const fetchedUser = {
                name: 'Test User',
                email: validData.email,
                hashedPassword: 'hashed_password'
            };
            mockedDbFetchUserByEmail.mockResolvedValue(fetchedUser);
            mockedValidatePassword.mockResolvedValue(false);

            const formData = new FormData();
            await login({ errors: {} }, formData);

            // 1. ユーザー取得が呼ばれたか
            expect(mockedDbFetchUserByEmail).toHaveBeenCalledWith(validData.email);

            // 2. セッション作成は呼ばれなかったか
            expect(mockedCreateSession).not.toHaveBeenCalled();

            // 3. リダイレクトは呼ばれなかったか
            expect(mockedRedirect).not.toHaveBeenCalled();
        });

        it('refuses invalid form data. should not perform create session or redirect.', async () => {
            const errors = { email: ['Email is required'], password: ['Password is required'] };
            mockedValidateSigninFormData.mockReturnValue({ errors });

            const formData = new FormData();
            const result = await login({ errors: {} }, formData);

            expect(result).toEqual({ errors });
            expect(mockedDbFetchUserByEmail).not.toHaveBeenCalled();
            expect(mockedCreateSession).not.toHaveBeenCalled();
            expect(mockedRedirect).not.toHaveBeenCalled();
        });
    });
});