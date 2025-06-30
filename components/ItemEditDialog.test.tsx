import { cleanup, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ItemEditDialog from "./ItemEditDialog";
import { renderWithQueryClientProvider } from "@/test/utils";

vi.mock("@/lib/db/todo-items", () => ({
    getTodoItemById: vi.fn().mockResolvedValue({
        id: "test-id",
        title: "Test Item",
        description: "This is a test item.",
        deadline: "2023-12-31",
    }),
}));

describe("ItemEditDialog", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it('fetches the associated item data on dialog opened, and show them', () => {
        throw new Error("Test not implemented yet");
    });

    it('is capable to close the dialog when mutate function resolved successfully', async () => {
        const user = userEvent.setup();
        const mockMutate = vi.fn().mockResolvedValueOnce({});
        const mockHandleClose = vi.fn();
        const { getByRole } = renderWithQueryClientProvider(
            <ItemEditDialog
                itemId="test-id"
                mutate={mockMutate}
                open={true}
                onClose={mockHandleClose}
            />
        );
        const confirmButton = getByRole("button", { name: "Confirm" });
        await user.click(confirmButton);

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalled();
            expect(mockHandleClose).toHaveBeenCalled();
        });
    });
});