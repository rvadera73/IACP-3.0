# IACP-3.0 Data Model Specification
## Based on Prototype Screens and Implementation

**Version:** 3.0  
**Date:** March 22, 2026  
**Source:** Derived from actual IACP-3.0 prototype implementation

---

## Executive Summary

This document defines the data model for IACP-3.0 based on the **actual implementation** in the codebase, not external references. All entities, relationships, and workflows are derived from:

- `src/types.ts` - Core TypeScript interfaces
- `src/constants.ts` - System constants and configurations
- `src/core/rbac.ts` - Role-based access control
- `src/data/mockDataEnhanced.ts` - Enhanced mock data structures
- `src/data/mockCaseData.ts` - Case lifecycle mock data
- `src/components/iacp/*.tsx` - Dashboard implementations
- `src/services/*.ts` - Business logic services

---

## 1. Core Design Principles

### 1.1 Portal Separation

```
┌─────────────────────────────────────────────────────────────┐
│                     IACP System                              │
│  ┌───────────────────────┐   ┌───────────────────────┐     │
│  │    OALJ Portal        │   │   Boards Portal       │     │
│  │  (Adjudication)       │   │   (Appellate)         │     │
│  │                       │   │                       │     │
│  │  Case Types:          │   │  Case Types:          │     │
│  │  • BLA (Black Lung)   │   │  • BRB (Benefits Rev) │     │
│  │  • LHC (Longshore)    │   │  • ARB (Admin Review) │     │
│  │  • PER (PERM/BALCA)   │   │  • ECAB (FECA Appeals)│     │
│  │                       │   │                       │     │
│  │  Roles:               │   │  Roles:               │     │
│  │  • Docket Clerk       │   │  • Docket Clerk       │     │
│  │  • Legal Assistant    │   │  • Legal Assistant    │     │
│  │  • Attorney-Advisor   │   │  • Attorney-Advisor   │     │
│  │  • Judge (ALJ)        │   │  • Board Member       │     │
│  └───────────────────────┘   └───────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Case Lifecycle Stages

**OALJ (Adjudication):**
```
Intake Review → Docketed → Awaiting Assignment → Assigned → 
Pre-Hearing → Hearing Scheduled → Hearing Complete → 
Decision Pending → Decision Signed → Released → Final/Appealed
```

**Boards (Appellate):**
```
Notice of Appeal → Transmission → Record Complete → 
Briefing → Oral Argument (optional) → Panel Review → 
Decision → Final
```

---

## 2. Entity Definitions

### 2.1 User

**Source:** `src/types.ts`, `src/core/rac.ts`

```typescript
interface User {
  // Identity
  id: string;                    // UUID
  name: string;
  email: string;
  
  // Role & Division
  role: UserRole;
  division: 'OALJ' | 'BOARDS';
  
  // OALJ Specific
  office?: string;               // Physical office location
  specialty?: ProgramCode[];     // Case type expertise
  
  // Boards Specific
  panelMember?: boolean;         // For Board Members only
  boards?: BoardCode[];          // Board assignments
  
  // Organization (external users)
  organization?: string;
  barNumber?: string;            // For attorneys
}

type UserRole =
  // OALJ Roles
  | 'OALJ Docket Clerk'
  | 'OALJ Legal Assistant'
  | 'OALJ Attorney-Advisor'
  | 'Administrative Law Judge'
  
  // Boards Roles
  | 'Board Docket Clerk'
  | 'Board Legal Assistant'
  | 'Board Attorney-Advisor'
  | 'Board Member'
  
  // External (UFS Portal)
  | 'Attorney'
  | 'Lay Representative'
  | 'Pro Se / Self-Represented Party'
  | 'Attorney Staff / Legal Assistant';

type ProgramCode = 'BLA' | 'LHC' | 'PER';
type BoardCode = 'BRB' | 'ARB' | 'ECAB';
```

**Usage in Screens:**
- All dashboards use `useAuth()` hook to get current user
- Role determines which dashboard is shown
- Division filters case access (OALJ vs. Boards)

---

### 2.2 Case (Intake/Filing)

**Source:** `src/data/mockDataEnhanced.ts`, `src/components/iacp/DocketClerkDashboard.tsx`

```typescript
interface IntakeCase {
  // Identity
  id: string;                    // INT-YYYY-NNNNN format
  docketNumber?: string;         // Assigned after docketing (YYYY-XXX-NNNNN)
  
