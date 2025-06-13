import { prisma } from "@/lib/prisma";
import { todo_item } from "@prisma/client";

export const dbFetchAllTodoItems = async (): Promise<todo_item[]> => {
    const todoItems = await prisma.todo_item.findMany();
    return todoItems;
}

export const dbCreateTodoItem = async (data: Omit<todo_item, 'id'>): Promise<todo_item> => {
    const newTodoItem = await prisma.todo_item.create({
        data: {
            title: data.title,
            description: data.description,
            deadline: data.deadline,
            completed: data.completed,
        },
    });
    return newTodoItem;
}