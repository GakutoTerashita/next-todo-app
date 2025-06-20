"use server";

import { dbFetchAllTodoItems } from "@/lib/db/todo-items";
import { todo_item } from "@prisma/client";

export const fetchAllTodoItems = async (): Promise<todo_item[]> => {
    try {
        const result = await dbFetchAllTodoItems();
        return result;
    } catch (error) {
        console.error("Failed to fetch todo items:", error);
        throw new Error('Failed to fetch todo items');
    }
}