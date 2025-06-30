import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ItemEditDialog from "./ItemEditDialog";
import { renderWithQueryClientProvider } from "@/test/utils";
import { getTodoItemById } from "@/app/actions";
import userEvent from "@testing-library/user-event";

vi.mock("@/app/actions", () => ({
    getTodoItemById: vi.fn(),
}));

const mockGetTodoItemById = vi.mocked(getTodoItemById);

describe("ItemEditDialog", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it('fetches the associated item data on dialog opened, and show them', async () => {
        mockGetTodoItemById.mockResolvedValue({
            id: "test-id",
            title: "Test Item",
            description: "This is a test item.",
            deadline: new Date("2024-12-31"),
            completed: false,
        });

        const mutate = vi.fn();
        const { getByText, getByLabelText } = renderWithQueryClientProvider(
            <ItemEditDialog
                itemId="test-id"
                mutate={mutate}
                open={true}
                onClose={() => { }}
            />
        );

        await waitFor(() => {
            expect(getByText("Edit TodoItem")).toBeInTheDocument();
            expect(getByLabelText("Title")).toHaveValue("Test Item");
            expect(getByLabelText("Description")).toHaveValue("This is a test item.");
            expect(getByLabelText("Deadline")).toHaveValue("2024-12-31");
        });
    });

    it('mutate function is called when confirm button in the dialog is clicked', async () => {
        const user = userEvent.setup();
        mockGetTodoItemById.mockResolvedValue({
            id: "test-id",
            title: "Test Item",
            description: "This is a test item.",
            deadline: new Date("2024-12-31"),
            completed: false,
        });

        const mutate = vi.fn().mockResolvedValue(true);

        const { getByRole, getByText } = renderWithQueryClientProvider(
            <ItemEditDialog
                itemId="test-id"
                mutate={mutate}
                open={true}
                onClose={() => { }}
            />
        );

        await waitFor(() => {
            expect(getByText("Edit TodoItem")).toBeInTheDocument();
        });

        // Simulate form submission
        const submitButton = getByRole("button", { name: /confirm/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mutate).toHaveBeenCalled();
        });
    });
});