import { prisma } from "@/lib/prisma";
import { todo_item } from "@prisma/client";

export const dbFetchAllTodoItems = async (): Promise<todo_item[]> => {
    const todoItems = await prisma.todo_item.findMany();
    return todoItems;
}