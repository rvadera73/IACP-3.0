import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PublicFilingWizard from '../components/PublicFilingWizard';

const mockMutateAsync = vi.fn();

vi.mock('../hooks/useFilings', () => ({
  useCreateFiling: () => ({
    mutateAsync: mockMutateAsync,
    error: null,
  }),
}));

vi.mock('../components/oalj/NewCaseForm', () => ({
  default: ({ onSubmit }: { onSubmit: (payload: any) => void }) => (
    <button
      onClick={() => onSubmit({
        category: 'Adjudication',
        caseType: 'BLA',
        claimant: 'Alex Claimant',
        employer: 'North Ridge Coal',
        title: 'Alex Claimant v. North Ridge Coal',
      })}
    >
      Submit Mock Filing
    </button>
  ),
}));

describe('PublicFilingWizard', () => {
  beforeEach(() => {
    mockMutateAsync.mockReset();
    mockMutateAsync.mockResolvedValue({
      intakeId: 'INT-2026-00077',
    });
  });

  it('renders the public filing wizard shell', () => {
    render(
      <MemoryRouter initialEntries={['/public-filing']}>
        <Routes>
          <Route path="/public-filing" element={<PublicFilingWizard />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/public e-filing wizard/i)).toBeInTheDocument();
    expect(screen.getByText(/start a new filing/i)).toBeInTheDocument();
  });

  it('submits through the filing mutation and shows the confirmation state', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/public-filing']}>
        <Routes>
          <Route path="/public-filing" element={<PublicFilingWizard />} />
          <Route path="/login" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByText(/submit mock filing/i));

    expect(mockMutateAsync).toHaveBeenCalledWith(expect.objectContaining({
      filing_type: 'Adjudication BLA Initial Filing',
      submitted_by: 'Alex Claimant',
    }));
    expect(await screen.findByText(/filing submitted/i)).toBeInTheDocument();
    expect(screen.getByText('INT-2026-00077')).toBeInTheDocument();
  });
});
