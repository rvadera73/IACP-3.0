/**
 * API Service Layer
 * Fetch wrappers for backend endpoints plus shape adapters for the UI.
 */

const API_BASE = '/api/v1';

export interface ApiFiling {
  id?: string;
  intake_id?: string;
  filing_type?: string;
  type?: string;
  status: 'pending' | 'accepted' | 'deficient';
  submitted_at?: string;
  submittedAt?: string;
  submitted_by?: string;
  submittedBy?: string;
  description: string;
  ai_score?: number;
  case_id?: string | null;
}

export interface Filing {
  id?: string;
  type: string;
  status: 'pending' | 'accepted' | 'deficient';
  submittedAt: string;
  submittedBy: string;
  description: string;
  intakeId?: string;
  aiScore?: number;
  caseId?: string | null;
}

export interface CreateFilingInput {
  filing_type: string;
  submitted_by: string;
  description: string;
  ai_score?: number;
  intake_id?: string;
}

export interface IntakeQueueItem extends Filing {
  queueStatus: 'Auto-Docket Ready' | 'Manual Review' | 'Processing' | 'Deficiency Notice Sent' | 'Docketed';
  channel: 'UFS' | 'Email' | 'Paper';
  caseType: string;
  claimant: string;
  employer: string;
  receivedAt: string;
  deficiencies: string[];
  documents: Array<{ name: string; pages: number }>;
  docketNumber?: string;
  docketedAt?: string;
  assignedJudge?: string;
  assignedAt?: string;
}

export interface DocketResult {
  status: 'docketed';
  filing_id: string;
  docket_number: string;
}

export interface JudgeSuggestion {
  judge_id: string;
  name: string;
  office: string;
  score: number;
}

export interface AssignJudgeInput {
  filingId: string;
  judgeId: string;
  judgeName: string;
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
}

function getErrorMessage(response: Response, fallback: string) {
  return `${fallback} (${response.status})`;
}

function normalizeFiling(filing: ApiFiling): Filing {
  return {
    id: filing.id,
    intakeId: filing.intake_id,
    type: filing.filing_type ?? filing.type ?? 'Unknown Filing',
    status: filing.status,
    submittedAt: filing.submitted_at ?? filing.submittedAt ?? new Date().toISOString(),
    submittedBy: filing.submitted_by ?? filing.submittedBy ?? 'Unknown filer',
    description: filing.description ?? '',
    aiScore: filing.ai_score,
    caseId: filing.case_id ?? null,
  };
}

function titleCaseStatus(status: Filing['status']) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function inferCaseType(filing: Filing) {
  const source = `${filing.type} ${filing.description}`.toUpperCase();
  if (source.includes('LHC') || source.includes('LONGSHORE')) return 'LHC';
  if (source.includes('PER') || source.includes('PERM')) return 'PER';
  return 'BLA';
}

function inferClaimant(description: string) {
  const match = description.match(/claimant[:\s]+([^.;\n]+)/i);
  return match?.[1]?.trim() || 'Unspecified claimant';
}

function inferEmployer(description: string) {
  const match = description.match(/employer[:\s]+([^.;\n]+)/i);
  return match?.[1]?.trim() || 'Not provided';
}

function inferDeficiencies(filing: Filing) {
  if (filing.status === 'deficient') {
    return ['Backend flagged deficiency review required'];
  }

  return filing.aiScore !== undefined && filing.aiScore < 70
    ? ['Low AI confidence score']
    : [];
}

function mapQueueStatus(filing: Filing): IntakeQueueItem['queueStatus'] {
  if (filing.status === 'accepted') return 'Docketed';

  const deficiencies = inferDeficiencies(filing);
  if (deficiencies.length > 0) return 'Manual Review';

  return 'Auto-Docket Ready';
}

function normalizeIntakeQueueItem(filing: ApiFiling): IntakeQueueItem {
  const normalized = normalizeFiling(filing);
  const caseType = inferCaseType(normalized);
  const claimant = inferClaimant(normalized.description);
  const employer = inferEmployer(normalized.description);
  const deficiencies = inferDeficiencies(normalized);
  const queueStatus = mapQueueStatus(normalized);

  return {
    ...normalized,
    queueStatus,
    channel: 'UFS',
    caseType,
    claimant,
    employer,
    receivedAt: normalized.submittedAt,
    deficiencies,
    documents: [
      {
        name: `${normalized.type.replace(/\s+/g, '_') || 'filing'}.pdf`,
        pages: 1,
      },
    ],
    docketNumber: normalized.status === 'accepted' && normalized.intakeId
      ? normalized.intakeId.replace('INT', '2026')
      : undefined,
    docketedAt: normalized.status === 'accepted' ? normalized.submittedAt : undefined,
  };
}

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);

  if (!response.ok) {
    throw new Error(getErrorMessage(response, 'Request failed'));
  }

  return response.json();
}

export const api = {
  filings: {
    async getAll(): Promise<Filing[]> {
      const data = await request<ApiFiling[]>(`${API_BASE}/filings`);
      return data.map(normalizeFiling);
    },

    async create(filing: CreateFilingInput): Promise<Filing> {
      const data = await request<ApiFiling>(`${API_BASE}/filings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filing),
      });

      return normalizeFiling(data);
    },

    async getById(id: string): Promise<Filing> {
      const data = await request<ApiFiling>(`${API_BASE}/filings/${id}`);
      return normalizeFiling(data);
    },
  },

  intake: {
    async getQueue(): Promise<IntakeQueueItem[]> {
      const data = await request<ApiFiling[]>(`${API_BASE}/intake/queue`);
      return data.map(normalizeIntakeQueueItem);
    },

    async docket(filingId: string): Promise<DocketResult> {
      return request<DocketResult>(`${API_BASE}/intake/${filingId}/docket`, {
        method: 'POST',
      });
    },
  },

  judges: {
    async suggest(caseType?: string): Promise<JudgeSuggestion[]> {
      const params = caseType ? `?case_type=${encodeURIComponent(caseType)}` : '';
      const data = await request<{ suggestions: JudgeSuggestion[] }>(`${API_BASE}/judges/suggest${params}`);
      return data.suggestions;
    },

    async assign({ filingId, judgeId, judgeName }: AssignJudgeInput) {
      // The backend does not expose a write endpoint for judge assignment yet.
      return Promise.resolve({
        filingId,
        judgeId,
        judgeName,
        assignedAt: new Date().toISOString(),
      });
    },
  },

  async health(): Promise<HealthStatus> {
    return request<HealthStatus>(`/health`);
  },
};

export function formatFilingSummary(filing: Filing) {
  return {
    id: filing.intakeId ?? filing.id ?? 'Unknown filing',
    type: filing.type,
    status: titleCaseStatus(filing.status),
    date: filing.submittedAt.split('T')[0],
    caseNo: filing.caseId ?? 'Pending docket assignment',
  };
}

export default api;
