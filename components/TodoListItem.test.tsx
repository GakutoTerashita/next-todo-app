import { todo_item } from "@prisma/client";
import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import TodoListItem from "./TodoListItem";
import { renderWithQueryClientProvider } from "@/test/utils";

describe('TodoListItem', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders title of item', () => {
        const item: todo_item = {
            id: "1",
            title: "Test Item",
            description: "This is a test item.",
            deadline: new Date("2023-10-01T00:00:00Z"),
            completed: false
        }
        renderWithQueryClientProvider(<TodoListItem item={item} />);

        expect(screen.getByText("Test Item")).toBeInTheDocument();
    });

    it('renders description of item', () => {
        const item: todo_item = {
            id: "2",
            title: "Another Item",
            description: "This is another test item.",
            deadline: new Date("2023-10-02T00:00:00Z"),
            completed: false
        }
        renderWithQueryClientProvider(<TodoListItem item={item} />);

        expect(screen.getByText("This is another test item.")).toBeInTheDocument();
    });

    it('renders deadline of item', () => {
        const item: todo_item = {
            id: "3",
            title: "Deadline Item",
            description: "This item has a deadline.",
            deadline: new Date("2023-10-03T00:00:00Z"),
            completed: false
        }
        renderWithQueryClientProvider(<TodoListItem item={item} />);

        expect(screen.getByText("Deadline: 2023/10/03")).toBeInTheDocument();
    });

    it('does not render deadline if it does not exist', () => {
        const item: todo_item = {
            id: "4",
            title: "No Deadline Item",
            description: "This item has no deadline.",
            deadline: null,
            completed: false
        }
        renderWithQueryClientProvider(<TodoListItem item={item} />);

        expect(screen.queryByText("Deadline:")).not.toBeInTheDocument();
    });

    it('renders item control buttons (complete, edit, delete)', () => {
        const item: todo_item = {
            id: "5",
            title: "Item with Controls",
            description: "This item has control buttons.",
            deadline: new Date("2023-10-04T00:00:00Z"),
            completed: false
        }
        renderWithQueryClientProvider(<TodoListItem item={item} />);

        expect(screen.getByRole('button', { name: /complete/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    })
});