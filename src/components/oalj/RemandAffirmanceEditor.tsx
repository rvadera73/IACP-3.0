/**
 * Remand/Affirmance Order Editor
 * 
 * Specialized editor for Boards panel decisions:
 * - Affirmance Order (uphold ALJ decision)
 * - Remand Order (send back for additional fact-finding)
 * - Modification Order (change specific findings)
 * - Reversal Order (overturn ALJ decision)
 * 
 * Features:
 * - Panel member collaboration
 * - Circulation workflow
 * - Dissent/Concurrence tracking
 * - Precedential value designation
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  FileText, Save, Send, Download, CheckCircle, AlertCircle,
  MessageSquare, Users, Clock, Scale, Bookmark, Copy
} from 'lucide-react';
import { Card, Badge, Button } from '../UI';
import AICitationSearchSidebar from './AICitationSearchSidebar';
import { useAuth } from '../../context/AuthContext';
import {
  createDocument,
  saveVersion,
  lockDocument,
  getVersionHistory,
  type DocumentState,
} from '../../services/documentVersionControl';

interface RemandAffirmanceEditorProps {
  caseNumber: string;
  boardType: 'BRB' | 'ARB' | 'ECAB';
  caseStatus: string;
  panelMembers: string[];
  onSubmitForCirculation?: (document: DocumentState) => void;
}

// Order templates by type
const ORDER_TEMPLATES: Record<string, string> = {
  affirmance: `ORDER AFFIRMING

[BOARD TYPE]
[CASE NUMBER]

Claimant/Petitioner: [NAME]
Employer/Respondent: [NAME]

Before: [BOARD MEMBER 1], [BOARD MEMBER 2], [BOARD MEMBER 3]

The [BOARD TYPE] has considered petitioner's arguments on appeal and the administrative law judge's Decision and Order dated [DATE].

Upon review of the entire record, the Board finds no reversible error. The administrative law judge's findings of fact are supported by substantial evidence, and the conclusions of law are in accordance with applicable law and precedent.

Accordingly, the Decision and Order of the administrative law judge is AFFIRMED.

SO ORDERED.

_________________________
[BOARD MEMBER NAME], Chair
[BOARD TYPE]

_________________________
[BOARD MEMBER NAME], Member

_________________________
[BOARD MEMBER NAME], Member

Dated: [DATE]`,

  remand: `ORDER REMANDING

[BOARD TYPE]
[CASE NUMBER]

Claimant/Petitioner: [NAME]
Employer/Respondent: [NAME]

Before: [BOARD MEMBER 1], [BOARD MEMBER 2], [BOARD MEMBER 3]

The [BOARD TYPE] has considered petitioner's arguments on appeal and the administrative law judge's Decision and Order dated [DATE].

Upon review of the record, the Board finds that additional fact-finding is necessary on the following issue(s):

1. [Specific issue requiring additional development]
2. [Additional findings needed]

The case is REMANDED to the administrative law judge for:
- [Specific instructions for remand]
- [Additional evidence to be developed]
- [Findings to be made on remand]

On remand, the administrative law judge shall:
1. [Specific instruction 1]
2. [Specific instruction 2]
3. Issue a new Decision and Order within [TIMEFRAME]

The Board retains jurisdiction over this matter.

SO ORDERED.

_________________________
[BOARD MEMBER NAME], Chair
[BOARD TYPE]

_________________________
[BOARD MEMBER NAME], Member

_________________________
[BOARD MEMBER NAME], Member

Dated: [DATE]`,

  reversal: `ORDER REVERSING

[BOARD TYPE]
[CASE NUMBER]

Claimant/Petitioner: [NAME]
Employer/Respondent: [NAME]

Before: [BOARD MEMBER 1], [BOARD MEMBER 2], [BOARD MEMBER 3]

The [BOARD TYPE] has considered petitioner's arguments on appeal and the administrative law judge's Decision and Order dated [DATE].

Upon review of the record, the Board finds reversible error in the administrative law judge's [specific finding/conclusion].

The administrative law judge erred in [describe error]. The correct legal standard is [cite precedent]. Applying the correct standard, the evidence establishes [new finding].

Accordingly, the Decision and Order of the administrative law judge is REVERSED.

SO ORDERED.

_________________________
[BOARD MEMBER NAME], Chair
[BOARD TYPE]

_________________________
[BOARD MEMBER NAME], Member

_________________________
[BOARD MEMBER NAME], Member

Dated: [DATE]`,
};

export default function RemandAffirmanceEditor({
  caseNumber,
  boardType,
  caseStatus,
  panelMembers,
  onSubmitForCirculation,
}: RemandAffirmanceEditorProps) {
  const { user } = useAuth();
  const [editorContent, setEditorContent] = useState('');
  const [documentState, setDocumentState] = useState<DocumentState | null>(null);
  const [orderType, setOrderType] = useState<'affirmance' | 'remand' | 'reversal' | 'modification'>('affirmance');
  const [isSaving, setIsSaving] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [circulationStatus, setCirculationStatus] = useState<Record<string, string>>({});

  // Initialize document
  useEffect(() => {
    const template = ORDER_TEMPLATES[orderType] || ORDER_TEMPLATES.affirmance;
    const newDoc = createDocument(
      caseNumber,
      `${orderType === 'affirmance' ? 'Affirmance' : orderType === 'remand' ? 'Remand' : 'Reversal'} Order`,
      user?.name || 'Board Attorney-Advisor',
      user?.role || 'Board Attorney-Advisor',
      template
    );
    setDocumentState(newDoc);
    setEditorContent(template);
  }, [caseNumber, orderType, user]);

  // Handle save
  const handleSave = (comment?: string) => {
    if (!documentState || documentState.isLocked) return;

    setIsSaving(true);
    
    try {
      const newState = saveVersion(
        documentState,
        editorContent,
        user?.name || user?.role || 'Board Attorney-Advisor',
        user?.role || 'Board Attorney-Advisor',
        comment
      );
      setDocumentState(newState);
    } catch (error) {
      console.error('Failed to save:', error);
    }

    setIsSaving(false);
  };

  // Submit for panel circulation
  const handleSubmitForCirculation = () => {
    if (!documentState) return;

    const lockedState = lockDocument(documentState, user?.name || 'Attorney-Advisor');
    setDocumentState(lockedState);

    // Initialize circulation status for each panel member
    const status: Record<string, string> = {};
    panelMembers.forEach(member => {
      status[member] = 'Pending';
    });
    setCirculationStatus(status);

    if (onSubmitForCirculation) {
      onSubmitForCirculation(lockedState);
    }

    alert(`Order submitted for panel circulation. Sent to ${panelMembers.length} Board Members.`);
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

  return (
    <div className="flex h-[calc(100vh-200px)]">
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-slate-900">Panel Order Editor</h2>
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <span>{caseNumber}</span>
                <span>•</span>
                <span>{boardType}</span>
                <span>•</span>
                <span>Version {documentState?.currentVersion || 1}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Order Type Selector */}
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value as any)}
                className="px-3 py-2 border-2 border-slate-200 rounded-lg text-sm"
              >
                <option value="affirmance">Affirmance Order</option>
                <option value="remand">Remand Order</option>
                <option value="reversal">Reversal Order</option>
                <option value="modification">Modification Order</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSidebar(!showSidebar)}
                leftIcon={<BookOpen className="w-4 h-4" />}
              >
                {showSidebar ? 'Hide' : 'Show'} Research
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSave('Manual save')}
                disabled={isSaving || documentState?.isLocked}
                leftIcon={isSaving ? <Clock className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              >
                Save
              </Button>

              <Button
                onClick={handleSubmitForCirculation}
                leftIcon={<Send className="w-4 h-4" />}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Circulate to Panel
              </Button>
            </div>
          </div>

          {/* Panel Members & Circulation Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-bold text-slate-700">Panel:</span>
            </div>
            {panelMembers.map((member, idx) => (
              <Badge key={idx} variant="info" size="sm">
                {member}
                {circulationStatus[member] && (
                  <span className="ml-1">
                    {circulationStatus[member] === 'Approved' ? '✓' :
                     circulationStatus[member] === 'Pending' ? '⏳' : '○'}
                  </span>
                )}
              </Badge>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden flex">
          <textarea
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
            readOnly={documentState?.isLocked}
            className="flex-1 p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed"
            placeholder="Draft order..."
          />

          {/* AI Citation Search Sidebar */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: showSidebar ? 320 : 0, opacity: showSidebar ? 1 : 0 }}
            className="overflow-hidden"
          >
            <AICitationSearchSidebar
              editorContent={editorContent}
              caseType={boardType === 'BRB' ? 'BLA' : boardType === 'ARB' ? 'PER' : 'ECAB'}
              caseStatus={caseStatus}
              onInsertCitation={handleInsertCitation}
              onBookmarkCitation={handleBookmarkCitation}
            />
          </motion.div>
        </div>

        {/* Circulation Status Panel */}
        {Object.keys(circulationStatus).length > 0 && (
          <div className="border-t border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900">Circulation Status</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {panelMembers.map((member, idx) => (
                <Card key={idx} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-slate-900">{member}</div>
                    <Badge
                      variant={
                        circulationStatus[member] === 'Approved' ? 'success' :
                        circulationStatus[member] === 'Dissent' ? 'error' :
                        'warning'
                      }
                      size="sm"
                    >
                      {circulationStatus[member] || 'Pending'}
                    </Badge>
                  </div>
                  {circulationStatus[member] === 'Dissent' && (
                    <div className="text-xs text-slate-600 mt-2">
                      <MessageSquare className="w-3 h-3 inline mr-1" />
                      Dissent filed
                    </div>
                  )}
                  {circulationStatus[member] === 'Concurrence' && (
                    <div className="text-xs text-slate-600 mt-2">
                      <CheckCircle className="w-3 h-3 inline mr-1" />
                      Concurrence filed
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
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

function Send({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}
