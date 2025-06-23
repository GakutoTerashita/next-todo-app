import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import TodoList from "./TodoList";
import { todo_item } from "@prisma/client";
import { getTodoItems } from "@/lib/api/todo-items";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock('@/lib/api/todo-items', () => ({
    getTodoItems: vi.fn(),
}));

const MockGetTodoItems = vi.mocked(getTodoItems);

describe('TodoList', () => {
    afterEach(() => {
        cleanup();
    });

    it('should render a list of todo items', async () => {
        const items: todo_item[] = [
            {
                id: '1',
                title: 'Test Todo 1',
                description: 'This is a test todo item 1',
                deadline: new Date('2023-10-01'),
                completed: false,
            },
            {
                id: '2',
                title: 'Test Todo 2',
                description: 'This is a test todo item 2',
                deadline: new Date('2023-10-02'),
                completed: false,
            }
        ]
        MockGetTodoItems.mockResolvedValueOnce(items);

        const queryClient = new QueryClient();
        const result = render(
            <QueryClientProvider client={queryClient}>
                <TodoList />
            </QueryClientProvider>
        );

        await waitFor(() => {
            const todoItems = result.getAllByRole('listitem');
            expect(todoItems).toHaveLength(2);
        });
    });

    it('should render a divider between items', async () => {
        const items: todo_item[] = [
            {
                id: '1',
                title: 'Test Todo 1',
                description: 'This is a test todo item 1',
                deadline: new Date('2023-10-01'),
                completed: false,
            },
            {
                id: '2',
                title: 'Test Todo 2',
                description: 'This is a test todo item 2',
                deadline: new Date('2023-10-02'),
                completed: false,
            }
        ];
        MockGetTodoItems.mockResolvedValueOnce(items);

        const queryClient = new QueryClient();
        const result = render(
            <QueryClientProvider client={queryClient}>
                <TodoList />
            </QueryClientProvider>
        );

        await waitFor(() => {
            const dividers = result.getAllByRole('separator');
            expect(dividers).toHaveLength(1); // One divider between two items
        });
    });

    it('should handle empty todo list gracefully', async () => {
        const items: todo_item[] = [];
        MockGetTodoItems.mockResolvedValueOnce(items);

        const queryClient = new QueryClient();
        const result = render(
            <QueryClientProvider client={queryClient}>
                <TodoList />
            </QueryClientProvider>
        );

        // await waitFor(() => {
        //     const loadText = result.getAllByText('Loading items...');
        //     expect(loadText.length).toBe(0);
        // })
        const todoItems = result.queryAllByRole('listitem');
        expect(todoItems).toHaveLength(0); // No items should be rendered
    });
});