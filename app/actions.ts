"use server";

import { dbCompleteTodoItem, dbCreateTodoItem, dbDeleteTodoItem, dbFetchAllTodoItems, dbFetchTodoItemById, dbUncompleteTodoItem, dbUpdateTodoItem } from "@/lib/db/todo-items";
import { todo_item } from "@prisma/client";
import * as z from "zod/v4";

export const getTodoItems = async (): Promise<todo_item[]> => {
    const todoItems = await dbFetchAllTodoItems();
    return todoItems;
};

export const getTodoItemById = async (id: string): Promise<todo_item | null> => {
    const todoItem = await dbFetchTodoItemById(id);
    return todoItem;
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

export const deleteTodoItem = async (formData: FormData) => {
    const schema = z.object({
        id: z.string().min(1, "ID is required"),
    });
    const parsedData = schema.safeParse(Object.fromEntries(formData));

    if (!parsedData.success) {
        throw new Error("Invalid form data");
    }

    const { id } = parsedData.data;
    await dbDeleteTodoItem(id);
    return;
};

export const completeTodoItem = async (formData: FormData) => {
    const schema = z.object({
        id: z.string().min(1, "ID is required"),
    });
    const parsedData = schema.safeParse(Object.fromEntries(formData));

    if (!parsedData.success) {
        throw new Error("Invalid form data");
    }

    const { id } = parsedData.data;
    await dbCompleteTodoItem(id);
    return;
};

export const uncompleteTodoItem = async (formData: FormData) => {
    const schema = z.object({
        id: z.string().min(1, "ID is required"),
    });
    const parsedData = schema.safeParse(Object.fromEntries(formData));

    if (!parsedData.success) {
        throw new Error("Invalid form data");
    }

    const { id } = parsedData.data;
    await dbUncompleteTodoItem(id);
    return;
};

export const updateTodoItem = async (formData: FormData) => {
    const schema = z.object({
        id: z.string().min(1, "ID is required"),
        title: z.string().min(1, "Title is required"),
        description: z.string().optional().nullable(),
        deadline: z.string().optional().nullable(),
    });
    const parsedData = schema.safeParse(Object.fromEntries(formData));

    if (!parsedData.success) {
        throw new Error("Invalid form data");
    }

    const { id, title, description, deadline } = parsedData.data;
    await dbUpdateTodoItem(id, {
        title,
        description: description || '',
        deadline: deadline ? new Date(deadline) : null,
    });

    return;
};