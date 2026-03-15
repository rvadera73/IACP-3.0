/**
 * Role-Based Access Control Configuration
 * 
 * Defines which roles can access which portals and case types
 * Ensures data isolation between OALJ and Boards
 */

// OALJ Case Types (Adjudication)
export const OALJ_CASE_TYPES = ['BLA', 'LHC', 'PER'] as const;
export type OALJCaseType = typeof OALJ_CASE_TYPES[number];

// Boards Case Types (Appeals)
export const BOARDS_CASE_TYPES = ['BRB', 'ARB', 'ECAB'] as const;
export type BoardsCaseType = typeof BOARDS_CASE_TYPES[number];

// OALJ Roles
export const OALJ_ROLES = {
  DOCKET_CLERK: 'OALJ Docket Clerk',
  LEGAL_ASSISTANT: 'OALJ Legal Assistant',
  ATTORNEY_ADVISOR: 'OALJ Attorney-Advisor',
  JUDGE: 'Administrative Law Judge',
} as const;

// Boards Roles
export const BOARDS_ROLES = {
  DOCKET_CLERK: 'Board Docket Clerk',
  LEGAL_ASSISTANT: 'Board Legal Assistant',
  ATTORNEY_ADVISOR: 'Board Attorney-Advisor',
  BOARD_MEMBER: 'Board Member',
} as const;

// All available roles
export const ALL_ROLES = {
  ...OALJ_ROLES,
  ...BOARDS_ROLES,
} as const;

export type Role = typeof ALL_ROLES[keyof typeof ALL_ROLES];

// Role to Portal Mapping
export const ROLE_PORTAL_MAPPING: Record<Role, 'OALJ' | 'BOARDS'> = {
  [OALJ_ROLES.DOCKET_CLERK]: 'OALJ',
  [OALJ_ROLES.LEGAL_ASSISTANT]: 'OALJ',
  [OALJ_ROLES.ATTORNEY_ADVISOR]: 'OALJ',
  [OALJ_ROLES.JUDGE]: 'OALJ',
  [BOARDS_ROLES.DOCKET_CLERK]: 'BOARDS',
  [BOARDS_ROLES.LEGAL_ASSISTANT]: 'BOARDS',
  [BOARDS_ROLES.ATTORNEY_ADVISOR]: 'BOARDS',
  [BOARDS_ROLES.BOARD_MEMBER]: 'BOARDS',
};

// Role to Case Type Mapping
export const ROLE_CASE_TYPES: Record<Role, readonly string[]> = {
  [OALJ_ROLES.DOCKET_CLERK]: OALJ_CASE_TYPES,
  [OALJ_ROLES.LEGAL_ASSISTANT]: OALJ_CASE_TYPES,
  [OALJ_ROLES.ATTORNEY_ADVISOR]: OALJ_CASE_TYPES,
  [OALJ_ROLES.JUDGE]: OALJ_CASE_TYPES,
  [BOARDS_ROLES.DOCKET_CLERK]: BOARDS_CASE_TYPES,
  [BOARDS_ROLES.LEGAL_ASSISTANT]: BOARDS_CASE_TYPES,
  [BOARDS_ROLES.ATTORNEY_ADVISOR]: BOARDS_CASE_TYPES,
  [BOARDS_ROLES.BOARD_MEMBER]: BOARDS_CASE_TYPES,
};

// Role Permissions
export interface RolePermissions {
  canDocket: boolean;
  canAssign: boolean;
  canScheduleHearing: boolean;
  canManageExhibits: boolean;
  canDraftDecision: boolean;
  canSignDecision: boolean;
  canSealDocument: boolean;
  canCloseRecord: boolean;
  canViewAllCases: boolean;
  canTransferCase: boolean;
}

