import { prisma } from "@/lib/prisma";
import { todo_item } from "@prisma/client";

export const dbFetchAllTodoItems = async (): Promise<todo_item[]> => {
    const todoItems = await prisma.todo_item.findMany();
    return todoItems;
}

export const dbCreateTodoItem = async (data: Omit<todo_item, 'id' | 'completed'>): Promise<todo_item> => {
    const newTodoItem = await prisma.todo_item.create({
        data: {
            title: data.title,
            description: data.description,
            deadline: data.deadline,
        },
    });
    return newTodoItem;
}

export const dbDeleteTodoItem = async (id: string): Promise<todo_item> => {
    const deletedTodoItem = await prisma.todo_item.delete({
        where: { id },
    });
    return deletedTodoItem;
};