import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Button } from "./Button";
import { act } from "react";

describe('<Button />', () => {
    it('Deberia renderizar el botón', () => {
        render(<Button label="Click me" />);
        const button = screen.getByText('Click me');
        expect(button).toBeInTheDocument();
    })

    it('Deberia ejecutar la función onClick al hacer clic', async () => {
        const handleClick = vi.fn();
        render(<Button label="Click me" onClick={handleClick} />);
        const button = screen.getByText('Click me');
        await act(() => {
            fireEvent.click(button);
        })
        expect(handleClick).toHaveBeenCalledTimes(1);
    })

})