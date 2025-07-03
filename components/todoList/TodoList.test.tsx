import { cleanup, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import TodoList from "./TodoList";
import { todo_item } from "@prisma/client";
import { renderWithQueryClientProvider } from "@/test/utils";

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

        renderWithQueryClientProvider(<TodoList todoItems={items} />);

        const todoItems = await screen.findAllByRole('listitem');
        expect(todoItems).toHaveLength(2);
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

        renderWithQueryClientProvider(<TodoList todoItems={items} />);

        const dividers = await screen.findAllByRole('separator');
        expect(dividers).toHaveLength(1); // One divider between two items
    });

    it('should handle empty todo list gracefully', async () => {
        const items: todo_item[] = [];

        renderWithQueryClientProvider(<TodoList todoItems={items} />);

        await waitFor(() => {
            expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
        });
        expect(screen.queryByText(/Error/i)).not.toBeInTheDocument();

        const todoItems = screen.queryAllByRole('listitem');
        expect(todoItems).toHaveLength(0); // No items should be rendered
    });
});