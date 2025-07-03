import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import LogoutButton from "./LogoutButton";
import { logout } from "@/app/actions/auth/auth";
import userEvent from "@testing-library/user-event";

vi.mock("@/app/actions/auth/auth", () => ({
    logout: vi.fn(() => Promise.resolve(undefined)),
}));

const mockedLogout = vi.mocked(logout);

describe('LogoutButton', () => {
    afterEach(() => {
        cleanup();
    });

    it('should render a button', () => {
        render(<LogoutButton />);
        expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });

    it('should call logout action on click', async () => {
        render(<LogoutButton />);
        const button = screen.getByRole('button', { name: /logout/i });

        const user = userEvent.setup();

        await user.click(button);

        expect(mockedLogout).toHaveBeenCalled();
    });
});