"use server";
import bcrypt from 'bcrypt';
import { createSession, deleteSession } from '@/lib/session';
import { ValidatedSignupData, validateSigninFormData, validateSignupFormData } from './helpers/validateFormData';
import { redirect } from 'next/navigation';
import validatePassword from './helpers/validatePassword';
import { dbFetchUserByEmail, dbRegisterUser } from '@/lib/db/users';
import { LoginFormState, SignupFormState } from './types';
import { Prisma } from '@prisma/client';

export const handleSignupError = (
    error: unknown
): SignupFormState => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            return {
                errors: {
                    email: ['This email address is already in use.'],
                }
            };
        }
    }

    console.error('An unexpected error occurred during signup:', error);

    return {
        errors: {
            general: ['An unexpected error occurred. Please try again.'],
        }
    };
};

export const registerUserAndCreateSession = async (
    validatedSignupData: ValidatedSignupData
): Promise<void> => {
    const hashedPassword = await bcrypt.hash(validatedSignupData.password, 10);

    const registeredUser = await dbRegisterUser({
        name: validatedSignupData.name,
        email: validatedSignupData.email,
        hashedPassword,
    });

    await createSession(registeredUser.name);
};

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
        await registerUserAndCreateSession(validatedData);
    } catch (error) {
        return handleSignupError(error);
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