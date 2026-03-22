/**
 * Enhanced Mock Data for IACP 3.0
 * 
 * Provides comprehensive test data for:
 * - Auto-docketing workflow
 * - Deficiency notification system
 * - Smart scheduling features
 * - All 8 user roles (OALJ + Boards)
 * 
 * Last Updated: March 16, 2026
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface EnhancedMockCase {
  id: string;
  docketNumber: string;
  programArea: ProgramArea;
  perspective: 'trial' | 'appellate';
  proceduralState: ProceduralState;
  filedAt: string;
  docketedAt?: string;
  daysElapsed: number;
  deadlineDate: string;
  claimant?: string;
  employer?: string;
  petitioner?: string;
  respondent?: string;
  office: string;
  assignedJudge?: string;
  panel?: string;
  parties: Party[];
  documents: Document[];
  motions: Motion[];
  hearings: Hearing[];
  deadlines: Deadline[];
  deficiencies?: Deficiency[];
  filingData: FilingData;
  aiScore: number;
  status: IntakeStatus;
  channel: FilingChannel;
}

export type ProgramArea = 'BLA' | 'LHC' | 'PER' | 'BRB' | 'ARB' | 'ECAB';
export type ProceduralState = 
  | 'Intake Review'
  | 'Docketed - Awaiting Assignment'
  | 'Assigned - Pending Draft'
  | 'Hearing Scheduled'
  | 'Post-Hearing - Pending Decision'
  | 'Decision Drafted'
  | 'Signed & Released'
  | 'Appealed';
export type IntakeStatus = 'New' | 'Processing' | 'Auto-Docket Ready' | 'Manual Review' | 'Deficiency Notice Sent' | 'Docketed';
export type FilingChannel = 'UFS' | 'Email' | 'Paper';

export interface Party {
  name: string;
  role: string;
  represented: boolean;
  attorney?: string;
  email?: string;
  phone?: string;
  address?: string;
  servicePreference?: 'electronic' | 'mail';
}

export interface Document {
  id: string;
  name: string;
  type: 'filings' | 'exhibits' | 'decisions' | 'orders' | 'transcripts' | 'memos';
  filedAt: string;
  filedBy: string;
  status: 'Filed' | 'Accepted' | 'Admitted' | 'Rejected' | 'Pending';
  size: string;
  pages: number;
  content?: string;
}

export interface Motion {
  id: string;
  type: string;
  filedAt: string;
  status: 'Pending' | 'Granted' | 'Denied' | 'Withdrawn';
  ruling?: string;
  rulingDate?: string;
}

export interface Hearing {
  id: string;
  type: string;
  date: string;
  time: string;
  location: string;
  courtroom?: string;
  judge?: string;
  courtReporter?: string;
  videoConference?: boolean;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';
  noticeSentAt?: string;
  transcriptAvailable?: boolean;
}

export interface Deadline {
  id: string;
  type: string;
  dueDate: string;
  description: string;
  status: 'Pending' | 'Completed' | 'Overdue' | 'Extended';
  daysRemaining?: number;
}

export interface Deficiency {
  id: string;
  type: 'Missing Signature' | 'Illegible Field' | 'Missing Required Field' | 'Invalid Format' | 'Missing Document';
  field: string;
  description: string;
  severity: 'Critical' | 'Warning';
  autoFixable: boolean;
  notifiedAt?: string;
  correctedAt?: string;
}

export interface FilingData {
  claimantName?: string;
  employerName?: string;
  petitionerName?: string;
  respondentName?: string;
  ssn?: string;
  dateOfBirth?: string;
  dateOfInjury?: string;
  dateOfDecision?: string;
  signature?: string;
  insuranceCarrier?: string;
  ein?: string;
  [key: string]: any;
}

export interface Judge {
  id: string;
  name: string;
  office: string;
  activeCases: number;
  weightedLoad: number;
  capacity: number;
  specialty: ProgramArea[];
  compliance270: number;
  pendingDecisions: number;
  upcomingHearings: number;
  availableDates: string[];
}

export interface CourtReporter {
  id: string;
  name: string;
  office: string;
  available: boolean;
  scheduledDates: string[];
}

export interface Courtroom {
  id: string;
  name: string;
  office: string;
  capacity: number;
  videoConferenceEnabled: boolean;
  availableDates: string[];
}

export interface SchedulingOption {
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

export interface DeficiencyNotice {
  id: string;
  caseId: string;
  docketNumber: string;
  claimant: string;
  deficiencies: Deficiency[];
  generatedAt: string;
  deadline: string;
  status: 'Draft' | 'Sent' | 'Corrected' | 'Dismissed';
  content: string;
}

// ============================================================================
// MOCK DATA - INTAKE QUEUE (For Docket Clerk)
// ============================================================================

export const INTAKE_QUEUE: EnhancedMockCase[] = [
  {
    id: 'INT-2026-00089',
    docketNumber: 'INT-2026-00089',
    programArea: 'BLA',
    perspective: 'trial',
    proceduralState: 'Intake Review',
    filedAt: '2026-03-15',
    daysElapsed: 0,
    deadlineDate: '2026-12-10',
    claimant: 'Robert Martinez',
    employer: 'Harbor Freight Inc.',
    office: 'Pittsburgh, PA',
    channel: 'UFS',
    status: 'Auto-Docket Ready',
    aiScore: 98,
    parties: [
      { 
        name: 'Robert Martinez', 
        role: 'Claimant', 
        represented: false, 
        email: 'r.martinez@email.com', 
        phone: '(412) 555-0123',
        address: '456 Miner Street, Pittsburgh, PA 15202',
        servicePreference: 'mail' 
      },
      { 
        name: 'Harbor Freight Inc.', 
        role: 'Employer', 
        represented: true, 
        attorney: 'Corporate Legal Dept', 
        email: 'legal@harborfreight.com',
        servicePreference: 'electronic' 
      },
    ],
    documents: [
      {
        id: 'D1',
        name: 'LS-203 Claim Form',
        type: 'filings',
        filedAt: '2026-03-15',
        filedBy: 'Claimant',
        status: 'Filed',
        size: '2.1 MB',
        pages: 12,
        content: `DEPARTMENT OF LABOR - CLAIM FOR BLACK LUNG BENEFITS\n\nClaimant: Robert Martinez\nSSN: XXX-XX-4567\nEmployer: Harbor Freight Inc.\nDate of Injury: 2025-08-15\n\nSignature: /s/ Robert Martinez\nDate: 2026-03-15`
      },
      {
        id: 'D2',
        name: 'Medical Reports - Dr. Johnson',
        type: 'exhibits',
        filedAt: '2026-03-15',
        filedBy: 'Claimant',
        status: 'Filed',
        size: '4.5 MB',
        pages: 38,
        content: `MEDICAL EVALUATION - Pneumoconiosis Diagnosis\nPatient: Robert Martinez\nFEV1: 1.8L (52% predicted)\nDiagnosis: Black Lung Disease`
      },
    ],
    motions: [],
    hearings: [],
    deadlines: [
      { id: 'DL1', type: 'Employer Response', dueDate: '2026-03-30', description: 'Employer must file response', status: 'Pending' },
    ],
    deficiencies: [],
    filingData: {
      claimantName: 'Robert Martinez',
      employerName: 'Harbor Freight Inc.',
      ssn: 'XXX-XX-4567',
      dateOfBirth: '1970-01-15',
      dateOfInjury: '2025-08-15',
      signature: '/s/ Robert Martinez',
    },
  },
  {
    id: 'INT-2026-00090',
    docketNumber: 'INT-2026-00090',
    programArea: 'LHC',
    perspective: 'trial',
    proceduralState: 'Intake Review',
    filedAt: '2026-03-14',
    daysElapsed: 1,
    deadlineDate: '2026-12-09',
    claimant: 'Sarah Chen',
    employer: 'Pacific Stevedoring',
    office: 'San Francisco, CA',
    channel: 'Email',
    status: 'Deficiency Notice Sent',
    aiScore: 65,
    parties: [
      { 
        name: 'Sarah Chen', 
        role: 'Claimant', 
        represented: true, 
        attorney: 'Legal Aid Society', 
        email: 'legal@legalaid.org',
        servicePreference: 'electronic' 
      },
    ],
    documents: [
      {
        id: 'D1',
        name: 'LS-203 Claim Form (Scan)',
        type: 'filings',
        filedAt: '2026-03-14',
        filedBy: 'Claimant',
        status: 'Filed',
        size: '1.8 MB',
        pages: 8,
        content: `DEPARTMENT OF LABOR - CLAIM FORM\nClaimant: Sarah Chen\nEmployer: Pacific Stevedoring\n[SSN field illegible - scan quality issue]`
      },
    ],
    motions: [],
    hearings: [],
    deadlines: [],
    deficiencies: [
      {
        id: 'DEF-001',
        type: 'Missing Signature',
        field: 'signature',
        description: 'No signature detected on claim form',
        severity: 'Critical',
        autoFixable: false,
        notifiedAt: '2026-03-14 15:30:00',
      },
      {
        id: 'DEF-002',
        type: 'Illegible Field',
        field: 'ssn',
        description: 'SSN field could not be read from scan',
        severity: 'Critical',
        autoFixable: false,
        notifiedAt: '2026-03-14 15:30:00',
      },
    ],
    filingData: {
      claimantName: 'Sarah Chen',
      employerName: 'Pacific Stevedoring',
      ssn: '???',
      signature: '',
    },
    hearing: [],
  },
  {
    id: 'INT-2026-00091',
    docketNumber: 'INT-2026-00091',
    programArea: 'PER',
    perspective: 'trial',
    proceduralState: 'Intake Review',
    filedAt: '2026-03-13',
    daysElapsed: 2,
    deadlineDate: '2026-12-08',
    petitioner: 'TechCorp Industries',
    respondent: 'DOL SOL',
    office: 'Washington, DC',
    channel: 'Paper',
    status: 'Manual Review',
    aiScore: 88,
    parties: [
      { 
        name: 'TechCorp Industries', 
        role: 'Petitioner', 
        represented: true, 
        attorney: 'Morgan & Associates', 
        email: 'legal@morganlaw.com',
        servicePreference: 'electronic' 
      },
    ],
    documents: [
      {
        id: 'D1',
        name: 'BALCA Appeal Brief',
        type: 'filings',
        filedAt: '2026-03-13',
        filedBy: 'Petitioner',
        status: 'Filed',
        size: '5.2 MB',
        pages: 45,
        content: `APPEAL TO BALCA\nPetitioner: TechCorp Industries\nRespondent: DOL SOL\nDate of Decision: 2026-02-15\n\nSignature: /s/ James Morgan, Attorney\nDate: 2026-03-13`
      },
    ],
    motions: [],
    hearings: [],
    deadlines: [],
    deficiencies: [],
    filingData: {
      petitionerName: 'TechCorp Industries',
      respondentName: 'DOL SOL',
      dateOfDecision: '2026-02-15',
      signature: '/s/ James Morgan, Attorney',
    },
  },
  {
    id: 'INT-2026-00092',
    docketNumber: 'INT-2026-00092',
    programArea: 'BLA',
    perspective: 'trial',
    proceduralState: 'Intake Review',
    filedAt: '2026-03-12',
    daysElapsed: 3,
    deadlineDate: '2026-12-07',
    claimant: 'James Wilson',
    employer: 'Eastern Coal Co.',
    office: 'New York, NY',
    channel: 'UFS',
    status: 'Auto-Docket Ready',
    aiScore: 95,
    parties: [
      { 
        name: 'James Wilson', 
        role: 'Claimant', 
        represented: false, 
        email: 'j.wilson@email.com', 
        phone: '(212) 555-0198',
        address: '789 Oak Avenue, New York, NY 10001',
        servicePreference: 'mail' 
      },
    ],
    documents: [
      {
        id: 'D1',
        name: 'LS-203 Claim Form',
        type: 'filings',
        filedAt: '2026-03-12',
        filedBy: 'Claimant',
        status: 'Filed',
        size: '2.5 MB',
        pages: 15,
        content: `DEPARTMENT OF LABOR - CLAIM FORM\nClaimant: James Wilson\nEmployer: Eastern Coal Co.\nSignature: /s/ James Wilson`
      },
    ],
    motions: [],
    hearings: [],
    deadlines: [],
    deficiencies: [],
    filingData: {
      claimantName: 'James Wilson',
      employerName: 'Eastern Coal Co.',
      ssn: 'XXX-XX-7890',
      dateOfBirth: '1965-05-20',
      dateOfInjury: '2025-09-10',
      signature: '/s/ James Wilson',
    },
  },
  {
    id: 'INT-2026-00093',
    docketNumber: 'INT-2026-00093',
    programArea: 'LHC',
    perspective: 'trial',
    proceduralState: 'Intake Review',
    filedAt: '2026-03-11',
    daysElapsed: 4,
    deadlineDate: '2026-12-06',
    claimant: 'Maria Garcia',
    employer: 'Atlantic Maritime Services',
    office: 'Pittsburgh, PA',
    channel: 'Email',
    status: 'Deficiency Notice Sent',
    aiScore: 72,
    parties: [
      { 
        name: 'Maria Garcia', 
        role: 'Claimant', 
        represented: true, 
        attorney: 'Workers Rights Clinic', 
        email: 'clinic@workersrights.org',
        servicePreference: 'electronic' 
      },
    ],
    documents: [
      {
        id: 'D1',
        name: 'LS-203 Claim Form',
        type: 'filings',
        filedAt: '2026-03-11',
        filedBy: 'Claimant',
        status: 'Filed',
        size: '1.9 MB',
        pages: 10,
        content: `DEPARTMENT OF LABOR - CLAIM FORM\nClaimant: Maria Garcia\nEmployer: Atlantic Maritime Services\n[Missing employer EIN]`
      },
    ],
    motions: [],
    hearings: [],
    deadlines: [],
    deficiencies: [
      {
        id: 'DEF-003',
        type: 'Missing Required Field',
        field: 'ein',
        description: 'Employer EIN is required but not provided',
        severity: 'Critical',
        autoFixable: false,
        notifiedAt: '2026-03-11 16:00:00',
      },
    ],
    filingData: {
      claimantName: 'Maria Garcia',
      employerName: 'Atlantic Maritime Services',
      ssn: 'XXX-XX-3456',
      signature: '/s/ Maria Garcia',
    },
  },
];

// ============================================================================
// MOCK DATA - JUDGES (For Smart Assignment)
// ============================================================================

export const JUDGES: Judge[] = [
  {
    id: 'J001',
    name: 'Hon. Sarah Jenkins',
    office: 'Pittsburgh, PA',
    activeCases: 24,
    weightedLoad: 58,
    capacity: 75,
    specialty: ['BLA', 'LHC'],
    compliance270: 96,
    pendingDecisions: 5,
    upcomingHearings: 3,
    availableDates: ['2026-03-20', '2026-03-22', '2026-03-25', '2026-03-27'],
  },
  {
    id: 'J002',
    name: 'Hon. Michael Ross',
    office: 'New York, NY',
    activeCases: 18,
    weightedLoad: 42,
    capacity: 75,
    specialty: ['LHC', 'PER'],
    compliance270: 100,
    pendingDecisions: 3,
    upcomingHearings: 2,
    availableDates: ['2026-03-21', '2026-03-22', '2026-03-25', '2026-03-26'],
  },
  {
    id: 'J003',
    name: 'Hon. Patricia Chen',
    office: 'San Francisco, CA',
    activeCases: 32,
    weightedLoad: 78,
    capacity: 75,
    specialty: ['BLA', 'LHC'],
    compliance270: 88,
    pendingDecisions: 8,
    upcomingHearings: 5,
    availableDates: ['2026-03-20', '2026-03-24', '2026-03-28'],
  },
  {
    id: 'J004',
    name: 'Hon. James Wilson',
    office: 'Washington, DC',
    activeCases: 12,
    weightedLoad: 28,
    capacity: 75,
    specialty: ['PER', 'BLA'],
    compliance270: 100,
    pendingDecisions: 2,
    upcomingHearings: 1,
    availableDates: ['2026-03-19', '2026-03-20', '2026-03-21', '2026-03-25', '2026-03-27'],
  },
];

// ============================================================================
// MOCK DATA - COURT REPORTERS (For Smart Scheduling)
// ============================================================================

export const COURT_REPORTERS: CourtReporter[] = [
  { id: 'CR001', name: 'Jennifer Smith', office: 'Pittsburgh, PA', available: true, scheduledDates: ['2026-03-24', '2026-03-28'] },
  { id: 'CR002', name: 'Michael Johnson', office: 'Pittsburgh, PA', available: true, scheduledDates: ['2026-03-20', '2026-03-25'] },
  { id: 'CR003', name: 'Rebecca Williams', office: 'Pittsburgh, PA', available: false, scheduledDates: ['2026-03-19', '2026-03-20', '2026-03-21', '2026-03-22'] },
  { id: 'CR004', name: 'Amanda Brown', office: 'New York, NY', available: true, scheduledDates: ['2026-03-22', '2026-03-26'] },
  { id: 'CR005', name: 'Kevin Davis', office: 'New York, NY', available: true, scheduledDates: ['2026-03-20', '2026-03-21'] },
  { id: 'CR006', name: 'Laura Miller', office: 'San Francisco, CA', available: true, scheduledDates: ['2026-03-24', '2026-03-25'] },
  { id: 'CR007', name: 'Thomas Wilson', office: 'San Francisco, CA', available: false, scheduledDates: ['2026-03-19', '2026-03-20', '2026-03-21'] },
  { id: 'CR008', name: 'Patricia Moore', office: 'Washington, DC', available: true, scheduledDates: ['2026-03-21', '2026-03-25'] },
  { id: 'CR009', name: 'Steven Taylor', office: 'Washington, DC', available: true, scheduledDates: ['2026-03-20', '2026-03-22'] },
  { id: 'CR010', name: 'Diana Anderson', office: 'Washington, DC', available: true, scheduledDates: ['2026-03-24', '2026-03-26'] },
];

// ============================================================================
// MOCK DATA - COURTROOMS (For Smart Scheduling)
// ============================================================================

export const COURTROOMS: Courtroom[] = [
  { id: 'CR001', name: 'Room 402', office: 'Pittsburgh, PA', capacity: 30, videoConferenceEnabled: true, availableDates: ['2026-03-19', '2026-03-20', '2026-03-21', '2026-03-22', '2026-03-25'] },
  { id: 'CR002', name: 'Room 405', office: 'Pittsburgh, PA', capacity: 25, videoConferenceEnabled: true, availableDates: ['2026-03-19', '2026-03-20', '2026-03-22', '2026-03-25', '2026-03-27'] },
  { id: 'CR003', name: 'Room 501', office: 'Pittsburgh, PA', capacity: 40, videoConferenceEnabled: false, availableDates: ['2026-03-20', '2026-03-21', '2026-03-25'] },
  { id: 'CR004', name: 'Room 301', office: 'New York, NY', capacity: 35, videoConferenceEnabled: true, availableDates: ['2026-03-19', '2026-03-20', '2026-03-21', '2026-03-22'] },
  { id: 'CR005', name: 'Room 302', office: 'New York, NY', capacity: 20, videoConferenceEnabled: true, availableDates: ['2026-03-20', '2026-03-21', '2026-03-25', '2026-03-26'] },
  { id: 'CR006', name: 'Room 201', office: 'San Francisco, CA', capacity: 30, videoConferenceEnabled: true, availableDates: ['2026-03-19', '2026-03-20', '2026-03-24', '2026-03-25'] },
  { id: 'CR007', name: 'Room 202', office: 'San Francisco, CA', capacity: 25, videoConferenceEnabled: false, availableDates: ['2026-03-20', '2026-03-21', '2026-03-22'] },
  { id: 'CR008', name: 'Room 101', office: 'Washington, DC', capacity: 45, videoConferenceEnabled: true, availableDates: ['2026-03-19', '2026-03-20', '2026-03-21', '2026-03-25'] },
  { id: 'CR009', name: 'Room 102', office: 'Washington, DC', capacity: 30, videoConferenceEnabled: true, availableDates: ['2026-03-20', '2026-03-21', '2026-03-22', '2026-03-25'] },
  { id: 'CR010', name: 'Room 103', office: 'Washington, DC', capacity: 20, videoConferenceEnabled: true, availableDates: ['2026-03-19', '2026-03-25', '2026-03-27'] },
];

// ============================================================================
// MOCK DATA - DEFICIENCY NOTICES (Generated)
// ============================================================================

export const DEFICIENCY_NOTICES: DeficiencyNotice[] = [
  {
    id: 'DN-2026-00001',
    caseId: 'INT-2026-00090',
    docketNumber: 'INT-2026-00090',
    claimant: 'Sarah Chen',
    deficiencies: [
      { id: 'DEF-001', type: 'Missing Signature', field: 'signature', description: 'No signature detected', severity: 'Critical', autoFixable: false },
      { id: 'DEF-002', type: 'Illegible Field', field: 'ssn', description: 'SSN field unreadable', severity: 'Critical', autoFixable: false },
    ],
    generatedAt: '2026-03-14 15:30:00',
    deadline: '2026-03-28',
    status: 'Sent',
    content: `NOTICE OF DEFICIENCY

Date: March 14, 2026
To: Sarah Chen
Case: INT-2026-00090

Your filing has been reviewed and the following deficiencies were found:

1. Missing Signature: No signature detected on claim form
2. Illegible Field: SSN field could not be read from scan

Please correct these deficiencies and resubmit by March 28, 2026.
Failure to do so may result in dismissal of your claim.

Office of Administrative Law Judges
U.S. Department of Labor`,
  },
  {
    id: 'DN-2026-00002',
    caseId: 'INT-2026-00093',
    docketNumber: 'INT-2026-00093',
    claimant: 'Maria Garcia',
    deficiencies: [
      { id: 'DEF-003', type: 'Missing Required Field', field: 'ein', description: 'Employer EIN required', severity: 'Critical', autoFixable: false },
    ],
    generatedAt: '2026-03-11 16:00:00',
    deadline: '2026-03-25',
    status: 'Sent',
    content: `NOTICE OF DEFICIENCY

Date: March 11, 2026
To: Maria Garcia
Case: INT-2026-00093

Your filing has been reviewed and the following deficiency was found:

1. Missing Required Field: Employer EIN is required but not provided

Please correct this deficiency and resubmit by March 25, 2026.
Failure to do so may result in dismissal of your claim.

Office of Administrative Law Judges
U.S. Department of Labor`,
  },
];

// ============================================================================
// MOCK DATA - HEARING SCHEDULE (For Legal Assistant)
// ============================================================================

export const PENDING_HEARINGS: EnhancedMockCase[] = [
  {
    id: '2026-BLA-00015',
    docketNumber: '2026-BLA-00015',
    programArea: 'BLA',
    perspective: 'trial',
    proceduralState: 'Hearing Pending Scheduling',
    filedAt: '2026-02-15',
    docketedAt: '2026-02-16',
    daysElapsed: 29,
    deadlineDate: '2026-11-12',
    claimant: 'William Thompson',
    employer: 'Consolidated Coal Co.',
    office: 'Pittsburgh, PA',
    assignedJudge: 'J001',
    channel: 'UFS',
    status: 'Docketed',
    aiScore: 95,
    parties: [
      { 
        name: 'William Thompson', 
        role: 'Claimant', 
        represented: false, 
        email: 'w.thompson@email.com', 
        phone: '(412) 555-0145',
        address: '123 Coal Road, Pittsburgh, PA 15203',
        servicePreference: 'mail' 
      },
      { 
        name: 'Consolidated Coal Co.', 
        role: 'Employer', 
        represented: true, 
        attorney: 'Defense Associates', 
        email: 'legal@defenseassoc.com',
        servicePreference: 'electronic' 
      },
    ],
    documents: [],
    motions: [],
    hearings: [],
    deadlines: [],
    deficiencies: [],
    filingData: {},
  },
  {
    id: '2026-LHC-00022',
    docketNumber: '2026-LHC-00022',
    programArea: 'LHC',
    perspective: 'trial',
    proceduralState: 'Hearing Pending Scheduling',
    filedAt: '2026-02-20',
    docketedAt: '2026-02-21',
    daysElapsed: 24,
    deadlineDate: '2026-11-17',
    claimant: 'Jennifer Lee',
    employer: 'Maritime Transport Inc.',
    office: 'New York, NY',
    assignedJudge: 'J002',
    channel: 'UFS',
    status: 'Docketed',
    aiScore: 92,
    parties: [
      { 
        name: 'Jennifer Lee', 
        role: 'Claimant', 
        represented: true, 
        attorney: 'Workers Rights Clinic', 
        email: 'clinic@workersrights.org',
        servicePreference: 'electronic' 
      },
    ],
    documents: [],
    motions: [],
    hearings: [],
    deadlines: [],
    deficiencies: [],
    filingData: {},
  },
  {
    id: '2026-PER-00008',
    docketNumber: '2026-PER-00008',
    programArea: 'PER',
    perspective: 'trial',
    proceduralState: 'Hearing Pending Scheduling',
    filedAt: '2026-02-25',
    docketedAt: '2026-02-26',
    daysElapsed: 19,
    deadlineDate: '2026-11-22',
    petitioner: 'Global Tech Solutions',
    respondent: 'DOL SOL',
    office: 'Washington, DC',
    assignedJudge: 'J004',
    channel: 'Paper',
    status: 'Docketed',
    aiScore: 90,
    parties: [
      { 
        name: 'Global Tech Solutions', 
        role: 'Petitioner', 
        represented: true, 
        attorney: 'Morgan & Associates', 
        email: 'legal@morganlaw.com',
        servicePreference: 'electronic' 
      },
    ],
    documents: [],
    motions: [],
    hearings: [],
    deadlines: [],
    deficiencies: [],
    filingData: {},
  },
];

// ============================================================================
// MOCK DATA - SCHEDULED HEARINGS
// ============================================================================

export const SCHEDULED_HEARINGS: Hearing[] = [
  {
    id: 'H001',
    type: 'Hearing',
    date: '2026-03-20',
    time: '10:00 AM',
    location: 'Pittsburgh, PA',
    courtroom: 'Room 402',
    judge: 'Hon. Sarah Jenkins',
    courtReporter: 'Jennifer Smith',
    videoConference: false,
    status: 'Scheduled',
    noticeSentAt: '2026-03-06',
  },
  {
    id: 'H002',
    type: 'Pre-Hearing Conference',
    date: '2026-03-21',
    time: '2:00 PM',
    location: 'New York, NY',
    courtroom: 'Room 301',
    judge: 'Hon. Michael Ross',
    courtReporter: 'Amanda Brown',
    videoConference: true,
    status: 'Scheduled',
    noticeSentAt: '2026-03-07',
  },
  {
    id: 'H003',
    type: 'Hearing',
    date: '2026-03-25',
    time: '9:00 AM',
    location: 'Washington, DC',
    courtroom: 'Room 101',
    judge: 'Hon. James Wilson',
    courtReporter: 'Patricia Moore',
    videoConference: false,
    status: 'Scheduled',
    noticeSentAt: '2026-03-11',
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get intake queue items filtered by status
 */
