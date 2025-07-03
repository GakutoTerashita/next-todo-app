import { renderHook } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";
import useItemEditDialog from "./useItemEditDialog";

describe('useItemEditDialog', () => {
    it('handles open and close states', () => {
        const { result } = renderHook(() => useItemEditDialog());

        // Initial state should be closed
        expect(result.current.isDialogOpened).toBe(false);

        // Open the dialog
        act(() => {
            result.current.handleDialogOpen();
        });
        expect(result.current.isDialogOpened).toBe(true);

        // Close the dialog
        act(() => {
            result.current.handleDialogClose();
        });
        expect(result.current.isDialogOpened).toBe(false);
    });

    it('returns correct handlers', () => {
        const { result } = renderHook(() => useItemEditDialog());

        expect(typeof result.current.handleDialogOpen).toBe('function');
        expect(typeof result.current.handleDialogClose).toBe('function');

        // Ensure the initial state is closed
        expect(result.current.isDialogOpened).toBe(false);
    });
});