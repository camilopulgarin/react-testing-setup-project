import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { useOrders } from './useOrders';
import { SessionProvider, useSession } from '../context/AuthContext';
import { waitFor } from '@testing-library/dom';
import { renderHook } from '@testing-library/react';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

vi.mock('../context/AuthContext', async() => {
    const actual = await vi.importActual('../context/AuthContext');
    return {
        ...actual,
        useSession: vi.fn()
    }
})

describe('useOrders MSW', () => {
    const mockUser = { id: "1", name: "Wilmer Garzon" };

    beforeEach(() => {
        (useSession as Mock).mockReturnValue({ user: mockUser })
    })

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <SessionProvider>
            <MemoryRouter>
                {children}
            </MemoryRouter>
        </SessionProvider>
    )

    it('debe obtener good la data', async () => {
        const { result } = renderHook(() => useOrders(), { wrapper })
        const initialLoading = result.current.loading;
        expect(initialLoading).toBe(true);
        
        await waitFor(() => {
            const lengthOrders = result.current.orders.length;
            expect(lengthOrders).toBe(1);
        })

    })

    it('Debe obtener un error', async () => {
        server.use(
            http.get('http://localhost:3001/orders', () => {
                return new HttpResponse(null, {
                    status: 500,
                    statusText: 'Internal Server Error'
                })
            })
        )

        const { result } = renderHook(() => useOrders(), { wrapper });
        await waitFor(() => {
            const error = result.current.error;
            expect(error).toBe('Failed to fetch orders. Please try again later.');
            
        })
    })
})