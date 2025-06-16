import { dbCreateTodoItem, dbFetchAllTodoItems } from "@/lib/db/todo-items";
import { NextRequest, NextResponse } from "next/server";

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
    try {
        const {
            title,
            description,
            deadline,
        } = await request.json();
        const todoItem = await dbCreateTodoItem({
            title,
            description,
            deadline,
        });
        return NextResponse.json(todoItem);
    } catch (error) {
        console.error("Error creating todo item:", error);
        return NextResponse.json(
            { error: "Failed to create todo item" },
            { status: 500 }
        );
    }
};