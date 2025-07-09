"use server";
import bcrypt from 'bcrypt';
import { createSession, deleteSession } from '@/lib/session';
import { ValidatedSignupData, validateSigninFormData, validateSignupFormData } from './helpers/validateFormData';
import { redirect } from 'next/navigation';
import validatePassword from './helpers/validatePassword';
import { dbFetchUserByEmail, dbRegisterUser } from '@/lib/db/users';
import { LoginFormState, SignupFormState } from './types';

export const registerUserAndCreateSession = async (
    validatedSignupData: ValidatedSignupData
) => {
    const hashedPassword = await bcrypt.hash(validatedSignupData.password, 10);

    const registeredUser = await dbRegisterUser({
        name: validatedSignupData.name,
        email: validatedSignupData.email,
        hashedPassword,
    }).catch(error => ({
        errors: {
            general: [`Database error occurred: ${error.code}: ${error.message}`],
        }
    }));

    if ('errors' in registeredUser) {
        return registeredUser;
    }

    await createSession(registeredUser.name);

    return { success: true };
}

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

    const result = await registerUserAndCreateSession(validatedData);

    if (!('success' in result)) {
        return {
            errors: {
                general: [result.errors.general?.[0]],
            }
        };
    }

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