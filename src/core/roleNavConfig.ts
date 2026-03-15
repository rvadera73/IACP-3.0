/**
 * Role-Driven Navigation Configuration
 *
 * Defines workflow-specific navigation items for each OALJ/Boards role.
 * Navigation reflects actual daily workflow, not generic modules.
 */

import { OALJ_ROLES, BOARDS_ROLES } from './rbac';

export interface NavItem {
  id: string;
  label: string;
  icon: string; // Lucide icon name
  description?: string;
}

// OALJ Docket Clerk — "The Gatekeeper"
const DOCKET_CLERK_NAV: NavItem[] = [
  { id: 'inbox', label: 'Inbox', icon: 'Inbox', description: 'Incoming filings awaiting docketing' },
  { id: 'docketing', label: 'Docketing', icon: 'FileCheck', description: 'AI-assisted validation & docket assignment' },
  { id: 'assignment', label: 'Assignment', icon: 'UserCheck', description: 'Route cases to judges' },
  { id: 'all-cases', label: 'All Cases', icon: 'FolderOpen', description: 'Browse all docketed cases' },
  { id: 'case-viewer', label: 'Case Viewer', icon: 'Eye', description: 'Full case record viewer' },
];

// OALJ Attorney-Advisor — "The Legal Brain"
const ATTORNEY_ADVISOR_NAV: NavItem[] = [
  { id: 'my-cases', label: 'My Cases', icon: 'Briefcase', description: 'Assigned cases' },
  { id: 'bench-memo', label: 'Bench Memo', icon: 'FileText', description: 'Bench memorandum editor' },
  { id: 'draft-decision', label: 'Draft Decision', icon: 'FilePen', description: 'Decision & Order editor' },
  { id: 'research', label: 'Research', icon: 'Search', description: 'Legal research tools' },
  { id: 'case-viewer', label: 'Case Viewer', icon: 'Eye', description: 'Full case record viewer' },
];

// OALJ Legal Assistant — "The Scheduler"
const LEGAL_ASSISTANT_NAV: NavItem[] = [
  { id: 'scheduling', label: 'Scheduling', icon: 'Calendar', description: 'Hearing scheduling & smart scheduler' },
  { id: 'notices', label: 'Notices', icon: 'Mail', description: 'Notice of Hearing generation' },
  { id: 'transcripts', label: 'Transcripts', icon: 'FileAudio', description: 'Transcript management' },
  { id: 'my-judges-cases', label: "My Judge's Cases", icon: 'Scale', description: 'Cases for assigned judge' },
  { id: 'case-viewer', label: 'Case Viewer', icon: 'Eye', description: 'Full case record viewer' },
];

// OALJ Administrative Law Judge — "The Decision Maker"
const JUDGE_NAV: NavItem[] = [
  { id: 'my-cases', label: 'My Cases', icon: 'Briefcase', description: 'Assigned cases with deadline tracking' },
  { id: 'hearings', label: 'Hearings', icon: 'Video', description: 'Upcoming hearing schedule' },
  { id: 'decisions', label: 'Decisions', icon: 'FileText', description: 'Draft decisions for review' },
  { id: 'sign-release', label: 'Sign & Release', icon: 'PenTool', description: 'Finalize and sign decisions' },
  { id: 'case-viewer', label: 'Case Viewer', icon: 'Eye', description: 'Full case record viewer' },
];

// Role → Nav mapping
const ROLE_NAV_MAP: Record<string, NavItem[]> = {
  [OALJ_ROLES.DOCKET_CLERK]: DOCKET_CLERK_NAV,
  [OALJ_ROLES.ATTORNEY_ADVISOR]: ATTORNEY_ADVISOR_NAV,
  [OALJ_ROLES.LEGAL_ASSISTANT]: LEGAL_ASSISTANT_NAV,
  [OALJ_ROLES.JUDGE]: JUDGE_NAV,
  // Boards roles mirror their OALJ counterparts for now
  [BOARDS_ROLES.DOCKET_CLERK]: DOCKET_CLERK_NAV,
  [BOARDS_ROLES.ATTORNEY_ADVISOR]: ATTORNEY_ADVISOR_NAV,
  [BOARDS_ROLES.LEGAL_ASSISTANT]: LEGAL_ASSISTANT_NAV,
  [BOARDS_ROLES.BOARD_MEMBER]: JUDGE_NAV,
};

export function getNavForRole(role: string): NavItem[] {
  return ROLE_NAV_MAP[role] || [];
}

export function getDefaultNavItem(role: string): string {
  const nav = getNavForRole(role);
  return nav.length > 0 ? nav[0].id : '';
}
