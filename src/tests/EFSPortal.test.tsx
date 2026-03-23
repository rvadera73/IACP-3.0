import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import EFSPortal from '../components/EFSPortal';

const mockUseFilings = vi.fn();
const mockUseCreateFiling = vi.fn();

vi.mock('../hooks/useFilings', () => ({
  useFilings: () => mockUseFilings(),
  useCreateFiling: () => mockUseCreateFiling(),
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { name: 'Casey Attorney', role: 'Attorney' },
    logout: vi.fn(),
  }),
}));

vi.mock('../services/geminiService', () => ({
  analyzeIntake: vi.fn(() => Promise.resolve('AI complete')),
  analyzeAccessRequest: vi.fn(() => Promise.resolve('Access review complete')),
}));

vi.mock('../components/oalj/CasesGallery', () => ({
  default: ({ cases }: { cases: Array<{ title: string }> }) => (
    <div data-testid="cases-gallery">Cases: {cases.length}</div>
  ),
}));

vi.mock('../components/oalj/CaseRecord', () => ({
  default: () => <div data-testid="case-record">Case Record</div>,
}));

vi.mock('../components/oalj/NotificationsPanel', () => ({
  default: () => <div data-testid="notifications-panel">Notifications</div>,
}));

vi.mock('../components/oalj/CaseIntelligenceHub', () => ({
  default: () => <div data-testid="case-intelligence-hub">Case Intelligence Hub</div>,
}));

function renderPortal() {
  return render(
    <MemoryRouter>
      <EFSPortal />
    </MemoryRouter>
  );
}

describe('EFSPortal', () => {
  beforeEach(() => {
    mockUseCreateFiling.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
      error: null,
    });

    mockUseFilings.mockReturnValue({
      data: [
        {
          id: '1',
          intakeId: 'INT-2026-00001',
          type: 'New Case Filing',
          status: 'pending',
          submittedAt: '2026-03-21T10:00:00Z',
          submittedBy: 'Casey Attorney',
          description: 'Claimant: Robert Martinez. Employer: Apex Coal Mining.',
        },
      ],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  it('shows a loading spinner while filings load', () => {
    mockUseFilings.mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });

    renderPortal();

    expect(screen.getByText(/loading filings/i)).toBeInTheDocument();
  });

  it('shows an api error toast when filings fail to load', () => {
    mockUseFilings.mockReturnValue({
      data: [],
      isLoading: false,
      error: new Error('Failed to fetch filings'),
      refetch: vi.fn(),
    });

    renderPortal();

    expect(screen.getByText(/we hit an api error/i)).toBeInTheDocument();
    expect(screen.getByText(/failed to fetch filings/i)).toBeInTheDocument();
  });

  it('renders live filing totals from the filings hook', () => {
    renderPortal();

    expect(screen.getByRole('heading', { name: 'My Cases' })).toBeInTheDocument();
    expect(screen.getByText(/total filings/i)).toBeInTheDocument();
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
  });
});
