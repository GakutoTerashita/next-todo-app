import { describe, expect, it } from "vitest";
import signup from "./auth";

describe('auth actions', () => {
    describe('signup action', () => {
        describe('success cases', () => {
            it('accept valid form data', async () => {
                const formData = new FormData();
                formData.append('name', 'Valid Name');
                formData.append('email', 'valid.email@example.com');
                formData.append('password', 'Valid123');

                const errors = await signup(undefined, formData);

                expect(errors).toBeUndefined();
            });
        });

        describe('failure cases', () => {
            it('deny invalid name', async () => {
                const formData = new FormData();
                formData.append('name', 'A');
                formData.append('email', 'valid.email@example.com');
                formData.append('password', 'Valid123');

                const errors = await signup(undefined, formData);

                expect(errors?.errors.name)
                    .toEqual(['Name must be at least 2 characters long']);
            });

            it('deny invalid email', async () => {
                const formData = new FormData();
                formData.append('name', 'Valid Name');
                formData.append('email', 'invalid-email');
                formData.append('password', 'Valid123');

                const errors = await signup(undefined, formData);

                expect(errors?.errors.email)
                    .toEqual(['Invalid email address']);
            });

            it('deny invalid password case 0', async () => {
                const formData = new FormData();
                formData.append('name', 'Valid Name');
                formData.append('email', 'valid.email@example.com');
                formData.append('password', 'short');

                const errors = await signup(undefined, formData);

                expect(errors?.errors.password)
                    .toEqual([
                        'Password must be at least 6 characters long',
                        'Contain at least one number',
                    ]);
            });

            it('deny invalid password case 1', async () => {
                const formData = new FormData();
                formData.append('name', 'Valid Name');
                formData.append('email', 'valid.email@example.com');
                formData.append('password', '123456');

                const errors = await signup(undefined, formData);

                expect(errors?.errors.password)
                    .toEqual([
                        'Contain at least one letter',
                    ]);
            });

            it('deny invalid password case 2', async () => {
                const formData = new FormData();
                formData.append('name', 'Valid Name');
                formData.append('email', 'valid.email@example.com');
                formData.append('password', 'abcdef');

                const errors = await signup(undefined, formData);

                expect(errors?.errors.password)
                    .toEqual([
                        'Contain at least one number',
                    ]);
            });
        });
    });
});