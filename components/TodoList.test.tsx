import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import TodoList from "./TodoList";
import { todo_item } from "@prisma/client";

describe('TodoList', () => {
    afterEach(() => {
        cleanup();
    });

    it('should render a list of todo items', () => {
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
        const result = render(<TodoList items={items} />);

        const todoItems = result.getAllByRole('listitem');

        expect(todoItems).toHaveLength(2);
    });

    it('should render a divider between items', () => {
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

        const result = render(<TodoList items={items} />);
        const dividers = result.getAllByRole('separator');
        expect(dividers).toHaveLength(1); // One divider between two items
    });

    it('should handle empty todo list gracefully', () => {
        const items: todo_item[] = [];
        const result = render(<TodoList items={items} />);
        const todoItems = result.queryAllByRole('listitem');
        expect(todoItems).toHaveLength(0); // No items should be rendered
    });
});