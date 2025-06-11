import { afterEach, beforeEach, describe, expect, it, Mock, MockInstance, vi } from 'vitest';
import * as ReactRouter from 'react-router-dom';
import * as AuthContext from '../context/AuthContext';
import * as OrdersService from '../services/getOrders';
import { waitFor } from '@testing-library/dom';
import { renderHook } from '@testing-library/react';
import { useOrders } from './useOrders';

vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}))

describe('useOrdersSpy', () => {
    let useSessionSpy: MockInstance;
    let getOrdersSpy: MockInstance;
    const mockNavigate = vi.fn();

    beforeEach(() => {
        useSessionSpy = vi.spyOn(AuthContext, 'useSession');
        getOrdersSpy = vi.spyOn(OrdersService, 'getOrders');
        vi.spyOn(ReactRouter, 'useNavigate').mockReturnValue(mockNavigate);

        (ReactRouter.useNavigate as Mock).mockReturnValue(mockNavigate);

        vi.clearAllMocks();
    })

    afterEach(() => {
        vi.resetAllMocks();
    })

    it('deberia mostrar un error', async () => {
        useSessionSpy.mockReturnValue({ user: { id: 1 }});
        getOrdersSpy.mockRejectedValue(new Error('Api error'));
        const { result } = renderHook(() => useOrders());

        expect(result.current.loading).toBe(true);
        expect(result.current.error).toBeNull();

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBe('Failed to fetch orders. Please try again later.');
            expect(getOrdersSpy).toHaveBeenCalledTimes(1);
        })
    })
})