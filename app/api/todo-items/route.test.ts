import { dbFetchAllTodoItems } from '@/lib/db/todo-items';
import { todo_item } from '@prisma/client';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from './route';

vi.mock('@/lib/db/todo-items', () => ({
    dbFetchAllTodoItems: vi.fn(),
}));

const mockDbFetchAllTodoItems = vi.mocked(dbFetchAllTodoItems);

describe('GET /api/todo-items', () => {
    describe('success case', () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('respond with all todo items got', async () => {
            const mockTodoItems: todo_item[] = [
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
            mockDbFetchAllTodoItems.mockResolvedValue(mockTodoItems);
            const response = await GET();
            const body = await response.json();

            expect(response.status).toBe(200);
            expect(body).toEqual(mockTodoItems);
            expect(mockDbFetchAllTodoItems).toHaveBeenCalledTimes(1);
        });
    });
})