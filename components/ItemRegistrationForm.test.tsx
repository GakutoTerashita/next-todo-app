import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import ItemRegistrationForm from "./ItemRegistrationForm";

describe('ItemRegistrationForm', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders 2 input fields with placeholders', () => {
        const result = render(<ItemRegistrationForm />);

        expect(result.getByRole('textbox', { name: 'title' }));
        expect(result.getByRole('textbox', { name: 'description' }));
    });

    it('renders a date picker', () => {
        const result = render(<ItemRegistrationForm />);

        const datePicker = result.getByLabelText('deadline');
        expect(datePicker.getAttribute('type')).toBe('date');
    });
});