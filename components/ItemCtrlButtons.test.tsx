import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi, expect } from "vitest";
import ItemCtrlButtons from "./ItemCtrlButtons";
import { deleteTodoItem } from "@/app/actions";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import { renderWithQueryClientProvider } from "@/test/utils";

vi.mock('@/app/actions', () => ({
    deleteTodoItem: vi.fn(),
}));

vi.mock('@tanstack/react-query', async (importOriginal) => {
    const original = await importOriginal<typeof import('@tanstack/react-query')>();
    return {
        ...original,
        useQueryClient: vi.fn(),
    };
});

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
        const { getByText } = render(<ItemCtrlButtons completed={false} id="1" />);

        expect(getByText('Complete'));
        expect(getByText('Edit'));
        expect(getByText('Delete'));

        cleanup();

        const { getByText: getByTextCompleted } = render(<ItemCtrlButtons completed={true} id="2" />);
        expect(getByTextCompleted('Completed'));
    });

    describe('delete button', () => {
        it('attempts to delete item on click', () => {
            const user = userEvent.setup();

            const result = renderWithQueryClientProvider(<ItemCtrlButtons completed={false} id="1" />);

            const deleteButton = result.getByText('Delete');
            user.click(deleteButton);

            expect(mockDeleteTodoItem).toHaveBeenCalledWith('1');
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

                const result = render(
                    <QueryClientProvider client={queryClient}>
                        <ItemCtrlButtons completed={false} id="1" />
                    </QueryClientProvider>
                );

                const deleteButton = result.getByText('Delete');
                await user.click(deleteButton);

                expect(mockDeleteTodoItem).toHaveBeenCalledWith('1');
                expect(queryClient.invalidateQueries).toHaveBeenCalledWith(['todoItems']);
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

                const result = render(
                    <QueryClientProvider client={queryClient}>
                        <ItemCtrlButtons completed={false} id="1" />
                    </QueryClientProvider>
                );

                const deleteButton = result.getByText('Delete');
                await user.click(deleteButton);

                expect(mockDeleteTodoItem).toHaveBeenCalledWith('1');
                expect(queryClient.invalidateQueries).not.toHaveBeenCalled();
            });
        })
    });
});