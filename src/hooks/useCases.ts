/**
 * React Query Hooks for Cases
 */

import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export interface Case {
  id: string;
  caseNumber: string;
  caseType: string;
  title: string;
  status: string;
  filingDate: string;
}

export function useCases() {
  return useQuery({
    queryKey: ['cases'],
    queryFn: async () => {
      // For now, return empty array - will implement when backend has endpoint
      return [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCase(caseNumber: string) {
  return useQuery({
    queryKey: ['case', caseNumber],
    queryFn: async () => {
      // For now, return null - will implement when backend has endpoint
      return null;
    },
    enabled: !!caseNumber,
  });
}
