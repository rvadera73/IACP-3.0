/**
 * React Query Hooks for Filings
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Filing } from '../services/api';

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
    mutationFn: (data: Omit<Filing, 'id' | 'submittedAt'>) => 
      api.filings.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filings'] });
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
