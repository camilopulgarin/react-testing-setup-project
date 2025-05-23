import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Contador } from "./Contador";


describe('<Contador />', () => {
    it('Deberia mostrar el valor inicial', () => {
        render(<Contador />);
        const valorInicial = screen.getByText('Contador: 0');
        expect(valorInicial).toBeInTheDocument();
    })

    it('Deberia incrementar el contador', async() => {
        render(<Contador />);
        const botonIncrementar = screen.getByText('Incrementar');
        await act(() => {
            fireEvent.click(botonIncrementar);
        })
        const contador = screen.getByText('Contador: 1');
        expect(contador).toBeInTheDocument();
    })
})