  // Classification
  programArea: ProgramCode | BoardCode;
  perspective: 'trial' | 'appellate';
  
  // Lifecycle
  proceduralState: ProceduralState;
  status: IntakeStatus;
  
  // Filing Details
  filedAt: string;               // ISO datetime
  docketedAt?: string;           // When officially docketed
  daysElapsed: number;
  deadlineDate: string;          // 270-day for BLA
  
  // Parties
  claimant?: string;
  employer?: string;
  petitioner?: string;           // For PER/Boards
  respondent?: string;           // For Boards
  
  // Assignment
  office: string;
  assignedJudge?: string;        // Judge ID after assignment
  panel?: string[];              // For Boards (3 members)
  
  // Filing Channel
  channel: FilingChannel;
  
  // AI Processing
  aiScore: number;               // 0-100 completeness score
  deficiencies?: Deficiency[];
  
  // Data
  parties: Party[];
  documents: Document[];
  motions: Motion[];
  hearings: Hearing[];
  deadlines: Deadline[];
  
  // Raw filing data
  filingData: FilingData;
}

type ProceduralState =
  | 'Intake Review'
  | 'Docketed - Awaiting Assignment'
  | 'Assigned - Pending Draft'
  | 'Hearing Scheduled'
  | 'Post-Hearing - Pending Decision'
  | 'Decision Drafted'
  | 'Signed & Released'
  | 'Appealed';

type IntakeStatus =
  | 'New'
  | 'Processing'
  | 'Auto-Docket Ready'
  | 'Manual Review'
  | 'Deficiency Notice Sent'
  | 'Docketed';

type FilingChannel = 'UFS' | 'Email' | 'Paper';
```

**Usage in Screens:**
- Docket Clerk Dashboard: Shows intake queue with status filters
- Auto-docketing: Uses `aiScore` and `deficiencies` to determine readiness
- Assignment: Uses `assignedJudge` to track judicial allocation

---

### 2.3 Party

**Source:** `src/data/mockDataEnhanced.ts`, `src/data/mockCaseData.ts`

```typescript
interface Party {
  // Identity
  name: string;
  role: PartyRole;
  
  // Representation
  represented: boolean;
  attorney?: string;             // Law firm or attorney name
  
  // Contact
  email?: string;
  phone?: string;
  address?: string;
  
  // Service
  servicePreference: 'electronic' | 'mail';
}

type PartyRole =
  | 'Claimant'
  | 'Employer'
  | 'Petitioner'
  | 'Respondent'
  | 'Party-in-Interest'          // Director, OWCP
  | 'Intervenor';
```

**Key Business Rules:**
1. **Pro Se Detection:** `represented: false` triggers special service rules
2. **Service Preference:** Determines NEF delivery method
3. **Director, OWCP:** Required party in BLA/LHC cases (20 C.F.R. § 702.311)

**Usage in Screens:**
- Case Intelligence Hub: Shows party list with representation status
- Smart Scheduler: Uses `servicePreference` for notice delivery
- Deficiency notices: Sent to party email/address

---

### 2.4 Document

**Source:** `src/types.ts`, `src/data/mockDataEnhanced.ts`

```typescript
interface Document {
  // Identity
  id: string;
  name: string;
  
  // Classification
  type: DocumentType;
  
  // Filing Info
  filedAt: string;
  filedBy: string;
  status: DocumentStatus;
  
  // Physical
  size: string;                  // e.g., "2.1 MB"
  pages: number;
  
  // Content (for prototype)
  content?: string;              // Full text for AI analysis
}

type DocumentType = 'filings' | 'exhibits' | 'decisions' | 'orders' | 'transcripts' | 'memos';

