'use client';

import { registerTodoItem } from "@/lib/api/todo-items";
import { todo_item } from "@prisma/client";
import { Dayjs } from "dayjs";
import { useState } from "react";

const useTodoListItemRegistration = (
    onRegistered?: () => void
) => {
    const [loading, setLoading] = useState(false);

    const register = async (
        title: string,
        description: string,
        deadline: Dayjs | null
    ): Promise<todo_item> => {

        setLoading(true);

        const newTodoItem: Omit<todo_item, "id" | "completed"> = {
            title,
            description,
            deadline: deadline ? deadline.toDate() : null,
        };

        try {
            const result = await registerTodoItem(newTodoItem);
            setLoading(false);
            onRegistered?.();
            return result;
        } catch (error) {
            console.error("Failed to register todo item:", error);
            setLoading(false);
            throw error;
        }
    };

    return {
        loading,
        register,
    };
};

export default useTodoListItemRegistration;