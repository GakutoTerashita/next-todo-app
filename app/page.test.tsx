import { describe, expect, it, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { getTodoItems } from "@/lib/api/todo-items";
import Home from "./page";

vi.mock('@/lib/api/todo-items', () => ({
    getTodoItems: vi.fn(),
}));

const MockGetTodoItems = vi.mocked(getTodoItems);

describe('Root Page', () => {
    it('fetches and displays todo items', async () => {
        const mockItems = [
            { id: '1', title: 'Item 1', description: 'Description 1', deadline: new Date(), completed: false },
            { id: '2', title: 'Item 2', description: 'Description 2', deadline: new Date(), completed: true },
        ];

        MockGetTodoItems.mockResolvedValueOnce(mockItems);

        const result = render(<Home />);

        expect(await result.findByText('Item 1'));
        expect(await result.findByText('Item 2'));
    });

    it('renders the todoItems component', () => {
        throw new Error('This test is not implemented yet');
    });

    it('renders the item registration form', () => {
        throw new Error('This test is not implemented yet');
    });
});