type DocumentStatus = 'Filed' | 'Accepted' | 'Admitted' | 'Rejected' | 'Pending';
```

**Usage in Screens:**
- Case Intelligence Hub: Document list with type badges
- Document Viewer: Shows content with zoom/print/download
- AI Analysis: `content` field used for PII detection

---

### 2.5 Deficiency

**Source:** `src/data/mockDataEnhanced.ts`, `src/services/autoDocketing.ts`

```typescript
interface Deficiency {
  // Identity
  id: string;                    // DEF-NNNNN format
  
  // Classification
  type: DeficiencyType;
  field: string;                 // Form field name
  
  // Details
  description: string;
  severity: 'Critical' | 'Warning';
  
  // Auto-Fix
  autoFixable: boolean;
  
  // Workflow
  notifiedAt?: string;
  correctedAt?: string;
}

type DeficiencyType =
  | 'Missing Signature'
  | 'Illegible Field'
  | 'Missing Required Field'
  | 'Invalid Format'
  | 'Missing Document';
```

**Usage in Screens:**
- Docket Clerk Dashboard: Shows deficiency count and details
- Deficiency Notice: Generated from deficiency array
- Auto-Docket: Blocks if `deficiencies.length > 0`

---

### 2.6 Hearing

**Source:** `src/data/mockDataEnhanced.ts`, `src/services/smartScheduler.ts`

```typescript
interface Hearing {
  // Identity
  id: string;
  type: HearingType;
  
  // Scheduling
  date: string;                  // YYYY-MM-DD
  time: string;                  // HH:MM AM/PM
  location: string;              // City, State
  
  // Resources
  courtroom?: string;            // Room number
  judge?: string;                // Judge name
  courtReporter?: string;        // Reporter name
  videoConference?: boolean;
  
  // Status
  status: HearingStatus;
  
  // Service
  noticeSentAt?: string;
  transcriptAvailable?: boolean;
}

type HearingType = 'Hearing' | 'Pre-Hearing Conference' | 'Status Conference';

type HearingStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';
```

**Usage in Screens:**
- Legal Assistant Dashboard: Pending scheduling list
- Smart Scheduler: Shows optimal dates with judge/reporter/room
- Judge Dashboard: Upcoming hearings calendar

---

### 2.7 Judge

**Source:** `src/data/mockDataEnhanced.ts`, `src/services/smartAssignment.ts`

```typescript
interface Judge {
  // Identity
  id: string;                    // JNNN format
  name: string;
  office: string;
  
  // Workload
  activeCases: number;
  weightedLoad: number;          // Algorithm-calculated
  capacity: number;              // Max cases (typically 75)
  
  // Expertise
  specialty: ProgramCode[];
  
  // Performance
  compliance270: number;         // Percentage on-time
  pendingDecisions: number;
  upcomingHearings: number;
  
  // Availability
  availableDates: string[];      // For scheduling
}
```

**Usage in Screens:**
- Docket Clerk Dashboard: Judge assignment modal
- Smart Assignment: Shows top 3 judges with AI reasons
- Legal Assistant Dashboard: Judge availability for scheduling

---

### 2.8 Motion

**Source:** `src/data/mockDataEnhanced.ts`, `src/data/mockCaseData.ts`

```typescript
interface Motion {
  // Identity
  id: string;
  type: string;                  // e.g., "Motion to Compel"
  
  // Filing
  filedAt: string;
  status: MotionStatus;
  
  // Ruling
  ruling?: string;
  rulingDate?: string;
}

type MotionStatus = 'Pending' | 'Granted' | 'Denied' | 'Withdrawn';
```

**Usage in Screens:**
- Case Intelligence Hub: Motions list with status
- Judge Dashboard: Pending motions count
- Pre-Hearing checklist: Outstanding motions

---

### 2.9 Deadline

**Source:** `src/data/mockDataEnhanced.ts`

```typescript
interface Deadline {
  // Identity
  id: string;
  type: string;                  // e.g., "Employer Response"
  
  // Timing
  dueDate: string;               // YYYY-MM-DD
  description: string;
  
  // Status
  status: DeadlineStatus;
  daysRemaining?: number;
}

