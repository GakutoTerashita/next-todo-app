import { dbCreateTodoItem, dbFetchAllTodoItems } from '@/lib/db/todo-items';
import { todo_item } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET, POST } from './route';
import { NextRequest } from 'next/server';

vi.mock('@/lib/db/todo-items', () => ({
    dbFetchAllTodoItems: vi.fn(),
    dbCreateTodoItem: vi.fn(),
}));

const mockDbFetchAllTodoItems = vi.mocked(dbFetchAllTodoItems);
const mockDbCreateTodoItem = vi.mocked(dbCreateTodoItem);

describe('GET /api/todo-items', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error');
    describe('success case', () => {
        beforeEach(() => {
            vi.clearAllMocks();
            consoleErrorSpy.mockClear();
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

    describe('failure case', () => {
        beforeEach(() => {
            vi.clearAllMocks();
            consoleErrorSpy.mockClear();
        });

        it('respond with 500 on error', async () => {
            consoleErrorSpy.mockImplementation(() => { });
            mockDbFetchAllTodoItems.mockRejectedValue(new Error("Database error"));
            const response = await GET();
            const body = await response.json();

            expect(response.status).toBe(500);
            expect(body).toEqual({ error: "Failed to fetch todo items" });
            expect(mockDbFetchAllTodoItems).toHaveBeenCalledTimes(1);
        });
    });
});

describe('POST /api/todo-items', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error');
    describe('success case', () => {
        beforeEach(() => {
            vi.clearAllMocks();
            consoleErrorSpy.mockClear();
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
            consoleErrorSpy.mockClear();
        });

        it('responds with 500 on error', async () => {
            consoleErrorSpy.mockImplementation(() => { });
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