import { describe, it, expect } from 'vitest';
import {
  isOALJRole,
  isBoardsRole,
  getCaseTypesForRole,
  hasPermission,
  ROLE_PERMISSIONS,
  OALJ_ROLES,
  BOARDS_ROLES,
  OALJ_CASE_TYPES,
  BOARDS_CASE_TYPES,
} from '../core/rbac';

describe('RBAC', () => {
  describe('isOALJRole', () => {
    it('should return true for OALJ roles', () => {
      expect(isOALJRole('OALJ Docket Clerk')).toBe(true);
      expect(isOALJRole('OALJ Legal Assistant')).toBe(true);
      expect(isOALJRole('OALJ Attorney-Advisor')).toBe(true);
      expect(isOALJRole('Administrative Law Judge')).toBe(true);
    });

    it('should return false for Boards roles', () => {
      expect(isOALJRole('Board Docket Clerk')).toBe(false);
      expect(isOALJRole('Board Legal Assistant')).toBe(false);
      expect(isOALJRole('Board Attorney-Advisor')).toBe(false);
      expect(isOALJRole('Board Member')).toBe(false);
    });
  });

  describe('isBoardsRole', () => {
    it('should return true for Boards roles', () => {
      expect(isBoardsRole('Board Docket Clerk')).toBe(true);
      expect(isBoardsRole('Board Legal Assistant')).toBe(true);
      expect(isBoardsRole('Board Attorney-Advisor')).toBe(true);
      expect(isBoardsRole('Board Member')).toBe(true);
    });

    it('should return false for OALJ roles', () => {
      expect(isBoardsRole('OALJ Docket Clerk')).toBe(false);
      expect(isBoardsRole('OALJ Legal Assistant')).toBe(false);
      expect(isBoardsRole('OALJ Attorney-Advisor')).toBe(false);
      expect(isBoardsRole('Administrative Law Judge')).toBe(false);
    });
  });

  describe('getCaseTypesForRole', () => {
    it('should return OALJ case types for OALJ roles', () => {
      const oaljCaseTypes = getCaseTypesForRole('OALJ Docket Clerk');
      expect(oaljCaseTypes).toContain('BLA');
      expect(oaljCaseTypes).toContain('LHC');
      expect(oaljCaseTypes).toContain('PER');
    });

    it('should return Boards case types for Boards roles', () => {
      const boardsCaseTypes = getCaseTypesForRole('Board Docket Clerk');
      expect(boardsCaseTypes).toContain('BRB');
      expect(boardsCaseTypes).toContain('ARB');
      expect(boardsCaseTypes).toContain('ECAB');
    });
  });

  describe('hasPermission', () => {
    it('should return true for docket clerk docketing permission', () => {
      expect(hasPermission('OALJ Docket Clerk', 'canDocket')).toBe(true);
      expect(hasPermission('Board Docket Clerk', 'canDocket')).toBe(true);
    });

    it('should return false for docket clerk sign decision permission', () => {
      expect(hasPermission('OALJ Docket Clerk', 'canSignDecision')).toBe(false);
      expect(hasPermission('Board Docket Clerk', 'canSignDecision')).toBe(false);
    });

    it('should return true for judge sign decision permission', () => {
      expect(hasPermission('Administrative Law Judge', 'canSignDecision')).toBe(true);
      expect(hasPermission('Board Member', 'canSignDecision')).toBe(true);
    });

    it('should return true for legal assistant schedule hearing permission', () => {
      expect(hasPermission('OALJ Legal Assistant', 'canScheduleHearing')).toBe(true);
      expect(hasPermission('Board Legal Assistant', 'canScheduleHearing')).toBe(true);
    });

    it('should return true for attorney advisor draft decision permission', () => {
      expect(hasPermission('OALJ Attorney-Advisor', 'canDraftDecision')).toBe(true);
      expect(hasPermission('Board Attorney-Advisor', 'canDraftDecision')).toBe(true);
    });

    it('should return false for legal assistant docket permission', () => {
      expect(hasPermission('OALJ Legal Assistant', 'canDocket')).toBe(false);
    });
  });

  describe('ROLE_PERMISSIONS', () => {
    it('should have permissions for all OALJ roles', () => {
      Object.values(OALJ_ROLES).forEach(role => {
        expect(ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS]).toBeDefined();
        expect(ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS].canViewAllCases).toBeDefined();
      });
    });

    it('should have permissions for all Boards roles', () => {
      Object.values(BOARDS_ROLES).forEach(role => {
        expect(ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS]).toBeDefined();
        expect(ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS].canViewAllCases).toBeDefined();
      });
    });
  });

  describe('Case Types Constants', () => {
    it('should have correct OALJ case types', () => {
      expect(OALJ_CASE_TYPES).toContain('BLA');
      expect(OALJ_CASE_TYPES).toContain('LHC');
      expect(OALJ_CASE_TYPES).toContain('PER');
      expect(OALJ_CASE_TYPES.length).toBe(3);
    });

    it('should have correct Boards case types', () => {
      expect(BOARDS_CASE_TYPES).toContain('BRB');
      expect(BOARDS_CASE_TYPES).toContain('ARB');
      expect(BOARDS_CASE_TYPES).toContain('ECAB');
      expect(BOARDS_CASE_TYPES.length).toBe(3);
    });
  });
});
