'use client';

import { registerTodoItem } from "@/lib/api/todo-items";
import useFetch from "./useFetch";

const useTodoListItemRegistration = (
    onRegistered?: () => void
) => {
    const {
        data: registeredTodoItem,
        loading,
        error,
        executeFetch,
    } = useFetch(
        registerTodoItem,
        (error) => {
            console.error("Error registering todo item:", error);
        },
        onRegistered,
    )

    return {
        registeredTodoItem,
        loading,
        error,
        executeRegistration: executeFetch,
    };
};

export default useTodoListItemRegistration;