export function getIntakeQueueByStatus(status: IntakeStatus): EnhancedMockCase[] {
  return INTAKE_QUEUE.filter(item => item.status === status);
}

/**
 * Get deficiency notices by status
 */
export function getDeficiencyNoticesByStatus(status: DeficiencyNotice['status']): DeficiencyNotice[] {
  return DEFICIENCY_NOTICES.filter(notice => notice.status === status);
}

/**
 * Get judges by office
 */
export function getJudgesByOffice(office: string): Judge[] {
  return JUDGES.filter(judge => judge.office === office);
}

/**
 * Get court reporters by office
 */
export function getCourtReportersByOffice(office: string): CourtReporter[] {
  return COURT_REPORTERS.filter(reporter => reporter.office === office);
}

/**
 * Get courtrooms by office
 */
export function getCourtroomsByOffice(office: string): Courtroom[] {
  return COURTROOMS.filter(courtroom => courtroom.office === office);
}

/**
 * Calculate days until deadline
 */
export function getDaysUntilDeadline(dueDate: string): number {
  const today = new Date();
  const deadline = new Date(dueDate);
  const diffTime = deadline.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if a date is valid for scheduling (minimum notice period)
 */
export function isValidHearingDate(date: string, hasProSeParty: boolean): boolean {
  const today = new Date();
  const hearingDate = new Date(date);
  const daysDiff = (hearingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  const minDays = hasProSeParty ? 14 : 7;
  return daysDiff >= minDays;
}

/**
 * Generate mock scheduling options for a case
 */
export function generateSchedulingOptions(
  judgeId: string,
  office: string,
  hasProSeParty: boolean
): SchedulingOption[] {
  const judge = JUDGES.find(j => j.id === judgeId);
  if (!judge) return [];

  const reporters = getCourtReportersByOffice(office).filter(r => r.available);
  const courtrooms = getCourtroomsByOffice(office);
  
  const options: SchedulingOption[] = [];
  
  judge.availableDates.slice(0, 3).forEach((date, index) => {
    const isOptimal = index === 0;
    options.push({
      date,
      time: index === 0 ? '10:00 AM' : index === 1 ? '2:00 PM' : '9:00 AM',
      location: office,
      courtroom: courtrooms[0]?.name || 'Room TBD',
      judge: judge.name,
      courtReporter: reporters[0]?.name || 'TBD',
      videoConference: false,
      optimal: isOptimal,
      reasons: isOptimal 
        ? ['Earliest available date', 'Judge availability confirmed', 'Courtroom available']
        : ['Alternative date'],
    });
  });

  return options;
}
