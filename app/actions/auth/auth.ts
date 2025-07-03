"use server";
import { createSession, deleteSession } from '@/lib/session';
import registerUser from './registerUser';
import { validateSigninFormData, validateSignupFormData } from './validateFormData';
import { redirect } from 'next/navigation';
import fetchUserByEmail from './fetchUserByEmail';
import validatePassword from './validatePassword';

type SingupFormState = {
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
    }
    message?: string;
} | undefined;

export const signup = async (
    state: SingupFormState,
    formData: FormData
): Promise<SingupFormState> => {
    const validatedData = validateSignupFormData(formData);

    if ('errors' in validatedData) {
        return {
            errors: validatedData.errors,
        };
    }

    const registered = await registerUser({
        name: validatedData.name,
        email: validatedData.email,
        password: validatedData.password,
    });

    await createSession(registered.name);
    redirect("/");
};

type LoginFormState = {
    errors?: {
        email?: string[];
        password?: string[];
    }
} | undefined;

export const login = async (
    state: LoginFormState,
    formData: FormData,
) => {
    const validatedData = validateSigninFormData(formData);

    if ('errors' in validatedData) {
        return {
            errors: validatedData.errors,
        };
    }

    const user = await fetchUserByEmail(validatedData.email);

    if (!user) {
        return {
            errors: {
                email: ['User not found'],
            },
        };
    }

    if (!validatePassword(validatedData.password, user.hashedPassword)) {
        return {
            errors: {
                password: ['Invalid password'],
            },
        };
    }

    await createSession(user.name);
    redirect("/");
};

export const logout = async () => {
    await deleteSession();
    redirect("/accounts");
};