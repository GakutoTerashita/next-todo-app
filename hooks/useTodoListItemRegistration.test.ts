import { registerTodoItem } from "@/lib/api/todo-items";
import { describe, vi, beforeEach, expect, it } from "vitest";
import useTodoListItemRegistration from "./useTodoListItemRegistration";
import { renderHook, waitFor } from "@testing-library/react";

vi.mock('@/lib/api/todo-items', () => ({
    registerTodoItem: vi.fn(),
}));

const mockRegisterTodoItem = vi.mocked(registerTodoItem);

describe('useTodoListItemRegistration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('executeRegistration', () => {
        describe('success case', () => {
            it('calls registerTodoItem with the correct parameters', async () => {
                const mockItem = {
                    title: "Test Item",
                    description: "This is a test item.",
                    deadline: new Date(),
                };
                mockRegisterTodoItem.mockResolvedValueOnce({
                    id: '1',
                    ...mockItem,
                    completed: false,
                });

                const { result } = renderHook(() => (
                    useTodoListItemRegistration()
                ));

                result.current.executeRegistration(mockItem);

                await waitFor(() => {
                    expect(mockRegisterTodoItem).toHaveBeenCalledWith(mockItem);
                });
            });

            it('calls onRegistered callback when registration finishes', async () => {
                const mockItem = {
                    title: "Test Item",
                    description: "This is a test item.",
                    deadline: new Date(),
                };
                mockRegisterTodoItem.mockResolvedValueOnce({
                    id: '1',
                    ...mockItem,
                    completed: false,
                });

                const onRegistered = vi.fn();

                const { result } = renderHook(() => (
                    useTodoListItemRegistration(onRegistered)
                ));

                result.current.executeRegistration(mockItem);

                await waitFor(() => {
                    expect(mockRegisterTodoItem).toHaveResolved();
                    expect(onRegistered).toHaveBeenCalled();
                });
            });
        });
    });
});