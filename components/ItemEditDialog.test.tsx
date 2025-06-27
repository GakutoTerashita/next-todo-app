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

    it('has correct form inputs', () => {
        const { getByLabelText } = renderWithQueryClientProvider(
            <ItemEditDialog
                itemId="test-id"
                mutate={() => { }}
                open={true}
                onClose={() => { }}
            />
        );

        expect(getByLabelText("Title")).toBeInTheDocument();
        expect(getByLabelText("Description")).toBeInTheDocument();
        expect(getByLabelText("Deadline")).toBeInTheDocument();
    })

    it('has confirm button', () => {
        const { getByRole } = renderWithQueryClientProvider(
            <ItemEditDialog
                itemId="test-id"
                mutate={() => { }}
                open={true}
                onClose={() => { }}
            />
        );

        expect(getByRole("button", { name: "Confirm" })).toBeInTheDocument();
    });

    it('calls the mutate function when confirm button is clicked', async () => {
        const user = userEvent.setup();
        const mockMutate = vi.fn();
        const { getByRole, getByLabelText } = renderWithQueryClientProvider(
            <ItemEditDialog
                itemId="test-id"
                mutate={mockMutate}
                open={true}
                onClose={() => { }}
            />
        );

        const titleInput = getByLabelText("Title");
        const descriptionInput = getByLabelText("Description");
        const deadlineInput = getByLabelText("Deadline");
        const confirmButton = getByRole("button", { name: "Confirm" });

        await user.type(titleInput, "New Title");
        await user.type(descriptionInput, "New Description");
        await user.type(deadlineInput, "2023-12-31");
        await user.click(confirmButton);

        expect(mockMutate).toHaveBeenCalled();
    });

    it('calls handleClose when cancel button is clicked', async () => {
        const user = userEvent.setup();
        const mockHandleClose = vi.fn();
        const { getByRole } = renderWithQueryClientProvider(
            <ItemEditDialog
                itemId="test-id"
                mutate={() => { }}
                open={true}
                onClose={mockHandleClose}
            />
        );

        const cancelButton = getByRole("button", { name: "Cancel" });
        await user.click(cancelButton);

        expect(mockHandleClose).toHaveBeenCalled();
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

    it('hidden input has correct itemId', () => {
        renderWithQueryClientProvider(<ItemEditDialog
            itemId="test-id"
            mutate={() => { }}
            open={true}
            onClose={() => { }}
        />);

        const hiddenInput = document.querySelector('input[name="id"]') as HTMLInputElement;
        expect(hiddenInput?.value).toBe("test-id");
    });
});