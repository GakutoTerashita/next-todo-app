import { describe, expect, it, vi } from "vitest";
import { registerTodoItem, getTodoItems } from "./todo-items";

vi.mock('@/lib/api/todo-items', () => ({
    registerTodoItem: vi.fn(),
    getTodoItems: vi.fn(),
}));

const MockRegisterTodoItem = vi.mocked(registerTodoItem);
const MockGetTodoItems = vi.mocked(getTodoItems);

describe('API wrapper', () => {
    describe('registerTodoItem', () => {
        describe('success case', () => {
            it('returns the registered todo item', async () => {
                const mockItem = {
                    title: "Test Item",
                    description: "This is a test item.",
                    deadline: new Date(),
                };

                MockRegisterTodoItem.mockResolvedValueOnce({
                    id: '1',
                    ...mockItem,
                    completed: false,
                });

                const result = await registerTodoItem(mockItem);
                expect(result).toEqual({
                    id: '1',
                    ...mockItem,
                    completed: false,
                });
            });
        });

        describe('failure case', () => {
            it('throws an error when the API call fails', async () => {
                const mockItem = {
                    title: "Test Item",
                    description: "This is a test item.",
                    deadline: new Date(),
                };

                MockRegisterTodoItem.mockRejectedValueOnce(new Error('Failed to register todo item'));

                await expect(registerTodoItem(mockItem)).rejects.toThrow('Failed to register todo item');
            });
        });
    });

    describe('getTodoItems', () => {
        describe('success case', () => {
            it('returns a list of todo items', async () => {
                const mockItems = [
                    { id: '1', title: 'Item 1', description: 'Description 1', deadline: new Date(), completed: false },
                    { id: '2', title: 'Item 2', description: 'Description 2', deadline: new Date(), completed: true },
                ];

                MockGetTodoItems.mockResolvedValueOnce(mockItems);

                const result = await getTodoItems();
                expect(result).toEqual(mockItems);
            });
        });
    });
});