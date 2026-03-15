import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { autoDocketFiling, generateDeficiencyNotice, validateFilingForDocketing } from '../services/autoDocketing';

describe('Auto-Docketing Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('validateFilingForDocketing', () => {
    it('should detect missing required fields', () => {
      const filingData = {
        claimantName: 'John Doe',
        employerName: 'Coal Corp',
      };

      const result = validateFilingForDocketing(filingData, 'BLA', '');

      expect(result.deficiencies.length).toBeGreaterThan(0);
      expect(result.recommendedAction).toBe('Deficiency Notice');
    });

    it('should detect missing signature', () => {
      const filingData = {
        claimantName: 'John Doe',
        employerName: 'Coal Corp',
        ssn: '123-45-6789',
        dateOfBirth: '1970-01-15',
        dateOfInjury: '2025-12-15',
        // Missing signature
      };

      const result = validateFilingForDocketing(filingData, 'BLA', 'text without signature');

      // Service should detect missing signature field
      expect(result.deficiencies.length).toBeGreaterThan(0);
    });

    it('should return invalid for filing with missing required fields', () => {
      const filingData = {
        claimantName: 'John Doe',
        // Missing employer, SSN, dates
      };

      const result = validateFilingForDocketing(filingData, 'BLA', '');

      expect(result.isValid).toBe(false);
      expect(result.deficiencies.length).toBeGreaterThan(0);
      expect(result.deficiencies.some(d => d.type === 'Missing Required Field')).toBe(true);
    });

    it('should handle low AI score correctly', () => {
      const filingData = {
        claimantName: 'John Doe',
        employerName: 'Coal Corp',
      };

      const result = validateFilingForDocketing(filingData, 'BLA', 'Short text');

      expect(result.aiScore).toBeLessThan(90);
      expect(result.canAutoDocket).toBe(false);
    });
  });

  describe('autoDocketFiling', () => {
    it('should fail for filing with missing required fields', async () => {
      const filingData = {
        claimantName: 'John Doe',
        employerName: 'Coal Corp',
      };

      const result = await autoDocketFiling(filingData, 'BLA', '');

      expect(result.success).toBe(false);
      expect(result.docketNumber).toBeUndefined();
    });

    it('should fail to docket invalid filing', async () => {
      const filingData = {
        claimantName: 'John Doe',
        // Missing required fields
      };

      const result = await autoDocketFiling(filingData, 'BLA', '');

      expect(result.success).toBe(false);
      expect(result.docketNumber).toBeUndefined();
      expect(result.message).toContain('cannot be auto-docketed');
    });

    it('should handle different case types', async () => {
      const filingData = {
        claimantName: 'John Doe',
        employerName: 'Coal Corp',
        ssn: '123-45-6789',
        dateOfBirth: '1970-01-15',
        dateOfInjury: '2025-12-15',
      };

      const blaResult = await autoDocketFiling(filingData, 'BLA', 'text');
      const lhcResult = await autoDocketFiling(filingData, 'LHC', 'text');
      const perResult = await autoDocketFiling(filingData, 'PER', 'text');

      // All should fail due to missing signature
      expect(blaResult.success).toBe(false);
      expect(lhcResult.success).toBe(false);
      expect(perResult.success).toBe(false);
    });
  });

  describe('generateDeficiencyNotice', () => {
    it('should generate properly formatted deficiency notice', () => {
      const deficiencies = [
        {
          id: '1',
          type: 'Missing Signature' as const,
          field: 'signature',
          description: 'No signature detected',
          severity: 'Critical' as const,
          autoFixable: false,
        },
      ];

      const notice = generateDeficiencyNotice(
        { claimantName: 'John Doe' },
        deficiencies,
        'John Doe'
      );

      expect(notice).toContain('NOTICE OF DEFICIENCY');
      expect(notice).toContain('John Doe');
      expect(notice).toContain('Missing Signature');
      expect(notice).toContain('resubmit');
    });

    it('should include all deficiencies in notice', () => {
      const deficiencies = [
        {
          id: '1',
          type: 'Missing Signature' as const,
          field: 'signature',
          description: 'No signature',
          severity: 'Critical' as const,
          autoFixable: false,
        },
        {
          id: '2',
          type: 'Missing Required Field' as const,
          field: 'employerEIN',
          description: 'Employer EIN missing',
          severity: 'Critical' as const,
          autoFixable: false,
        },
      ];

      const notice = generateDeficiencyNotice(
        { claimantName: 'John Doe' },
        deficiencies,
        'John Doe'
      );

      expect(notice).toContain('Missing Signature');
      expect(notice).toContain('Employer EIN');
    });
  });
});
