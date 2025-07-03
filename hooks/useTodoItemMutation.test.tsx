import { describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import useTodoItemMutation from "./useTodoItemMutation";

vi.mock('@tanstack/react-query', async (importOriginal) => ({
    ...await importOriginal<typeof import('@tanstack/react-query')>(),
    useQueryClient: vi.fn(),
}));

const mockUseQueryClient = vi.mocked(useQueryClient);

describe('useTodoMutation', () => {
    it('mutationFn is passed correctly', async () => {
        const mockMutationFn = vi.fn().mockResolvedValue(undefined);
        const queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });
        mockUseQueryClient.mockReturnValue(queryClient);

        const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

        const { result } = renderHook(
            () => useTodoItemMutation(mockMutationFn),
            {
                wrapper: ({ children }) => (
                    <QueryClientProvider client={queryClient}>
                        {children}
                    </QueryClientProvider>
                )
            },
        );

        result.current.mutate(new FormData());
        await waitFor(() => {
            expect(mockMutationFn).toHaveBeenCalled();
            expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ["todoItems"] });
        });
    });

    it('optional onSuccess callback is called if provided', async () => {
        const mockMutationFn = vi.fn().mockResolvedValue(undefined);
        const optionalOnSuccess = vi.fn();
        const queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });
        mockUseQueryClient.mockReturnValue(queryClient);
        const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
        const { result } = renderHook(
            () => useTodoItemMutation(mockMutationFn, optionalOnSuccess),
            {
                wrapper: ({ children }) => (
                    <QueryClientProvider client={queryClient}>
                        {children}
                    </QueryClientProvider>
                )
            },
        );
        result.current.mutate(new FormData());
        await waitFor(() => {
            expect(mockMutationFn).toHaveBeenCalled();
            expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ["todoItems"] });
            expect(optionalOnSuccess).toHaveBeenCalled();
        });
    });

    it('failure case, invalidateQueries is not called', async () => {
        const mockMutationFn = vi.fn().mockRejectedValue(new Error("Mutation failed"));
        const queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });
        mockUseQueryClient.mockReturnValue(queryClient);

        const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

        const { result } = renderHook(
            () => useTodoItemMutation(mockMutationFn),
            {
                wrapper: ({ children }) => (
                    <QueryClientProvider client={queryClient}>
                        {children}
                    </QueryClientProvider>
                )
            },
        );

        result.current.mutate(new FormData());

        await waitFor(() => {
            expect(mockMutationFn).toHaveBeenCalled();
            expect(invalidateQueriesSpy).not.toHaveBeenCalled();
        });
    });
});