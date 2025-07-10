import { Prisma } from "@prisma/client";
import { LoginFormState, SignupFormState } from "../types";

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

export const handleLoginError = (
    error: unknown
): LoginFormState => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return {
            errors: {
                general: ['An unexpected database error occurred.'],
            }
        }
    }

    return {
        errors: {
            general: ['An unexpected error occurred. Please try again.'],
        },
    }
}