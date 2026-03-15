/**
 * Comprehensive Mock Data for Case Intelligence Hub
 * Covers all lifecycle stages for OALJ and Boards
 */

export interface MockCaseData {
  docketNumber: string;
  programArea: string;
  proceduralState: string;
  perspective: 'trial' | 'appellate';
  filedAt: string;
  docketedAt: string;
  daysElapsed: number;
  daysToDecision: number;
  deadlineDate: string;
  claimant?: string;
  employer?: string;
  petitioner?: string;
  respondent?: string;
  assignedJudge?: string;
  panel?: string;
  office: string;
  dateOfInjury?: string;
  medicalProvider?: string;
  aljDecisionDate?: string;
  jurisdictionalFlag?: string;
  parties: Party[];
  motions: Motion[];
  documents: Document[];
  heritage: Heritage;
  aiSummary: string;
  aiInsights: AIInsight[];
  briefingSchedule?: BriefingSchedule;
  oaljRecord?: OALJRecord;
  hearings?: Hearing[];
  deadlines?: Deadline[];
}

export interface Party {
  name: string;
  role: string;
  represented: boolean;
  attorney?: string;
  email?: string;
  phone?: string;
  servicePreference?: 'electronic' | 'mail';
}

export interface Motion {
  id: string;
  type: string;
  filedAt: string;
  status: 'Pending' | 'Granted' | 'Denied' | 'Withdrawn';
  ruling?: string;
  rulingDate?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'filings' | 'exhibits' | 'decisions' | 'orders' | 'transcripts' | 'memos';
  filedAt: string;
  filedBy: string;
  status: 'Filed' | 'Accepted' | 'Admitted' | 'Rejected' | 'Pending';
  size?: string;
  pages?: number;
}

export interface Heritage {
  priorClaims: string[];
  consolidatedCases: string[];
  relatedAppeals: string[];
}

export interface AIInsight {
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  description: string;
  action?: string;
}

export interface BriefingSchedule {
  openingBrief: { due: string; status: string; filedDate?: string };
  responseBrief: { due: string; status: string; filedDate?: string };
  replyBrief: { due: string; status: string; filedDate?: string };
}

export interface OALJRecord {
  docketNumber: string;
  aljDecision: string;
  aljDecisionDate: string;
  recordPages: number;
  exhibits: number;
  transcripts: number;
}

