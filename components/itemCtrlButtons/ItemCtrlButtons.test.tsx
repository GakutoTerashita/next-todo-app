import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi, expect } from "vitest";
import ItemCtrlButtons from "./ItemCtrlButtons";
import { completeTodoItem, uncompleteTodoItem } from "@/app/actions/todo";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import { renderWithQueryClientProvider } from "@/test/utils";

vi.mock('@/app/actions/todo', async (importOriginal) => ({
    ...await importOriginal<typeof import('@/app/actions/todo')>(),
    deleteTodoItem: vi.fn(),
    completeTodoItem: vi.fn(),
    uncompleteTodoItem: vi.fn(),
    updateTodoItem: vi.fn(),
}));

vi.mock('@tanstack/react-query', async (importOriginal) => ({
    ...await importOriginal<typeof import('@tanstack/react-query')>(),
    useQueryClient: vi.fn(),
}));

const mockCompleteTodoItem = vi.mocked(completeTodoItem);
const mockUncompleteTodoItem = vi.mocked(uncompleteTodoItem);

const mockUseQueryClient = vi.mocked(useQueryClient);

describe('ItemCtrlButtons', () => {
    afterEach(() => {
        cleanup();
    });

    beforeEach(() => {
        mockUseQueryClient.mockClear();
    });

    it('renders buttons with correct labels', () => {
        renderWithQueryClientProvider(<ItemCtrlButtons completed={false} id="1" />);

        expect(screen.getByRole('button', { name: 'Complete' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();

        cleanup();

        renderWithQueryClientProvider(<ItemCtrlButtons completed={true} id="2" />);
        expect(screen.getByRole('button', { name: 'Completed' })).toBeInTheDocument();
    });

    describe('complete button', () => {
        describe('complete', () => {
            describe('success case', () => {
                it('calls completeTodoItem on click', async () => {
                    mockCompleteTodoItem.mockResolvedValue(undefined);

                    const user = userEvent.setup();

                    renderWithQueryClientProvider(<ItemCtrlButtons completed={false} id="1" />);

                    const completeButton = screen.getByRole('button', { name: 'Complete' });
                    await user.click(completeButton);

                    expect(mockCompleteTodoItem).toHaveBeenCalled();
                });

                it('invalidates the query after completion', async () => {
                    mockCompleteTodoItem.mockResolvedValue(undefined);

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

                    const completeButton = screen.getByRole('button', { name: 'Complete' });
                    await user.click(completeButton);

                    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['todoItems'] });
                });
            });

            describe('failure case', () => {
                it('does not invalidate the query if completion fails', async () => {
                    mockCompleteTodoItem.mockRejectedValue(new Error('Completion failed'));

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

                    const completeButton = screen.getByRole('button', { name: 'Complete' });
                    await user.click(completeButton);

                    expect(mockCompleteTodoItem).toHaveBeenCalled();
                    expect(invalidateQueriesSpy).not.toHaveBeenCalled();
                });
            });
        });

        describe('uncomplete', () => {
            describe('success case', () => {
                it('calls uncompleteTodoItem on click', async () => {
                    mockUncompleteTodoItem.mockResolvedValue(undefined);

                    const user = userEvent.setup();

                    renderWithQueryClientProvider(<ItemCtrlButtons completed={true} id="1" />);

                    const completeButton = screen.getByRole('button', { name: 'Completed' });
                    await user.click(completeButton);

                    expect(mockUncompleteTodoItem).toHaveBeenCalled();
                });

                it('invalidates the query after uncompletion', async () => {
                    mockUncompleteTodoItem.mockResolvedValue(undefined);

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
                            <ItemCtrlButtons completed={true} id="1" />
                        </QueryClientProvider>
                    );

                    const completeButton = screen.getByRole('button', { name: 'Completed' });
                    await user.click(completeButton);

                    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['todoItems'] });
                });
            });

            describe('failure case', () => {
                it('does not invalidate the query if uncompletion fails', async () => {
                    mockUncompleteTodoItem.mockRejectedValue(new Error('Uncompletion failed'));

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
                            <ItemCtrlButtons completed={true} id="1" />
                        </QueryClientProvider>
                    );

                    const completeButton = screen.getByRole('button', { name: 'Completed' });
                    await user.click(completeButton);

                    expect(mockUncompleteTodoItem).toHaveBeenCalled();
                    expect(invalidateQueriesSpy).not.toHaveBeenCalled();
                });
            });
        });
    });
});