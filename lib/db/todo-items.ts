import { prisma } from "@/lib/prisma";
import { todo_item } from "@prisma/client";

export const dbFetchAllTodoItems = async (): Promise<todo_item[]> => {
    const todoItems = await prisma.todo_item.findMany();
    return todoItems;
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
