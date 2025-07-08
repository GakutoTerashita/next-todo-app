import { describe, expect, vi, beforeEach, it, afterAll, beforeAll } from "vitest";
import { dbCreateTodoItem, dbDeleteTodoItem, dbFetchAllTodoItems, dbCompleteTodoItem, dbUncompleteTodoItem, dbFetchTodoItemById, dbUpdateTodoItem, dbFetchAllTodoItemsCompleted } from "./todo-items";
import { PrismaClient } from "@prisma/client";
import { setupTestDb, teardownTestDB } from "./test-utils";

let prisma: PrismaClient;

vi.mock('@/lib/prisma', () => ({
    get prisma() {
        return prisma;
    }
}));

let dbName: string;

beforeAll(async () => {
    const setup = setupTestDb();
    prisma = setup.prisma;
    dbName = setup.dbName;
});

afterAll(async () => {
    await teardownTestDB(prisma, dbName);
});

beforeEach(async () => {
    await prisma.todo_item.deleteMany();
});

describe('dbFetchAllTodoItems', () => {
    describe('success case', () => {
        it('creates todo items', async () => {
            const data = [
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
            await prisma.todo_item.createMany({
                data,
            });


            const todoItems = await dbFetchAllTodoItems();

            expect(todoItems).toEqual(data);
        });
    })

    // describe('failure case', () => {
    //     beforeEach(() => {
    //         vi.clearAllMocks();
    //     });

    //     it('throws an error when database query fails', async () => {
    //         mockFindMany.mockRejectedValue(new Error("Database error"));

    //         await expect(dbFetchAllTodoItems()).rejects.toThrow("Database error");
    //         expect(mockFindMany).toHaveBeenCalledTimes(1);
    //     });
    // });
});

describe('dbFetchTodoItemsCompleted', () => {
    describe('success case', () => {
        it('fetches completed todo items', async () => {
            const data = [
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
            await prisma.todo_item.createMany({
                data
            });

            const shouldBe = data.filter(item => item.completed);

            const todoItems = await dbFetchAllTodoItemsCompleted();

            expect(todoItems).toEqual(shouldBe);
        });
    });
});

describe('dbFetchTodoItemById', () => {
    describe('success case', () => {
        it('fetches a todo item by ID', async () => {
            const data = {
                id: '1',
                title: 'Test Todo',
                description: 'Description',
                deadline: null,
                completed: false,
            };

            await prisma.todo_item.create({
                data,
            });

            const todoItem = await dbFetchTodoItemById('1');

            expect(todoItem).toEqual(data);
        });
    });

    // describe('failure case', () => {
    //     beforeEach(() => {
    //         vi.clearAllMocks();
    //     });

    //     it('returns null when no todo item is found by ID', async () => {
    //         mockFindUnique.mockResolvedValue(null);

    //         const todoItem = await dbFetchTodoItemById('1');

    //         expect(todoItem).toBeNull();
    //         expect(mockFindUnique).toHaveBeenCalledTimes(1);
    //         expect(mockFindUnique).toHaveBeenCalledWith({
    //             where: { id: '1' },
    //         });
    //     });

    //     it('throws an error when database query fails', async () => {
    //         mockFindUnique.mockRejectedValue(new Error("Database error"));

    //         await expect(dbFetchTodoItemById('1')).rejects.toThrow("Database error");
    //         expect(mockFindUnique).toHaveBeenCalledTimes(1);
    //         expect(mockFindUnique).toHaveBeenCalledWith({
    //             where: { id: '1' },
    //         });
    //     });
    // });
});

describe('dbCreateTodoItem', () => {
    describe('success case', () => {
        it('creates a new todo item in the database', async () => {
            const todoItem = await dbCreateTodoItem({
                title: 'Test Todo',
                description: 'Description',
                deadline: null,
            });

            const data = await prisma.todo_item.findUnique({
                where: { id: todoItem.id },
            });

            expect(todoItem).toEqual(data);
        });
    });

    // describe('failure case', () => {
    //     beforeEach(() => {
    //         vi.clearAllMocks();
    //     });

    //     it('throws an error when creating a todo item fails', async () => {
    //         mockCreate.mockRejectedValue(new Error("Database error"));

    //         await expect(dbCreateTodoItem({
    //             title: 'Test Todo',
    //             description: 'Description',
    //             deadline: null,
    //         })).rejects.toThrow("Database error");

    //         expect(mockCreate).toHaveBeenCalledTimes(1);
    //     });
    // });
});

describe('dbDeleteTodoItem', () => {
    describe('success case', () => {
        it('deletes a todo item from the database', async () => {
            const data = {
                id: '1',
                title: 'Test Todo',
                description: 'Description',
                deadline: null,
                completed: false,
            };

            await prisma.todo_item.create({
                data
            });

            const deletedItem = await dbDeleteTodoItem('1');

            expect(deletedItem).toEqual(data);

            const got = await prisma.todo_item.findUnique({
                where: { id: '1' },
            });

            expect(got).toBeNull();
        });
    });

    // describe('failure case', () => {
    //     beforeEach(() => {
    //         vi.clearAllMocks();
    //     });

    //     it('throws an error when deleting a todo item fails', async () => {
    //         mockDelete.mockRejectedValue(new Error("Database error"));

    //         await expect(dbDeleteTodoItem('1')).rejects.toThrow("Database error");
    //         expect(mockDelete).toHaveBeenCalledTimes(1);
    //         expect(mockDelete).toHaveBeenCalledWith({
    //             where: { id: '1' },
    //         });
    //     });
    // });
});

describe('dbCompleteTodoItem', () => {
    describe('success case', () => {
        it('sets the completion status of a todo item true', async () => {
            const data = {
                id: '1',
                title: 'Test Todo',
                description: 'Description',
                deadline: null,
                completed: false,
            };

            await prisma.todo_item.create({
                data
            });

            await dbCompleteTodoItem('1');

            const got = await prisma.todo_item.findUnique({
                where: { id: '1' },
            });

            expect(got).not.toBeNull();
            expect(got!.completed).toBe(true);
        });
    });

    // describe('failure case', () => {
    //     beforeEach(() => {
    //         vi.clearAllMocks();
    //     });

    //     it('throws an error when completing a todo item fails', async () => {
    //         mockUpdate.mockRejectedValue(new Error("Database error"));

    //         await expect(dbCompleteTodoItem('1')).rejects.toThrow("Database error");
    //         expect(mockUpdate).toHaveBeenCalledTimes(1);
    //         expect(mockUpdate).toHaveBeenCalledWith({
    //             where: { id: '1' },
    //             data: { completed: true },
    //         });
    //     });
    // });
});

describe('dbUncompleteTodoItem', () => {
    describe('success case', () => {
        it('sets the completion status of a todo item false', async () => {
            const data = {
                id: '1',
                title: 'Test Todo',
                description: 'Description',
                deadline: null,
                completed: true,
            };

            await prisma.todo_item.create({
                data
            });

            await dbUncompleteTodoItem('1');

            const got = await prisma.todo_item.findUnique({
                where: { id: '1' },
            });

            expect(got).not.toBeNull();
            expect(got!.completed).toBe(false);
        });
    });

    // describe('failure case', () => {
    //     beforeEach(() => {
    //         vi.clearAllMocks();
    //     });

    //     it('throws an error when uncompleting a todo item fails', async () => {
    //         mockUpdate.mockRejectedValue(new Error("Database error"));

    //         await expect(dbUncompleteTodoItem('1')).rejects.toThrow("Database error");
    //         expect(mockUpdate).toHaveBeenCalledTimes(1);
    //         expect(mockUpdate).toHaveBeenCalledWith({
    //             where: { id: '1' },
    //             data: { completed: false },
    //         });
    //     });
    // });
});

describe('dbUpdateTodoItem', () => {
    describe('success case', () => {
        it('updates a todo item data in the database', async () => {
            const data = {
                id: '1',
                title: 'Updated Todo',
                description: 'Updated Description',
                deadline: null,
                completed: false,
            };

            await prisma.todo_item.create({
                data
            });

            await dbUpdateTodoItem('1', {
                title: 'Updated Todo',
                description: 'Updated Description',
            });

            const got = await prisma.todo_item.findUnique({
                where: { id: '1' },
            });

            expect({
                ...got,
                title: 'Updated Todo',
                description: 'Updated Description',
            }).toEqual(data);
        });
    });

    // describe('failure case', () => {
    //     beforeEach(() => {
    //         vi.clearAllMocks();
    //     });

    //     it('throws an error when updating a todo item fails', async () => {
    //         mockUpdate.mockRejectedValue(new Error("Database error"));

    //         await expect(dbUpdateTodoItem('1', { title: 'Updated Todo' })).rejects.toThrow("Database error");
    //         expect(mockUpdate).toHaveBeenCalledTimes(1);
    //     });
    // });
});