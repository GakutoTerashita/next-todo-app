import registerUser from './registerUser';
import validateFormData from './validateFormData';

type FormState = {
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
    }
    message?: string;
} | undefined;

const signup = async (
    state: FormState,
    formData: FormData
): Promise<FormState> => {
    const validatedData = validateFormData(formData);

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
    return {
        message: `User ${registered.name} registered successfully!`,
    }
};

export default signup;