type DeadlineStatus = 'Pending' | 'Completed' | 'Overdue' | 'Extended';
```

**Usage in Screens:**
- Case Intelligence Hub: Deadline tracker
- Judge Dashboard: 270-day alert banner
- Legal Assistant Dashboard: Scheduling deadlines

---

### 2.10 Filing (UFS Portal)

**Source:** `src/types.ts`

```typescript
interface Filing {
  // Identity
  id: string;
  intakeId: string;              // Links to IntakeCase
  caseId?: string;               // If linked to existing case
  
  // Classification
  type: string;                  // e.g., "Claim", "Motion"
  category: string;              // e.g., "Initiating", "Responsive"
  
  // Submitter
  submittedBy: string;
  submittedAt: string;
  
  // Status
  status: 'Pending' | 'Accepted' | 'Deficient';
  
  // Content
  description: string;
  aiAnalysis?: string;           // AI-generated summary
  
  // Document
  documentUrl?: string;
  fileName?: string;
  
  // Metadata
  metadata?: FilingMetadata;
  
  // AI Findings
  findings?: FilingFindings;
  
  // Extracted Data
  extractedMetadata?: ExtractedMetadata;
}

interface FilingMetadata {
  formNumber?: string;
  isUrgent?: boolean;
  representativeId?: string;
  barNumber?: string;
}

interface FilingFindings {
  identityMatch: {
    status: 'Match' | 'Mismatch' | 'Unverified';
    details: string;
  };
  redactionScan: {
    status: 'Clean' | 'Flagged';
    details: string;
    count: number;
  };
  timelinessCheck: {
    status: 'Timely' | 'Late';
    details: string;
  };
  deficiencyDetection: {
    status: 'None' | 'Detected';
    details: string;
    autoNotice?: boolean;
  };
}

interface ExtractedMetadata {
  ssn?: string;
  claimantId?: string;
  dateOfInjury?: string;
  employerName?: string;
  carrierId?: string;
  originalCaseNumber?: string;
  dateOfDecision?: string;
  appealingPartyRole?: string;
  physicianName?: string;
  dateOfExam?: string;
  documentCategory?: string;
  filingParty?: string;
  relatedMotionId?: string;
  requestedExtensionDate?: string;
}
```

**Usage in Screens:**
- UFS Portal: Filing submission
- Docket Clerk Dashboard: Intake queue population
- AI Analysis: Findings displayed for clerk review

---

## 3. Service Interfaces

### 3.1 Auto-Docketing Service

**Source:** `src/services/autoDocketing.ts`

```typescript
interface AutoDocketResult {
  success: boolean;
  docketNumber?: string;
  message: string;
  deficiencies?: Deficiency[];
}

// Functions
function autoDocketFiling(
  filingData: FilingData,
  caseType: ProgramCode,
  documentText: string
): Promise<AutoDocketResult>;

function generateDeficiencyNotice(
  caseId: string,
  deficiencies: Deficiency[]
): string;
```

**Workflow:**
```
1. AI Validation → 2. Deficiency Check → 3. Generate Docket Number → 4. Create Case Record
```

**Usage:**
- Docket Clerk clicks "Docket" button
- System runs `autoDocketFiling()`
- Returns docket number or deficiency list

---

### 3.2 Smart Assignment Service

**Source:** `src/services/smartAssignment.ts`

```typescript
interface AssignmentResult {
  suggestedJudges: Judge[];      // Top 3 suggestions
  reasons: Record<string, string[]>;  // Judge ID → AI reasons
}

interface JudgeScore {
  judgeId: string;
  score: number;
  breakdown: {
    workload: number;            // 40%
    geography: number;           // 30%
    expertise: number;           // 20%
    rotation: number;            // 10%
  };
}

