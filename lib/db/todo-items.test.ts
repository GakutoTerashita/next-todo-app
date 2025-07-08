import { describe, expect, vi, beforeEach, it, afterAll, beforeAll } from "vitest";
import { dbCreateTodoItem, dbDeleteTodoItem, dbFetchAllTodoItems, dbCompleteTodoItem, dbUncompleteTodoItem, dbFetchTodoItemById, dbUpdateTodoItem, dbFetchAllTodoItemsCompleted } from "./todo-items";
import { PrismaClient } from "@prisma/client";
import { setupTestDb, teardownTestDB } from "./test-utils";

let prisma: PrismaClient;
let dbName: string;

vi.mock('@/lib/prisma', () => ({
    get prisma() {
        return prisma;
    }
}));

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
});


describe('dbFetchTodoItemsCompleted', () => {
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

describe('dbFetchTodoItemById', () => {
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


    it('returns null when no todo item is found by ID', async () => {

        const todoItem = await dbFetchTodoItemById('1');

        expect(todoItem).toBeNull();
    });

});

describe('dbCreateTodoItem', () => {
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

describe('dbDeleteTodoItem', () => {
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

describe('dbCompleteTodoItem', () => {
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

describe('dbUncompleteTodoItem', () => {
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

describe('dbUpdateTodoItem', () => {
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