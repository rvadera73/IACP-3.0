import { describe, it, expect } from 'vitest';
import { getSuggestedJudges, isJudgeOverloaded, isJudgeUnderutilized, getJudgeWorkloadStatus, calculateOfficeStats } from '../services/smartAssignment';

describe('Smart Assignment Service', () => {
  const mockJudges = [
    { id: 'J001', name: 'Hon. Sarah Jenkins', office: 'Pittsburgh, PA', activeCases: 24, weightedLoad: 58, capacity: 75, specialty: ['BLA', 'LHC'], compliance270: 96, pendingDecisions: 5 },
    { id: 'J002', name: 'Hon. Michael Ross', office: 'New York, NY', activeCases: 18, weightedLoad: 42, capacity: 75, specialty: ['LHC', 'PER'], compliance270: 100, pendingDecisions: 3 },
    { id: 'J003', name: 'Hon. Patricia Chen', office: 'San Francisco, CA', activeCases: 32, weightedLoad: 78, capacity: 75, specialty: ['BLA'], compliance270: 88, pendingDecisions: 8 },
    { id: 'J004', name: 'Hon. James Wilson', office: 'Washington, DC', activeCases: 12, weightedLoad: 28, capacity: 75, specialty: ['PER', 'WB'], compliance270: 100, pendingDecisions: 2 },
  ];

  describe('getSuggestedJudges', () => {
    it('should return top 3 judges sorted by score', () => {
      const suggestions = getSuggestedJudges(mockJudges, {
        caseType: 'BLA',
        office: 'Pittsburgh, PA',
      });

      expect(suggestions).toHaveLength(3);
      expect(suggestions[0].rank).toBe(1);
      expect(suggestions[1].rank).toBe(2);
      expect(suggestions[2].rank).toBe(3);
    });

    it('should prioritize judges with lower workload', () => {
      const suggestions = getSuggestedJudges(mockJudges, {
        caseType: 'BLA',
        office: 'Pittsburgh, PA',
      });

      // Judge with lowest workload should be ranked higher
      const underutilizedJudge = mockJudges.find(j => j.weightedLoad < 40);
      if (underutilizedJudge) {
        const suggestion = suggestions.find(s => s.judge.id === underutilizedJudge.id);
        expect(suggestion).toBeDefined();
        expect(suggestion!.rank).toBeLessThanOrEqual(2);
      }
    });

    it('should consider case type expertise', () => {
      const suggestions = getSuggestedJudges(mockJudges, {
        caseType: 'BLA',
        office: 'Pittsburgh, PA',
      });

      // BLA specialist should be ranked higher
      const blaSpecialist = mockJudges.find(j => j.specialty.includes('BLA'));
      if (blaSpecialist) {
        const suggestion = suggestions.find(s => s.judge.id === blaSpecialist.id);
        expect(suggestion).toBeDefined();
        expect(suggestion!.reasons.some((r: string) => r.includes('BLA'))).toBe(true);
      }
    });

    it('should include reasons for each suggestion', () => {
      const suggestions = getSuggestedJudges(mockJudges, {
        caseType: 'BLA',
        office: 'Pittsburgh, PA',
      });

      suggestions.forEach(suggestion => {
        expect(suggestion.reasons).toBeDefined();
        expect(suggestion.reasons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('isJudgeOverloaded', () => {
    it('should return true for judge with >90% utilization', () => {
      const overloadedJudge = { ...mockJudges[2], weightedLoad: 70, capacity: 75 }; // 93% utilization
      expect(isJudgeOverloaded(overloadedJudge)).toBe(true);
    });

    it('should return false for judge with <90% utilization', () => {
      const normalJudge = mockJudges[0]; // 77% utilization
      expect(isJudgeOverloaded(normalJudge)).toBe(false);
    });
  });

  describe('isJudgeUnderutilized', () => {
    it('should return true for judge with <50% utilization', () => {
      const underutilizedJudge = { ...mockJudges[3], weightedLoad: 28, capacity: 75 }; // 37% utilization
      expect(isJudgeUnderutilized(underutilizedJudge)).toBe(true);
    });

    it('should return false for judge with >50% utilization', () => {
      const normalJudge = mockJudges[0]; // 77% utilization
      expect(isJudgeUnderutilized(normalJudge)).toBe(false);
    });
  });

  describe('getJudgeWorkloadStatus', () => {
    it('should return "Overloaded" for >90% utilization', () => {
      const overloadedJudge = { ...mockJudges[2], weightedLoad: 70, capacity: 75 };
      expect(getJudgeWorkloadStatus(overloadedJudge)).toBe('Overloaded');
    });

    it('should return "Moderate" for 75-90% utilization', () => {
      const moderateJudge = mockJudges[0]; // 77% utilization
      expect(getJudgeWorkloadStatus(moderateJudge)).toBe('Moderate');
    });

    it('should return "Available" for 50-75% utilization', () => {
      const availableJudge = { ...mockJudges[1], weightedLoad: 50, capacity: 75 };
      expect(getJudgeWorkloadStatus(availableJudge)).toBe('Available');
    });

    it('should return "Underutilized" for <50% utilization', () => {
      const underutilizedJudge = mockJudges[3]; // 37% utilization
      expect(getJudgeWorkloadStatus(underutilizedJudge)).toBe('Underutilized');
    });
  });

  describe('calculateOfficeStats', () => {
    it('should calculate correct office statistics', () => {
      const stats = calculateOfficeStats(mockJudges);

      expect(stats.totalJudges).toBe(4);
      expect(stats.totalActiveCases).toBe(86); // 24+18+32+12
      expect(stats.overloadedJudges).toBe(1); // Judge with 78/75 load
      expect(stats.underutilizedJudges).toBe(1); // Judge with 28/75 load
    });

    it('should calculate average utilization correctly', () => {
      const stats = calculateOfficeStats(mockJudges);
      
      // Average of: 77%, 56%, 104%, 37% = 68.5%
      expect(stats.avgUtilization).toBeGreaterThanOrEqual(65);
      expect(stats.avgUtilization).toBeLessThanOrEqual(72);
    });

    it('should calculate average compliance correctly', () => {
      const stats = calculateOfficeStats(mockJudges);
      
      // Average of: 96, 100, 88, 100 = 96%
      expect(stats.avgCompliance).toBe(96);
    });
  });
});
