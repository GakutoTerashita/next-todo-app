'use client';

import { fetchTodoItems } from "@/lib/api/todo-items";
import { todo_item } from "@prisma/client";
import { useEffect, useState } from "react";

const useTodoListItemList = () => {
    const [todoListItems, setTodoListItems] = useState<todo_item[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedItems = await fetchTodoItems();
                setTodoListItems(fetchedItems);
            } catch (error) {
                console.error("Failed to fetch todo items:", error);
                setTodoListItems([]);
            }
        };

        fetchData();
    }, []);

    return {
        todoListItems,
    };
};

export default useTodoListItemList;