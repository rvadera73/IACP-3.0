import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DocketClerkDashboard from '../components/iacp/DocketClerkDashboard';

const mockUseIntakeQueue = vi.fn();
const mockUseAutoDocket = vi.fn();
const mockUseAssignJudge = vi.fn();
const mockUseJudgeSuggestions = vi.fn();

vi.mock('../hooks/useFilings', () => ({
  useIntakeQueue: () => mockUseIntakeQueue(),
  useAutoDocket: () => mockUseAutoDocket(),
  useAssignJudge: () => mockUseAssignJudge(),
  useJudgeSuggestions: (...args: unknown[]) => mockUseJudgeSuggestions(...args),
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { name: 'Dana Clerk', role: 'OALJ Docket Clerk' },
  }),
}));

vi.mock('../components/oalj/CaseIntelligenceHub', () => ({
  default: () => <div data-testid="case-hub">Case Hub</div>,
}));

vi.mock('../components/oalj/CasesGallery', () => ({
  default: () => <div data-testid="cases-gallery">Cases Gallery</div>,
}));

vi.mock('../components/iacp/AnalyticsDashboard', () => ({
  default: () => <div data-testid="analytics-dashboard">Analytics Dashboard</div>,
}));

describe('DocketClerkDashboard', () => {
  beforeEach(() => {
    mockUseAutoDocket.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });

    mockUseAssignJudge.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });

    mockUseJudgeSuggestions.mockReturnValue({
      data: [],
      isLoading: false,
    });

    mockUseIntakeQueue.mockReturnValue({
      data: [
        {
          id: 'filing-1',
          intakeId: 'INT-2026-00089',
          type: 'New Claim',
          status: 'pending',
          submittedAt: '2026-03-21T10:00:00Z',
          submittedBy: 'Dana Clerk',
          description: 'Claimant: Robert Martinez. Employer: Apex Coal Mining.',
          aiScore: 98,
          caseId: null,
          queueStatus: 'Auto-Docket Ready',
          channel: 'UFS',
          caseType: 'BLA',
          claimant: 'Robert Martinez',
          employer: 'Apex Coal Mining',
          receivedAt: '2026-03-21T10:00:00Z',
          deficiencies: [],
          documents: [{ name: 'claim.pdf', pages: 1 }],
        },
      ],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  it('shows a loading spinner while the intake queue loads', () => {
    mockUseIntakeQueue.mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<DocketClerkDashboard onCaseSelect={vi.fn()} />);

    expect(screen.getByText(/loading intake queue/i)).toBeInTheDocument();
  });

  it('shows an api error toast when the intake queue fails', () => {
    mockUseIntakeQueue.mockReturnValue({
      data: [],
      isLoading: false,
      error: new Error('Queue unavailable'),
      refetch: vi.fn(),
    });

    render(<DocketClerkDashboard onCaseSelect={vi.fn()} />);

    expect(screen.getByText(/we hit an api error/i)).toBeInTheDocument();
    expect(screen.getByText(/queue unavailable/i)).toBeInTheDocument();
  });

  it('renders queue data from the api hook', async () => {
    const user = userEvent.setup();
    render(<DocketClerkDashboard onCaseSelect={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /docket queue/i }));

    expect(screen.getByText(/total intake/i)).toBeInTheDocument();
    expect(screen.getByText(/robert martinez/i)).toBeInTheDocument();
    expect(screen.getAllByText(/auto-docket ready/i).length).toBeGreaterThan(0);
  });
});