// Functions
function getSuggestedJudges(
  caseType: ProgramCode,
  office: string,
  currentLoad?: Record<string, number>
): AssignmentResult;
```

**Algorithm:**
```typescript
score = (
  workloadScore * 0.40 +      // Lower load = higher score
  geographyScore * 0.30 +     // Same office = higher score
  expertiseScore * 0.20 +     // Case type specialty = higher score
  rotationScore * 0.10        // Least recent assignment = higher score
);
```

**Usage:**
- Docket Clerk clicks "Assign" on docketed case
- System calls `getSuggestedJudges()`
- Shows modal with Top 3 judges and AI reasons

---

### 3.3 Smart Scheduler Service

**Source:** `src/services/smartScheduler.ts`

```typescript
interface HearingSchedule {
  date: string;
  time: string;
  location: string;
  courtroom: string;
  judge: string;
  courtReporter: string;
  videoConference: boolean;
  optimal: boolean;
  reasons: string[];
}

interface ServiceValidation {
  valid: boolean;
  errors: string[];
}

interface NoticeOfHearing {
  caseNumber: string;
  claimant: string;
  employer: string;
  hearingDetails: HearingSchedule;
  parties: Party[];
  content: string;               // Generated notice text
}

interface ReporterDispatch {
  reporter: string;
  confirmed: boolean;
  contactInfo: string;
}

// Functions
function findOptimalHearingDates(options: {
  caseType: ProgramCode;
  judgeId: string;
  office: string;
  hasProSeParty: boolean;
  hearingType: HearingType;
  duration: number;              // Hours
}): HearingSchedule[];

function generateNoticeOfHearing(
  caseNumber: string,
  claimant: string,
  employer: string,
  schedule: HearingSchedule,
  parties: Party[]
): NoticeOfHearing;

function dispatchCourtReporter(
  office: string,
  date: string,
  caseNumber: string
): ReporterDispatch;

function validateProSeService(
  parties: Party[],
  proposedMethod: string
): ServiceValidation;
```

**Pro Se Service Rules:**
```typescript
// 20 C.F.R. § 702.341
if (party.represented === false) {
  // Must use certified mail with return receipt
  if (proposedMethod !== 'CERTIFIED') {
    return {
      valid: false,
      errors: ['Pro Se party requires certified mail service']
    };
  }
  
  // 14-day notice required
  const noticeDays = daysBetween(noticeDate, hearingDate);
  if (noticeDays < 14) {
    return {
      valid: false,
      errors: ['Pro Se party requires 14 days notice']
    };
  }
}
```

**Usage:**
- Legal Assistant clicks "Schedule" on pending hearing
- System calls `findOptimalHearingDates()`
- Shows 3 optimal dates with judge/reporter/room
- On confirm: `generateNoticeOfHearing()` + `dispatchCourtReporter()`

---

## 4. Dashboard Data Structures

### 4.1 Docket Clerk Dashboard

**Source:** `src/components/iacp/DocketClerkDashboard.tsx`

```typescript
interface DocketClerkDashboardState {
  // Views
  activeView: 'dashboard' | 'my-cases' | 'docket-queue' | 'assignment-queue' | 'analytics';
  
  // Filings (Intake Queue)
  filings: IntakeCase[];
  
  // Filters
  filterChannel: string;         // 'all', 'UFS', 'Email', 'Paper'
  filterStatus: string;          // 'all', 'Auto-Docket Ready', etc.
  searchQuery: string;
  
  // Assignment Modal
  showAssignmentModal: boolean;
  selectedForAssignment: IntakeCase | null;
  suggestedJudges: Judge[];
  
  // Processing
  isProcessing: boolean;
  processingMessage: string;
  
  // Stats
  stats: {
    totalIntake: number;
    autoDocketed: number;
    manualReview: number;
    deficiencyNotices: number;
    awaitingAssignment: number;
  };
}

// Sample Filings Data (from prototype)
const sampleFilings: IntakeCase[] = [
  {
    id: 'INT-2026-00089',
    docketNumber: undefined,
    programArea: 'BLA',
    perspective: 'trial',
    proceduralState: 'Intake Review',
    status: 'Auto-Docket Ready',
    filedAt: '2026-03-11 09:23 AM',
    daysElapsed: 0,
    deadlineDate: '2026-12-10',
    claimant: 'Robert Martinez',
    employer: 'Apex Coal Mining',
    office: 'Pittsburgh, PA',
    channel: 'UFS',
    aiScore: 98,
    deficiencies: [],
    parties: [...],
    documents: [...],
    motions: [],
    hearings: [],
    deadlines: [...],
    filingData: {...}
  },
  // ... more filings
];
```

---

### 4.2 Judge Dashboard

**Source:** `src/components/iacp/OALJJudgeDashboard.tsx`

```typescript
interface JudgeDashboardState {
  // Views
  activeView: 'dashboard' | 'analytics' | 'redline';
  
