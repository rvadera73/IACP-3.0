/**
 * API Service Layer
 * Fetch wrappers for all backend endpoints
 */

const API_BASE = '/api/v1';

export interface Filing {
  id?: string;
  type: string;
  status: 'pending' | 'accepted' | 'deficient';
  submittedAt: string;
  submittedBy: string;
  description: string;
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
}

export const api = {
  filings: {
    async getAll(): Promise<Filing[]> {
      const response = await fetch(`${API_BASE}/filings`);
      if (!response.ok) {
        throw new Error('Failed to fetch filings');
      }
      return response.json();
    },

    async create(filing: Omit<Filing, 'id' | 'submittedAt'>): Promise<Filing> {
      const response = await fetch(`${API_BASE}/filings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filing),
      });
      if (!response.ok) {
        throw new Error('Failed to create filing');
      }
      return response.json();
    },

    async getById(id: string): Promise<Filing> {
      const response = await fetch(`${API_BASE}/filings/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch filing');
      }
      return response.json();
    },
  },

  async health(): Promise<HealthStatus> {
    const response = await fetch(`${API_BASE}/health`);
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    return response.json();
  },
};

export default api;
