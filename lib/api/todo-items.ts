import { todo_item } from "@prisma/client";

export const registerTodoItem = async (
    item: Omit<todo_item, 'id' | 'completed'>
): Promise<todo_item> => {
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

    return await response.json().catch((error) => {
        console.error("Failed to parse response:", error);
        throw new Error('Failed to parse response from server');
    });
}

type ResponeTodoItem = Omit<todo_item, 'deadline'> & {
    deadline: string | null;
};
type GetTodoItemsResponse = ResponeTodoItem[];
export const getTodoItems = async (): Promise<todo_item[]> => {
    const response = await fetch('/api/todo-items', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch todo items');
    }

    const responseParsed: GetTodoItemsResponse = await response.json().catch((error) => {
        console.error("Failed to parse response:", error);
        throw new Error('Failed to parse response from server');
    });

    const todo_item = responseParsed.map((item) => {
        if (item.deadline) {
            return {
                ...item,
                deadline: new Date(item.deadline),
            };
        } else {
            return {
                ...item,
                deadline: null,
            };
        }
    });

    return todo_item;
}