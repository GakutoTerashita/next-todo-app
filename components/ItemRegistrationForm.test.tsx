import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import ItemRegistrationForm from "./ItemRegistrationForm";
import userEvent from "@testing-library/user-event";

describe('ItemRegistrationForm', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders 2 input fields with placeholders', () => {
        const result = render(<ItemRegistrationForm />);

        expect(result.getByRole('textbox', { name: 'title' }));
        expect(result.getByRole('textbox', { name: 'description' }));
    });

    it('renders a date picker', () => {
        const result = render(<ItemRegistrationForm />);

        const datePicker = result.getByLabelText('deadline');
        expect(datePicker.getAttribute('type')).toBe('date');
    });

    it('user input is reflected in the input fields', async () => {
        const user = userEvent.setup();
        const result = render(<ItemRegistrationForm />);

        const titleInput = result.getByRole('textbox', { name: 'title' }) as HTMLInputElement;
        const descriptionInput = result.getByRole('textbox', { name: 'description' }) as HTMLInputElement;
        const datePicker = result.getByLabelText('deadline') as HTMLInputElement;

        await user.type(titleInput, 'Test Item');
        await user.type(descriptionInput, 'This is a test item description.');
        await user.type(datePicker, '2023-10-01');

        expect(titleInput.value).toBe('Test Item');
        expect(descriptionInput.value).toBe('This is a test item description.');
        expect(datePicker.value).toBe('2023-10-01');
    });
});