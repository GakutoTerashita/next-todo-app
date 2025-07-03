import { dbFetchUserByEmail } from "@/lib/db/users";

const fetchUserByEmail = async (email: string) => {
    const user = await dbFetchUserByEmail(email);
    return user;
};

export default fetchUserByEmail;