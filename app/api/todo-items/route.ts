import { dbFetchAllTodoItems } from "@/lib/db/todo-items";
import { NextResponse } from "next/server";

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
