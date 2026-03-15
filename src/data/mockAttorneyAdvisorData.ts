/**
 * Mock Data for Attorney-Advisor Dashboard
 * 
 * Comprehensive mock data for:
 * - Bench Memos
 * - Draft Decisions
 * - Active Cases
 * - Legal Research
 */

export interface BenchMemo {
  caseNumber: string;
  claimant: string;
  employer: string;
  judge: string;
  status: 'In Progress' | 'Draft Complete' | 'Submitted';
  lastUpdated: string;
  caseType: 'BLA' | 'LHC' | 'PER';
  filedDate: string;
  hearingDate?: string;
  issues: string[];
  content: string;
  template: string;
}

export interface DraftDecision {
  caseNumber: string;
  claimant: string;
  employer: string;
  version: number;
  status: 'Judge Review' | 'Revisions Requested' | 'AA Drafting';
  submittedAt: string;
  caseType: 'BLA' | 'LHC' | 'PER';
  judge: string;
  dispositionNotes?: string;
  content: string;
  findings: string[];
  conclusions: string[];
  order: string;
}

export interface ActiveCase {
  caseNumber: string;
  claimant: string;
  employer: string;
  caseType: 'BLA' | 'LHC' | 'PER';
  status: string;
  filedDate: string;
  judge: string;
  nextAction: string;
  nextActionDue: string;
}

// Bench Memo Templates
const BENCH_MEMO_TEMPLATES: Record<string, string> = {
  BLA: `BENCH MEMORANDUM

Case Number: [CASE_NUMBER]
Claimant: [CLAIMANT]
Employer: [EMPLOYER]
Judge: Hon. [JUDGE_NAME]
Date: [DATE]

I. INTRODUCTION
This Black Lung benefits claim involves [CLAIMANT], a coal miner with [YEARS] years of underground employment. Claimant alleges total disability due to pneumoconiosis arising from coal mine employment.

II. PROCEDURAL HISTORY
- Claim filed: [FILED_DATE]
- Hearing held: [HEARING_DATE] before Hon. [JUDGE_NAME]
- Post-hearing briefing completed: [DATE]

III. ISSUES FOR ADJUDICATION
A. Whether claimant has established clinical pneumoconiosis under 20 C.F.R. § 718.202
B. Whether claimant has established total disability under 20 C.F.R. § 718.204
C. Whether pneumoconiosis arose from coal mine employment under 20 C.F.R. § 718.203

IV. RELEVANT FACTS
A. Employment History
[Detail coal mine employment]

B. Medical Evidence
[Summarize medical opinions, PFTs, ABGs, x-rays]

V. ANALYSIS
A. Pneumoconiosis (20 C.F.R. § 718.202)
[Analyze medical evidence]

B. Total Disability (20 C.F.R. § 718.204)
[Analyze disability evidence]

C. Causation (20 C.F.R. § 718.203)
[Analyze employment connection]

VI. RECOMMENDATION
Based on the foregoing, it is recommended that the ALJ [AWARD/DENY] benefits.

Respectfully submitted,
[ATTORNEY-ADVISOR NAME]
OALJ Attorney-Advisor`,

  LHC: `BENCH MEMORANDUM

Case Number: [CASE_NUMBER]
Claimant: [CLAIMANT]
Employer: [EMPLOYER]
Judge: Hon. [JUDGE_NAME]
Date: [DATE]

I. INTRODUCTION
This Longshore and Harbor Workers' Compensation Act claim involves [CLAIMANT], who alleges injury arising out of and in the course of maritime employment.

II. PROCEDURAL HISTORY
- Claim filed: [FILED_DATE]
- Hearing held: [HEARING_DATE]
- Post-hearing briefing completed: [DATE]

III. ISSUES FOR ADJUDICATION
A. Whether claimant sustained injury in course of employment under 33 U.S.C. § 902(2)
B. Whether claimant has established disability under 33 U.S.C. § 908
C. Whether any defenses bar recovery

IV. RELEVANT FACTS
A. Employment and Injury
[Detail circumstances of injury]

B. Medical Evidence
[Summarize medical treatment and opinions]

C. Wage Earning Capacity
[Detail pre- and post-injury wages]

V. ANALYSIS
A. Injury (33 U.S.C. § 902(2))
[Analyze injury elements]

B. Disability (33 U.S.C. § 908)
[Analyze disability and impairment]

C. Defenses
[Analyze any asserted defenses]

VI. RECOMMENDATION
Based on the foregoing, it is recommended that the ALJ [AWARD/DENY] benefits.

Respectfully submitted,
[ATTORNEY-ADVISOR NAME]
OALJ Attorney-Advisor`,
};

