import { describe, expect, it } from "vitest";
import { validateSigninFormData, validateSignupFormData } from "./validateFormData";

describe('validateFormData', () => {
    describe('success cases', () => {
        it('accept valid form data', () => {
            const formData = new FormData();
            formData.append('name', 'Valid Name');
            formData.append('email', 'valid.email@example.com');
            formData.append('password', 'Valid123');

            const result = validateSignupFormData(formData);

            if (!('name' in result) || !('email' in result) || !('password' in result) || 'errors' in result) {
                throw new Error('Expected validation to succeed');
            }
            expect(result.name).toBe('Valid Name');
            expect(result.email).toBe('valid.email@example.com');
            expect(result.password).toBe('Valid123');
        });
    });

    describe('failure cases', () => {
        it('deny invalid name', () => {
            const formData = new FormData();
            formData.append('name', 'A');
            formData.append('email', 'valid.email@example.com');
            formData.append('password', 'Valid123');

            const result = validateSignupFormData(formData);

            if (!('errors' in result)) {
                throw new Error('Expected validation to fail');
            }
            expect(result.errors.name)
                .toEqual(['Name must be at least 2 characters long']);
        });

        it('deny invalid email', () => {
            const formData = new FormData();
            formData.append('name', 'Valid Name');
            formData.append('email', 'invalid-email');
            formData.append('password', 'Valid123');

            const result = validateSignupFormData(formData);

            if (!('errors' in result)) {
                throw new Error('Expected validation to fail');
            }
            expect(result.errors.email)
                .toEqual(['Invalid email address']);
        });

        it('deny invalid password case 0', () => {
            const formData = new FormData();
            formData.append('name', 'Valid Name');
            formData.append('email', 'valid.email@example.com');
            formData.append('password', 'short');

            const result = validateSignupFormData(formData);

            if (!('errors' in result)) {
                throw new Error('Expected validation to fail');
            }
            expect(result.errors.password)
                .toEqual([
                    'Password must be at least 6 characters long',
                    'Contain at least one number',
                ]);
        });

        it('deny invalid password case 1', () => {
            const formData = new FormData();
            formData.append('name', 'Valid Name');
            formData.append('email', 'valid.email@example.com');
            formData.append('password', '123456');

            const result = validateSignupFormData(formData);

            if (!('errors' in result)) {
                throw new Error('Expected validation to fail');
            }
            expect(result.errors.password)
                .toEqual([
                    'Contain at least one letter',
                ]);
        });

        it('deny invalid password case 2', () => {
            const formData = new FormData();
            formData.append('name', 'Valid Name');
            formData.append('email', 'valid.email@example.com');
            formData.append('password', 'abcdef');

            const result = validateSignupFormData(formData);

            if (!('errors' in result)) {
                throw new Error('Expected validation to fail');
            }
            expect(result.errors.password)
                .toEqual([
                    'Contain at least one number',
                ]);
        });
    });
});

describe('validateSigninFormData', () => {
    describe('success cases', () => {
        it('accept valid form data', () => {
            const formData = new FormData();
            formData.append('email', 'valid.email@example.com');
            formData.append('password', 'Valid123');

            const result = validateSigninFormData(formData);

            if (!('email' in result) || !('password' in result) || 'errors' in result) {
                throw new Error('Expected validation to succeed');
            }
            expect(result.email).toBe('valid.email@example.com');
            expect(result.password).toBe('Valid123');
        });
    });

    describe('failure cases', () => {
        it('deny invalid email', () => {
            const formData = new FormData();
            formData.append('email', 'invalid-email');
            formData.append('password', 'Valid123');

            const result = validateSigninFormData(formData);

            if (!('errors' in result)) {
                throw new Error('Expected validation to fail');
            }
            expect(result.errors.email)
                .toEqual(['Invalid email address']);
        });

        it('deny empty password', () => {
            const formData = new FormData();
            formData.append('email', 'valid.email@example.com');
            formData.append('password', '');

            const result = validateSigninFormData(formData);

            if (!('errors' in result)) {
                throw new Error('Expected validation to fail');
            }
            expect(result.errors.password)
                .toEqual(['Password is required']);
        });
    });
});