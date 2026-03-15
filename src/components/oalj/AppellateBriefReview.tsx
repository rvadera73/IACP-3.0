/**
 * Appellate Brief Review Editor
 * 
 * Specialized editor for Boards Attorney-Advisors to review appellate briefs:
 * - Petition for Review
 * - Response Brief
 * - Reply Brief
 * 
 * Features:
 * - Assignment of Error tracking
 * - Standard of Review annotations
 * - Citation validation for appellate cases
 * - Precedent matching from BRB/ARB/ECAB decisions
 * - Briefing schedule tracker
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText, BookOpen, Scale, AlertCircle, CheckCircle,
  Search, MessageSquare, Bookmark, Copy, Plus, Eye,
  TrendingUp, Target, Quote, List, ListOrdered
} from 'lucide-react';
import { Card, Badge, Button } from '../UI';
import AICitationSearchSidebar from './AICitationSearchSidebar';
import { useAuth } from '../../context/AuthContext';

interface AppellateBriefReviewProps {
  caseNumber: string;
  boardType: 'BRB' | 'ARB' | 'ECAB';
  caseStatus: string;
  briefType: 'petition' | 'response' | 'reply';
  onSubmitAnalysis?: (analysis: any) => void;
}

interface AssignmentOfError {
  id: string;
  number: number;
  description: string;
  standardOfReview: string;
  argumentSummary: string;
  meritAssessment: 'meritorious' | 'non-meritorious' | 'unclear';
  notes: string;
}

interface BriefAnalysis {
  briefType: string;
  filingDate: string;
  pageCount: number;
  assignmentsOfError: AssignmentOfError[];
  keyCitations: string[];
  summary: string;
}

// Mock appellate brief data
const MOCK_BRIEFS: Record<string, BriefAnalysis> = {
  'BRB No. 24-0123': {
    briefType: 'Petition for Review',
    filingDate: '2024-03-28',
    pageCount: 45,
    assignmentsOfError: [
      {
        id: 'aoe-1',
        number: 1,
        description: 'The ALJ erred in finding claimant totally disabled under 20 C.F.R. § 718.204(b).',
        standardOfReview: 'Substantial evidence',
        argumentSummary: 'Petitioner argues ALJ relied on stale PFTs and ignored more recent medical evidence showing improved lung function.',
        meritAssessment: 'unclear',
        notes: 'Need to review PFT dates and qualifying vs non-qualifying studies.',
      },
      {
        id: 'aoe-2',
        number: 2,
        description: 'The ALJ erred in weighing conflicting medical opinions under 20 C.F.R. § 718.204(b)(2).',
        standardOfReview: 'Rational fact-finding',
        argumentSummary: 'Petitioner contends ALJ improperly discounted Dr. Smith\'s opinion without adequate explanation.',
        meritAssessment: 'non-meritorious',
        notes: 'ALJ provided detailed reasoning for weighting. Substantial evidence supports finding.',
      },
    ],
    keyCitations: [
      '20 C.F.R. § 718.204(b)',
      'Director, OWCP v. Greenwich Collieries, 512 U.S. 267 (1994)',
      'Consolidation Coal Co. v. Director, OWCP, 50 F.3d 238 (4th Cir. 1995)',
    ],
    summary: 'Petitioner challenges ALJ\'s finding of total disability. Primary argument focuses on staleness of pulmonary function tests and alleged improper weighing of medical opinions.',
  },
};

export default function AppellateBriefReview({
  caseNumber,
  boardType,
  caseStatus,
  briefType,
  onSubmitAnalysis,
}: AppellateBriefReviewProps) {
  const { user } = useAuth();
  const [briefContent, setBriefContent] = useState('');
  const [assignmentsOfError, setAssignmentsOfError] = useState<AssignmentOfError[]>([]);
  const [selectedAOE, setSelectedAOE] = useState<AssignmentOfError | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [analysisNotes, setAnalysisNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'brief' | 'aoe' | 'analysis'>('brief');

  // Load mock brief data
  useEffect(() => {
    if (MOCK_BRIEFS[caseNumber]) {
      const brief = MOCK_BRIEFS[caseNumber];
      setAssignmentsOfError(brief.assignmentsOfError);
      setAnalysisNotes(brief.summary);
    }
  }, [caseNumber]);

  // Extract assignments of error from brief content
  const extractAssignmentsOfError = () => {
    // In production, use AI to extract AOE from brief text
    const mockAOE: AssignmentOfError = {
      id: `aoe-${Date.now()}`,
      number: assignmentsOfError.length + 1,
      description: 'New assignment of error detected...',
      standardOfReview: 'To be determined',
      argumentSummary: '',
      meritAssessment: 'unclear',
      notes: '',
    };
    setAssignmentsOfError([...assignmentsOfError, mockAOE]);
  };

  // Update AOE merit assessment
  const updateAOEMerit = (aoeId: string, merit: AssignmentOfError['meritAssessment']) => {
    setAssignmentsOfError(assignmentsOfError.map(aoe =>
      aoe.id === aoeId ? { ...aoe, meritAssessment: merit } : aoe
    ));
  };

  // Insert citation
  const handleInsertCitation = (citation: string) => {
    setBriefContent(briefContent + '\n' + citation);
  };

  // Bookmark citation
  const handleBookmarkCitation = (citation: any) => {
    console.log('Bookmarked:', citation);
  };

  // Submit analysis
  const handleSubmitAnalysis = () => {
    const analysis = {
      caseNumber,
      briefType,
      assignmentsOfError,
      analysisNotes,
      submittedBy: user?.name,
      submittedAt: new Date().toISOString(),
    };

    if (onSubmitAnalysis) {
      onSubmitAnalysis(analysis);
    }

    alert('Brief analysis submitted to Board Members');
  };

  const meritCounts = {
    meritorious: assignmentsOfError.filter(a => a.meritAssessment === 'meritorious').length,
    nonMeritorious: assignmentsOfError.filter(a => a.meritAssessment === 'non-meritorious').length,
    unclear: assignmentsOfError.filter(a => a.meritAssessment === 'unclear').length,
  };

  return (
    <div className="flex h-[calc(100vh-200px)]">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-slate-900">
                {briefType === 'petition' ? 'Petition for Review' :
                 briefType === 'response' ? 'Response Brief' : 'Reply Brief'}
              </h2>
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <span>{caseNumber}</span>
                <span>•</span>
                <span>{boardType}</span>
                <span>•</span>
                <span>{assignmentsOfError.length} Assignment(s) of Error</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={activeTab === 'brief' ? 'outline' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('brief')}
                leftIcon={<FileText className="w-4 h-4" />}
              >
                Brief Text
              </Button>
              <Button
                variant={activeTab === 'aoe' ? 'outline' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('aoe')}
                leftIcon={<Target className="w-4 h-4" />}
              >
                Assignments of Error
              </Button>
              <Button
                variant={activeTab === 'analysis' ? 'outline' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('analysis')}
                leftIcon={<MessageSquare className="w-4 h-4" />}
              >
                Analysis
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSidebar(!showSidebar)}
                leftIcon={<BookOpen className="w-4 h-4" />}
              >
                {showSidebar ? 'Hide' : 'Show'} Research
              </Button>
              <Button
                onClick={handleSubmitAnalysis}
                leftIcon={<Send className="w-4 h-4" />}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Submit Analysis
              </Button>
            </div>
          </div>

          {/* Merit Assessment Summary */}
          {assignmentsOfError.length > 0 && (
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-600">Meritorious: {meritCounts.meritorious}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-slate-600">Non-Meritorious: {meritCounts.nonMeritorious}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-300" />
                <span className="text-slate-600">Unclear: {meritCounts.unclear}</span>
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex">
          {/* Brief Text Tab */}
          {activeTab === 'brief' && (
            <div className="flex-1 overflow-y-auto p-6">
              <Card>
                <div className="p-6">
                  <h3 className="font-bold text-slate-900 mb-4">Brief Content</h3>
                  <textarea
                    value={briefContent}
                    onChange={(e) => setBriefContent(e.target.value)}
                    className="w-full h-96 p-4 border-2 border-slate-200 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Paste brief content here for analysis..."
                  />
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={extractAssignmentsOfError}
                      leftIcon={<Plus className="w-4 h-4" />}
                    >
                      Extract Assignments of Error
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Copy className="w-4 h-4" />}
                    >
                      Copy to Clipboard
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Assignments of Error Tab */}
          {activeTab === 'aoe' && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {assignmentsOfError.map((aoe) => (
                  <Card
                    key={aoe.id}
                    className={`p-6 cursor-pointer transition-all ${
                      selectedAOE?.id === aoe.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => setSelectedAOE(aoe)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Badge variant="info" size="sm">AOE #{aoe.number}</Badge>
                        <Badge
                          variant={
                            aoe.meritAssessment === 'meritorious' ? 'success' :
                            aoe.meritAssessment === 'non-meritorious' ? 'error' :
                            'warning'
                          }
                          size="sm"
                        >
                          {aoe.meritAssessment}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateAOEMerit(aoe.id, 'meritorious');
                          }}
                          className="text-xs"
                        >
                          Meritorious
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateAOEMerit(aoe.id, 'non-meritorious');
                          }}
                          className="text-xs"
                        >
                          Non-Meritorious
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateAOEMerit(aoe.id, 'unclear');
                          }}
                          className="text-xs"
                        >
                          Unclear
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="text-xs font-bold text-slate-500 uppercase mb-1">Assignment of Error</div>
                        <div className="text-sm text-slate-900">{aoe.description}</div>
                      </div>

                      <div>
                        <div className="text-xs font-bold text-slate-500 uppercase mb-1">Standard of Review</div>
                        <div className="text-sm text-slate-900">{aoe.standardOfReview}</div>
                      </div>

                      <div>
                        <div className="text-xs font-bold text-slate-500 uppercase mb-1">Argument Summary</div>
                        <div className="text-sm text-slate-700">{aoe.argumentSummary}</div>
                      </div>

                      {aoe.notes && (
                        <div>
                          <div className="text-xs font-bold text-slate-500 uppercase mb-1">AA Notes</div>
                          <div className="text-sm text-slate-700 italic">{aoe.notes}</div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}

                {assignmentsOfError.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    <Target className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>No assignments of error identified yet.</p>
                    <p className="text-sm mt-2">Paste brief content and click "Extract Assignments of Error"</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Analysis Tab */}
          {activeTab === 'analysis' && (
            <div className="flex-1 overflow-y-auto p-6">
              <Card>
                <div className="p-6">
                  <h3 className="font-bold text-slate-900 mb-4">Brief Analysis & Recommendation</h3>
                  <textarea
                    value={analysisNotes}
                    onChange={(e) => setAnalysisNotes(e.target.value)}
                    className="w-full h-96 p-4 border-2 border-slate-200 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Provide your analysis of the brief, including:
- Summary of arguments
- Assessment of each assignment of error
- Citation to relevant precedent
- Recommendation to Board Members..."
                  />
                  <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-bold text-slate-900 mb-2 text-sm">Analysis Template:</h4>
                    <div className="text-xs text-slate-600 space-y-2">
                      <div><strong>I. Introduction</strong> - Brief overview of case and issue on appeal</div>
                      <div><strong>II. Standard of Review</strong> - Substantial evidence / Questions of law</div>
                      <div><strong>III. Analysis by Assignment of Error</strong> - Address each AOE with precedent</div>
                      <div><strong>IV. Recommendation</strong> - Affirm, Reverse, Remand, or Modify</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
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
                  editorContent={briefContent}
                  caseType={boardType === 'BRB' ? 'BLA' : boardType === 'ARB' ? 'PER' : 'ECAB'}
                  caseStatus={caseStatus}
                  onInsertCitation={handleInsertCitation}
                  onBookmarkCitation={handleBookmarkCitation}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Add Send icon
function Send({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}
