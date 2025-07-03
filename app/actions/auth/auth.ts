"use server";
import bcrypt from 'bcrypt';
import { createSession, deleteSession } from '@/lib/session';
import { validateSigninFormData, validateSignupFormData } from './helpers/validateFormData';
import { redirect } from 'next/navigation';
import validatePassword from './helpers/validatePassword';
import { dbFetchUserByEmail, dbRegisterUser } from '@/lib/db/users';
import { LoginFormState, SingupFormState } from './types';

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

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const registered = await dbRegisterUser({
        name: validatedData.name,
        email: validatedData.email,
        hashedPassword,
    }).catch(error => ({
        errors: {
            general: [`Database error occurred: ${error.code}: ${error.message}`],
        }
    }));

    if ('errors' in registered) {
        return registered;
    }

    await createSession(registered.name);
    redirect("/");
};

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

    const user = await dbFetchUserByEmail(validatedData.email);

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