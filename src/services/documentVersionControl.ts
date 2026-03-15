/**
 * Document Version Control System
 * 
 * Manages document versions during collaborative drafting:
 * - Auto-versioning on save
 * - Version history tracking
 * - Compare versions
 * - Restore previous versions
 * - Lock/unlock for editing
 * 
 * Features:
 * - Shadow ECM (Enterprise Content Management)
 * - Timestamped versions
 * - Author tracking
 * - Change detection
 */

export interface DocumentVersion {
  id: string;
  versionNumber: number;
  content: string;
  author: string;
  authorRole: string;
  createdAt: string;
  comment?: string;
  isLocked: boolean;
  status: 'draft' | 'under_review' | 'final';
}

export interface DocumentState {
  id: string;
  caseNumber: string;
  documentType: string;
  currentVersion: number;
  versions: DocumentVersion[];
  isLocked: boolean;
  lockedBy?: string;
  lastSaved: string;
}

// Create initial document state
export function createDocument(
  caseNumber: string,
  documentType: string,
  author: string,
  authorRole: string,
  initialContent: string = ''
): DocumentState {
  const now = new Date().toISOString();
  
  return {
    id: `doc-${Date.now()}`,
    caseNumber,
    documentType,
    currentVersion: 1,
    versions: [
      {
        id: `v1-${Date.now()}`,
        versionNumber: 1,
        content: initialContent,
        author,
        authorRole,
        createdAt: now,
        status: 'draft',
        isLocked: false,
      },
    ],
    isLocked: false,
    lastSaved: now,
  };
}

// Save new version
export function saveVersion(
  state: DocumentState,
  content: string,
  author: string,
  authorRole: string,
  comment?: string
): DocumentState {
  if (state.isLocked) {
    throw new Error('Document is locked for editing');
  }

  const now = new Date().toISOString();
  const newVersionNumber = state.currentVersion + 1;

  const newVersion: DocumentVersion = {
    id: `v${newVersionNumber}-${Date.now()}`,
    versionNumber: newVersionNumber,
    content,
    author,
    authorRole,
    createdAt: now,
    comment,
    status: 'draft',
    isLocked: false,
  };

  return {
    ...state,
    currentVersion: newVersionNumber,
    versions: [...state.versions, newVersion],
    lastSaved: now,
  };
}

// Lock document for review
export function lockDocument(
  state: DocumentState,
  lockedBy: string
): DocumentState {
  return {
    ...state,
    isLocked: true,
    lockedBy,
    versions: state.versions.map((v, idx) => ({
      ...v,
      isLocked: idx === state.versions.length - 1, // Lock current version
    })),
  };
}

// Unlock document
export function unlockDocument(state: DocumentState): DocumentState {
  return {
    ...state,
    isLocked: false,
    lockedBy: undefined,
    versions: state.versions.map(v => ({
      ...v,
      isLocked: false,
    })),
  };
}

// Get version by number
export function getVersion(
  state: DocumentState,
  versionNumber: number
): DocumentVersion | undefined {
  return state.versions.find(v => v.versionNumber === versionNumber);
}

// Compare two versions
export function compareVersions(
  state: DocumentState,
  version1: number,
  version2: number
): { added: string[]; removed: string[] } {
  const v1 = getVersion(state, version1);
  const v2 = getVersion(state, version2);

  if (!v1 || !v2) {
    return { added: [], removed: [] };
  }

  const lines1 = v1.content.split('\n');
  const lines2 = v2.content.split('\n');

  const added = lines2.filter(line => !lines1.includes(line));
  const removed = lines1.filter(line => !lines2.includes(line));

  return { added, removed };
}

// Restore to previous version
export function restoreVersion(
  state: DocumentState,
  versionNumber: number,
  author: string,
  authorRole: string
): DocumentState {
  const versionToRestore = getVersion(state, versionNumber);
  
  if (!versionToRestore) {
    throw new Error(`Version ${versionNumber} not found`);
  }

  return saveVersion(
    state,
    versionToRestore.content,
    author,
    authorRole,
    `Restored from version ${versionNumber}`
  );
}

// Update version status
export function updateVersionStatus(
  state: DocumentState,
  versionNumber: number,
  status: DocumentVersion['status']
): DocumentState {
  return {
    ...state,
    versions: state.versions.map(v =>
      v.versionNumber === versionNumber ? { ...v, status } : v
    ),
  };
}

// Get version history summary
export function getVersionHistory(state: DocumentState): Array<{
  version: number;
  author: string;
  role: string;
  date: string;
  comment?: string;
  status: string;
}> {
  return state.versions.map(v => ({
    version: v.versionNumber,
    author: v.author,
    role: v.authorRole,
    date: new Date(v.createdAt).toLocaleString(),
    comment: v.comment,
    status: v.status,
  }));
}

// Mock data for testing
export const MOCK_DOCUMENT: DocumentState = {
  id: 'doc-123',
  caseNumber: '2024-BLA-00042',
  documentType: 'Draft Decision & Order',
  currentVersion: 3,
  versions: [
    {
      id: 'v1-001',
      versionNumber: 1,
      content: `DECISION AND ORDER

Claimant: Estate of R. Kowalski
Employer: Pittsburgh Coal Co.

This is the initial draft...`,
      author: 'J. Smith',
      authorRole: 'OALJ Attorney-Advisor',
      createdAt: '2026-03-01T09:00:00Z',
      status: 'draft',
      isLocked: false,
    },
    {
      id: 'v2-002',
      versionNumber: 2,
      content: `DECISION AND ORDER

Claimant: Estate of R. Kowalski
Employer: Pittsburgh Coal Co.

After careful review of the evidence, the ALJ finds that claimant has established total disability due to pneumoconiosis arising from 17 years of underground coal mine employment.

FINDINGS OF FACT:
1. Claimant worked 17 years in underground coal mines.
2. Medical evidence establishes pneumoconiosis.
3. Claimant is totally disabled.

CONCLUSIONS OF LAW:
1. Claimant is eligible for benefits under 20 C.F.R. Part 718.

ORDER:
Claimant is AWARDED benefits.`,
      author: 'J. Smith',
      authorRole: 'OALJ Attorney-Advisor',
      createdAt: '2026-03-05T14:30:00Z',
      comment: 'Added findings and conclusions',
      status: 'under_review',
      isLocked: true,
    },
    {
      id: 'v3-003',
      versionNumber: 3,
      content: `DECISION AND ORDER

Claimant: Estate of R. Kowalski
Employer: Pittsburgh Coal Co.

After careful review of the evidence, the undersigned finds that claimant has established total disability due to pneumoconiosis arising from 17 years of underground coal mine employment.

FINDINGS OF FACT:
1. Decedent worked 17 years in underground coal mines for Employer.
2. Medical evidence establishes clinical pneumoconiosis under 20 C.F.R. § 718.202.
3. Decedent was totally disabled under 20 C.F.R. § 718.204.

CONCLUSIONS OF LAW:
1. Decedent suffered from pneumoconiosis arising from coal mine employment.
2. Decedent's pneumoconiosis caused total disability.
3. Claimant is eligible for benefits under 20 C.F.R. Part 718.

ORDER:
Claimant is AWARDED benefits under the Black Lung Benefits Act.`,
      author: 'Hon. Sarah Jenkins',
      authorRole: 'Administrative Law Judge',
      createdAt: '2026-03-08T16:45:00Z',
      comment: 'Redlined - refined language and added citations',
      status: 'final',
      isLocked: false,
    },
  ],
  isLocked: false,
  lastSaved: '2026-03-08T16:45:00Z',
};
