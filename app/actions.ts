"use server";

import { prisma } from "@/lib/prisma";

export const getTodoItems = async () => {
    const todoItems = await prisma.todo_item.findMany();
    return todoItems;
};