export const ROLE_PERMISSIONS: Record<Role, RolePermissions> = {
  // OALJ Permissions
  [OALJ_ROLES.DOCKET_CLERK]: {
    canDocket: true,
    canAssign: true,
    canScheduleHearing: false,
    canManageExhibits: false,
    canDraftDecision: false,
    canSignDecision: false,
    canSealDocument: false,
    canCloseRecord: false,
    canViewAllCases: true,
    canTransferCase: true,
  },
  [OALJ_ROLES.LEGAL_ASSISTANT]: {
    canDocket: false,
    canAssign: false,
    canScheduleHearing: true,
    canManageExhibits: true,
    canDraftDecision: false,
    canSignDecision: false,
    canSealDocument: false,
    canCloseRecord: false,
    canViewAllCases: false,
    canTransferCase: false,
  },
  [OALJ_ROLES.ATTORNEY_ADVISOR]: {
    canDocket: false,
    canAssign: false,
    canScheduleHearing: false,
    canManageExhibits: false,
    canDraftDecision: true,
    canSignDecision: false,
    canSealDocument: false,
    canCloseRecord: false,
    canViewAllCases: false,
    canTransferCase: false,
  },
  [OALJ_ROLES.JUDGE]: {
    canDocket: false,
    canAssign: false,
    canScheduleHearing: false,
    canManageExhibits: false,
    canDraftDecision: true,
    canSignDecision: true,
    canSealDocument: true,
    canCloseRecord: true,
    canViewAllCases: true,
    canTransferCase: true,
  },
  
  // Boards Permissions
  [BOARDS_ROLES.DOCKET_CLERK]: {
    canDocket: true,
    canAssign: true,
    canScheduleHearing: false,
    canManageExhibits: false,
    canDraftDecision: false,
    canSignDecision: false,
    canSealDocument: false,
    canCloseRecord: false,
    canViewAllCases: true,
    canTransferCase: true,
  },
  [BOARDS_ROLES.LEGAL_ASSISTANT]: {
    canDocket: false,
    canAssign: false,
    canScheduleHearing: true,
    canManageExhibits: false,
    canDraftDecision: false,
    canSignDecision: false,
    canSealDocument: false,
    canCloseRecord: false,
    canViewAllCases: false,
    canTransferCase: false,
  },
  [BOARDS_ROLES.ATTORNEY_ADVISOR]: {
    canDocket: false,
    canAssign: false,
    canScheduleHearing: false,
    canManageExhibits: false,
    canDraftDecision: true,
    canSignDecision: false,
    canSealDocument: false,
    canCloseRecord: false,
    canViewAllCases: false,
    canTransferCase: false,
  },
  [BOARDS_ROLES.BOARD_MEMBER]: {
    canDocket: false,
    canAssign: false,
    canScheduleHearing: false,
    canManageExhibits: false,
    canDraftDecision: true,
    canSignDecision: true,
    canSealDocument: true,
    canCloseRecord: true,
    canViewAllCases: true,
    canTransferCase: true,
  },
};

// Helper Functions
export function isOALJRole(role: Role): boolean {
  return ROLE_PORTAL_MAPPING[role] === 'OALJ';
}

export function isBoardsRole(role: Role): boolean {
  return ROLE_PORTAL_MAPPING[role] === 'BOARDS';
}

export function getCaseTypesForRole(role: Role): readonly string[] {
  return ROLE_CASE_TYPES[role];
}

export function hasPermission(role: Role, permission: keyof RolePermissions): boolean {
  return ROLE_PERMISSIONS[role][permission];
}

// Login Page Configuration
export const LOGIN_PORTAL_OPTIONS = [
  {
    id: 'OALJ',
    name: 'OALJ Portal',
    description: 'Office of Administrative Law Judges',
    caseTypes: OALJ_CASE_TYPES,
    roles: Object.values(OALJ_ROLES),
    icon: 'Scale',
  },
  {
    id: 'BOARDS',
    name: 'Appellate Boards',
    description: 'BRB, ARB, ECAB',
    caseTypes: BOARDS_CASE_TYPES,
    roles: Object.values(BOARDS_ROLES),
    icon: 'Building2',
  },
];
