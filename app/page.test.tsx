import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup, screen } from "@testing-library/react";
import Home from "./page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getTodoItems } from "./actions";
import { renderWithQueryClientProvider } from "@/test/utils";

vi.mock('@/app/actions', async (importOriginal) => ({
    ...await importOriginal<typeof import('@/app/actions')>(),
    getTodoItems: vi.fn(),
    registerTodoItem: vi.fn(),
}));

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

        renderWithQueryClientProvider(<Home />);

        expect(await screen.findByText('Item 1')).toBeInTheDocument();
        expect(await screen.findByText('Item 2')).toBeInTheDocument();
    });

    it('renders the item registration form', async () => {
        const mockItems = [
            { id: '1', title: 'Item 1', description: 'Description 1', deadline: new Date(), completed: false },
            { id: '2', title: 'Item 2', description: 'Description 2', deadline: new Date(), completed: true },
        ];

        MockGetTodoItems.mockResolvedValueOnce(mockItems);

        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <Home />
            </QueryClientProvider>
        );

        expect(await screen.findByRole('textbox', { name: 'title' })).toBeInTheDocument();
        expect(await screen.findByRole('textbox', { name: 'description' })).toBeInTheDocument();
        expect(await screen.findByLabelText('deadline')).toBeInTheDocument();
        expect(await screen.findByRole('button', { name: 'Add Item' })).toBeInTheDocument();
    });
});