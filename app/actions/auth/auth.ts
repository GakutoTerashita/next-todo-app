import bcrypt from 'bcrypt';
import { dbRegisterUser } from '@/lib/db/users';
import validateFormData from './validateFormData';

export const registerUser = async ({
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

    return user;
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