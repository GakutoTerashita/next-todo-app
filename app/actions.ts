"use server";

import { dbCreateTodoItem, dbDeleteTodoItem, dbFetchAllTodoItems } from "@/lib/db/todo-items";
import * as z from "zod/v4";

export const getTodoItems = async () => {
    const todoItems = await dbFetchAllTodoItems();
    return todoItems;
};

export const registerTodoItem = async (formData: FormData) => {
    const schema = z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().optional().nullable(),
        deadline: z.string().optional().nullable(),
    });
    const parsedData = schema.safeParse(Object.fromEntries(formData));

    if (!parsedData.success) {
        throw new Error("Invalid form data");
    }

    await dbCreateTodoItem({
        title: parsedData.data.title,
        description: parsedData.data.description || '',
        deadline: parsedData.data.deadline ? new Date(parsedData.data.deadline) : null,
    });

    return;
};

export const deleteTodoItem = async (FormData: FormData) => {
    const schema = z.object({
        id: z.string().min(1, "ID is required"),
    });
    const parsedData = schema.safeParse(Object.fromEntries(FormData));

    if (!parsedData.success) {
        throw new Error("Invalid form data");
    }

    const { id } = parsedData.data;
    await dbDeleteTodoItem(id);
    return;
};