import { renderWithQueryClientProvider } from "@/test/utils";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import ItemCtrlButtons from "./ItemCtrlButtons";
import { screen } from "@testing-library/react";


describe('edit button', () => {
    it('opens dialog for editing todo-item on click', async () => {
        const user = userEvent.setup();

        renderWithQueryClientProvider(<ItemCtrlButtons completed={false} id="1" />);

        const editButton = screen.getByRole('button', { name: 'Edit' });
        await user.click(editButton);

        expect(screen.getByText('Edit TodoItem')).toBeInTheDocument();
    });
});