import { CaseType, Division, AppealType, CasePhase } from './types';
import {
  Wind,
  Ship,
  FileCheck,
  ShieldCheck,
  ArrowUpRight,
  History,
} from 'lucide-react';
import React from 'react';

// OALJ Case Types Only (BLA, LHC, PER)
export const CASE_TYPES: Record<CaseType, { label: string; icon: any }> = {
  BLA: { label: 'Black Lung (BLA)', icon: Wind },
  LHC: { label: 'Longshore (LHC)', icon: Ship },
  PER: { label: 'BALCA/PERM (PER)', icon: FileCheck },
};

// Boards Appeal Types Only (BRB, ARB, ECAB)
export const APPEAL_TYPES: Record<AppealType, { label: string; icon: any; prefix: string }> = {
  BRB: { label: 'Benefits Review Board', icon: ShieldCheck, prefix: 'BRB No.' },
  ARB: { label: 'Administrative Review Board', icon: ArrowUpRight, prefix: 'ARB No.' },
  ECAB: { label: 'Employees\' Compensation Appeals Board', icon: History, prefix: 'ECAB No.' },
};

export const PHASES: Record<CasePhase, { label: string; step: number }> = {
  'Intake': { label: 'Intake & Docketing', step: 1 },
  'Assignment': { label: 'Assignment', step: 2 },
  'Pre-Hearing': { label: 'Pre-Hearing', step: 3 },
  'Hearing': { label: 'Hearing', step: 4 },
  'Decision': { label: 'Decision', step: 5 },
  'Post-Decision': { label: 'Post-Decision', step: 6 },
};

export const OFFICES = [
  'Washington, DC',
  'Cherry Hill, NJ',
  'Cincinnati, OH',
  'Covington, LA',
  'Newport News, VA',
  'Pittsburgh, PA',
  'San Francisco, CA',
];

// Role Definitions - OALJ and Boards Only (for IACP Portal)
// External roles kept for UFS Portal compatibility
export const ROLES = {
  // External/UFS Portal Roles
  EXTERNAL: [
    'Attorney',
    'Lay Representative',
    'Pro Se / Self-Represented Party',
    'Attorney Staff / Legal Assistant',
    'Non-Party Participant',
    'Court Reporter'
  ],
  // OALJ Roles (Adjudication - BLA, LHC, PER)
  OALJ: [
    'OALJ Docket Clerk',
    'OALJ Legal Assistant',
    'OALJ Attorney-Advisor',
    'Administrative Law Judge',
  ],
  // Boards Roles (Appeals - BRB, ARB, ECAB)
  BOARDS: [
    'Board Docket Clerk',
    'Board Legal Assistant',
    'Board Attorney-Advisor',
    'Board Member',
  ],
  // IT Admin (kept for compatibility)
  IT_ADMIN: [
    'OCIO Administrator',
    'System Moderator',
    'IT Support Specialist'
  ],
};

// Helper to get all available roles for login
export const getAllRoles = () => [
  ...ROLES.EXTERNAL,
  ...ROLES.OALJ,
  ...ROLES.BOARDS,
  ...ROLES.IT_ADMIN,
];

// Helper to check if role is OALJ
export const isOALJRole = (role: string) => ROLES.OALJ.includes(role);

// Helper to check if role is Boards
export const isBoardsRole = (role: string) => ROLES.BOARDS.includes(role);

// Get case types for role
export const getCaseTypesForRole = (role: string): string[] => {
  if (isOALJRole(role)) {
    return ['BLA', 'LHC', 'PER'];
  }
  if (isBoardsRole(role)) {
    return ['BRB', 'ARB', 'ECAB'];
  }
  return [];
};

export const MOCK_OALJ_CASES = [
  {
    caseNumber: '2024-BLA-00042',
    claimant: 'John Doe',
    employer: 'Coal Corp',
    judge: 'Hon. Sarah Jenkins',
    decisionDate: '2026-01-15',
    status: 'Decided',
    phase: 'Post-Decision',
    parties: [
      { name: 'John Doe', role: 'Claimant', email: 'john@example.com' },
      { name: 'Coal Corp', role: 'Employer', email: 'legal@coalcorp.com' },
      { name: 'Director, OWCP', role: 'Party-in-Interest', email: 'director@dol.gov' }
    ],
    record: [
      { type: 'Decision', name: 'Decision and Order Awarding Benefits', date: '2026-01-15' },
      { type: 'Transcript', name: 'Hearing Transcript - 2025-11-10', date: '2025-11-20' },
      { type: 'Exhibit', name: 'CX-1: Medical Report', date: '2025-10-01' },
      { type: 'Exhibit', name: 'DX-1: Employment Records', date: '2025-10-05' }
    ]
  },
  {
    caseNumber: '2024-LHC-00123',
    claimant: 'Jane Smith',
    employer: 'Port Authority',
    judge: 'Hon. Michael Ross',
    decisionDate: '2026-02-10',
    status: 'Decided',
    phase: 'Post-Decision',
    parties: [
      { name: 'Jane Smith', role: 'Claimant', email: 'jane@example.com' },
      { name: 'Port Authority', role: 'Employer', email: 'hr@portauth.gov' }
    ],
    record: [
      { type: 'Decision', name: 'Decision and Order Denying Benefits', date: '2026-02-10' },
      // Missing transcript for testing "Record Completeness Scan"
      { type: 'Exhibit', name: 'CX-1: Injury Report', date: '2025-12-01' }
    ]
  }
];
