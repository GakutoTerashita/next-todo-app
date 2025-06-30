import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
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
        const { getByLabelText } = render(
            <ItemEditDialogContentsForm
                todoItem={testItem}
                submitAction={() => { }}
                onClose={() => { }}
            />
        );

        expect(getByLabelText("Title")).toBeInTheDocument();
        expect(getByLabelText("Description")).toBeInTheDocument();
        expect(getByLabelText("Deadline")).toBeInTheDocument();
    })

    it('has confirm button', () => {
        const { getByRole } = render(
            <ItemEditDialogContentsForm
                todoItem={testItem}
                submitAction={() => { }}
                onClose={() => { }}
            />
        );

        expect(getByRole("button", { name: "Confirm" })).toBeInTheDocument();
    });

    it('calls the mutate function when confirm button is clicked', async () => {
        const user = userEvent.setup();
        const mockMutate = vi.fn();
        const { getByRole, getByLabelText } = render(
            <ItemEditDialogContentsForm
                todoItem={testItem}
                submitAction={mockMutate}
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
        const { getByRole } = render(
            <ItemEditDialogContentsForm
                todoItem={testItem}
                submitAction={() => { }}
                onClose={mockHandleClose}
            />
        );

        const cancelButton = getByRole("button", { name: "Cancel" });
        await user.click(cancelButton);

        expect(mockHandleClose).toHaveBeenCalled();
    });

    it('hidden input has correct itemId', () => {
        render(<ItemEditDialogContentsForm
            todoItem={testItem}
            submitAction={() => { }}
            onClose={() => { }}
        />);

        const hiddenInput = document.querySelector('input[name="id"]') as HTMLInputElement;
        expect(hiddenInput?.value).toBe("test-id");
    });
});