import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import LoginForm from "./LoginForm";

vi.mock("@/app/actions/auth/auth", () => ({
    login: vi.fn(() => Promise.resolve(undefined)),
}));

describe('LoginForm', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders textbox for email and password', () => {
        render(<LoginForm />);

        const emailInput = screen.getByRole('textbox', { name: /email/i });
        const passwordInput = screen.getByLabelText(/password/i);

        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
    });

    it('password input is of type password', () => {
        render(<LoginForm />);

        const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
        expect(passwordInput).toHaveAttribute('type', 'password');
    });
});