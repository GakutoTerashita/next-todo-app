import { renderWithQueryClientProvider } from "@/test/utils";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";
import ItemCtrlButtons from "./ItemCtrlButtons";
import { beforeEach } from "node:test";
import { deleteTodoItem } from "@/app/actions/todo";

vi.mock('@/app/actions/todo', async (importOriginal) => ({
    ...await importOriginal<typeof import('@/app/actions/todo')>(),
    deleteTodoItem: vi.fn(),
}));
const mockDeleteTodoItem = vi.mocked(deleteTodoItem);

vi.mock('@tanstack/react-query', async (importOriginal) => ({
    ...await importOriginal<typeof import('@tanstack/react-query')>(),
    useQueryClient: vi.fn(),
}));
const mockUseQueryClient = vi.mocked(useQueryClient);

describe('delete button', () => {
    afterEach(() => {
        cleanup();
    })

    beforeEach(() => {
        mockDeleteTodoItem.mockClear();
    })

    describe('success case', () => {
        it('attempts to delete item on click', async () => {
            const user = userEvent.setup();

            renderWithQueryClientProvider(<ItemCtrlButtons completed={false} id="1" />);

            const deleteButton = screen.getByRole('button', { name: 'Delete' });
            await user.click(deleteButton);

            expect(mockDeleteTodoItem).toHaveBeenCalled();
        });

        it('invalidates the query after deletion', async () => {
            mockDeleteTodoItem.mockResolvedValue(undefined);

            const user = userEvent.setup();

            const queryClient = new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: false,
                    },
                },
            })
            mockUseQueryClient.mockReturnValue(queryClient);

            const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

            render(
                <QueryClientProvider client={queryClient}>
                    <ItemCtrlButtons completed={false} id="1" />
                </QueryClientProvider>
            );

            const deleteButton = screen.getByRole('button', { name: 'Delete' });
            await user.click(deleteButton);

            expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['todoItems'] });
        });
    });

    describe('failure case', () => {
        it('does not invalidate the query if deletion fails', async () => {
            mockDeleteTodoItem.mockRejectedValue(new Error('Deletion failed'));

            const user = userEvent.setup();

            const queryClient = new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: false,
                    },
                },
            });
            mockUseQueryClient.mockReturnValue(queryClient);

            const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

            render(
                <QueryClientProvider client={queryClient}>
                    <ItemCtrlButtons completed={false} id="1" />
                </QueryClientProvider>
            );

            const deleteButton = screen.getByRole('button', { name: 'Delete' });
            await user.click(deleteButton);

            expect(mockDeleteTodoItem).toHaveBeenCalled();
            expect(invalidateQueriesSpy).not.toHaveBeenCalled();
        });
    })
});
