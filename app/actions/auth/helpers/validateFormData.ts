import z from "zod";

const signupFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long" })
        .trim(),
    email: z
        .string()
        .email({ message: "Invalid email address" })
        .trim(),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .regex(/[a-zA-Z]/, { message: 'Contain at least one letter' })
        .regex(/[0-9]/, { message: 'Contain at least one number' })
        .trim(),
});

export type ValidatedSignupData = {
    name: string;
    email: string;
    password: string;
}

export type SignupFormErrors = {
    errors: {
        name?: string[] | undefined;
        email?: string[] | undefined;
        password?: string[] | undefined;
    };
};

export const validateSignupFormData = (
    formData: FormData
): ValidatedSignupData | SignupFormErrors => {
    const validatedFields = signupFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    return validatedFields.data;
};

const signinFormData = z.object({
    email: z
        .string()
        .email({ message: "Invalid email address" })
        .trim(),
    password: z
        .string()
        .min(1, { message: "Password is required" })
        .trim(),
});

export type ValidatedSigninData = {
    email: string;
    password: string;
}

export type SigninFormErrors = {
    errors: {
        email?: string[] | undefined;
        password?: string[] | undefined;
    };
};

export const validateSigninFormData = (
    formData: FormData
): ValidatedSigninData | SigninFormErrors => {
    const validatedFields = signinFormData.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    return validatedFields.data;
};