import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import ItemEditDialogContentsForm from "./ItemEditDialogContentsForm";
import { todo_item } from "@prisma/client";

describe("ItemEditDialogContentsForm", () => {
    afterEach(() => {
        cleanup();
    });

    const testItem: todo_item = {
        id: "test-id",
        title: "Test Item",
        description: "This is a test item.",
        deadline: new Date("2023-12-31"),
        completed: false,
    };

    it('has correct form inputs', () => {
        render(
            <ItemEditDialogContentsForm
                todoItem={testItem}
                action={() => { }}
                onClose={() => { }}
                pending={false}
            />
        );

        expect(screen.getByLabelText("Title")).toBeInTheDocument();
        expect(screen.getByLabelText("Description")).toBeInTheDocument();
        expect(screen.getByLabelText("Deadline")).toBeInTheDocument();
    })

    it('has confirm button', () => {
        render(
            <ItemEditDialogContentsForm
                todoItem={testItem}
                action={() => { }}
                onClose={() => { }}
                pending={false}
            />
        );

        expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
    });

    it('calls the mutate function when confirm button is clicked', async () => {
        const user = userEvent.setup();
        const mockMutate = vi.fn();
        render(
            <ItemEditDialogContentsForm
                todoItem={testItem}
                action={mockMutate}
                onClose={() => { }}
                pending={false}
            />
        );

        const titleInput = screen.getByLabelText("Title");
        const descriptionInput = screen.getByLabelText("Description");
        const deadlineInput = screen.getByLabelText("Deadline");
        const confirmButton = screen.getByRole("button", { name: "Confirm" });

        await user.type(titleInput, "New Title");
        await user.type(descriptionInput, "New Description");
        await user.type(deadlineInput, "2023-12-31");
        await user.click(confirmButton);

        expect(mockMutate).toHaveBeenCalled();
    });

    it('calls handleClose when cancel button is clicked', async () => {
        const user = userEvent.setup();
        const mockHandleClose = vi.fn();
        render(
            <ItemEditDialogContentsForm
                todoItem={testItem}
                action={() => { }}
                onClose={mockHandleClose}
                pending={false}
            />
        );

        const cancelButton = screen.getByRole("button", { name: "Cancel" });
        await user.click(cancelButton);

        expect(mockHandleClose).toHaveBeenCalled();
    });
});