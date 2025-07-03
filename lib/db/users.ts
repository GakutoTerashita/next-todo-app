import { prisma } from "@/lib/prisma";
import { user } from "@prisma/client";

/**
 * Registers a new user in the database.
 * @param {Object} params - The parameters for registering a user.
 * @param {string} params.name - The name of the user.
 * @param {string} params.email - The email of the user.
 * @param {string} params.hashedPassword - The hashed password of the user.
 * @returns {Promise<user>} The registered user object.
 */
export const dbRegisterUser = async ({
    name,
    email,
    hashedPassword
}: {
    name: string;
    email: string;
    hashedPassword: string;
}): Promise<user> => {
    const registeredUser = await prisma.user.create({
        data: {
            name,
            email,
            hashedPassword,
        }
    });
    return registeredUser;
};