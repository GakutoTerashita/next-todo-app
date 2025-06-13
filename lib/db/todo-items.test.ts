import { describe, expect, vi, beforeEach, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { dbCreateTodoItem, dbFetchAllTodoItems } from "./todo-items";

vi.mock('@/lib/prisma', () => ({
    prisma: {
        todo_item: {
            findMany: vi.fn(),
            create: vi.fn(),
        },
    }
}));

const mockFindMany = vi.mocked(prisma.todo_item.findMany);
const mockCreate = vi.mocked(prisma.todo_item.create);

describe('dbFetchAllTodoItems', () => {
    describe('success case', () => {
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
    })

    describe('failure case', () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('throws an error when database query fails', async () => {
            mockFindMany.mockRejectedValue(new Error("Database error"));

            await expect(dbFetchAllTodoItems()).rejects.toThrow("Database error");
            expect(mockFindMany).toHaveBeenCalledTimes(1);
        });
    });
});

describe('dbCreateTodoItem', () => {
    describe('success case', () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('creates a new todo item in the database', async () => {
            const mockTodoItem = {
                id: '1',
                title: 'Test Todo',
                description: 'Description',
                deadline: null,
                completed: false,
            };

            mockCreate.mockResolvedValue(mockTodoItem);

            const todoItem = await dbCreateTodoItem({
                title: 'Test Todo',
                description: 'Description',
                deadline: null,
                completed: false,
            });

            expect(todoItem).toEqual(mockTodoItem);
            expect(mockCreate).toHaveBeenCalledTimes(1);
            expect(mockCreate).toHaveBeenCalledWith({
                data: {
                    title: 'Test Todo',
                    description: 'Description',
                    deadline: null,
                    completed: false,
                },
            });
        });
    });

    describe('failure case', () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('throws an error when creating a todo item fails', async () => {
            mockCreate.mockRejectedValue(new Error("Database error"));

            await expect(dbCreateTodoItem({
                title: 'Test Todo',
                description: 'Description',
                deadline: null,
                completed: false,
            })).rejects.toThrow("Database error");

            expect(mockCreate).toHaveBeenCalledTimes(1);
        });
    });
});