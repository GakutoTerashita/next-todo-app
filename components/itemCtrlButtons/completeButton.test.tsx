import { completeTodoItem, uncompleteTodoItem } from '@/app/actions/todo';
import { renderWithQueryClientProvider } from '@/test/utils';
import { useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ItemCtrlButtons from './ItemCtrlButtons';

vi.mock('@/app/actions/todo', async (importOriginal) => ({
    ...await importOriginal<typeof import('@/app/actions/todo')>(),
    completeTodoItem: vi.fn(),
    uncompleteTodoItem: vi.fn(),
}));
const mockCompleteTodoItem = vi.mocked(completeTodoItem);
const mockUncompleteTodoItem = vi.mocked(uncompleteTodoItem);

vi.mock('@tanstack/react-query', async (importOriginal) => ({
    ...await importOriginal<typeof import('@tanstack/react-query')>(),
    useQueryClient: vi.fn(),
}));
const mockUseQueryClient = vi.mocked(useQueryClient);

describe('complete button', () => {
    afterEach(() => {
        cleanup();
    });

    beforeEach(() => {
        mockUseQueryClient.mockClear();
        mockCompleteTodoItem.mockClear();
        mockUncompleteTodoItem.mockClear();
    });

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