  // Redline Modal
  showRedlineModal: boolean;
  selectedCaseForRedline: CaseData | null;
  
  // Stats
  stats: {
    activeCases: number;
    upcomingHearings: number;
    decisionsDue: number;
    motionsPending: number;
  };
  
  // Decisions Pending
  decisionsPending: DecisionPending[];
  
  // Hearings
  upcomingHearings: HearingSummary[];
}

interface DecisionPending {
  caseNumber: string;
  claimant: string;
  daysPending: number;
  priority: 'High' | 'Medium' | 'Low';
  draftVersion: number;
}

interface HearingSummary {
  caseNumber: string;
  claimant: string;
  date: string;
  time: string;
  type: HearingType;
}

// 270-Day Alert
interface DeadlineAlert {
  caseNumber: string;
  daysOverdue: number;          // Negative = days remaining
  badge: 'error' | 'warning';
}
```

---

### 4.3 Legal Assistant Dashboard

**Source:** `src/components/iacp/OALJLegalAssistantDashboard.tsx`

```typescript
interface LegalAssistantDashboardState {
  // Views
  activeView: 'dashboard' | 'schedule' | 'notices' | 'analytics';
  
  // Scheduler
  showScheduler: boolean;
  suggestedDates: HearingSchedule[];
  selectedDate: HearingSchedule | null;
  selectedCaseForScheduling: CaseData | null;
  
  // Notice Preview
  showNoticePreview: boolean;
  selectedNoticeCase: CaseData | null;
  
  // Stats
  stats: {
    hearingsThisMonth: number;
    noticesIssued: number;
    pendingScheduling: number;
    transcriptsPending: number;
  };
  
  // Pending Scheduling
  pendingScheduling: PendingHearing[];
  
  // Upcoming Hearings
  upcomingHearings: ScheduledHearing[];
}

interface PendingHearing {
  caseNumber: string;
  claimant: string;
  judge: string;
  type: HearingType;
  proSe: boolean;
  pendingActions: string[];
  parties: Party[];
}

