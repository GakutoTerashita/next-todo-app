import { describe, expect, vi, beforeEach, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { dbFetchAllTodoItems } from "./todo-items";

vi.mock('@/lib/prisma', () => ({
    prisma: {
        todo_item: {
            findMany: vi.fn()
        }
    }
}));

const mockFindMany = vi.mocked(prisma.todo_item.findMany);

describe('dbFetchAllTodoItems', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockFindMany.mockReset();
    });

    it('fetches all todo items from the database', async () => {
        const mockTodoItems = [
            {
                id: '1',
                title: 'Test Todo 1',
                description: 'Description 1',
                deadline: null,
                completed: false,
            },
            {
                id: '2',
                title: 'Test Todo 2',
                description: 'Description 2',
                deadline: null,
                completed: true,
            },
        ];

        mockFindMany.mockResolvedValue(mockTodoItems);

        const todoItems = await dbFetchAllTodoItems();

        expect(todoItems).toEqual(mockTodoItems);
        expect(mockFindMany).toHaveBeenCalledTimes(1);
    });
});