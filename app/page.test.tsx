import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup, waitFor } from "@testing-library/react";
import Home from "./page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getTodoItems, registerTodoItem } from "./actions";
import { renderWithQueryClientProvider } from "@/test/utils";

vi.mock('@/app/actions', async (importOriginal) => ({
    ...await importOriginal<typeof import('@/app/actions')>(),
    getTodoItems: vi.fn(),
    registerTodoItem: vi.fn(),
}));

const MockRegisterTodoItem = vi.mocked(registerTodoItem); // Internally used by ItemRegistrationForm
const MockGetTodoItems = vi.mocked(getTodoItems);

describe('Root Page', () => {
    afterEach(() => {
        cleanup();
    });

    beforeEach(() => {
        MockGetTodoItems.mockClear();
    });

    it('fetches and displays todo items', async () => {
        const mockItems = [
            { id: '1', title: 'Item 1', description: 'Description 1', deadline: new Date(), completed: false },
            { id: '2', title: 'Item 2', description: 'Description 2', deadline: new Date(), completed: true },
        ];

        MockGetTodoItems.mockResolvedValueOnce(mockItems);

        const result = renderWithQueryClientProvider(<Home />);

        await waitFor(async () => {
            expect(await result.findByText('Item 1'));
            expect(await result.findByText('Item 2'));
        });
    });

    it('renders the item registration form', async () => {
        const mockItems = [
            { id: '1', title: 'Item 1', description: 'Description 1', deadline: new Date(), completed: false },
            { id: '2', title: 'Item 2', description: 'Description 2', deadline: new Date(), completed: true },
        ];

        MockGetTodoItems.mockResolvedValueOnce(mockItems);

        const queryClient = new QueryClient();
        const result = render(
            <QueryClientProvider client={queryClient}>
                <Home />
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(result.getByRole('textbox', { name: 'title' }));
            expect(result.getByRole('textbox', { name: 'description' }));
            expect(result.getByLabelText('deadline'));
            expect(result.getByRole('button', { name: 'Add Item' }));
        });
    });
});