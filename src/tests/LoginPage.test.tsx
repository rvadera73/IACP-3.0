import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LoginPage from '../components/LoginPage';

const mockLogin = vi.fn();
const mockBeginDemoSignIn = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

vi.mock('../services/auth', () => ({
  beginDemoSignIn: (...args: unknown[]) => mockBeginDemoSignIn(...args),
}));

function renderLogin(state?: { portal?: 'external' | 'internal' }) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/login', state }]}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/efs" element={<div>EFS Destination</div>} />
        <Route path="/internal" element={<div>Internal Destination</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    mockLogin.mockReset();
    mockBeginDemoSignIn.mockReset();
    mockBeginDemoSignIn.mockResolvedValue({
      id: 'user-1',
      name: 'Taylor Counsel',
      role: 'Attorney',
    });
  });

  it('shows external provider buttons for the external portal', async () => {
    renderLogin({ portal: 'external' });

    expect(screen.getByText(/continue with google/i)).toBeInTheDocument();
    expect(screen.getByText(/continue with login.gov/i)).toBeInTheDocument();
  });

  it('uses google sign-in flow for external users', async () => {
    const user = userEvent.setup();
    renderLogin({ portal: 'external' });

    await user.type(screen.getByPlaceholderText(/enter your email/i), 'taylor@example.com');
    await user.selectOptions(screen.getByRole('combobox'), 'Attorney');
    await user.click(screen.getByText(/continue with google/i));

    expect(mockBeginDemoSignIn).toHaveBeenCalledWith(expect.objectContaining({
      provider: 'google',
      portal: 'external',
      role: 'Attorney',
      email: 'taylor@example.com',
    }));
  });
});
