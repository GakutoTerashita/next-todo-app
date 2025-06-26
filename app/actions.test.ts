import { dbFetchAllTodoItems, dbCreateTodoItem, dbDeleteTodoItem, dbCompleteTodoItem } from "@/lib/db/todo-items";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { completeTodoItem, deleteTodoItem, getTodoItems, registerTodoItem } from "./actions";

vi.mock('@/lib/db/todo-items', () => ({
    dbFetchAllTodoItems: vi.fn(),
    dbCreateTodoItem: vi.fn(),
    dbDeleteTodoItem: vi.fn(),
    dbCompleteTodoItem: vi.fn(),
}));

const mockDbFetchAllTodoItems = vi.mocked(dbFetchAllTodoItems);
const mockDbCreateTodoItem = vi.mocked(dbCreateTodoItem);
const mockDbDeleteTodoItem = vi.mocked(dbDeleteTodoItem);
const mockDbCompleteTodoItem = vi.mocked(dbCompleteTodoItem);

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
});
