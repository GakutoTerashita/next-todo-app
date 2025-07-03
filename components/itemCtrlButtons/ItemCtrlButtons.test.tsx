import { cleanup, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ItemCtrlButtons from "./ItemCtrlButtons";
import { renderWithQueryClientProvider } from "@/test/utils";

describe('ItemCtrlButtons', () => {
    it('renders buttons with correct labels', () => {
        renderWithQueryClientProvider(<ItemCtrlButtons completed={false} id="1" />);

        expect(screen.getByRole('button', { name: 'Complete' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();

        cleanup();

        renderWithQueryClientProvider(<ItemCtrlButtons completed={true} id="2" />);
        expect(screen.getByRole('button', { name: 'Completed' })).toBeInTheDocument();
    });

});