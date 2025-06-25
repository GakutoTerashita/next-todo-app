import { fireEvent } from "@testing-library/dom";
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi, expect } from "vitest";
import ItemCtrlButtons from "./ItemCtrlButtons";

describe('ItemCtrlButtons', () => {
    afterEach(() => {
        cleanup();
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
});