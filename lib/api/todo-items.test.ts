import { describe, expect, it, vi } from "vitest";
import { registerTodoItem } from "./todo-items";

vi.mock('@/lib/api/todo-items', () => ({
    registerTodoItem: vi.fn(),
}));

const MockRegisterTodoItem = vi.mocked(registerTodoItem);

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
});