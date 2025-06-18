import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ItemRegistrationForm from "./ItemRegistrationForm";

describe('ItemRegistrationForm', () => {
    it('renders 2 input fields with placeholders', () => {
        const result = render(<ItemRegistrationForm />);

        expect(result.getByRole('textbox', { name: 'title' }));
        expect(result.getByRole('textbox', { name: 'description' }));
    });

    it('renders a date picker', () => {
        const result = render(<ItemRegistrationForm />);

        expect(result.getByRole('textbox', { name: 'deadline' }));
    });
});