interface ScheduledHearing {
  caseNumber: string;
  date: string;
  time: string;
  location: string;
  judge: string;
  reporter: string;
}
```

---

## 5. Permission Matrix

**Source:** `src/core/rbac.ts`

```typescript
interface RolePermissions {
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

const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  // OALJ Roles
  'OALJ Docket Clerk': {
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
  'OALJ Legal Assistant': {
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
  'OALJ Attorney-Advisor': {
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
  'Administrative Law Judge': {
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
  
  // Boards Roles (similar structure)
  'Board Docket Clerk': { ... },
  'Board Legal Assistant': { ... },
  'Board Attorney-Advisor': { ... },
  'Board Member': { ... },
};
```

---

## 6. Case Workspace Layout

**Source:** `src/components/case/CaseWorkspace.tsx`

```typescript
interface CaseWorkspaceLayout {
  // Three-Pane Design
  header: CaseHeader;
  entityNavigator: EntityNavigator;
  workspace: Workspace;
}

interface CaseHeader {
  caseNumber: string;
  title: string;
  status: CaseStatus;
  phase: CasePhase;
  judge?: string;
  office: string;
}

interface EntityNavigator {
  parties: Party[];
  representatives: Representative[];
  organizations: Organization[];
}

interface Workspace {
  // Tabs
  activeTab: 'docket' | 'documents' | 'hearings' | 'motions' | 'parties' | 'ai-chat';
  
  // Docket Tab
  docketEntries: DocketEntry[];
  
  // Documents Tab
  documents: Document[];
  
  // Hearings Tab
  hearings: Hearing[];
  
  // Motions Tab
  motions: Motion[];
  
  // AI Chat
  chatMessages: ChatMessage[];
}
```

---

## 7. Data Flow Diagrams

### 7.1 Intake to Docketing Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Intake Processing Flow                        │
│                                                                  │
│  UFS Portal          AI Processing         Docket Clerk         │
│  (External)          (Backend)             (Internal)           │
│                                                                  │
│  ┌──────────┐                                                    │
│  │  Submit  │                                                    │
│  │  Filing  │                                                    │
│  └────┬─────┘                                                    │
│       │                                                          │
│       │ Filing                                                   │
│       ▼                                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  1. AI Validation                                        │  │
│  │     • PII Detection                                      │  │
│  │     • Signature Verification                             │  │
│  │     • Field Completeness                                 │  │
│  │     • Document Quality                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│       │                                                          │
│       │ AI Score + Deficiencies                                  │
│       ▼                                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  2. Status Determination                                 │  │
│  │     • Score >= 90: "Auto-Docket Ready"                   │  │
│  │     • Score < 90: "Manual Review"                        │  │
│  │     • Deficiencies: "Deficiency Notice Sent"             │  │
│  └──────────────────────────────────────────────────────────┘  │
│       │                                                          │
│       ▼                                                          │
│  ┌──────────┐       ┌──────────┐       ┌──────────┐           │
│  │  Docket  │──────►│  Assign  │──────►│ Schedule │           │
│  │  (Clerk) │       │  (Clerk) │       │   (LA)   │           │
│  └──────────┘       └──────────┘       └──────────┘           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Assignment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Judge Assignment Flow                         │
│                                                                  │
│  Docket Clerk        Smart Assignment       Judge               │
│                                                                  │
│  ┌──────────┐                                                    │
│  │  Select  │                                                    │
│  │  "Assign"│                                                    │
│  └────┬─────┘                                                    │
│       │                                                          │
│       │ caseType, office                                         │
│       ▼                                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  getSuggestedJudges()                                    │  │
│  │                                                           │  │
│  │  For each judge:                                          │  │
│  │    • Workload Score (40%)                                 │  │
│  │    • Geography Score (30%)                                │  │
│  │    • Expertise Score (20%)                                │  │
│  │    • Rotation Score (10%)                                 │  │
│  │    • Total Score                                          │  │
│  │                                                           │  │
│  │  Return Top 3 with AI reasons                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│       │                                                          │
│       │ Top 3 Judges + Reasons                                   │
│       ▼                                                          │
│  ┌──────────┐       ┌──────────┐                                │
│  │  Review  │──────►│  Assign  │                                │
│  │  Options │       │  Judge   │                                │
│  └──────────┘       └──────────┘                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 7.3 Hearing Scheduling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  Hearing Scheduling Flow                         │
│                                                                  │
│  Legal Assistant    Smart Scheduler      External Parties        │
│                                                                  │
│  ┌──────────┐                                                    │
│  │  Select  │                                                    │
│  │  Case    │                                                    │
│  └────┬─────┘                                                    │
│       │                                                          │
│       │ caseId, judgeId, office                                  │
│       ▼                                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  findOptimalHearingDates()                               │  │
│  │                                                           │  │
│  │  1. Get Judge Availability                                │  │
│  │  2. Get Courtroom Availability                            │  │
│  │  3. Get Court Reporter Availability                       │  │
│  │  4. Apply Constraints:                                    │  │
│  │     • Pro Se: 14 days notice                              │  │
│  │     • Represented: 7 days notice                          │  │
│  │     • Duration: 2 hours typical                           │  │
│  │  5. Return Top 3 dates                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│       │                                                          │
│       │ 3 Optimal Dates                                          │
│       ▼                                                          │
│  ┌──────────┐       ┌──────────┐       ┌──────────┐           │
│  │  Review  │──────►│ Confirm  │──────►│  Send    │           │
│  │  Dates   │       │  Selection│      │  Notices │           │
│  └──────────┘       └──────────┘       └──────────┘           │
│                            │                   │                │
│                            │                   ▼                │
│                     ┌──────────────────────────────────┐       │
│                     │  generateNoticeOfHearing()       │       │
│                     │  dispatchCourtReporter()         │       │
│                     │  validateProSeService()          │       │
│                     └──────────────────────────────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Implementation Status

### 8.1 Implemented Entities

| Entity | TypeScript Interface | Mock Data | Service | Dashboard |
|--------|---------------------|-----------|---------|-----------|
| User | ✅ `types.ts` | ✅ | ✅ `AuthContext` | ✅ All |
| IntakeCase | ✅ `mockDataEnhanced.ts` | ✅ | ✅ `autoDocketing.ts` | ✅ Docket Clerk |
| Party | ✅ `mockDataEnhanced.ts` | ✅ | - | ✅ Case Hub |
| Document | ✅ `types.ts` | ✅ | - | ✅ Case Hub |
| Deficiency | ✅ `mockDataEnhanced.ts` | ✅ | ✅ `autoDocketing.ts` | ✅ Docket Clerk |
| Hearing | ✅ `mockDataEnhanced.ts` | ✅ | ✅ `smartScheduler.ts` | ✅ Legal Assistant |
| Judge | ✅ `mockDataEnhanced.ts` | ✅ | ✅ `smartAssignment.ts` | ✅ Docket Clerk |
| Motion | ✅ `mockDataEnhanced.ts` | ✅ | - | ✅ Case Hub |
| Deadline | ✅ `mockDataEnhanced.ts` | ✅ | - | ✅ All |
| Filing | ✅ `types.ts` | ✅ | - | ✅ UFS Portal |

### 8.2 Pending Implementation

| Entity | Priority | Notes |
|--------|----------|-------|
| ServiceRecord | Medium | Track certified mail receipts |
| Decision | High | Redline history, signature workflow |
| BriefingSchedule | Medium | Boards appellate deadlines |
| Transcript | Low | Hearing transcript tracking |
| Organization | Medium | Law firms, government agencies |

---

## 9. Next Steps

### 9.1 Database Schema

Convert TypeScript interfaces to DynamoDB schema:

```typescript
// Example: IntakeCase to DynamoDB
{
  pk: 'CASE#INT-2026-00089',
  sk: 'METADATA',
  entityType: 'INTAKE_CASE',
  docketNumber: undefined,
  programArea: 'BLA',
  perspective: 'trial',
  proceduralState: 'Intake Review',
  status: 'Auto-Docket Ready',
  filedAt: '2026-03-11T09:23:00Z',
  daysElapsed: 0,
  deadlineDate: '2026-12-10',
  claimant: 'Robert Martinez',
  employer: 'Apex Coal Mining',
  office: 'Pittsburgh, PA',
  channel: 'UFS',
  aiScore: 98,
  deficiencies: [],
  
  // GSI Keys
  GSI1PK: 'PROGRAM#BLA',
  GSI1SK: 'STATUS#Auto-Docket Ready',
  GSI2PK: 'OFFICE#Pittsburgh, PA',
  GSI2SK: 'FILED_DATE#2026-03-11',
  GSI3PK: 'CHANNEL#UFS',
  GSI3SK: 'STATUS#Auto-Docket Ready',
  
  // TTL for temporary data
  TTL: 1893456000  // 7 years from filing
}
```

### 9.2 API Endpoints

```typescript
// Intake
POST   /api/v1/intake              // Submit new filing
GET    /api/v1/intake              // Get intake queue
GET    /api/v1/intake/:id          // Get intake details
POST   /api/v1/intake/:id/docket   // Auto-docket filing
POST   /api/v1/intake/:id/assign   // Assign judge

// Cases
GET    /api/v1/cases               // Search cases
GET    /api/v1/cases/:id           // Get case details
GET    /api/v1/cases/:id/docket    // Get docket entries
GET    /api/v1/cases/:id/documents // Get documents

// Hearings
POST   /api/v1/hearings/schedule   // Schedule hearing
GET    /api/v1/hearings/:id        // Get hearing details
PUT    /api/v1/hearings/:id        // Update hearing

// Judges
GET    /api/v1/judges              // Get all judges
GET    /api/v1/judges/suggest      // Get suggested judges
```

---

**Document History:**

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | March 22, 2026 | Initial specification from prototype |
