import z from "zod";

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

const validateFormData = (formData: FormData) => {
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

export default validateFormData;