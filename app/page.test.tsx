import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import Home from "./page";
import { fetchAllTodoItems } from "./actions/actions";

vi.mock('@/actions/actions', () => ({
    fetchAllTodoItems: vi.fn(),
}));

const MockFetchAllTodoItems = vi.mocked(fetchAllTodoItems);

describe('Root Page', () => {
    afterEach(() => {
        cleanup();
    });

    beforeEach(() => {
        MockFetchAllTodoItems.mockClear();
    });

    it('fetches and displays todo items', async () => {
        const mockItems = [
            { id: '1', title: 'Item 1', description: 'Description 1', deadline: new Date(), completed: false },
            { id: '2', title: 'Item 2', description: 'Description 2', deadline: new Date(), completed: true },
        ];

        MockFetchAllTodoItems.mockResolvedValueOnce(mockItems);

        const result = render(<Home />);

        expect(await result.findByText('Item 1'));
        expect(await result.findByText('Item 2'));
    });

    it('renders the item registration form', () => {
        const mockItems = [
            { id: '1', title: 'Item 1', description: 'Description 1', deadline: new Date(), completed: false },
            { id: '2', title: 'Item 2', description: 'Description 2', deadline: new Date(), completed: true },
        ];

        MockFetchAllTodoItems.mockResolvedValueOnce(mockItems);

        const result = render(<Home />);

        expect(result.getByRole('textbox', { name: 'title' }));
        expect(result.getByRole('textbox', { name: 'description' }));
        expect(result.getByLabelText('deadline'));
        expect(result.getByRole('button', { name: 'Add Item' }));
    });
});