import { describe, it, expect } from 'vitest';

describe('miPrimerTest', () => {
    it('la suma de dos números', () => {
        const suma = (a,b) => a + b;
        const resultado = suma(2, 3);
        expect(resultado).toBe(5);
    })

    it('dos textos son iguales', () => {
        const texto1 = 'Hola';
        const texto2 = 'Hola';
        expect(texto1).toBe(texto2);
    })
})