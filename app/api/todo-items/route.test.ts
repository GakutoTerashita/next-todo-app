import { dbCreateTodoItem, dbFetchAllTodoItems } from '@/lib/db/todo-items';
import { todo_item } from '@prisma/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

vi.mock('@/lib/db/todo-items', () => ({
    dbCreateTodoItem: vi.fn(),
}));

const mockDbCreateTodoItem = vi.mocked(dbCreateTodoItem);

describe('POST /api/todo-items', () => {
    describe('success case', () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('creates a new todo item and responds with it', async () => {
            const mockTodoItem: todo_item = {
                id: '1',
                title: 'New Todo',
                description: 'New Description',
                deadline: null,
                completed: false,
            };
            mockDbCreateTodoItem.mockResolvedValue(mockTodoItem);

            const request = new NextRequest('http://localhost/api/todo-items', {
                method: 'POST',
                body: JSON.stringify({
                    title: 'New Todo',
                    description: 'New Description',
                    deadline: null,
                }),
                headers: { 'Content-Type': 'application/json' },
            });

            const response = await POST(request);
            const body = await response.json();

            expect(response.status).toBe(200);
            expect(body).toEqual(mockTodoItem);
            expect(mockDbCreateTodoItem).toHaveBeenCalledTimes(1);
        });
    });

    describe('failure case', () => {
        beforeEach(() => {
            vi.clearAllMocks();
            vi.spyOn(console, 'error').mockImplementation(() => { });
        });

        afterEach(() => {
            vi.mocked(console.error).mockRestore();
        });

        it('responds with 500 on error', async () => {
            mockDbCreateTodoItem.mockRejectedValue(new Error("Database error"));

            const request = new NextRequest('http://localhost/api/todo-items', {
                method: 'POST',
                body: JSON.stringify({
                    title: 'New Todo',
                    description: 'New Description',
                    deadline: null,
                }),
                headers: { 'Content-Type': 'application/json' },
            });

            const response = await POST(request);
            const body = await response.json();

            expect(response.status).toBe(500);
            expect(body).toEqual({ error: "Failed to create todo item" });
            expect(mockDbCreateTodoItem).toHaveBeenCalledTimes(1);
        });
    });
});