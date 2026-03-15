/**
 * Draft Decision & Order Editor
 * 
 * Collaborative document editor for drafting decisions with:
 * - Real-time redline/tracked changes
 * - Judge collaboration workflow
 * - Disposition notes integration
 * - Version comparison view
 * - Official PDF generation
 * 
 * Features:
 * - Side-by-side comparison view
 * - Accept/reject changes
 * - Judge disposition notes
 * - Citation validation
 * - PII redaction detection
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Save, Send, Download, History, FileText, CheckCircle,
  XCircle, AlertCircle, Eye, Edit3, MessageSquare,
  Signature, Scale, TrendingUp, TrendingDown, Copy,
  Bookmark, Plus, Trash2, EyeOff, Clock
} from 'lucide-react';
import { Card, Badge, Button } from '../UI';
import AICitationSearchSidebar from './AICitationSearchSidebar';
import {
  createDocument,
  saveVersion,
  lockDocument,
  unlockDocument,
  compareVersions,
  getVersionHistory,
  updateVersionStatus,
  type DocumentState,
  type DocumentVersion,
} from '../../services/documentVersionControl';
import { useAuth } from '../../context/AuthContext';

interface DraftDecisionEditorProps {
  caseNumber: string;
  caseType: 'BLA' | 'LHC' | 'PER' | 'BRB' | 'ARB' | 'ECAB';
  caseStatus: string;
  existingDocument?: DocumentState;
  userRole: string;
  onSubmitForRelease?: (document: DocumentState) => void;
}

interface Change {
  type: 'added' | 'removed';
  text: string;
  lineNumber: number;
}

// Decision templates by case type
const DECISION_TEMPLATES: Record<string, string> = {
  BLA: `DECISION AND ORDER

Claimant: [CLAIMANT_NAME]
Employer: [EMPLOYER_NAME]
Case Number: [CASE_NUMBER]

This is a "Decision and Order" of the Administrative Law Judge pursuant to the Black Lung Benefits Act, 30 U.S.C. §§ 901-945.

STATEMENT OF THE CASE
This claim for Black Lung benefits was filed by [CLAIMANT_NAME] on [DATE]. A hearing was held on [DATE] before the undersigned Administrative Law Judge. The hearing transcript has been received and made part of the record.

Based upon all the evidence, the undersigned finds that claimant [IS/IS NOT] entitled to benefits.

FINDINGS OF FACT
1. [Claimant/Estate] worked [YEARS] years in underground coal mines for Employer.
2. [Claimant] suffers/suffered from pneumoconiosis as defined in 20 C.F.R. § 718.202.
3. [Claimant] [is/was] totally disabled within the meaning of 20 C.F.R. § 718.204.
4. [Claimant's] pneumoconiosis arose out of coal mine employment under 20 C.F.R. § 718.203.

CONCLUSIONS OF LAW
1. [Claimant] [is/is not] eligible for benefits under the Black Lung Benefits Act.
2. This Decision and Order is in accordance with 20 C.F.R. Part 718.

ORDER
[Claimant IS AWARDED benefits under the Black Lung Benefits Act.]
[Claimant's claim for benefits is DENIED.]

SO ORDERED.

_________________________
ADMINISTRATIVE LAW JUDGE
United States Department of Labor
Office of Administrative Law Judges

Date: [DATE]`,

  LHC: `DECISION AND ORDER

Claimant: [CLAIMANT_NAME]
Employer: [EMPLOYER_NAME]
Case Number: [CASE_NUMBER]

This is a "Decision and Order" of the Administrative Law Judge pursuant to the Longshore and Harbor Workers' Compensation Act, 33 U.S.C. §§ 901-950.

STATEMENT OF THE CASE
This is a proceeding under the Longshore and Harbor Workers' Compensation Act. Claimant alleges injury arising out of and in the course of maritime employment on [DATE]. A hearing was held on [DATE].

Based upon all the evidence, the undersigned finds that claimant [IS/IS NOT] entitled to benefits.

FINDINGS OF FACT
1. Claimant sustained injury on [DATE] while in the course of employment with Employer.
2. The injury resulted in [disability/impairment] as defined in 33 U.S.C. § 908.
3. [Additional findings as appropriate]

CONCLUSIONS OF LAW
1. Claimant's injury arose out of and in the course of employment under 33 U.S.C. § 902(2).
2. Claimant [is/is not] entitled to [type of compensation] under 33 U.S.C. § 908.

ORDER
[Claimant IS AWARDED [specific compensation/benefits].]
[Claimant's claim for benefits is DENIED.]

SO ORDERED.

_________________________
ADMINISTRATIVE LAW JUDGE
United States Department of Labor
Office of Administrative Law Judges

Date: [DATE]`,
};

export default function DraftDecisionEditor({
  caseNumber,
  caseType,
  caseStatus,
  existingDocument,
  userRole,
  onSubmitForRelease,
}: DraftDecisionEditorProps) {
  const { user } = useAuth();
  const [editorContent, setEditorContent] = useState('');
  const [documentState, setDocumentState] = useState<DocumentState | null>(null);
  const [viewMode, setViewMode] = useState<'edit' | 'compare' | 'redline'>('edit');
  const [compareVersion1, setCompareVersion1] = useState<number>(1);
  const [compareVersion2, setCompareVersion2] = useState<number>(2);
  const [changes, setChanges] = useState<Change[]>([]);
  const [dispositionNotes, setDispositionNotes] = useState('');
  const [showDispositionNotes, setShowDispositionNotes] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const isJudge = userRole.includes('Judge') || userRole.includes('Board Member');
  const isAttorneyAdvisor = userRole.includes('Attorney-Advisor');

  // Initialize document
  useEffect(() => {
    if (existingDocument) {
      setDocumentState(existingDocument);
      const currentVersion = existingDocument.versions[existingDocument.versions.length - 1];
      setEditorContent(currentVersion.content);
    } else {
      // Create new document with template
      const template = DECISION_TEMPLATES[caseType] || DECISION_TEMPLATES.BLA;
      const newDoc = createDocument(
        caseNumber,
        'Decision and Order',
        user?.name || (isJudge ? 'Judge' : 'Attorney-Advisor'),
        userRole,
        template
      );
      setDocumentState(newDoc);
      setEditorContent(template);
    }
  }, [existingDocument, caseNumber, caseType, user, userRole, isJudge]);

  // Calculate changes for comparison view
  useEffect(() => {
    if (viewMode === 'compare' && documentState) {
      const diff = compareVersions(documentState, compareVersion1, compareVersion2);
      const newChanges: Change[] = [
        ...diff.added.map(text => ({ type: 'added' as const, text, lineNumber: 0 })),
        ...diff.removed.map(text => ({ type: 'removed' as const, text, lineNumber: 0 })),
      ];
      setChanges(newChanges);
    }
  }, [viewMode, documentState, compareVersion1, compareVersion2]);

  // Handle save
  const handleSave = (comment?: string) => {
    if (!documentState || documentState.isLocked) return;

    setIsSaving(true);
    
    try {
      const newState = saveVersion(
        documentState,
        editorContent,
        user?.name || userRole,
        userRole,
        comment
      );
      setDocumentState(newState);
    } catch (error) {
      console.error('Failed to save:', error);
    }

    setIsSaving(false);
  };

  // Submit for release (Judge only)
  const handleSubmitForRelease = () => {
    if (!documentState || !isJudge) return;

    const finalState = updateVersionStatus(
      documentState,
      documentState.currentVersion,
      'final'
    );
    setDocumentState(finalState);

    if (onSubmitForRelease) {
      onSubmitForRelease(finalState);
    }

    alert('Decision signed and released. Official PDF generated and docketed.');
  };

  // Submit for Judge review (Attorney-Advisor)
  const handleSubmitForJudge = () => {
    if (!documentState || !isAttorneyAdvisor) return;

    const lockedState = lockDocument(documentState, user?.name || 'Attorney-Advisor');
    setDocumentState(lockedState);

    alert('Draft submitted to Judge for review and redlining.');
  };

  // Accept/reject change (Judge redline mode)
  const handleChange = (change: Change, accept: boolean) => {
    if (accept) {
      // Remove the change marker from content
      const newContent = editorContent.replace(
        change.type === 'added' ? `<ins>${change.text}</ins>` : `<del>${change.text}</del>`,
        change.type === 'added' ? change.text : ''
      );
      setEditorContent(newContent);
    }
    
    // Remove from changes list
    setChanges(changes.filter(c => c !== change));
  };

  // Insert citation
  const handleInsertCitation = (citation: string) => {
    setEditorContent(editorContent + '\n' + citation);
  };

  // Bookmark citation
  const handleBookmarkCitation = (citation: any) => {
    console.log('Bookmarked:', citation);
  };

  const versionHistory = documentState ? getVersionHistory(documentState) : [];
  const isLocked = documentState?.isLocked || false;
  const lockedBy = documentState?.lockedBy;

  // Render content with redlines
  const renderRedlineContent = (content: string) => {
    // This is a simplified version - in production, use a proper diff library
    return content.split('\n').map((line, idx) => (
      <div key={idx} className="font-mono text-sm leading-relaxed">
        {line}
      </div>
    ));
  };

  return (
    <div className="flex h-[calc(100vh-200px)]">
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="font-bold text-slate-900">Decision and Order</h2>
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <span>{caseNumber}</span>
                <span>•</span>
                <span>Version {documentState?.currentVersion || 1}</span>
                {isLocked && (
                  <Badge variant="warning" size="sm">
                    Locked by {lockedBy}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
              <Button
                variant={viewMode === 'edit' ? 'outline' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('edit')}
                className="text-xs"
              >
                <Edit3 className="w-3 h-3 mr-1" />
                Edit
              </Button>
              <Button
                variant={viewMode === 'compare' ? 'outline' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('compare')}
                disabled={!documentState || documentState.versions.length < 2}
                className="text-xs"
              >
                <FileText className="w-3 h-3 mr-1" />
                Compare
              </Button>
              <Button
                variant={viewMode === 'redline' ? 'outline' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('redline')}
                disabled={!isJudge}
                className="text-xs"
              >
                <Eye className="w-3 h-3 mr-1" />
                Redline
              </Button>
            </div>

            {/* Disposition Notes (Judge only) */}
            {isJudge && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDispositionNotes(!showDispositionNotes)}
                leftIcon={<MessageSquare className="w-4 h-4" />}
              >
                Disposition Notes
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
              leftIcon={<BookOpen className="w-4 h-4" />}
            >
              {showSidebar ? 'Hide' : 'Show'} Research
            </Button>

            {isAttorneyAdvisor && !isLocked && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSave('Manual save')}
                  disabled={isSaving}
                  leftIcon={isSaving ? <Clock className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                >
                  Save
                </Button>
                <Button
                  onClick={handleSubmitForJudge}
                  leftIcon={<Send className="w-4 h-4" />}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Submit to Judge
                </Button>
              </>
            )}

            {isJudge && (
              <Button
                onClick={handleSubmitForRelease}
                leftIcon={<Signature className="w-4 h-4" />}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Sign & Release
              </Button>
            )}
          </div>
        </div>

        {/* Comparison Version Selectors */}
        {viewMode === 'compare' && documentState && (
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-700">Compare:</span>
              <select
                value={compareVersion1}
                onChange={(e) => setCompareVersion1(Number(e.target.value))}
                className="px-3 py-2 border-2 border-slate-200 rounded-lg text-sm"
              >
                {versionHistory.map((v) => (
                  <option key={v.version} value={v.version}>
                    Version {v.version} ({v.author})
                  </option>
                ))}
              </select>
              <span className="text-slate-400">vs</span>
              <select
                value={compareVersion2}
                onChange={(e) => setCompareVersion2(Number(e.target.value))}
                className="px-3 py-2 border-2 border-slate-200 rounded-lg text-sm"
              >
                {versionHistory.map((v) => (
                  <option key={v.version} value={v.version}>
                    Version {v.version} ({v.author})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-100 border border-emerald-500" />
                <span className="text-slate-600">Added ({changes.filter(c => c.type === 'added').length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border border-red-500" />
                <span className="text-slate-600">Removed ({changes.filter(c => c.type === 'removed').length})</span>
              </div>
            </div>
          </div>
        )}

        {/* Editor / Comparison View */}
        <div className="flex-1 overflow-hidden flex">
          {viewMode === 'compare' ? (
            <div className="flex-1 grid grid-cols-2 gap-4 p-4 overflow-y-auto">
              {/* Version 1 */}
              <div className="border-r border-slate-200 pr-4">
                <h3 className="font-bold text-slate-900 mb-2">Version {compareVersion1}</h3>
                <pre className="text-sm font-mono whitespace-pre-wrap">
                  {documentState.versions.find(v => v.versionNumber === compareVersion1)?.content || ''}
                </pre>
              </div>
              {/* Version 2 */}
              <div className="pl-4">
                <h3 className="font-bold text-slate-900 mb-2">Version {compareVersion2}</h3>
                <pre className="text-sm font-mono whitespace-pre-wrap">
                  {documentState.versions.find(v => v.versionNumber === compareVersion2)?.content || ''}
                </pre>
              </div>
            </div>
          ) : viewMode === 'redline' ? (
            <div className="flex-1 p-4 overflow-y-auto bg-red-50">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Redline Review Mode
              </h3>
              <div className="space-y-2">
                {changes.length > 0 ? (
                  changes.map((change, idx) => (
                    <Card
                      key={idx}
                      className={`p-3 ${
                        change.type === 'added' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Badge
                            variant={change.type === 'added' ? 'success' : 'error'}
                            size="sm"
                            className="mb-2"
                          >
                            {change.type === 'added' ? 'ADDED' : 'REMOVED'}
                          </Badge>
                          <div className="text-sm font-mono">{change.text}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleChange(change, true)}
                            leftIcon={<CheckCircle className="w-4 h-4 text-emerald-600" />}
                            className="text-xs"
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleChange(change, false)}
                            leftIcon={<XCircle className="w-4 h-4 text-red-600" />}
                            className="text-xs"
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-emerald-600" />
                    <p>No changes detected. Document is clean.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <textarea
              value={editorContent}
              onChange={(e) => setEditorContent(e.target.value)}
              readOnly={isLocked && !isJudge}
              className="flex-1 p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed"
              placeholder="Draft decision..."
            />
          )}

          {/* AI Citation Search Sidebar */}
          <AnimatePresence>
            {showSidebar && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <AICitationSearchSidebar
                  editorContent={editorContent}
                  caseType={caseType}
                  caseStatus={caseStatus}
                  onInsertCitation={handleInsertCitation}
                  onBookmarkCitation={handleBookmarkCitation}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Disposition Notes Panel (Judge only) */}
        <AnimatePresence>
          {showDispositionNotes && isJudge && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 150, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-slate-200 bg-amber-50 p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900">Disposition Notes</h3>
              </div>
              <textarea
                value={dispositionNotes}
                onChange={(e) => setDispositionNotes(e.target.value)}
                placeholder="Enter instructions for Attorney-Advisor (e.g., 'Award benefits - pneumoconiosis established by PFTs and Dr. Smith opinion')..."
                className="w-full h-20 px-3 py-2 border-2 border-amber-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <div className="text-xs text-slate-500 mt-2">
                These notes will be visible to Attorney-Advisor when drafting.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Add icons
function BookOpen({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function Clock({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
