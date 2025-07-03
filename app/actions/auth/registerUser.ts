import { dbRegisterUser } from "@/lib/db/users";
import bcrypt from 'bcrypt';

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

    return user;
}

export default registerUser;