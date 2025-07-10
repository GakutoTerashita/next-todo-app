export type SignupFormState = {
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        general?: string[];
    }
    message?: string;
} | undefined;

export type LoginFormState = {
    errors?: {
        email?: string[];
        password?: string[];
        general?: string[];
    }
} | undefined;
