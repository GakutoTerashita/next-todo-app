'use client';

import { fetchTodoItems } from "@/lib/api/todo-items";
import useAutoFetch from "./useAsync";

const useTodoListItemList = () => {
    const {
        data: fetchedTodoItems,
        loading,
        error,
    } = useAutoFetch(
        fetchTodoItems,
        (error) => {
            console.error("Error fetching todo items:", error);
        }
    );

    return {
        todoListItems: fetchedTodoItems || [],
        loading,
        error,
    };
};

export default useTodoListItemList;