// Mock Bench Memos Data
export const MOCK_BENCH_MEMOS: BenchMemo[] = [
  {
    caseNumber: '2024-BLA-00042',
    claimant: 'Estate of R. Kowalski',
    employer: 'Pittsburgh Coal Co.',
    judge: 'Hon. Sarah Jenkins',
    status: 'In Progress',
    lastUpdated: '2026-03-10',
    caseType: 'BLA',
    filedDate: '2024-01-15',
    hearingDate: '2024-02-20',
    issues: [
      'Whether claimant has established clinical pneumoconiosis under 20 C.F.R. § 718.202',
      'Whether claimant has established total disability under 20 C.F.R. § 718.204',
      'Whether pneumoconiosis arose from coal mine employment under 20 C.F.R. § 718.203',
    ],
    content: BENCH_MEMO_TEMPLATES.BLA
      .replace('[CASE_NUMBER]', '2024-BLA-00042')
      .replace('[CLAIMANT]', 'Estate of R. Kowalski')
      .replace('[EMPLOYER]', 'Pittsburgh Coal Co.')
      .replace('[JUDGE_NAME]', 'Sarah Jenkins')
      .replace('[DATE]', 'March 10, 2026')
      .replace('[YEARS]', '17')
      .replace('[FILED_DATE]', 'January 15, 2024')
      .replace('[HEARING_DATE]', 'February 20, 2024'),
    template: 'BLA',
  },
  {
    caseNumber: '2025-LHC-00089',
    claimant: 'J. Peterson',
    employer: 'Acme Corporation',
    judge: 'Hon. Michael Ross',
    status: 'Draft Complete',
    lastUpdated: '2026-03-09',
    caseType: 'LHC',
    filedDate: '2025-06-01',
    hearingDate: '2025-08-15',
    issues: [
      'Whether claimant sustained injury in course of employment under 33 U.S.C. § 902(2)',
      'Whether claimant has established disability under 33 U.S.C. § 908',
    ],
    content: BENCH_MEMO_TEMPLATES.LHC
      .replace('[CASE_NUMBER]', '2025-LHC-00089')
      .replace('[CLAIMANT]', 'J. Peterson')
      .replace('[EMPLOYER]', 'Acme Corporation')
      .replace('[JUDGE_NAME]', 'Michael Ross')
      .replace('[DATE]', 'March 9, 2026')
      .replace('[FILED_DATE]', 'June 1, 2025')
      .replace('[HEARING_DATE]', 'August 15, 2025'),
    template: 'LHC',
  },
  {
    caseNumber: '2025-PER-00015',
    claimant: 'TechCorp Industries',
    employer: 'BALCA',
    judge: 'Hon. Patricia Chen',
    status: 'Submitted',
    lastUpdated: '2026-03-08',
    caseType: 'PER',
    filedDate: '2025-03-01',
    issues: [
      'Whether PERM labor certification was properly denied',
      'Whether employer met burden of proof',
    ],
    content: BENCH_MEMO_TEMPLATES.LHC // Using LHC as placeholder
      .replace('[CASE_NUMBER]', '2025-PER-00015')
      .replace('[CLAIMANT]', 'TechCorp Industries')
      .replace('[EMPLOYER]', 'BALCA')
      .replace('[JUDGE_NAME]', 'Patricia Chen')
      .replace('[DATE]', 'March 8, 2026')
      .replace('[FILED_DATE]', 'March 1, 2025'),
    template: 'PER',
  },
  {
    caseNumber: '2026-BLA-00012',
    claimant: 'James Thompson',
    employer: 'Apex Coal Mining',
    judge: 'Hon. Sarah Jenkins',
    status: 'In Progress',
    lastUpdated: '2026-03-11',
    caseType: 'BLA',
    filedDate: '2026-02-28',
    hearingDate: '2026-04-10',
    issues: [
      'Whether claimant has established pneumoconiosis',
      'Whether claimant is totally disabled',
    ],
    content: BENCH_MEMO_TEMPLATES.BLA
      .replace('[CASE_NUMBER]', '2026-BLA-00012')
      .replace('[CLAIMANT]', 'James Thompson')
      .replace('[EMPLOYER]', 'Apex Coal Mining')
      .replace('[JUDGE_NAME]', 'Sarah Jenkins')
      .replace('[DATE]', 'March 11, 2026')
      .replace('[YEARS]', '18')
      .replace('[FILED_DATE]', 'February 28, 2026'),
    template: 'BLA',
  },
];

