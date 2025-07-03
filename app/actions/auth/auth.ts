"use server";
import { createSession, deleteSession } from '@/lib/session';
import registerUser from './registerUser';
import { validateSignupFormData } from './validateFormData';
import { redirect } from 'next/navigation';

type FormState = {
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
    }
    message?: string;
} | undefined;

export const signup = async (
    state: FormState,
    formData: FormData
): Promise<FormState> => {
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

export const login = async (formData: FormData) => {

}

export const logout = async () => {
    await deleteSession();
    redirect("/accounts");
};