export interface Hearing {
  id: string;
  type: string;
  date: string;
  time: string;
  location: string;
  judge?: string;
  reporter?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface Deadline {
  type: string;
  dueDate: string;
  description: string;
  status: 'Pending' | 'Completed' | 'Overdue';
}

export const COMPREHENSIVE_MOCK_CASES: Record<string, MockCaseData> = {
  // ============================================================================
  // OALJ CASES - ALL LIFECYCLE STAGES
  // ============================================================================

  // STAGE 1: INTAKE (New Filing)
  'INT-2026-00089': {
    docketNumber: 'INT-2026-00089',
    programArea: 'Black Lung (BLA)',
    proceduralState: 'Intake Review',
    perspective: 'trial',
    filedAt: '2026-03-13',
    docketedAt: 'Pending',
    daysElapsed: 0,
    daysToDecision: 270,
    deadlineDate: '2026-12-08',
    claimant: 'Robert Martinez',
    employer: 'Harbor Freight Inc.',
    office: 'Pittsburgh, PA',
    dateOfInjury: '2025-08-15',
    medicalProvider: 'Dr. Sarah Johnson, Pulmonary Associates',
    parties: [
      { name: 'Robert Martinez', role: 'Claimant', represented: false, email: 'r.martinez@email.com', phone: '(412) 555-0123', servicePreference: 'mail' },
      { name: 'Harbor Freight Inc.', role: 'Employer', represented: true, attorney: 'Corporate Legal Dept', email: 'legal@harborfreight.com', servicePreference: 'electronic' },
    ],
    motions: [],
    documents: [
      { 
        id: 'D1', 
        name: 'LS-203 Claim Form', 
        type: 'filings', 
        filedAt: '2026-03-13', 
        filedBy: 'Claimant', 
        status: 'Filed', 
        size: '2.1 MB', 
        pages: 12,
        content: `
DEPARTMENT OF LABOR
OFFICE OF WORKERS' COMPENSATION PROGRAMS

CLAIM FOR BENEFITS UNDER THE BLACK LUNG BENEFITS ACT

1. CLAIMANT INFORMATION:
   Name: Robert Martinez
   SSN: XXX-XX-4567
   Address: 456 Miner Street, Pittsburgh, PA 15202
   
2. EMPLOYMENT HISTORY:
   Employer: Harbor Freight Inc.
   Dates: 2004-2026 (22 years)
   Position: Underground Coal Miner
   
3. MEDICAL CONDITION:
   Diagnosis: Pneumoconiosis (Black Lung Disease)
   Date of Onset: 2025-08-15
   Treating Physician: Dr. Sarah Johnson
   
I declare that the information provided is true and correct.

Signature: /s/ Robert Martinez
Date: 2026-03-13
`
      },
      { 
        id: 'D2', 
        name: 'Medical Reports - Dr. Johnson', 
        type: 'exhibits', 
        filedAt: '2026-03-13', 
        filedBy: 'Claimant', 
        status: 'Filed', 
        size: '4.5 MB', 
        pages: 38,
        content: `
MEDICAL EVALUATION REPORT

Patient: Robert Martinez
Date of Examination: 2026-03-10
Examining Physician: Dr. Sarah Johnson, M.D.

PULMONARY FUNCTION TESTS:
FEV1: 1.8 L (52% predicted)
FVC: 2.5 L (60% predicted)
FEV1/FVC: 72%

DIAGNOSIS:
1. Pneumoconiosis (Black Lung Disease)
2. Chronic Obstructive Pulmonary Disease (COPD)

OPINION:
Patient is totally disabled due to respiratory impairment 
arising from 22 years of underground coal mine employment.

/s/ Dr. Sarah Johnson, M.D.
Date: 2026-03-10
`
      },
      { 
        id: 'D3', 
        name: 'Employment History', 
        type: 'exhibits', 
        filedAt: '2026-03-13', 
        filedBy: 'Claimant', 
        status: 'Filed', 
        size: '1.2 MB', 
        pages: 8,
        content: `
EMPLOYMENT VERIFICATION

Employee: Robert Martinez
Employer: Harbor Freight Inc.
Period: 2004-2026 (22 years)
Position: Underground Coal Miner

Dust Exposure: Regular exposure to respirable coal mine dust

Verified: /s/ HR Director, Harbor Freight Inc.
Date: 2026-03-13
`
      },
    ],
    heritage: { priorClaims: [], consolidatedCases: [], relatedAppeals: [] },
    aiSummary: 'New Black Lung benefits claim filed on 3/13/2026 by Robert Martinez, an underground coal miner with 22 years of qualifying employment. Claimant alleges total disability due to pneumoconiosis. Initial filing includes LS-203 claim form, medical evidence from Dr. Sarah Johnson establishing respiratory impairment (FEV1 1.8L, 52% predicted), and employment records. Case is currently in intake review pending AI validation and docketing. Claimant is pro se and will require certified mail service. Preliminary AI review indicates complete filing with no deficiencies.',
    aiInsights: [
      { type: 'success', title: 'Complete Filing', description: 'All required fields and documents present.' },
      { type: 'warning', title: 'Pro Se Claimant', description: 'Claimant self-represented - requires certified mail service.' },
      { type: 'info', title: 'Auto-Docket Ready', description: 'Case meets criteria for automated docketing.' },
    ],
    hearings: [],
    deadlines: [
      { type: 'Employer Response', dueDate: '2026-03-28', description: 'Employer must file response to claim', status: 'Pending' },
      { type: 'Docketing Deadline', dueDate: '2026-03-15', description: 'Case must be docketed', status: 'Pending' },
    ],
  },

  // STAGE 2: DOCKETING (Awaiting Assignment)
  '2026-BLA-00012': {
    docketNumber: '2026-BLA-00012',
    programArea: 'Black Lung (BLA)',
    proceduralState: 'Docketed - Awaiting Assignment',
    perspective: 'trial',
    filedAt: '2026-02-28',
    docketedAt: '2026-03-01',
    daysElapsed: 14,
    daysToDecision: 256,
    deadlineDate: '2026-11-14',
    claimant: 'James Thompson',
    employer: 'Apex Coal Mining',
    office: 'Pittsburgh, PA',
    dateOfInjury: '2025-06-20',
    medicalProvider: 'Dr. Michael Chen, Occupational Medicine',
    assignedJudge: 'Pending Assignment',
    parties: [
      { name: 'James Thompson', role: 'Claimant', represented: true, attorney: 'Legal Aid Society', email: 'legal@legalaid.org', servicePreference: 'electronic' },
      { name: 'Apex Coal Mining', role: 'Employer', represented: true, attorney: 'Hansen & Associates', email: 'legal@hansenlaw.com', servicePreference: 'electronic' },
    ],
    motions: [],
    documents: [
      { 
        id: 'D1', 
        name: 'LS-203 Claim Form', 
        type: 'filings', 
        filedAt: '2026-02-28', 
        filedBy: 'Claimant', 
        status: 'Accepted', 
        size: '2.3 MB', 
        pages: 14,
        content: `DEPARTMENT OF LABOR - CLAIM FORM\nClaimant: James Thompson\nEmployer: Apex Coal Mining\nFiled: 2026-02-28\nEmployment: 18 years underground coal mining`
      },
      { 
        id: 'D2', 
        name: 'Pulmonary Function Tests', 
        type: 'exhibits', 
        filedAt: '2026-02-28', 
        filedBy: 'Claimant', 
        status: 'Admitted', 
        size: '3.1 MB', 
        pages: 22,
        content: `PULMONARY FUNCTION TEST REPORT\nPatient: James Thompson\nFEV1: 1.9L (54% predicted)\nFVC: 2.6L (62% predicted)\nDiagnosis: Pneumoconiosis with respiratory impairment`
      },
      { 
        id: 'D3', 
        name: 'Employer Response', 
        type: 'filings', 
        filedAt: '2026-03-10', 
        filedBy: 'Employer', 
        status: 'Accepted', 
        size: '1.8 MB', 
        pages: 15,
        content: `EMPLOYER RESPONSE TO CLAIM\nEmployer: Apex Coal Mining\nContests: Causation of condition\nPosition: Condition not work-related\nFiled: 2026-03-10`
      },
    ],
    heritage: { priorClaims: [], consolidatedCases: [], relatedAppeals: [] },
    aiSummary: 'Black Lung claim docketed on 3/1/2026, currently awaiting judicial assignment. Claimant James Thompson worked 18 years in underground coal mines. Medical evidence includes qualifying pulmonary function tests and arterial blood gas studies. Employer has filed response contesting causation. Case is ready for assignment to ALJ. Recommended assignment factors: (1) Pittsburgh office jurisdiction, (2) Black Lung specialization required, (3) Current caseload balance favors assignment.',
    aiInsights: [
      { type: 'info', title: 'Ready for Assignment', description: 'All initial filings complete, ready for judge assignment.' },
      { type: 'warning', title: 'Assignment Pending', description: 'Case awaiting assignment for 14 days.' },
    ],
    hearings: [],
    deadlines: [
      { type: 'Assignment Deadline', dueDate: '2026-03-20', description: 'Case should be assigned to judge', status: 'Pending' },
    ],
  },

  // STAGE 3: PRE-HEARING (Discovery & Motions)
  '2024-BLA-00042': {
    docketNumber: '2024-BLA-00042',
    programArea: 'Black Lung (BLA)',
    proceduralState: 'Pre-Hearing',
    perspective: 'trial',
    filedAt: '2024-01-15',
    docketedAt: '2024-01-16',
    daysElapsed: 428,
    daysToDecision: 158,
    deadlineDate: '2026-08-18',
    claimant: 'Estate of R. Kowalski',
    employer: 'Pittsburgh Coal Co.',
    office: 'Pittsburgh, PA',
    dateOfInjury: '2022-11-10',
    medicalProvider: 'Dr. James Smith, Pulmonology Associates',
    assignedJudge: 'Hon. Sarah Jenkins',
    parties: [
      { name: 'Estate of R. Kowalski', role: 'Claimant', represented: true, attorney: 'Legal Aid Society', email: 'legal@legalaid.org', servicePreference: 'electronic' },
      { name: 'Pittsburgh Coal Co.', role: 'Employer', represented: true, attorney: 'Hansen & Associates', email: 'legal@hansenlaw.com', servicePreference: 'electronic' },
      { name: 'Director, OWCP', role: 'Party-in-Interest', represented: true, attorney: 'DOL Counsel', email: 'director@dol.gov', servicePreference: 'electronic' },
    ],
    motions: [
      { id: 'M1', type: 'Motion to Compel Evidence', filedAt: '2024-02-01', status: 'Granted', ruling: 'Employer must produce employment records', rulingDate: '2024-02-15' },
      { id: 'M2', type: 'Motion for Summary Decision', filedAt: '2024-02-20', status: 'Denied', ruling: 'Genuine issue of material fact exists', rulingDate: '2024-03-05' },
      { id: 'M3', type: 'Motion to Exclude Expert Testimony', filedAt: '2024-03-01', status: 'Pending' },
    ],
    documents: [
      { 
        id: 'D1', 
        name: 'LS-203 Claim Form', 
        type: 'filings', 
        filedAt: '2024-01-15', 
        filedBy: 'Claimant', 
        status: 'Accepted', 
        size: '2.4 MB', 
        pages: 15,
        content: `
DEPARTMENT OF LABOR
OFFICE OF WORKERS' COMPENSATION PROGRAMS

CLAIM FOR BENEFITS UNDER THE BLACK LUNG BENEFITS ACT

1. CLAIMANT INFORMATION:
   Name: Estate of R. Kowalski
   SSN: XXX-XX-1234
   Address: 123 Mining Road, Pittsburgh, PA 15201
   
2. EMPLOYMENT HISTORY:
   Employer: Pittsburgh Coal Co.
   Dates: 1985-2002 (17 years)
   Position: Underground Coal Miner
   
3. MEDICAL CONDITION:
   Diagnosis: Pneumoconiosis (Black Lung Disease)
   Date of Onset: 2022-11-10
   Treating Physician: Dr. James Smith
   
4. CLAIM DETAILS:
   Date of Last Exposure: 2002-06-30
   Date of Death: 2023-08-15
   Surviving Spouse: Mary Kowalski
   
I declare that the information provided is true and correct.

Signature: /s/ Mary Kowalski
Date: 2024-01-15
`
      },
      { 
        id: 'D2', 
        name: 'Medical Evidence - Dr. Smith', 
        type: 'exhibits', 
        filedAt: '2024-01-20', 
        filedBy: 'Claimant', 
        status: 'Admitted', 
        size: '5.1 MB', 
        pages: 45,
        content: `
MEDICAL EVALUATION REPORT

Patient: Estate of R. Kowalski
Date of Examination: 2024-01-18
Examining Physician: Dr. James Smith, M.D., F.A.C.P.

CHIEF COMPLAINT:
Progressive shortness of breath, chronic cough, decreased exercise tolerance

HISTORY OF PRESENT ILLNESS:
The patient is a 58-year-old former underground coal miner with 17 years of 
qualifying coal mine employment. He presents with a history of progressive 
dyspnea on exertion, chronic productive cough, and decreased exercise tolerance 
dating back to approximately 2020.

PHYSICAL EXAMINATION:
- General: Patient appears in mild respiratory distress
- Lungs: Decreased breath sounds bilaterally, expiratory wheezing
- Heart: Regular rate and rhythm, no murmurs
- Extremities: No cyanosis or clubbing

PULMONARY FUNCTION TESTS:
FEV1: 1.8 L (52% predicted)
FVC: 2.4 L (58% predicted)
FEV1/FVC: 75%
DLCO: 12.5 mL/min/mmHg (48% predicted)

ARTERIAL BLOOD GAS (Room Air):
pH: 7.42
PaO2: 68 mmHg
PaCO2: 42 mmHg
HCO3: 26 mEq/L
O2 Saturation: 92%

CHEST X-RAY FINDINGS:
- Small rounded opacities in upper lung zones
- Category: 2/1 profusion
- Location: Upper zones, posterior

DIAGNOSIS:
1. Pneumoconiosis (Black Lung Disease)
2. Chronic Obstructive Pulmonary Disease (COPD)
3. Total Disability due to respiratory impairment

OPINION:
It is my medical opinion, to a reasonable degree of medical certainty, that 
the patient's pneumoconiosis arose out of his 17 years of underground coal 
mine employment. The patient is totally disabled due to his respiratory 
condition and is unable to perform his usual coal mine work or any gainful 
employment.

Respectfully submitted,
/s/ Dr. James Smith, M.D., F.A.C.P.
Pulmonology Associates
Date: 2024-01-20
`
      },
      { 
        id: 'D3', 
        name: 'Employment Records', 
        type: 'exhibits', 
        filedAt: '2024-02-25', 
        filedBy: 'Employer', 
        status: 'Admitted', 
        size: '3.2 MB', 
        pages: 28,
        content: `
EMPLOYMENT VERIFICATION RECORDS

Employee: R. Kowalski
SSN: XXX-XX-1234
Employer: Pittsburgh Coal Co.
Mine ID: 46-01234

PERIOD OF EMPLOYMENT:
Start Date: June 15, 1985
End Date: June 30, 2002
Total Service: 17 years, 0 months, 15 days

JOB CLASSIFICATION:
- 1985-1990: Coal Miner Helper (Underground)
- 1990-1995: Continuous Miner Operator (Underground)
- 1995-2002: Longwall Operator (Underground)

DUST EXPOSURE RECORDS:
Year    Position    Samples    Average    Standard
1985    Helper      24         1.8 mg/m³  2.0 mg/m³
1990    Miner Op.   26         2.1 mg/m³  2.0 mg/m³
1995    Longwall    28         2.3 mg/m³  2.0 mg/m³
2000    Longwall    25         2.0 mg/m³  2.0 mg/m³

WORK HISTORY:
- Regularly worked in areas with coal dust exposure
- Assigned to underground sections
- Operated heavy mining equipment
- Exposed to respirable coal mine dust

VERIFICATION:
I certify that the above information is true and correct to the best of my 
knowledge as the authorized representative of Pittsburgh Coal Co.

/s/ John Hansen, Attorney
Hansen & Associates
Counsel for Employer
Date: 2024-02-25
`
      },
      { 
        id: 'D4', 
        name: 'Deposition Transcript - Dr. Smith', 
        type: 'transcripts', 
        filedAt: '2024-03-10', 
        filedBy: 'Claimant', 
        status: 'Accepted', 
        size: '8.5 MB', 
        pages: 120,
        content: `
UNITED STATES DEPARTMENT OF LABOR
OFFICE OF ADMINISTRATIVE LAW JUDGES

DEPOSITION TRANSCRIPT

Case: Estate of R. Kowalski v. Pittsburgh Coal Co.
Date: March 8, 2024
Time: 10:00 AM
Location: 1000 Liberty Avenue, Pittsburgh, PA 15222

APPEARANCES:

For Claimant:
  Legal Aid Society
  By: Sarah Johnson, Esq.

For Employer:
  Hansen & Associates
  By: John Hansen, Esq.

WITNESS: Dr. James Smith, M.D.
         Treating Physician

---

EXAMINATION BY MS. JOHNSON:

Q: Please state your name for the record.
A: Dr. James Smith.

Q: What is your medical specialty?
A: I am board-certified in Pulmonary Disease and Internal Medicine.

Q: How long have you been practicing?
A: I have been practicing for 25 years, with the last 15 years focused 
   on occupational lung diseases.

Q: Did you treat the decedent in this case?
A: Yes, I treated Mr. Kowalski from 2020 until his death in 2023.

Q: What is your diagnosis?
A: Mr. Kowalski suffered from pneumoconiosis, also known as Black Lung 
   Disease, caused by his 17 years of underground coal mine employment.

Q: In your medical opinion, was he totally disabled?
A: Yes. His pulmonary function tests showed severe impairment. His FEV1 
   was only 52% of predicted, and his DLCO was 48% of predicted. He was 
   unable to perform any gainful employment.

Q: Did his condition arise from coal mine employment?
A: Absolutely. There is no other explanation for his condition. The 
   medical evidence is clear and consistent with occupational exposure 
   to coal mine dust.

---

[Deposition continues for 120 pages]

CERTIFICATE OF REPORTER:
I, Jane Reporter, Certified Court Reporter, do hereby certify that the 
foregoing is a true and accurate transcript of the proceedings.

/s/ Jane Reporter, CCR
Date: March 10, 2024
`
      },
    ],
    heritage: { priorClaims: ['2020-BLA-00123 (Denied)'], consolidatedCases: [], relatedAppeals: [] },
    aiSummary: 'Black Lung benefits claim in pre-hearing stage before Hon. Sarah Jenkins. Claimant is the Estate of R. Kowalski, deceased coal miner with 17 years underground employment. Key legal issues: (1) pneumoconiosis under 20 C.F.R. § 718.202, (2) total disability under § 718.204, (3) causation under § 718.203. Discovery is substantially complete. One pending motion to exclude expert testimony awaits ruling. Hearing scheduled for 4/15/2026. Case is on track for decision within 270-day timeframe.',
    aiInsights: [
      { type: 'success', title: 'Discovery Complete', description: 'All discovery responses received.' },
      { type: 'warning', title: 'Pending Motion', description: 'Motion to Exclude Expert Testimony filed 3/1/24 awaits ruling.' },
      { type: 'info', title: 'Hearing Scheduled', description: 'Hearing set for 4/15/2026 at 10:00 AM.' },
    ],
    hearings: [
      { id: 'H1', type: 'Pre-Hearing Conference', date: '2026-04-15', time: '10:00 AM', location: 'Room 402, Pittsburgh', judge: 'Hon. Sarah Jenkins', reporter: 'J. Smith', status: 'Scheduled' },
    ],
    deadlines: [
      { type: 'Pre-Hearing Brief', dueDate: '2026-04-01', description: 'Pre-hearing briefs due', status: 'Pending' },
      { type: 'Hearing', dueDate: '2026-04-15', description: 'Evidentiary hearing', status: 'Pending' },
    ],
  },

  // STAGE 4: HEARING
  '2025-LHC-00128': {
    docketNumber: '2025-LHC-00128',
    programArea: 'Longshore (LHC)',
    proceduralState: 'Hearing',
    perspective: 'trial',
    filedAt: '2025-06-01',
    docketedAt: '2025-06-02',
    daysElapsed: 285,
    daysToDecision: 120,
    deadlineDate: '2026-07-12',
    claimant: 'Maria Santos',
    employer: 'Atlantic Dockworkers',
    office: 'New York, NY',
    dateOfInjury: '2024-09-20',
    medicalProvider: 'Dr. Lisa Chen, Orthopedic Associates',
    assignedJudge: 'Hon. Michael Ross',
    parties: [
      { name: 'Maria Santos', role: 'Claimant', represented: true, attorney: 'Legal Services NYC', email: 'legal@lsnyc.org', servicePreference: 'electronic' },
      { name: 'Atlantic Dockworkers', role: 'Employer', represented: true, attorney: 'Maritime Law Group', email: 'legal@maritimelaw.com', servicePreference: 'electronic' },
    ],
    motions: [
      { id: 'M1', type: 'Motion for Medical Examination', filedAt: '2025-08-15', status: 'Granted', ruling: 'IME scheduled', rulingDate: '2025-09-01' },
    ],
    documents: [
      { 
        id: 'D1', 
        name: 'CA-1 Claim Form', 
        type: 'filings', 
        filedAt: '2025-06-01', 
        filedBy: 'Claimant', 
        status: 'Accepted', 
        size: '1.8 MB', 
        pages: 12,
        content: `DEPARTMENT OF LABOR - LONGSHORE ACT\nClaim Form CA-1\nClaimant: Maria Santos\nEmployer: Atlantic Dockworkers\nDate of Injury: 2024-09-20\nBody Part: Right Shoulder`
      },
      { 
        id: 'D2', 
        name: 'MRI Report - Shoulder', 
        type: 'exhibits', 
        filedAt: '2025-06-15', 
        filedBy: 'Claimant', 
        status: 'Admitted', 
        size: '12.5 MB', 
        pages: 35,
        content: `MRI REPORT - RIGHT SHOULDER\nPatient: Maria Santos\nFindings: Full-thickness rotator cuff tear\nSupraspinatus tendon retracted 1.5cm\nModerate joint effusion\nRecommendation: Surgical repair`
      },
      { 
        id: 'D3', 
        name: 'IME Report - Dr. Wilson', 
        type: 'exhibits', 
        filedAt: '2025-10-01', 
        filedBy: 'Employer', 
        status: 'Admitted', 
        size: '4.2 MB', 
        pages: 28,
        content: `INDEPENDENT MEDICAL EXAMINATION\nExaminer: Dr. Wilson, M.D.\nPatient: Maria Santos\nOpinion: Injury consistent with work activity\nImpairment Rating: 35% upper extremity`
      },
      { 
        id: 'D4', 
        name: 'Hearing Transcript - Day 1', 
        type: 'transcripts', 
        filedAt: '2026-03-10', 
        filedBy: 'Court Reporter', 
        status: 'Accepted', 
        size: '2.1 MB', 
        pages: 85,
        content: `HEARING TRANSCRIPT - DAY 1\nCase: Maria Santos v. Atlantic Dockworkers\nDate: 2026-03-10\nWitnesses: Claimant, Dr. Lisa Chen, Dr. Wilson\n[85 pages of testimony]`
      },
    ],
    heritage: { priorClaims: [], consolidatedCases: [], relatedAppeals: [] },
    aiSummary: 'Longshore Act claim involving rotator cuff injury during cargo loading operations. Claimant Maria Santos sustained injury on 9/20/2024. Hearing commenced on 3/10/2026 before Hon. Michael Ross in New York. Day 1 testimony included claimant, treating physician Dr. Lisa Chen, and IME examiner Dr. Wilson. Key disputed issues: (1) whether injury arose out of employment, (2) extent of disability, (3) causation of ongoing symptoms. Hearing reconvenes 3/25/2026 for employer testimony and closing arguments.',
    aiInsights: [
      { type: 'info', title: 'Hearing In Progress', description: 'Day 1 complete, Day 2 scheduled for 3/25/2026.' },
      { type: 'warning', title: 'Transcript Pending', description: 'Day 1 transcript available, Day 2 pending.' },
    ],
    hearings: [
      { id: 'H1', type: 'Evidentiary Hearing - Day 1', date: '2026-03-10', time: '9:00 AM', location: 'Room 301, New York', judge: 'Hon. Michael Ross', reporter: 'A. Brown', status: 'Completed' },
      { id: 'H2', type: 'Evidentiary Hearing - Day 2', date: '2026-03-25', time: '9:00 AM', location: 'Room 301, New York', judge: 'Hon. Michael Ross', reporter: 'A. Brown', status: 'Scheduled' },
    ],
    deadlines: [
      { type: 'Hearing Day 2', dueDate: '2026-03-25', description: 'Continue hearing', status: 'Pending' },
      { type: 'Post-Hearing Briefs', dueDate: '2026-04-15', description: 'Post-hearing briefs due', status: 'Pending' },
    ],
  },

  // STAGE 5: DECISION (Under Adjudication)
  '2024-PER-00015': {
    docketNumber: '2024-PER-00015',
    programArea: 'BALCA/PERM (PER)',
    proceduralState: 'Decision Under Adjudication',
    perspective: 'trial',
    filedAt: '2024-06-15',
    docketedAt: '2024-06-16',
    daysElapsed: 272,
    daysToDecision: 35,
    deadlineDate: '2026-04-17',
    claimant: 'TechCorp Industries',
    employer: 'BALCA',
    office: 'Washington, DC',
    assignedJudge: 'Hon. Patricia Chen',
    parties: [
      { name: 'TechCorp Industries', role: 'Petitioner', represented: true, attorney: 'TechCorp Legal', email: 'legal@techcorp.com', servicePreference: 'electronic' },
      { name: 'BALCA', role: 'Respondent', represented: true, attorney: 'DOL Counsel', email: 'balca@dol.gov', servicePreference: 'electronic' },
    ],
    motions: [],
    documents: [
      { 
        id: 'D1', 
        name: 'Petition for Review', 
        type: 'filings', 
        filedAt: '2024-06-15', 
        filedBy: 'Petitioner', 
        status: 'Accepted', 
        size: '3.2 MB', 
        pages: 45,
        content: `PETITION FOR REVIEW\nPetitioner: TechCorp Industries\nRespondent: BALCA\nIssues: 1) Unduly restrictive job requirements 2) Proper recruitment 3) Qualified U.S. workers available`
      },
      { 
        id: 'D2', 
        name: 'Administrative Record', 
        type: 'exhibits', 
        filedAt: '2024-07-01', 
        filedBy: 'Respondent', 
        status: 'Admitted', 
        size: '25.8 MB', 
        pages: 450,
        content: `ADMINISTRATIVE RECORD\nCase: TechCorp Industries v. BALCA\nTotal Pages: 450\nIncludes: Application, Recruitment Records, Employer File, Audit Documentation`
      },
      { 
        id: 'D3', 
        name: 'Petitioner Brief', 
        type: 'filings', 
        filedAt: '2024-08-15', 
        filedBy: 'Petitioner', 
        status: 'Accepted', 
        size: '5.1 MB', 
        pages: 65,
        content: `PETITIONER'S BRIEF\nTechCorp Industries v. BALCA\nArgument: Job requirements were not unduly restrictive\nRecruitment was conducted properly\nNo qualified U.S. workers applied`
      },
      { 
        id: 'D4', 
        name: 'Respondent Brief', 
        type: 'filings', 
        filedAt: '2024-09-15', 
        filedBy: 'Respondent', 
        status: 'Accepted', 
        size: '4.8 MB', 
        pages: 58,
        content: `RESPONDENT'S BRIEF\nBALCA v. TechCorp Industries\nArgument: Job requirements tailored to avoid U.S. workers\nRecruitment insufficient\nQualified workers available`
      },
    ],
    heritage: { priorClaims: [], consolidatedCases: [], relatedAppeals: [] },
    aiSummary: 'PERM labor certification appeal before Hon. Patricia Chen. Petitioner TechCorp Industries challenges BALCA denial of permanent labor certification for software engineer position. Key issues: (1) whether job requirements were unduly restrictive, (2) whether recruitment was conducted properly, (3) whether qualified U.S. workers were available. Hearing completed 12/15/2025. Case is under adjudication with decision due within 35 days. Draft decision is being prepared.',
    aiInsights: [
      { type: 'warning', title: 'Decision Due Soon', description: 'Only 35 days remaining to 270-day deadline.' },
      { type: 'info', title: 'Draft In Progress', description: 'Decision draft being prepared by chambers.' },
    ],
    hearings: [],
    deadlines: [
      { type: 'Decision Deadline', dueDate: '2026-04-17', description: '270-day adjudication deadline', status: 'Pending' },
    ],
  },

  // STAGE 6: POST-DECISION (Appeal Period)
  '2023-BLA-00892': {
    docketNumber: '2023-BLA-00892',
    programArea: 'Black Lung (BLA)',
    proceduralState: 'Post-Decision',
    perspective: 'trial',
    filedAt: '2023-08-10',
    docketedAt: '2023-08-11',
    daysElapsed: 582,
    daysToDecision: 0,
    deadlineDate: '2024-05-07',
    claimant: 'William Davis',
    employer: 'Eastern Coal Corporation',
    office: 'Cincinnati, OH',
    dateOfInjury: '2021-05-20',
    medicalProvider: 'Dr. Robert Taylor, Pulmonary Specialists',
    assignedJudge: 'Hon. James Wilson',
    parties: [
      { name: 'William Davis', role: 'Claimant', represented: true, attorney: 'Ohio Legal Services', email: 'legal@ohiolegal.org', servicePreference: 'electronic' },
      { name: 'Eastern Coal Corporation', role: 'Employer', represented: true, attorney: 'Coal Industry Legal', email: 'legal@easterncoal.com', servicePreference: 'electronic' },
    ],
    motions: [],
    documents: [
      { 
        id: 'D1', 
        name: 'LS-203 Claim Form', 
        type: 'filings', 
        filedAt: '2023-08-10', 
        filedBy: 'Claimant', 
        status: 'Accepted', 
        size: '2.0 MB', 
        pages: 12,
        content: `CLAIM FORM - William Davis\nEmployer: Eastern Coal Corporation\nEmployment: 25 years\nDiagnosis: Pneumoconiosis`
      },
      { 
        id: 'D2', 
        name: 'Decision and Order', 
        type: 'decisions', 
        filedAt: '2024-05-01', 
        filedBy: 'Hon. James Wilson', 
        status: 'Filed', 
        size: '1.5 MB', 
        pages: 25,
        content: `DECISION AND ORDER\nClaimant: William Davis\nEmployer: Eastern Coal Corporation\nFinding: Claimant totally disabled due to pneumoconiosis\nOrder: Benefits AWARDED\nDate: 2024-05-01`
      },
      { 
        id: 'D3', 
        name: 'Notice of Appeal', 
        type: 'filings', 
        filedAt: '2024-05-15', 
        filedBy: 'Employer', 
        status: 'Filed', 
        size: '0.8 MB', 
        pages: 5,
        content: `NOTICE OF APPEAL\nTo: Benefits Review Board\nFrom: Eastern Coal Corporation\nAppeals: Decision issued 5/1/2024\nBRB Case No: 24-0456`
      },
    ],
    heritage: { priorClaims: [], consolidatedCases: [], relatedAppeals: ['BRB No. 24-0456'] },
    aiSummary: 'Black Lung claim adjudicated by Hon. James Wilson. Decision issued 5/1/2024 awarding benefits to claimant William Davis. ALJ found claimant totally disabled due to pneumoconiosis arising from 25 years of coal mine employment. Employer filed Notice of Appeal to Benefits Review Board on 5/15/2024 (within 30-day appeal window). Case is now in post-decision status pending appellate review. BRB docket number assigned: BRB No. 24-0456.',
    aiInsights: [
      { type: 'info', title: 'Appeal Filed', description: 'Employer appealed to BRB. Case transferred to appellate docket.' },
      { type: 'success', title: 'Decision Issued', description: 'Decision and Order Awarding Benefits issued within 270 days.' },
    ],
    hearings: [],
    deadlines: [],
  },

  // ============================================================================
  // BOARDS CASES - ALL LIFECYCLE STAGES
  // ============================================================================

  // BOARD STAGE 1: NEW APPEAL (Intake)
  'BRB No. 26-00042': {
    docketNumber: 'BRB No. 26-00042 BLA',
    programArea: 'Benefits Review Board (BRB)',
    proceduralState: 'New Appeal - Intake',
    perspective: 'appellate',
    filedAt: '2026-03-10',
    docketedAt: '2026-03-11',
    daysElapsed: 3,
    daysToDecision: 90,
    deadlineDate: '2026-06-08',
    aljDecisionDate: '2026-02-15',
    appealFiledDate: '2026-03-10',
    jurisdictionalFlag: 'Timely',
    petitioner: 'Atlantic Maritime',
    respondent: 'Jones',
    panel: 'BRB Panel B',
    office: 'Washington, DC',
    parties: [
      { name: 'Atlantic Maritime', role: 'Petitioner', represented: true, attorney: 'Maritime Defense Group', email: 'legal@maritimedefense.com', servicePreference: 'electronic' },
      { name: 'Jones', role: 'Respondent', represented: true, attorney: 'Legal Aid Society', email: 'legal@legalaid.org', servicePreference: 'electronic' },
    ],
    motions: [],
    documents: [
      { 
        id: 'D1', 
        name: 'Petition for Review', 
        type: 'filings', 
        filedAt: '2026-03-10', 
        filedBy: 'Petitioner', 
        status: 'Filed', 
        size: '1.5 MB', 
        pages: 12,
        content: `PETITION FOR REVIEW\nPetitioner: Atlantic Maritime\nRespondent: Jones\nChallenges: ALJ finding on disability extent\nALJ Decision: 2/15/2026`
      },
      { 
        id: 'D2', 
        name: 'ALJ Decision', 
        type: 'decisions', 
        filedAt: '2026-02-15', 
        filedBy: 'Hon. M. Ross', 
        status: 'Filed', 
        size: '2.1 MB', 
        pages: 28,
        content: `DECISION AND ORDER\nClaimant: Jones\nEmployer: Atlantic Maritime\nFinding: Total disability due to injury\nOrder: Benefits AWARDED\nDate: 2026-02-15`
      },
    ],
    heritage: { priorClaims: [], consolidatedCases: [], relatedAppeals: [] },
    briefingSchedule: {
      openingBrief: { due: '2026-04-09', status: 'Not Due' },
      responseBrief: { due: '2026-05-09', status: 'Not Due' },
      replyBrief: { due: '2026-05-24', status: 'Not Due' },
    },
    oaljRecord: {
      docketNumber: '2025-LHC-00456',
      aljDecision: 'Decision and Order Awarding Benefits',
      aljDecisionDate: '2026-02-15',
      recordPages: 380,
      exhibits: 22,
      transcripts: 2,
    },
    aiSummary: 'New appeal filed 3/10/2026 from ALJ decision awarding Longshore benefits. Petitioner Atlantic Maritime challenges ALJ finding on nature and extent of disability. ALJ Hon. Michael Ross awarded benefits on 2/15/2026. Appeal is timely filed within 30-day window. Case assigned to BRB Panel B. Opening brief due 4/9/2026. Standard of review: substantial evidence for factual findings, de novo for legal questions.',
    aiInsights: [
      { type: 'success', title: 'Timely Appeal', description: 'Appeal filed within 30-day jurisdictional window.' },
      { type: 'info', title: 'Briefing Schedule Set', description: 'Opening brief due 4/9/2026.' },
    ],
  },

  // BOARD STAGE 2: BRIEFING
  'BRB No. 24-0123': {
    docketNumber: 'BRB No. 24-0123 BLA',
    programArea: 'Benefits Review Board (BRB)',
    proceduralState: 'Briefing',
    perspective: 'appellate',
    filedAt: '2024-03-01',
    docketedAt: '2024-03-02',
    daysElapsed: 378,
    daysToDecision: 60,
    deadlineDate: '2026-05-12',
    aljDecisionDate: '2024-02-15',
    appealFiledDate: '2024-03-01',
    jurisdictionalFlag: 'Timely',
    petitioner: 'Williams',
    respondent: 'Black Diamond Mining',
    panel: 'BRB Panel A',
    office: 'Washington, DC',
    parties: [
      { name: 'Williams', role: 'Petitioner', represented: true, attorney: 'Legal Aid Society', email: 'legal@legalaid.org', servicePreference: 'electronic' },
      { name: 'Black Diamond Mining', role: 'Respondent', represented: true, attorney: 'Hansen & Associates', email: 'legal@hansenlaw.com', servicePreference: 'electronic' },
    ],
    motions: [],
    documents: [
      { 
        id: 'D1', 
        name: 'Petition for Review', 
        type: 'filings', 
        filedAt: '2024-03-01', 
        filedBy: 'Petitioner', 
        status: 'Accepted', 
        size: '1.2 MB', 
        pages: 8,
        content: `PETITION FOR REVIEW\nPetitioner: Williams\nRespondent: Black Diamond Mining\nAssignments of Error: 1) Medical evidence weighing 2) Total disability finding`
      },
      { 
        id: 'D2', 
        name: 'Opening Brief', 
        type: 'filings', 
        filedAt: '2024-03-28', 
        filedBy: 'Petitioner', 
        status: 'Accepted', 
        size: '3.5 MB', 
        pages: 45,
        content: `OPENING BRIEF\nWilliams v. Black Diamond Mining\nIssue 1: ALJ improperly weighed medical evidence\nIssue 2: No substantial evidence for total disability\nConclusion: Reverse and remand`
      },
      { 
        id: 'D3', 
        name: 'Response Brief', 
        type: 'filings', 
        filedAt: '2024-04-25', 
        filedBy: 'Respondent', 
        status: 'Accepted', 
        size: '3.2 MB', 
        pages: 42,
        content: `RESPONSE BRIEF\nBlack Diamond Mining v. Williams\nArgument: ALJ properly weighed evidence\nSubstantial evidence supports findings\nConclusion: Affirm the decision`
      },
    ],
    heritage: { priorClaims: [], consolidatedCases: [], relatedAppeals: ['BRB No. 24-0124 (Cross-Appeal)'] },
    briefingSchedule: {
      openingBrief: { due: '2024-04-01', status: 'Filed', filedDate: '2024-03-28' },
      responseBrief: { due: '2024-05-01', status: 'Filed', filedDate: '2024-04-25' },
      replyBrief: { due: '2024-05-15', status: 'Not Due' },
    },
    oaljRecord: {
      docketNumber: '2023-BLA-00456',
      aljDecision: 'Decision and Order Awarding Benefits',
      aljDecisionDate: '2024-02-15',
      recordPages: 450,
      exhibits: 25,
      transcripts: 3,
    },
    aiSummary: 'Appeal from ALJ decision awarding Black Lung benefits. Petitioner Williams challenges the ALJ finding on the nature and extent of disability. The ALJ found claimant totally disabled due to pneumoconiosis and awarded benefits. Petitioner raises two assignments of error: (1) whether the ALJ properly weighed conflicting medical evidence, and (2) whether substantial evidence supports the total disability finding. Opening and response briefs filed. Reply brief due 5/15/2024. Case ready for panel review after reply brief.',
    aiInsights: [
      { type: 'info', title: 'Briefing On Schedule', description: 'All briefs filed or due on time.' },
      { type: 'warning', title: 'Cross-Appeal Pending', description: 'Related cross-appeal BRB No. 24-0124 may affect this matter.' },
    ],
  },

  // BOARD STAGE 3: ORAL ARGUMENT
  'ARB No. 24-00089': {
    docketNumber: 'ARB No. 24-00089 PER',
    programArea: 'Administrative Review Board (ARB)',
    proceduralState: 'Oral Argument Scheduled',
    perspective: 'appellate',
    filedAt: '2024-05-15',
    docketedAt: '2024-05-16',
    daysElapsed: 303,
    daysToDecision: 45,
    deadlineDate: '2026-04-27',
    aljDecisionDate: '2024-04-01',
    appealFiledDate: '2024-05-15',
    jurisdictionalFlag: 'Timely',
    petitioner: 'Garcia',
    respondent: 'Logistics Partners',
    panel: 'ARB Panel C',
    office: 'Washington, DC',
    parties: [
      { name: 'Garcia', role: 'Petitioner', represented: true, attorney: 'Workers Rights Clinic', email: 'legal@workersrights.org', servicePreference: 'electronic' },
      { name: 'Logistics Partners', role: 'Respondent', represented: true, attorney: 'Employment Law Group', email: 'legal@employmentlaw.com', servicePreference: 'electronic' },
    ],
    motions: [],
    documents: [
      { 
        id: 'D1', 
        name: 'Petition for Review', 
        type: 'filings', 
        filedAt: '2024-05-15', 
        filedBy: 'Petitioner', 
        status: 'Accepted', 
        size: '1.8 MB', 
        pages: 15,
        content: `PETITION FOR REVIEW\nPetitioner: Garcia\nRespondent: Logistics Partners\nClaim: Whistleblower retaliation under Sarbanes-Oxley`
      },
      { 
        id: 'D2', 
        name: 'Opening Brief', 
        type: 'filings', 
        filedAt: '2024-06-15', 
        filedBy: 'Petitioner', 
        status: 'Accepted', 
        size: '4.2 MB', 
        pages: 52,
        content: `OPENING BRIEF\nGarcia v. Logistics Partners\nIssue: Whistleblower retaliation\nError: ALJ misapplied burden-shifting framework`
      },
      { 
        id: 'D3', 
        name: 'Response Brief', 
        type: 'filings', 
        filedAt: '2024-07-15', 
        filedBy: 'Respondent', 
        status: 'Accepted', 
        size: '3.8 MB', 
        pages: 48,
        content: `RESPONSE BRIEF\nLogistics Partners v. Garcia\nArgument: No retaliation occurred\nTermination was legitimate`
      },
      { 
        id: 'D4', 
        name: 'Reply Brief', 
        type: 'filings', 
        filedAt: '2024-08-01', 
        filedBy: 'Petitioner', 
        status: 'Accepted', 
        size: '2.1 MB', 
        pages: 25,
        content: `REPLY BRIEF\nRebuttal: Employer's reasons pretextual\nEvidence supports retaliation finding`
      },
    ],
    heritage: { priorClaims: [], consolidatedCases: [], relatedAppeals: [] },
    briefingSchedule: {
      openingBrief: { due: '2024-06-15', status: 'Filed', filedDate: '2024-06-15' },
      responseBrief: { due: '2024-07-15', status: 'Filed', filedDate: '2024-07-15' },
      replyBrief: { due: '2024-08-01', status: 'Filed', filedDate: '2024-08-01' },
    },
    oaljRecord: {
      docketNumber: '2023-PER-00234',
      aljDecision: 'Decision and Order',
      aljDecisionDate: '2024-04-01',
      recordPages: 520,
      exhibits: 35,
      transcripts: 4,
    },
    aiSummary: 'ARB appeal involving whistleblower retaliation claim under Sarbanes-Oxley. Petitioner Garcia alleges termination in violation of 18 U.S.C. § 1514A. ALJ found in favor of employer. Petitioner raises three assignments of error regarding burden shifting framework and damages calculation. Oral argument scheduled for 4/10/2026 at 2:00 PM before ARB Panel C. 30 minutes per side. Issue list circulated to parties.',
    aiInsights: [
      { type: 'info', title: 'Oral Argument Set', description: 'Oral argument scheduled for 4/10/2026 at 2:00 PM.' },
      { type: 'warning', title: 'Briefing Complete', description: 'All briefs filed, case ready for argument.' },
    ],
    hearings: [
      { id: 'H1', type: 'Oral Argument', date: '2026-04-10', time: '2:00 PM', location: 'Room 500, Washington DC', status: 'Scheduled' },
    ],
  },

  // BOARD STAGE 4: UNDER DECISION
  'ECAB No. 25-00156': {
    docketNumber: 'ECAB No. 25-00156',
    programArea: 'Employees Compensation Appeals Board (ECAB)',
    proceduralState: 'Under Decision',
    perspective: 'appellate',
    filedAt: '2025-04-01',
    docketedAt: '2025-04-02',
    daysElapsed: 347,
    daysToDecision: 28,
    deadlineDate: '2026-04-10',
    aljDecisionDate: '2025-03-01',
    appealFiledDate: '2025-04-01',
    jurisdictionalFlag: 'Timely',
    petitioner: 'Thompson',
    respondent: 'OWCP',
    panel: 'ECAB Panel A',
    office: 'Washington, DC',
    parties: [
      { name: 'Thompson', role: 'Appellant', represented: true, attorney: 'Federal Workers Legal', email: 'legal@federalworkers.org', servicePreference: 'electronic' },
      { name: 'OWCP', role: 'Appellee', represented: true, attorney: 'SOL Counsel', email: 'owcp-legal@dol.gov', servicePreference: 'electronic' },
    ],
    motions: [],
    documents: [
      { 
        id: 'D1', 
        name: 'Appeal from OWCP Decision', 
        type: 'filings', 
        filedAt: '2025-04-01', 
        filedBy: 'Appellant', 
        status: 'Accepted', 
        size: '2.5 MB', 
        pages: 35,
        content: `APPEAL FROM OWCP DECISION\nAppellant: Thompson\nAppellee: OWCP\nIssue: Schedule award impairment rating\nOWCP Decision: 3/1/2025`
      },
      { 
        id: 'D2', 
        name: 'Appellant Brief', 
        type: 'filings', 
        filedAt: '2025-05-01', 
        filedBy: 'Appellant', 
        status: 'Accepted', 
        size: '4.5 MB', 
        pages: 55,
        content: `APPELLANT BRIEF\nThompson v. OWCP\nIssue: Improper application of AMA Guides 6th Edition\nTable 16-11 lower extremity impairment\nOWCP rating too low`
      },
      { 
        id: 'D3', 
        name: 'OWCP Response', 
        type: 'filings', 
        filedAt: '2025-06-01', 
        filedBy: 'Appellee', 
        status: 'Accepted', 
        size: '3.8 MB', 
        pages: 48,
        content: `OWCP RESPONSE\nOWCP v. Thompson\nArgument: Rating calculation correct\nAMA Guides properly applied\nAffirm the decision`
      },
    ],
    heritage: { priorClaims: [], consolidatedCases: [], relatedAppeals: [] },
    briefingSchedule: {
      openingBrief: { due: '2025-05-01', status: 'Filed', filedDate: '2025-05-01' },
      responseBrief: { due: '2025-06-01', status: 'Filed', filedDate: '2025-06-01' },
      replyBrief: { due: '2025-06-15', status: 'Not Due' },
    },
    oaljRecord: {
      docketNumber: 'OWCP-2024-00789',
      aljDecision: 'OWCP Final Decision',
      aljDecisionDate: '2025-03-01',
      recordPages: 280,
      exhibits: 18,
      transcripts: 0,
    },
    aiSummary: 'ECAB appeal from OWCP schedule award determination. Appellant Thompson challenges OWCP impairment rating calculation under AMA Guides 6th Edition. Issue involves proper application of Table 16-11 for lower extremity impairment. Briefing complete. Case is under decision with 28 days remaining to statutory deadline. Draft decision circulating among panel members.',
    aiInsights: [
      { type: 'warning', title: 'Decision Due Soon', description: 'Only 28 days remaining to deadline.' },
      { type: 'info', title: 'Draft Circulating', description: 'Decision draft under panel review.' },
    ],
  },
};

export default COMPREHENSIVE_MOCK_CASES;
