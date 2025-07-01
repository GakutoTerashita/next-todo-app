import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import HeaderBar from "./HeaderBar";

it('has proper title', () => {
    render(<HeaderBar />);

    expect(screen.getByText("Next.js Todo App")).toBeInTheDocument();
});