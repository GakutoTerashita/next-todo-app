import { cleanup, render, screen } from "@testing-library/react";
import { describe, expect, it, afterEach, vi } from "vitest";
import SignupForm from "./SignupForm";

vi.mock('@/app/actions/auth/auth', () => ({
    signup: vi.fn(() => Promise.resolve(undefined)), // Mock the signup function
}));

describe('Authentication form', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders label for name, email, and password', () => {
        render(<SignupForm />);

        expect(screen.getByRole('textbox', { name: /name/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('password input is of type password', () => {
        render(<SignupForm />);

        const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
        expect(passwordInput.type).toBe('password');
    });
});