// Mock Draft Decisions Data
export const MOCK_DRAFT_DECISIONS: DraftDecision[] = [
  {
    caseNumber: '2024-BLA-00038',
    claimant: 'M. Johnson',
    employer: 'Coal Co.',
    version: 3,
    status: 'Judge Review',
    submittedAt: '2026-03-05',
    caseType: 'BLA',
    judge: 'Hon. Sarah Jenkins',
    dispositionNotes: 'Award benefits - pneumoconiosis established by PFTs and Dr. Smith opinion. Cite Greenwich Collieries for burden of proof.',
    content: `DECISION AND ORDER

Claimant: M. Johnson
Employer: Coal Co.
Case Number: 2024-BLA-00038

This is a Decision and Order of the Administrative Law Judge pursuant to the Black Lung Benefits Act.

STATEMENT OF THE CASE
This claim for Black Lung benefits was filed by M. Johnson on January 10, 2024. A hearing was held on March 15, 2024 before the undersigned Administrative Law Judge.

FINDINGS OF FACT
1. Claimant worked 20 years in underground coal mines for Employer.
2. Claimant suffers from pneumoconiosis as defined in 20 C.F.R. § 718.202.
3. Claimant is totally disabled within the meaning of 20 C.F.R. § 718.204.
4. Claimant's pneumoconiosis arose out of coal mine employment under 20 C.F.R. § 718.203.

CONCLUSIONS OF LAW
1. Claimant is eligible for benefits under the Black Lung Benefits Act.
2. This Decision and Order is in accordance with 20 C.F.R. Part 718.

ORDER
Claimant is AWARDED benefits under the Black Lung Benefits Act.

SO ORDERED this 10th day of March, 2026.

_________________________
Administrative Law Judge`,
    findings: [
      'Claimant worked 20 years in underground coal mines for Employer.',
      'Claimant suffers from pneumoconiosis as defined in 20 C.F.R. § 718.202.',
      'Claimant is totally disabled within the meaning of 20 C.F.R. § 718.204.',
      "Claimant's pneumoconiosis arose out of coal mine employment under 20 C.F.R. § 718.203.",
    ],
    conclusions: [
      'Claimant is eligible for benefits under the Black Lung Benefits Act.',
      'This Decision and Order is in accordance with 20 C.F.R. Part 718.',
    ],
    order: 'Claimant is AWARDED benefits under the Black Lung Benefits Act.',
  },
  {
    caseNumber: '2025-LHC-00012',
    claimant: 'S. Williams',
    employer: 'Port Authority',
    version: 2,
    status: 'Revisions Requested',
    submittedAt: '2026-03-01',
    caseType: 'LHC',
    judge: 'Hon. Michael Ross',
    dispositionNotes: 'Please clarify the standard of review section and add additional case citations for the injury analysis.',
    content: `DECISION AND ORDER

Claimant: S. Williams
Employer: Port Authority
Case Number: 2025-LHC-00012

This is a Decision and Order of the Administrative Law Judge pursuant to the Longshore and Harbor Workers' Compensation Act.

STATEMENT OF THE CASE
This is a proceeding under the Longshore Act. Claimant alleges injury arising out of and in the course of maritime employment on June 15, 2024.

FINDINGS OF FACT
1. Claimant sustained injury on June 15, 2024 while in the course of employment with Employer.
2. The injury resulted in disability as defined in 33 U.S.C. § 908.

CONCLUSIONS OF LAW
1. Claimant's injury arose out of and in the course of employment under 33 U.S.C. § 902(2).
2. Claimant is entitled to temporary total disability compensation under 33 U.S.C. § 908.

ORDER
Claimant is AWARDED temporary total disability compensation from June 15, 2024 to [date of MMI].

SO ORDERED.

_________________________
Administrative Law Judge`,
    findings: [
      'Claimant sustained injury on June 15, 2024 while in the course of employment with Employer.',
      'The injury resulted in disability as defined in 33 U.S.C. § 908.',
    ],
    conclusions: [
      "Claimant's injury arose out of and in the course of employment under 33 U.S.C. § 902(2).",
      'Claimant is entitled to temporary total disability compensation under 33 U.S.C. § 908.',
    ],
    order: 'Claimant is AWARDED temporary total disability compensation from June 15, 2024 to [date of MMI].',
  },
  {
    caseNumber: '2025-PER-00008',
    claimant: 'TechCorp v. BALCA',
    employer: 'BALCA',
    version: 1,
    status: 'AA Drafting',
    submittedAt: '2026-03-12',
    caseType: 'PER',
    judge: 'Hon. Patricia Chen',
    content: `DECISION AND ORDER

Petitioner: TechCorp Industries
Respondent: BALCA
Case Number: 2025-PER-00008

This is a Decision and Order of the Administrative Law Judge.

STATEMENT OF THE CASE
This proceeding involves review of BALCA's denial of PERM labor certification.

[Draft in progress...]`,
    findings: [],
    conclusions: [],
    order: '[To be determined]',
  },
];

