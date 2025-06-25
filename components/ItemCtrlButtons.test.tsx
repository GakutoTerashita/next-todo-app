import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi, expect } from "vitest";
import ItemCtrlButtons from "./ItemCtrlButtons";
import { deleteTodoItem } from "@/app/actions";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import { renderWithQueryClientProvider } from "@/test/utils";

vi.mock('@/app/actions', async (importOriginal) => ({
    ...await importOriginal<typeof import('@/app/actions')>(),
    deleteTodoItem: vi.fn(),
}));

vi.mock('@tanstack/react-query', async (importOriginal) => ({
    ...await importOriginal<typeof import('@tanstack/react-query')>(),
    useQueryClient: vi.fn(),
}));

const mockDeleteTodoItem = vi.mocked(deleteTodoItem);
const mockUseQueryClient = vi.mocked(useQueryClient);

describe('ItemCtrlButtons', () => {
    afterEach(() => {
        cleanup();
    });

    beforeEach(() => {
        mockDeleteTodoItem.mockClear();
        mockUseQueryClient.mockClear();
    });

    it('renders buttons with correct labels', () => {
        const { getByRole } = renderWithQueryClientProvider(<ItemCtrlButtons completed={false} id="1" />);

        expect(getByRole('button', { name: 'Complete' }));
        expect(getByRole('button', { name: 'Edit' }));
        expect(getByRole('button', { name: 'Delete' }));

        cleanup();

        const { getByRole: getByRoleCompleted } = renderWithQueryClientProvider(<ItemCtrlButtons completed={true} id="2" />);
        expect(getByRoleCompleted('button', { name: 'Completed' }));
    });

    describe('delete button', () => {
        it('attempts to delete item on click', async () => {
            const user = userEvent.setup();

            const result = renderWithQueryClientProvider(<ItemCtrlButtons completed={false} id="1" />);

            const deleteButton = result.getByRole('button', { name: 'Delete' });
            await user.click(deleteButton);

            expect(mockDeleteTodoItem).toHaveBeenCalled();
        });

        describe('success case', () => {
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

                const result = render(
                    <QueryClientProvider client={queryClient}>
                        <ItemCtrlButtons completed={false} id="1" />
                    </QueryClientProvider>
                );

                const deleteButton = result.getByText('Delete');
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

                const result = render(
                    <QueryClientProvider client={queryClient}>
                        <ItemCtrlButtons completed={false} id="1" />
                    </QueryClientProvider>
                );

                const deleteButton = result.getByText('Delete');
                await user.click(deleteButton);

                expect(mockDeleteTodoItem).toHaveBeenCalled();
                expect(invalidateQueriesSpy).not.toHaveBeenCalled();
            });
        })
    });
});