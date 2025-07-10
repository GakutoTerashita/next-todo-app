"use server";
import bcrypt from 'bcrypt';
import { createSession, deleteSession } from '@/lib/session';
import { validateSigninFormData, validateSignupFormData } from './helpers/validateFormData';
import { redirect } from 'next/navigation';
import { validatePassword } from './helpers/validatePassword';
import { dbFetchUserByEmail, dbRegisterUser } from '@/lib/db/users';
import { LoginFormState, SignupFormState } from './types';
import { handleLoginError, handleSignupError } from './helpers/handleAuthError';

export const signup = async (
    state: SignupFormState,
    formData: FormData
): Promise<SignupFormState> => {
    const validatedData = validateSignupFormData(formData);

    if ('errors' in validatedData) {
        return {
            errors: validatedData.errors,
        };
    }

    try {
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        const registeredUser = await dbRegisterUser({
            name: validatedData.name,
            email: validatedData.email,
            hashedPassword,
        });

        await createSession(registeredUser.name);
    } catch (error) {
        return handleSignupError(error);
    }

    redirect("/");
};

export const login = async (
    state: LoginFormState,
    formData: FormData,
): Promise<LoginFormState> => {
    const validatedData = validateSigninFormData(formData);

    if ('errors' in validatedData) {
        return {
            errors: validatedData.errors,
        };
    }

    try {
        const user = await dbFetchUserByEmail(validatedData.email);

        if (!user) {
            return {
                errors: {
                    email: ['User not found'],
                },
            };
        }

        if (!(await validatePassword(validatedData.password, user.hashedPassword))) {
            return {
                errors: {
                    password: ['Invalid password'],
                },
            };
        }

        await createSession(user.name);
    } catch (error) {
        return handleLoginError(error);
    }
    redirect("/");
};

export const logout = async () => {
    await deleteSession();
    redirect("/accounts");
};