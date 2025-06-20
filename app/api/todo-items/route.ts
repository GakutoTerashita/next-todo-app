import { dbCreateTodoItem, dbFetchAllTodoItems } from "@/lib/db/todo-items";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod/v4";

// GET returns all todo items
export const GET = async (): Promise<NextResponse> => {
    try {
        const todoItems = await dbFetchAllTodoItems();
        return NextResponse.json(todoItems);
    } catch (error) {
        console.error("Error fetching todo items:", error);
        return NextResponse.json(
            { error: "Failed to fetch todo items" },
            { status: 500 }
        );
    }
};

// POST creates a new todo item
export const POST = async (request: NextRequest): Promise<NextResponse> => {
    const schema = z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().optional().nullable(),
        deadline: z.date().optional().nullable(),
    });

    try {
        const body = await request.json();
        const parsedBody = schema.parse(body);
        const todoItem = await dbCreateTodoItem({
            title: parsedBody.title,
            description: parsedBody.description || '',
            deadline: parsedBody.deadline || null,
        });
        return NextResponse.json(todoItem);
    } catch (error) {
        console.error("Error creating todo item:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid request data" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Failed to create todo item" },
            { status: 500 }
        );
    }
};