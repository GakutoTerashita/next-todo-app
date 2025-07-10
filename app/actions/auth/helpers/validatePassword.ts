import "server-only";
import bcrypt from 'bcrypt';

export const validatePassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    const result = await bcrypt.compare(password, hashedPassword);
    return result;
}