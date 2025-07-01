import { describe, expect, vi, beforeEach, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { dbCreateTodoItem, dbDeleteTodoItem, dbFetchAllTodoItems, dbCompleteTodoItem, dbUncompleteTodoItem, dbFetchTodoItemById, dbUpdateTodoItem, dbFetchAllTodoItemsCompleted } from "./todo-items";

vi.mock('@/lib/prisma', () => ({
    prisma: {
        todo_item: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
            create: vi.fn(),
            delete: vi.fn(),
            update: vi.fn(),
        },
    }
}));

const mockFindMany = vi.mocked(prisma.todo_item.findMany);
const mockFindUnique = vi.mocked(prisma.todo_item.findUnique);
const mockCreate = vi.mocked(prisma.todo_item.create);
const mockDelete = vi.mocked(prisma.todo_item.delete);
const mockUpdate = vi.mocked(prisma.todo_item.update);

describe('dbFetchAllTodoItems', () => {
    describe('success case', () => {
        beforeEach(() => {
            vi.clearAllMocks();
            mockFindMany.mockReset();
        });

        it('returns fetched items', async () => {
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

describe('dbFetchTodoItemsCompleted', () => {
    describe('success case', () => {
        it('returns fetched items', async () => {
            const mockTodoItems = [
                {
                    id: '1',
                    title: 'Test Todo 1',
                    description: 'Description 1',
                    deadline: null,
                    completed: true,
                },
                {
                    id: '2',
                    title: 'Test Todo 2',
                    description: 'Description 2',
                    deadline: null,
                    completed: true,
                }
            ];
            const shouldBe = mockTodoItems.filter(item => item.completed);
            mockFindMany.mockResolvedValue(mockTodoItems);

            const todoItems = await dbFetchAllTodoItemsCompleted();

            expect(todoItems).toEqual(shouldBe);
        });
    });
});

describe('dbFetchTodoItemById', () => {
    describe('success case', () => {
        beforeEach(() => {
            vi.clearAllMocks();
            mockFindUnique.mockReset();
        });

        it('returns fetched items, calls where id', async () => {
            const mockTodoItem = {
                id: '1',
                title: 'Test Todo',
                description: 'Description',
                deadline: null,
                completed: false,
            };

            mockFindUnique.mockResolvedValue(mockTodoItem);

            const todoItem = await dbFetchTodoItemById('1');

            expect(todoItem).toEqual(mockTodoItem);
            expect(mockFindUnique).toHaveBeenCalledTimes(1);
            expect(mockFindUnique).toHaveBeenCalledWith({
                where: { id: '1' },
            });
        });
    });

    describe('failure case', () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('returns null when no todo item is found by ID', async () => {
            mockFindUnique.mockResolvedValue(null);

            const todoItem = await dbFetchTodoItemById('1');

            expect(todoItem).toBeNull();
            expect(mockFindUnique).toHaveBeenCalledTimes(1);
            expect(mockFindUnique).toHaveBeenCalledWith({
                where: { id: '1' },
            });
        });

        it('throws an error when database query fails', async () => {
            mockFindUnique.mockRejectedValue(new Error("Database error"));

            await expect(dbFetchTodoItemById('1')).rejects.toThrow("Database error");
            expect(mockFindUnique).toHaveBeenCalledTimes(1);
            expect(mockFindUnique).toHaveBeenCalledWith({
                where: { id: '1' },
            });
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
            });

            expect(todoItem).toEqual(mockTodoItem);
            expect(mockCreate).toHaveBeenCalledTimes(1);
            expect(mockCreate).toHaveBeenCalledWith({
                data: {
                    title: 'Test Todo',
                    description: 'Description',
                    deadline: null,
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
            })).rejects.toThrow("Database error");

            expect(mockCreate).toHaveBeenCalledTimes(1);
        });
    });
});

describe('dbDeleteTodoItem', () => {
    describe('success case', () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('deletes a todo item from the database', async () => {
            const mockTodoItem = {
                id: '1',
                title: 'Test Todo',
                description: 'Description',
                deadline: null,
                completed: false,
            };

            mockDelete.mockResolvedValue(mockTodoItem);

            const deletedItem = await dbDeleteTodoItem('1');

            expect(deletedItem).toEqual(mockTodoItem);
            expect(mockDelete).toHaveBeenCalledTimes(1);
            expect(mockDelete).toHaveBeenCalledWith({
                where: { id: '1' },
            });
        });
    });

    describe('failure case', () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('throws an error when deleting a todo item fails', async () => {
            mockDelete.mockRejectedValue(new Error("Database error"));

            await expect(dbDeleteTodoItem('1')).rejects.toThrow("Database error");
            expect(mockDelete).toHaveBeenCalledTimes(1);
            expect(mockDelete).toHaveBeenCalledWith({
                where: { id: '1' },
            });
        });
    });
});

describe('dbCompleteTodoItem', () => {
    describe('success case', () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('sets the completion status of a todo item true', async () => {
            const mockTodoItem = {
                id: '1',
                title: 'Test Todo',
                description: 'Description',
                deadline: null,
                completed: false,
            };

            mockUpdate.mockResolvedValue({
                ...mockTodoItem,
                completed: true,
            });

            const updatedItem = await dbCompleteTodoItem('1');

            expect(updatedItem.completed).toBe(true);
            expect(mockUpdate).toHaveBeenCalledTimes(1);
            expect(mockUpdate).toHaveBeenCalledWith({
                where: { id: '1' },
                data: { completed: true },
            });
        });
    });

    describe('failure case', () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('throws an error when completing a todo item fails', async () => {
            mockUpdate.mockRejectedValue(new Error("Database error"));

            await expect(dbCompleteTodoItem('1')).rejects.toThrow("Database error");
            expect(mockUpdate).toHaveBeenCalledTimes(1);
            expect(mockUpdate).toHaveBeenCalledWith({
                where: { id: '1' },
                data: { completed: true },
            });
        });
    });
});

