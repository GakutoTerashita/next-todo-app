import { dbFetchAllTodoItems, dbCreateTodoItem, dbDeleteTodoItem, dbCompleteTodoItem, dbUncompleteTodoItem, dbUpdateTodoItem, dbFetchTodoItemById } from "@/lib/db/todo-items";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { completeTodoItem, deleteTodoItem, getTodoItemById, getTodoItems, registerTodoItem, uncompleteTodoItem, updateTodoItem } from "./actions";

vi.mock('@/lib/db/todo-items', () => ({
    dbFetchAllTodoItems: vi.fn(),
    dbFetchTodoItemById: vi.fn(),
    dbCreateTodoItem: vi.fn(),
    dbDeleteTodoItem: vi.fn(),
    dbCompleteTodoItem: vi.fn(),
    dbUncompleteTodoItem: vi.fn(),
    dbUpdateTodoItem: vi.fn(),
}));

const mockDbFetchAllTodoItems = vi.mocked(dbFetchAllTodoItems);
const mockDbFetchTodoItemById = vi.mocked(dbFetchTodoItemById);
const mockDbCreateTodoItem = vi.mocked(dbCreateTodoItem);
const mockDbDeleteTodoItem = vi.mocked(dbDeleteTodoItem);
const mockDbCompleteTodoItem = vi.mocked(dbCompleteTodoItem);
const mockDbUncompleteTodoItem = vi.mocked(dbUncompleteTodoItem);
const mockDbUpdateTodoItem = vi.mocked(dbUpdateTodoItem);

describe('Server Actions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getTodoItems', () => {
        it('attempts fetching all todo items', async () => {
            mockDbFetchAllTodoItems.mockResolvedValue([
                { id: '1', title: 'Test Todo 1', description: 'Description 1', deadline: null, completed: false },
                { id: '2', title: 'Test Todo 2', description: 'Description 2', deadline: null, completed: true },
            ]);

            const todoItems = await getTodoItems();

            expect(todoItems).toEqual([
                { id: '1', title: 'Test Todo 1', description: 'Description 1', deadline: null, completed: false },
                { id: '2', title: 'Test Todo 2', description: 'Description 2', deadline: null, completed: true },
            ]);
            expect(mockDbFetchAllTodoItems).toHaveBeenCalledTimes(1);
        });
    });

    describe('getTodoItemById', () => {
        it('attempts fetching a todo item by ID', async () => {
            const mockTodoItem = { id: '1', title: 'Test Todo', description: 'Test Description', deadline: null, completed: false };
            mockDbFetchTodoItemById.mockResolvedValue(mockTodoItem);

            const todoItem = await getTodoItemById('1');

            expect(todoItem).toEqual(mockTodoItem);
            expect(mockDbFetchTodoItemById).toHaveBeenCalledWith('1');
        });
    });

    describe('registerTodoItem', () => {
        it('attempts registeration of a new todo item', async () => {
            const formData = new FormData();
            formData.append('title', 'New Todo Item');
            formData.append('description', 'This is a new todo item');
            formData.append('deadline', '2023-12-31');

            await registerTodoItem(formData);

            expect(mockDbCreateTodoItem).toHaveBeenCalledWith({
                title: 'New Todo Item',
                description: 'This is a new todo item',
                deadline: new Date('2023-12-31'),
            });
        });
    });

    describe('deleteTodoItem', () => {
        it('attempts deletion of a todo item', async () => {
            const formData = new FormData();
            formData.append('id', '1');

            await deleteTodoItem(formData);

            expect(mockDbDeleteTodoItem).toHaveBeenCalledWith('1');
        });
    });

    describe('completeTodoItem', () => {
        it('attempts completiing a todo item', async () => {
            const formData = new FormData();
            formData.append('id', '1');

            await completeTodoItem(formData);

            expect(mockDbCompleteTodoItem).toHaveBeenCalledWith('1');
        });
    });

    describe('uncompleteTodoItem', () => {
        it('attempts uncompleting a todo item', async () => {
            const formData = new FormData();
            formData.append('id', '1');

            await uncompleteTodoItem(formData);

            expect(mockDbUncompleteTodoItem).toHaveBeenCalledWith('1');
        });
    });

    describe('updateTodoItem', () => {
        it('attempts updating a todo item', async () => {
            const formData = new FormData();
            formData.append('id', '1');
            formData.append('title', 'Updated Todo Item');
            formData.append('description', 'Updated description');
            formData.append('deadline', '2024-01-01');

            await updateTodoItem('1', formData);

            expect(mockDbUpdateTodoItem).toHaveBeenCalledWith('1', {
                title: 'Updated Todo Item',
                description: 'Updated description',
                deadline: new Date('2024-01-01'),
            });
        });
    });
});
