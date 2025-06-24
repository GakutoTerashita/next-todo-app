import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ItemRegistrationForm from "./ItemRegistrationForm";
import userEvent from "@testing-library/user-event";
import { registerTodoItem } from "@/app/actions";
import dayjs from "dayjs";

vi.mock('@/app/actions', () => ({
    registerTodoItem: vi.fn()
}));

const mockRegisterTodoItem = vi.mocked(registerTodoItem);

describe('ItemRegistrationForm', () => {
    beforeEach(() => {
        mockRegisterTodoItem.mockClear();
        vi.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        cleanup();
        vi.mocked(console.log).mockRestore();
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

    it('performs registeration on form submission', async () => {
        const user = userEvent.setup();
        const result = render(<ItemRegistrationForm />);

        const titleInput = result.getByRole('textbox', { name: 'title' }) as HTMLInputElement;
        const descriptionInput = result.getByRole('textbox', { name: 'description' }) as HTMLInputElement;
        const datePicker = result.getByLabelText('deadline') as HTMLInputElement;
        const submitButton = result.getByRole('button', { name: 'Add Item' });

        mockRegisterTodoItem.mockResolvedValue(undefined);

        await user.type(titleInput, 'Test Item');
        await user.type(descriptionInput, 'This is a test item description.');
        await user.type(datePicker, '2023-10-01');
        await user.click(submitButton);

        expect(mockRegisterTodoItem).toHaveBeenCalled();
    });

    it('clears input fields after successful registration', async () => {
        const user = userEvent.setup();
        const result = render(<ItemRegistrationForm />);

        const titleInput = result.getByRole('textbox', { name: 'title' }) as HTMLInputElement;
        const descriptionInput = result.getByRole('textbox', { name: 'description' }) as HTMLInputElement;
        const datePicker = result.getByLabelText('deadline') as HTMLInputElement;
        const submitButton = result.getByRole('button', { name: 'Add Item' });

        mockRegisterTodoItem.mockResolvedValue(undefined);

        await user.type(titleInput, 'Test Item');
        await user.type(descriptionInput, 'This is a test item description.');
        await user.type(datePicker, '2023-10-01');
        await user.click(submitButton);

        expect(titleInput.value).toBe('');
        expect(descriptionInput.value).toBe('');
        expect(datePicker.value).toBe('');
    });
});