'use client';

import { registerTodoItem } from "@/lib/api/todo-items";
import { todo_item } from "@prisma/client";
import { useState } from "react";

const useTodoListItemRegistration = () => {
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState<Date | null>(null);

    const register = async (): Promise<todo_item> => {
        setLoading(true);
        const result = await registerTodoItem({
            title,
            description,
            deadline,
        }).catch((error) => {
            console.error("Failed to register todo item:", error);
            setLoading(false);
            throw error;
        });
        setLoading(false);
        return result;
    };

    return {
        loading,
        register,
        setTitle,
        setDescription,
        setDeadline,
    };
};

export default useTodoListItemRegistration;