import { afterEach, describe, expect, it } from "vitest";
import { dbFetchUserByEmail, dbRegisterUser } from "./users";
import { execSync } from "node:child_process";
import { prisma } from "@/lib/prisma";

describe('database integration tests', () => {

    afterEach(() => {
        execSync('npx prisma migrate reset --force --skip-generate', { stdio: 'inherit' });
    });

    describe('dbRegisterUser', () => {
        it('returns a registered user', async () => {
            const user = {
                name: 'John Doe',
                email: 'john@example.com',
                hashedPassword: 'password123',
            };

            const result = await dbRegisterUser(user);
            expect(result).toHaveProperty('name', user.name);
            expect(result).toHaveProperty('email', user.email);
            expect(result).toHaveProperty('hashedPassword', user.hashedPassword);
        });

        it('registers a user', async () => {
            const user = {
                name: 'Jane Doe',
                email: 'jane@example.com',
                hashedPassword: 'password456',
            };

            await dbRegisterUser(user);

            const regUser = await prisma.user.findUnique({
                where: { email: user.email },
            });
            expect(regUser).toHaveProperty('name', user.name);
            expect(regUser).toHaveProperty('email', user.email);
            expect(regUser).toHaveProperty('hashedPassword', user.hashedPassword);
        });

        // it('throws an error if database operation fails', async () => {
        //     await expect(dbRegisterUser({
        //         name: 'Jane Doe',
        //         email: 'jane@example.com',
        //         hashedPassword: 'password456',
        //     })).rejects.toThrow('Database error');
        // });
    });

    describe('dbFetchUserByEmail', () => {
        it('returns a user by email', async () => {
            const user = {
                name: 'John Doe',
                email: 'john@example.com',
                hashedPassword: 'password123',
            };

            await dbRegisterUser(user);

            const result = await dbFetchUserByEmail('john@example.com');

            expect(result).toBeTruthy();
            expect(result?.name).toBe('John Doe');
            expect(result?.email).toBe('john@example.com');
            expect(result?.hashedPassword).toBe('password123');
        });

        it('returns null if user is not found', async () => {
            const result = await dbFetchUserByEmail('nonexistent@example.com');
            expect(result).toBeNull();
        });
    });
});