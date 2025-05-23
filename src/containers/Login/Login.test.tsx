import { describe, it, expect, vi, Mock } from "vitest";
import { Login } from "./Login";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SessionProvider } from "../../context/AuthContext";
import { getAuth } from "../../services/getAuth";
import { act } from "react";

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate
    }
})

vi.mock("../../services/getAuth", () => ({
    getAuth: vi.fn()
}))

const mockNavigate = vi.fn();
const mockedGetAuth = getAuth as Mock;

describe('<Login />', () => {
    const handleLogin = () => {
        return render(
            <SessionProvider>
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </SessionProvider>
        )
    }

    it('deberia mostrar un mensaje de error', async () => {
        mockedGetAuth.mockRejectedValue(new Error('Invalid Credentials'));
        handleLogin();
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Login' });
    await act(() => {
        fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
        fireEvent.click(submitButton);
    })
    const errorMessage = await screen.getByText('Invalid Credentials');
    expect(errorMessage).toBeInTheDocument();
    })

    //para saltar un test usar it.skip
    it('deberia redirigir a /orders', async () => {
        mockedGetAuth.mockResolvedValue({ success: true });
        handleLogin();

        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByRole('button', { name: 'Login' });
        await act(() => {
            fireEvent.change(usernameInput, { target: { value: 'validUser' } });
            fireEvent.change(passwordInput, { target: { value: 'validPassword' } });
            fireEvent.click(submitButton);
        })

        await waitFor(() => {
            expect(mockedGetAuth).toHaveBeenCalledWith('validUser', 'validPassword');
            expect(mockNavigate).toHaveBeenCalledWith('/orders');
        })
    })
})