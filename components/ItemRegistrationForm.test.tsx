import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ItemRegistrationForm from "./ItemRegistrationForm";
import userEvent from "@testing-library/user-event";
import { registerTodoItem } from "@/app/actions";
import { renderWithQueryClientProvider } from "@/test/utils";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";

vi.mock('@/app/actions', () => ({
    registerTodoItem: vi.fn()
}));

vi.mock('@tanstack/react-query', async (importOriginal) => {
    // https://vitest.dev/api/vi.html#vi-mock
    // Doc says type will be inferred from the original import...
    // 
    // const original = await importOriginal();
    //
    // I tried above, but it does not work.
    const original = await importOriginal<typeof import('@tanstack/react-query')>();
    return {
        ...original,
        useQueryClient: vi.fn(),
    };
});

const mockRegisterTodoItem = vi.mocked(registerTodoItem);
const mockUseQueryClient = vi.mocked(useQueryClient);

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
        const result = renderWithQueryClientProvider(<ItemRegistrationForm />);

        expect(result.getByRole('textbox', { name: 'title' }));
        expect(result.getByRole('textbox', { name: 'description' }));
    });

    it('renders a date picker', () => {
        const result = renderWithQueryClientProvider(<ItemRegistrationForm />);

        const datePicker = result.getByLabelText('deadline');
        expect(datePicker.getAttribute('type')).toBe('date');
    });

    it('user input is reflected in the input fields', async () => {
        const user = userEvent.setup();
        const result = renderWithQueryClientProvider(<ItemRegistrationForm />);

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
        const result = renderWithQueryClientProvider(<ItemRegistrationForm />);

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
        const result = renderWithQueryClientProvider(<ItemRegistrationForm />);

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

    it('invalidates queries on successful registration', async () => {
        const user = userEvent.setup();

        const queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });
        const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
        mockUseQueryClient.mockReturnValue(queryClient);
        mockRegisterTodoItem.mockResolvedValue(undefined);

        const result = render(
            <QueryClientProvider client={queryClient}>
                <ItemRegistrationForm />
            </QueryClientProvider>
        );

        const titleInput = result.getByRole('textbox', { name: 'title' }) as HTMLInputElement;
        const descriptionInput = result.getByRole('textbox', { name: 'description' }) as HTMLInputElement;
        const datePicker = result.getByLabelText('deadline') as HTMLInputElement;
        const submitButton = result.getByRole('button', { name: 'Add Item' });

        await user.type(titleInput, 'Test Item');
        await user.type(descriptionInput, 'This is a test item description.');
        await user.type(datePicker, '2023-10-01');
        await user.click(submitButton);

        await waitFor(() => {
            expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['todoItems'] });
        });
    });
});