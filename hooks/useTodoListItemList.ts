'use client';

import { fetchTodoItems } from "@/lib/api/todo-items";
import { todo_item } from "@prisma/client";
import { useEffect, useState } from "react";

const useTodoListItemList = () => {
    const [todoListItems, setTodoListItems] = useState<todo_item[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const fetchedItems = await fetchTodoItems();
                setTodoListItems(fetchedItems);
            } catch (error) {
                console.error("Failed to fetch todo items:", error);
                setTodoListItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return {
        todoListItems,
        loading,
    };
};

export default useTodoListItemList;