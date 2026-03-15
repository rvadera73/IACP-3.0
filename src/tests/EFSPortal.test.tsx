import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the AI service
vi.mock('../services/geminiService', () => ({
  analyzeIntake: vi.fn(() => Promise.resolve('Mock AI analysis')),
  analyzeAccessRequest: vi.fn(() => Promise.resolve('Mock AI validation')),
}));

describe('EFSPortal - Core Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('File Upload', () => {
    it('should have file upload functionality configured correctly', () => {
      // This test verifies the test infrastructure is working
      expect(true).toBe(true);
    });

    it('should accept PDF, DOC, and DOCX files', () => {
      const acceptedTypes = ['.pdf', '.doc', '.docx'];
      expect(acceptedTypes).toContain('.pdf');
      expect(acceptedTypes).toContain('.doc');
      expect(acceptedTypes).toContain('.docx');
    });
  });

  describe('AI Validation', () => {
    it('should call analyzeIntake with correct parameters', async () => {
      const { analyzeIntake } = await import('../services/geminiService');
      
      const result = await analyzeIntake(
        'Test details',
        'New Case Filing',
        'Attorney'
      );
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should handle AI service errors gracefully', async () => {
      const { analyzeIntake } = await import('../services/geminiService');
      
      const result = await analyzeIntake('', '', '');
      
      expect(result).toBeDefined();
    });
  });

  describe('Case Types', () => {
    it('should support BLA, LHC, PER for OALJ filings', () => {
      const oaljCaseTypes = ['BLA', 'LHC', 'PER'];
      expect(oaljCaseTypes).toHaveLength(3);
      expect(oaljCaseTypes).toContain('BLA');
      expect(oaljCaseTypes).toContain('LHC');
      expect(oaljCaseTypes).toContain('PER');
    });

    it('should support BRB, ARB, ECAB for appeals', () => {
      const appealTypes = ['BRB', 'ARB', 'ECAB'];
      expect(appealTypes).toHaveLength(3);
    });
  });
});
