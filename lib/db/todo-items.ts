import { prisma } from "@/lib/prisma";
import { Prisma, todo_item } from "@prisma/client";

const dbFetchTodoItems = async (options?: Prisma.todo_itemFindManyArgs): Promise<todo_item[]> => {
    const todoItems = await prisma.todo_item.findMany(options);
    return todoItems;
};

export const dbFetchAllTodoItems = async (): Promise<todo_item[]> => {
    const result = dbFetchTodoItems();
    return result;
};

export const dbFetchAllTodoItemsCompleted = async (): Promise<todo_item[]> => {
    const result = dbFetchTodoItems({
        where: { completed: true },
    });
    return result;
};

export const dbFetchAllTodoItemsUncompleted = async (): Promise<todo_item[]> => {
    const result = dbFetchTodoItems({
        where: { completed: false },
    });
    return result;
};

export const dbFetchTodoItemById = async (id: string): Promise<todo_item | null> => {
    const todoItem = await prisma.todo_item.findUnique({
        where: { id },
    });
    return todoItem;
};

export const dbCreateTodoItem = async (data: Omit<todo_item, 'id' | 'completed'>): Promise<todo_item> => {
    const newTodoItem = await prisma.todo_item.create({
        data: {
            title: data.title,
            description: data.description,
            deadline: data.deadline,
        },
    });
    return newTodoItem;
};

export const dbDeleteTodoItem = async (id: string): Promise<todo_item> => {
    const deletedTodoItem = await prisma.todo_item.delete({
        where: { id },
    });
    return deletedTodoItem;
};

export const dbCompleteTodoItem = async (id: string): Promise<todo_item> => {
    const updatedTodoItem = await prisma.todo_item.update({
        where: { id },
        data: { completed: true },
    });
    return updatedTodoItem;
};

export const dbUncompleteTodoItem = async (id: string): Promise<todo_item> => {
    const updatedTodoItem = await prisma.todo_item.update({
        where: { id },
        data: { completed: false },
    });
    return updatedTodoItem;
};

export const dbUpdateTodoItem = async (id: string, data: Partial<Omit<todo_item, 'id'>>): Promise<todo_item> => {
    const updatedTodoItem = await prisma.todo_item.update({
        where: { id },
        data,
    });
    return updatedTodoItem;
}
