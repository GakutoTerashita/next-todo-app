import { z } from 'zod';
import bcrypt from 'bcrypt';
import { dbRegisterUser } from '@/lib/db/users';

const SignupFormSchema = z.object({
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

export const validateFormData = (formData: FormData) => {
    const validatedFields = SignupFormSchema.safeParse({
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

const registerUser = async ({
    name,
    email,
    password
}: {
    name: string;
    email: string;
    password: string;
}) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await dbRegisterUser({
        name,
        email,
        hashedPassword
    });
}

type FormState = {
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
    }
    message?: string;
} | undefined;

const signup = async (state: FormState, formData: FormData) => {
    const validatedData = validateFormData(formData);

    if ('errors' in validatedData) {
        return {
            errors: validatedData.errors,
        };
    }

    await registerUser({
        name: validatedData.name,
        email: validatedData.email,
        password: validatedData.password,
    });
};

export default signup;