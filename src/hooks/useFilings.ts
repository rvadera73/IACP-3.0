/**
 * React Query Hooks for Filings
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Filing, CreateFilingInput, AssignJudgeInput } from '../services/api';

export function useFilings() {
  return useQuery({
    queryKey: ['filings'],
    queryFn: () => api.filings.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateFiling() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateFilingInput) => 
      api.filings.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filings'] });
      queryClient.invalidateQueries({ queryKey: ['intake-queue'] });
    },
  });
}

export function useFiling(id: string) {
  return useQuery({
    queryKey: ['filing', id],
    queryFn: () => api.filings.getById(id),
    enabled: !!id,
  });
}

export function useIntakeQueue() {
  return useQuery({
    queryKey: ['intake-queue'],
    queryFn: () => api.intake.getQueue(),
    staleTime: 60 * 1000,
  });
}

export function useAutoDocket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (filingId: string) => api.intake.docket(filingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intake-queue'] });
      queryClient.invalidateQueries({ queryKey: ['filings'] });
    },
  });
}

export function useJudgeSuggestions(caseType?: string) {
  return useQuery({
    queryKey: ['judge-suggestions', caseType],
    queryFn: () => api.judges.suggest(caseType),
    enabled: !!caseType,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAssignJudge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AssignJudgeInput) => api.judges.assign(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intake-queue'] });
    },
  });
}
