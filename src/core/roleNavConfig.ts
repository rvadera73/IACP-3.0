/**
 * Role-Driven Navigation Configuration
 *
 * Defines workflow-specific navigation items for each OALJ/Boards role.
 * Navigation reflects actual daily workflow, not generic modules.
 * Case Viewer is NOT a nav item — it opens as a modal when a case is selected.
 */

import { OALJ_ROLES, BOARDS_ROLES } from './rbac';

export interface NavItem {
  id: string;
  label: string;
  icon: string; // Lucide icon name
  description?: string;
}

// ─── OALJ Navigation ───────────────────────────────────────────────

// OALJ Docket Clerk — "The Gatekeeper"
const OALJ_DOCKET_CLERK_NAV: NavItem[] = [
  { id: 'inbox', label: 'Inbox', icon: 'Inbox', description: 'Incoming filings awaiting docketing' },
  { id: 'docketing', label: 'Docketing', icon: 'FileCheck', description: 'AI-assisted validation & docket assignment' },
  { id: 'assignment', label: 'Assignment', icon: 'UserCheck', description: 'Route cases to judges' },
  { id: 'all-cases', label: 'All Cases', icon: 'FolderOpen', description: 'Browse all docketed cases' },
];

// OALJ Attorney-Advisor — "The Legal Brain"
const OALJ_ATTORNEY_ADVISOR_NAV: NavItem[] = [
  { id: 'my-cases', label: 'My Cases', icon: 'Briefcase', description: 'Assigned cases' },
  { id: 'bench-memo', label: 'Bench Memo', icon: 'FileText', description: 'Bench memorandum editor' },
  { id: 'draft-decision', label: 'Draft Decision', icon: 'FilePen', description: 'Decision & Order editor' },
  { id: 'research', label: 'Research', icon: 'Search', description: 'Legal research tools' },
];

// OALJ Legal Assistant — "The Scheduler"
const OALJ_LEGAL_ASSISTANT_NAV: NavItem[] = [
  { id: 'scheduling', label: 'Scheduling', icon: 'Calendar', description: 'Hearing scheduling & smart scheduler' },
  { id: 'notices', label: 'Notices', icon: 'Mail', description: 'Notice of Hearing generation' },
  { id: 'transcripts', label: 'Transcripts', icon: 'FileAudio', description: 'Transcript management' },
  { id: 'my-judges-cases', label: "My Judge's Cases", icon: 'Scale', description: 'Cases for assigned judge' },
];

// OALJ Administrative Law Judge — "The Decision Maker"
const OALJ_JUDGE_NAV: NavItem[] = [
  { id: 'my-cases', label: 'My Cases', icon: 'Briefcase', description: 'Assigned cases with deadline tracking' },
  { id: 'hearings', label: 'Hearings', icon: 'Video', description: 'Upcoming hearing schedule' },
  { id: 'decisions', label: 'Decisions', icon: 'FileText', description: 'Draft decisions for review' },
  { id: 'sign-release', label: 'Sign & Release', icon: 'PenTool', description: 'Finalize and sign decisions' },
];

// ─── Boards Navigation (Appellate-focused terminology) ──────────────

// Board Docket Clerk
const BOARD_DOCKET_CLERK_NAV: NavItem[] = [
  { id: 'inbox', label: 'Appeal Inbox', icon: 'Inbox', description: 'Incoming appeals awaiting docketing' },
  { id: 'docketing', label: 'Docketing', icon: 'FileCheck', description: 'Appeal validation & docket assignment' },
  { id: 'assignment', label: 'Panel Assignment', icon: 'UserCheck', description: 'Route appeals to panel members' },
  { id: 'all-cases', label: 'All Appeals', icon: 'FolderOpen', description: 'Browse all docketed appeals' },
];

// Board Attorney-Advisor
const BOARD_ATTORNEY_ADVISOR_NAV: NavItem[] = [
  { id: 'my-cases', label: 'My Appeals', icon: 'Briefcase', description: 'Assigned appeals' },
  { id: 'bench-memo', label: 'Case Summary', icon: 'FileText', description: 'Appellate case summary editor' },
  { id: 'draft-decision', label: 'Draft Opinion', icon: 'FilePen', description: 'Board opinion editor' },
  { id: 'research', label: 'Research', icon: 'Search', description: 'Legal research tools' },
];

// Board Legal Assistant
const BOARD_LEGAL_ASSISTANT_NAV: NavItem[] = [
  { id: 'scheduling', label: 'Oral Arguments', icon: 'Calendar', description: 'Oral argument scheduling' },
  { id: 'notices', label: 'Notices', icon: 'Mail', description: 'Notice generation & tracking' },
  { id: 'transcripts', label: 'Briefs & Record', icon: 'FileAudio', description: 'Briefing schedule & record management' },
  { id: 'my-judges-cases', label: "My Panel's Appeals", icon: 'Scale', description: 'Appeals for assigned panel' },
];

// Board Member
const BOARD_MEMBER_NAV: NavItem[] = [
  { id: 'my-cases', label: 'My Appeals', icon: 'Briefcase', description: 'Assigned appeals with deadline tracking' },
  { id: 'hearings', label: 'Oral Arguments', icon: 'Video', description: 'Upcoming oral arguments' },
  { id: 'decisions', label: 'Opinions', icon: 'FileText', description: 'Draft opinions for review' },
  { id: 'sign-release', label: 'Issue Decision', icon: 'PenTool', description: 'Finalize and issue board decisions' },
];

// ─── Role → Nav mapping ─────────────────────────────────────────────

const ROLE_NAV_MAP: Record<string, NavItem[]> = {
  // OALJ
  [OALJ_ROLES.DOCKET_CLERK]: OALJ_DOCKET_CLERK_NAV,
  [OALJ_ROLES.ATTORNEY_ADVISOR]: OALJ_ATTORNEY_ADVISOR_NAV,
  [OALJ_ROLES.LEGAL_ASSISTANT]: OALJ_LEGAL_ASSISTANT_NAV,
  [OALJ_ROLES.JUDGE]: OALJ_JUDGE_NAV,
  // Boards
  [BOARDS_ROLES.DOCKET_CLERK]: BOARD_DOCKET_CLERK_NAV,
  [BOARDS_ROLES.ATTORNEY_ADVISOR]: BOARD_ATTORNEY_ADVISOR_NAV,
  [BOARDS_ROLES.LEGAL_ASSISTANT]: BOARD_LEGAL_ASSISTANT_NAV,
  [BOARDS_ROLES.BOARD_MEMBER]: BOARD_MEMBER_NAV,
};

export function getNavForRole(role: string): NavItem[] {
  return ROLE_NAV_MAP[role] || [];
}

export function getDefaultNavItem(role: string): string {
  const nav = getNavForRole(role);
  return nav.length > 0 ? nav[0].id : '';
}
