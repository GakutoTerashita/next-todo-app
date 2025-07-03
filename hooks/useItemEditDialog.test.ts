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
            result.current.handleOpen();
        });
        expect(result.current.isDialogOpened).toBe(true);

        // Close the dialog
        act(() => {
            result.current.handleClose();
        });
        expect(result.current.isDialogOpened).toBe(false);
    });

    it('returns correct handlers', () => {
        const { result } = renderHook(() => useItemEditDialog());

        expect(typeof result.current.handleOpen).toBe('function');
        expect(typeof result.current.handleClose).toBe('function');

        // Ensure the initial state is closed
        expect(result.current.isDialogOpened).toBe(false);
    });
});