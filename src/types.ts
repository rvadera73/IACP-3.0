export type CaseType = 'BLA' | 'LHC' | 'PER' | 'FECA' | 'DBA' | 'WB' | 'OFLC';
export type AppealType = 'BRB' | 'ARB' | 'ECAB';
export type Division = 'OALJ' | 'BRB' | 'ARB' | 'ECAB';
export type CasePhase = 'Intake' | 'Assignment' | 'Pre-Hearing' | 'Hearing' | 'Decision' | 'Post-Decision';
export type FilingChannel = 'E-Filing' | 'Mail' | 'UFS';
export type CaseStatus = 'Intake' | 'Docketed' | 'Assigned' | 'Pending' | 'Decided' | 'Appealed' | 'Remanded' | 'Review' | 'Briefing' | 'Decision-Pending' | 'On Track' | 'SLA Breach' | 'Settled' | 'Auto-Docketed' | 'Deficient';
export type RecordStatus = 'Incomplete' | 'Certified' | 'Supplemented';
export type JurisdictionBasis = 'Interlocutory' | 'Final Order Review' | 'Petition for Reconsideration';
export type AppealDisposition = 'Affirmed' | 'Remanded' | 'Vacated' | 'Dismissed';

export interface User {
  id: string;
  name: string;
  role: string;
  division?: Division;
  office?: string;
  organization?: string;
}

export interface Filing {
  id: string;
  caseId?: string;
  intakeId: string;
  type: string;
  category: string;
  submittedBy: string;
  submittedAt: string;
  status: 'Pending' | 'Accepted' | 'Deficient';
  description: string;
  aiAnalysis?: string;
  documentUrl?: string;
  fileName?: string;
  metadata?: {
    formNumber?: string;
    isUrgent?: boolean;
    representativeId?: string;
    barNumber?: string;
  };
  findings?: {
    identityMatch: { status: 'Match' | 'Mismatch' | 'Unverified'; details: string };
    redactionScan: { status: 'Clean' | 'Flagged'; details: string; count: number };
    timelinessCheck: { status: 'Timely' | 'Late'; details: string };
    deficiencyDetection: { status: 'None' | 'Detected'; details: string; autoNotice?: boolean };
  };
  extractedMetadata?: {
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
  };
}

export interface AccessRequest {
  id: string;
  caseNumber: string;
  requestedBy: string;
  requestedAt: string;
  status: 'Pending' | 'Approved' | 'Denied';
  reason: string;
  verificationStatus: 'Verified' | 'Unverified' | 'Flagged';
}

export interface Case {
  id: string; // Internal ID
  caseNumber: string; // Official docket number
  intakeId: string;
  caseType: CaseType;
  appealType?: AppealType;
  phase: CasePhase;
  claimant: {
    name: string;
    ssnLast4?: string;
    dob?: string;
    isMiner?: boolean;
  };
  employer: {
    name: string;
    operatorId?: string;
    ein?: string;
  };
  channel?: FilingChannel;
  status: CaseStatus;
  division: Division;
  office: string;
  createdAt: string;
  judge?: string;
  filings: Filing[];
  summary?: string;
  serviceList: {
    name: string;
    role: string;
    email: string;
    organization: string;
    addedAt: string;
  }[];
  statutoryDeadline?: string;
  pendingActions?: string[];
  hearingDate?: string;
  hearingFormat?: 'Video' | 'In-Person' | 'Hybrid' | 'Record';
  slaStatus?: 'OK' | 'Warning' | 'Overdue';
  // Appeal specific data
  appealData?: {
    originalCaseNumber: string;
    dateOfDecisionBelow: string;
    appealingParty: string;
    basisForAppeal: string;
    jurisdictionBasis?: JurisdictionBasis;
    recordStatus?: RecordStatus;
    briefingSchedule?: {
      acknowledgmentDate?: string;
      petitionerBriefDue?: string;
      respondentBriefDue?: string;
      replyBriefDue?: string;
      petitionerFiledAt?: string;
      respondentFiledAt?: string;
      replyFiledAt?: string;
    };
    panel?: string[]; // 3-judge panel
    leadJudge?: string;
    disposition?: AppealDisposition;
    dissentingJudge?: string;
    findings?: {
      timeliness?: { status: 'Timely' | 'Late' | 'Flagged'; details: string };
      crossAppeal?: { detected: boolean; relatedCase?: string };
      standing?: { status: 'Verified' | 'Issue'; details: string };
    };
  };
  // Chambers Collaboration Data
  chambersData?: {
    assignedClerk?: string;
    dispositionInstructions?: string;
    benchMemo?: {
      legalIssue: string;
      standardOfReview: string;
      recommendedOutcome: string;
      clerkNotes: string;
      lastUpdated: string;
    };
    drafts: {
      id: string;
      version: number;
      type: 'Order' | 'FDO' | 'Notice';
      content: string;
      status: 'Draft' | 'Ready for Review' | 'Revise' | 'Approved' | 'Released';
      clerkComments?: string;
      judgeComments?: string;
      redlines?: string;
      createdAt: string;
      createdBy: string;
    }[];
    citations: {
      id: string;
      cite: string;
      link: string;
      status: 'Active' | 'Overturned' | 'Caution';
      verifiedAt?: string;
    }[];
    exhibitTags: {
      id: string;
      exhibitNumber: string;
      pageNumber: string;
      description: string;
      clerkNote: string;
      flaggedAt: string;
    }[];
    findings: {
      authorityCheck: { status: 'Verified' | 'Issue'; details: string };
      partyAgreement: { status: 'Confirmed' | 'Disputed' | 'N/A'; details: string };
      redactionCheck: { status: 'Complete' | 'Pending'; details: string };
      jurisdictionalCheck: { status: 'Timely' | 'Late' | 'Issue'; details: string };
    };
    auditLog: {
      id: string;
      userId: string;
      userName: string;
      action: string;
      timestamp: string;
    }[];
  };
}