describe('dbUncompleteTodoItem', () => {
    describe('success case', () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('sets the completion status of a todo item false', async () => {
            const mockTodoItem = {
                id: '1',
                title: 'Test Todo',
                description: 'Description',
                deadline: null,
                completed: true,
            };

            mockUpdate.mockResolvedValue({
                ...mockTodoItem,
                completed: false,
            });

            const updatedItem = await dbUncompleteTodoItem('1');

            expect(updatedItem.completed).toBe(false);
            expect(mockUpdate).toHaveBeenCalledTimes(1);
            expect(mockUpdate).toHaveBeenCalledWith({
                where: { id: '1' },
                data: { completed: false },
            });
        });
    });

    describe('failure case', () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('throws an error when uncompleting a todo item fails', async () => {
            mockUpdate.mockRejectedValue(new Error("Database error"));

            await expect(dbUncompleteTodoItem('1')).rejects.toThrow("Database error");
            expect(mockUpdate).toHaveBeenCalledTimes(1);
            expect(mockUpdate).toHaveBeenCalledWith({
                where: { id: '1' },
                data: { completed: false },
            });
        });
    });
});

describe('dbUpdateTodoItem', () => {
    describe('success case', () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('updates a todo item in the database', async () => {
            const mockTodoItem = {
                id: '1',
                title: 'Updated Todo',
                description: 'Updated Description',
                deadline: null,
                completed: false,
            };

            mockUpdate.mockResolvedValue(mockTodoItem);

            const updatedItem = await dbUpdateTodoItem('1', {
                title: 'Updated Todo',
                description: 'Updated Description',
            });

            expect(updatedItem).toEqual(mockTodoItem);
            expect(mockUpdate).toHaveBeenCalledTimes(1);
            expect(mockUpdate).toHaveBeenCalledWith({
                where: { id: '1' },
                data: {
                    title: 'Updated Todo',
                    description: 'Updated Description',
                },
            });
        });
    });

    describe('failure case', () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('throws an error when updating a todo item fails', async () => {
            mockUpdate.mockRejectedValue(new Error("Database error"));

            await expect(dbUpdateTodoItem('1', { title: 'Updated Todo' })).rejects.toThrow("Database error");
            expect(mockUpdate).toHaveBeenCalledTimes(1);
        });
    });
});