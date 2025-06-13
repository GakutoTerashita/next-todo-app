import { dbFetchAllTodoItems } from "@/lib/db/todo-items";
import { NextResponse } from "next/server";

// GET returns all todo items
export const GET = async (): Promise<NextResponse> => {
    const todoItems = await dbFetchAllTodoItems();
    return NextResponse.json(todoItems);
};
