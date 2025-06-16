import { todo_item } from "@prisma/client";

export const registerTodoItem = async (item: Omit<todo_item, 'id' | 'completed'>) => {
    const response = await fetch('/api/todo-items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
    });

    if (!response.ok) {
        throw new Error('Failed to register todo item');
    }

    return await response.json();
}