// Mock Active Cases Data
export const MOCK_ACTIVE_CASES: ActiveCase[] = [
  {
    caseNumber: '2024-BLA-00042',
    claimant: 'Estate of R. Kowalski',
    employer: 'Pittsburgh Coal Co.',
    caseType: 'BLA',
    status: 'Pre-Hearing',
    filedDate: '2024-01-15',
    judge: 'Hon. Sarah Jenkins',
    nextAction: 'Complete bench memo',
    nextActionDue: '2026-03-20',
  },
  {
    caseNumber: '2025-LHC-00089',
    claimant: 'J. Peterson',
    employer: 'Acme Corporation',
    caseType: 'LHC',
    status: 'Under Advisement',
    filedDate: '2025-06-01',
    judge: 'Hon. Michael Ross',
    nextAction: 'Draft decision',
    nextActionDue: '2026-03-25',
  },
  {
    caseNumber: '2025-PER-00015',
    claimant: 'TechCorp Industries',
    employer: 'BALCA',
    caseType: 'PER',
    status: 'Submitted',
    filedDate: '2025-03-01',
    judge: 'Hon. Patricia Chen',
    nextAction: 'Await judge review',
    nextActionDue: '2026-03-15',
  },
  {
    caseNumber: '2026-BLA-00012',
    claimant: 'James Thompson',
    employer: 'Apex Coal Mining',
    caseType: 'BLA',
    status: 'Pre-Hearing',
    filedDate: '2026-02-28',
    judge: 'Hon. Sarah Jenkins',
    nextAction: 'Research legal issues',
    nextActionDue: '2026-03-18',
  },
];

// Helper function to get memo by case number
export function getMemoByCaseNumber(caseNumber: string): BenchMemo | undefined {
  return MOCK_BENCH_MEMOS.find(m => m.caseNumber === caseNumber);
}

// Helper function to get decision by case number
export function getDecisionByCaseNumber(caseNumber: string): DraftDecision | undefined {
  return MOCK_DRAFT_DECISIONS.find(d => d.caseNumber === caseNumber);
}

// Helper function to get case by case number
export function getCaseByCaseNumber(caseNumber: string): ActiveCase | undefined {
  return MOCK_ACTIVE_CASES.find(c => c.caseNumber === caseNumber);
}
