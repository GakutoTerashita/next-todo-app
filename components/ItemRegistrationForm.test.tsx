import { cleanup, render, screen, waitFor } from "@testing-library/react";
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
        renderWithQueryClientProvider(<ItemRegistrationForm />);

        expect(screen.getByRole('textbox', { name: 'title' })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'description' })).toBeInTheDocument();
    });

    it('renders a date picker', () => {
        renderWithQueryClientProvider(<ItemRegistrationForm />);

        const datePicker = screen.getByLabelText('deadline');
        expect(datePicker).toHaveAttribute('type', 'date');
    });

    it('user input is reflected in the input fields', async () => {
        const user = userEvent.setup();
        renderWithQueryClientProvider(<ItemRegistrationForm />);

        const titleInput = screen.getByRole('textbox', { name: 'title' }) as HTMLInputElement;
        const descriptionInput = screen.getByRole('textbox', { name: 'description' }) as HTMLInputElement;
        const datePicker = screen.getByLabelText('deadline') as HTMLInputElement;

        await user.type(titleInput, 'Test Item');
        await user.type(descriptionInput, 'This is a test item description.');
        await user.type(datePicker, '2023-10-01');

        expect(titleInput).toHaveValue('Test Item');
        expect(descriptionInput).toHaveValue('This is a test item description.');
        expect(datePicker).toHaveValue('2023-10-01');
    });

    it('performs registeration on form submission', async () => {
        const user = userEvent.setup();
        renderWithQueryClientProvider(<ItemRegistrationForm />);

        const titleInput = screen.getByRole('textbox', { name: 'title' }) as HTMLInputElement;
        const descriptionInput = screen.getByRole('textbox', { name: 'description' }) as HTMLInputElement;
        const datePicker = screen.getByLabelText('deadline') as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: 'Add Item' });

        mockRegisterTodoItem.mockResolvedValue(undefined);

        await user.type(titleInput, 'Test Item');
        await user.type(descriptionInput, 'This is a test item description.');
        await user.type(datePicker, '2023-10-01');
        await user.click(submitButton);

        expect(mockRegisterTodoItem).toHaveBeenCalled();
    });

    it('clears input fields after successful registration', async () => {
        const user = userEvent.setup();
        renderWithQueryClientProvider(<ItemRegistrationForm />);

        const titleInput = screen.getByRole('textbox', { name: 'title' }) as HTMLInputElement;
        const descriptionInput = screen.getByRole('textbox', { name: 'description' }) as HTMLInputElement;
        const datePicker = screen.getByLabelText('deadline') as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: 'Add Item' });

        mockRegisterTodoItem.mockResolvedValue(undefined);

        await user.type(titleInput, 'Test Item');
        await user.type(descriptionInput, 'This is a test item description.');
        await user.type(datePicker, '2023-10-01');
        await user.click(submitButton);

        expect(titleInput).toHaveValue('');
        expect(descriptionInput).toHaveValue('');
        expect(datePicker).toHaveValue('');
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

        render(
            <QueryClientProvider client={queryClient}>
                <ItemRegistrationForm />
            </QueryClientProvider>
        );

        const titleInput = screen.getByRole('textbox', { name: 'title' }) as HTMLInputElement;
        const descriptionInput = screen.getByRole('textbox', { name: 'description' }) as HTMLInputElement;
        const datePicker = screen.getByLabelText('deadline') as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: 'Add Item' });

        await user.type(titleInput, 'Test Item');
        await user.type(descriptionInput, 'This is a test item description.');
        await user.type(datePicker, '2023-10-01');
        await user.click(submitButton);

        await waitFor(() => {
            expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['todoItems'] });
        });
    });

    it('button is disabled while mutation is in progress', async () => {
        const user = userEvent.setup();
        renderWithQueryClientProvider(<ItemRegistrationForm />);

        const titleInput = screen.getByRole('textbox', { name: 'title' }) as HTMLInputElement;
        const descriptionInput = screen.getByRole('textbox', { name: 'description' }) as HTMLInputElement;
        const datePicker = screen.getByLabelText('deadline') as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: 'Add Item' });

        mockRegisterTodoItem.mockImplementation(() => new Promise(() => { })); // Simulate a pending mutation

        await user.type(titleInput, 'Test Item');
        await user.type(descriptionInput, 'This is a test item description.');
        await user.type(datePicker, '2023-10-01');
        await user.click(submitButton);

        expect(submitButton).toBeDisabled();
    });
});