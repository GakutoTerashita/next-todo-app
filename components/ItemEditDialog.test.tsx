import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ItemEditDialog from "./ItemEditDialog";

describe("ItemEditDialog", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it('has correct form inputs', () => {
        const { getByLabelText } = render(
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
        const { getByRole } = render(
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
        const { getByRole, getByLabelText } = render(
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
        const { getByRole } = render(
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

    it('hidden input has correct itemId', () => {
        render(<ItemEditDialog
            itemId="test-id"
            mutate={() => { }}
            open={true}
            onClose={() => { }}
        />);

        const hiddenInput = document.querySelector('input[name="id"]') as HTMLInputElement;
        expect(hiddenInput?.value).toBe("test-id");
    });
});