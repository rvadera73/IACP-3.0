import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Edit3, CheckCircle, AlertCircle, Quote, BookOpen, Scale, TrendingUp, Save, Send, BarChart3, LayoutDashboard } from 'lucide-react';
import { Card, Badge, Button } from '../UI';
import AnalyticsDashboard from './AnalyticsDashboard';
import BenchMemoEditor from '../oalj/BenchMemoEditor';
import DraftDecisionEditor from '../oalj/DraftDecisionEditor';
import { DocumentState } from '../../services/documentVersionControl';

interface OALJAttorneyAdvisorDashboardProps {
  onCaseSelect: (caseId: string) => void;
}

interface Memo {
  caseNumber: string;
  claimant: string;
  judge: string;
  status: string;
  lastUpdated: string;
  caseType: 'BLA' | 'LHC' | 'PER';
}

interface Draft {
  caseNumber: string;
  claimant: string;
  version: number;
  status: string;
  submittedAt: string;
  caseType: 'BLA' | 'LHC' | 'PER';
}

export default function OALJAttorneyAdvisorDashboard({ onCaseSelect }: OALJAttorneyAdvisorDashboardProps) {
  const [activeView, setActiveView] = useState<'dashboard' | 'analytics' | 'memo-editor' | 'decision-editor' | 'research'>('dashboard');
  const [activeTab, setActiveTab] = useState<'memos' | 'drafts' | 'research'>('memos');
  const [selectedCaseForEditor, setSelectedCaseForEditor] = useState<any | null>(null);

  const stats = {
    activeMemos: 8,
    draftsInReview: 5,
    citationsChecked: 42,
    submissionsPending: 3,
  };

  const activeMemos: Memo[] = [
    { caseNumber: '2024-BLA-00042', claimant: 'Estate of R. Kowalski', judge: 'Hon. S. Jenkins', status: 'In Progress', lastUpdated: '2026-03-10', caseType: 'BLA' },
    { caseNumber: '2025-LHC-00089', claimant: 'J. Peterson v. Acme', judge: 'Hon. M. Ross', status: 'Draft Complete', lastUpdated: '2026-03-09', caseType: 'LHC' },
    { caseNumber: '2025-PER-00015', claimant: 'TechCorp v. BALCA', judge: 'Hon. P. Chen', status: 'Submitted', lastUpdated: '2026-03-08', caseType: 'PER' },
  ];

  const draftsInReview: Draft[] = [
    { caseNumber: '2024-BLA-00038', claimant: 'M. Johnson v. Coal Co.', version: 3, status: 'Judge Review', submittedAt: '2026-03-05', caseType: 'BLA' },
    { caseNumber: '2025-LHC-00012', claimant: 'S. Williams v. Port Auth.', version: 2, status: 'Revisions Requested', submittedAt: '2026-03-01', caseType: 'LHC' },
  ];

  const handleOpenBenchMemo = (caseData: any) => {
    setSelectedCaseForEditor(caseData);
    setActiveView('memo-editor');
  };

  const handleOpenDraftDecision = (caseData: any) => {
    setSelectedCaseForEditor(caseData);
    setActiveView('decision-editor');
  };

  const handleSubmitMemo = () => {
    alert('Bench Memo submitted to Judge!\n\n✓ Version tracked\n✓ Judge notified\n✓ Citation check attached');
    setActiveView('dashboard');
    setSelectedCaseForEditor(null);
  };

  const handleSubmitDecision = () => {
    alert('Draft Decision submitted for Review!\n\n✓ Version saved\n✓ Ready for Judge review');
    setActiveView('dashboard');
    setSelectedCaseForEditor(null);
  };

  return (
    <div className="space-y-6">
      {/* View Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            activeView === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </button>
        <button
          onClick={() => setActiveView('analytics')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            activeView === 'analytics' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Analytics
        </button>
        <button
          onClick={() => setActiveView('research')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            activeView === 'research' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Legal Research
        </button>
        {activeView === 'memo-editor' && (
          <button
            onClick={() => setActiveView('dashboard')}
            className="px-4 py-2 rounded-md text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            ← Back to Dashboard
          </button>
        )}
        {activeView === 'decision-editor' && (
          <button
            onClick={() => setActiveView('dashboard')}
            className="px-4 py-2 rounded-md text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            ← Back to Dashboard
          </button>
        )}
      </div>

      {/* Bench Memo Editor View */}
      {activeView === 'memo-editor' && selectedCaseForEditor && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <BenchMemoEditor
            caseNumber={selectedCaseForEditor.caseNumber}
            caseType={selectedCaseForEditor.caseType || 'BLA'}
            caseStatus={selectedCaseForEditor.status || 'Active'}
            onSubmitForReview={handleSubmitMemo}
          />
        </motion.div>
      )}

      {/* Draft Decision Editor View */}
      {activeView === 'decision-editor' && selectedCaseForEditor && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <DraftDecisionEditor
            caseNumber={selectedCaseForEditor.caseNumber}
            caseType={selectedCaseForEditor.caseType || 'BLA'}
            caseStatus={selectedCaseForEditor.status || 'Active'}
            userRole="OALJ Attorney-Advisor"
            onSubmitForRelease={handleSubmitDecision}
          />
        </motion.div>
      )}

      {/* Legal Research View */}
      {activeView === 'research' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <LegalResearchTools caseType="BLA" userRole="OALJ Attorney-Advisor" />
        </motion.div>
      )}

      {/* Analytics View */}
      {activeView === 'analytics' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <AnalyticsDashboard userRole="OALJ Attorney-Advisor" />
        </motion.div>
      )}

      {/* Dashboard View */}
      {activeView === 'dashboard' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between mb-2">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Active Bench Memos</div>
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold">{stats.activeMemos}</div>
            </Card>
            <Card className="p-6 border-l-4 border-l-amber-500">
              <div className="flex items-center justify-between mb-2">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Drafts in Review</div>
                <Edit3 className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-3xl font-bold">{stats.draftsInReview}</div>
            </Card>
            <Card className="p-6 border-l-4 border-l-emerald-500">
              <div className="flex items-center justify-between mb-2">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Citations Checked</div>
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-3xl font-bold">{stats.citationsChecked}</div>
            </Card>
            <Card className="p-6 border-l-4 border-l-purple-500">
              <div className="flex items-center justify-between mb-2">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Pending Submission</div>
                <Send className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-3xl font-bold">{stats.submissionsPending}</div>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('memos')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'memos' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600'
              }`}
            >
              Bench Memos
            </button>
            <button
              onClick={() => setActiveTab('drafts')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'drafts' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600'
              }`}
            >
              Draft Decisions
            </button>
            <button
              onClick={() => setActiveTab('research')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'research' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600'
              }`}
            >
              Legal Research
            </button>
          </div>

          {/* Bench Memos Tab */}
          {activeTab === 'memos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Active Bench Memos</h3>
                <Button leftIcon={<FileText className="w-4 h-4" />}>
                  New Bench Memo
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeMemos.map((memo) => (
                  <Card key={memo.caseNumber}>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="text-sm font-bold font-mono mb-1">{memo.caseNumber}</div>
                          <div className="text-xs text-slate-500">{memo.claimant}</div>
                          <div className="text-xs text-slate-500 mt-1">Judge: {memo.judge}</div>
                        </div>
                        <Badge
                          variant={memo.status === 'Submitted' ? 'success' : memo.status === 'Draft Complete' ? 'info' : 'warning'}
                          size="sm"
                        >
                          {memo.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                        <div className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          <span>Last updated: {memo.lastUpdated}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleOpenBenchMemo(memo)}
                          leftIcon={<Edit3 className="w-3 h-3" />}
                        >
                          {memo.status === 'In Progress' ? 'Continue Editing' : 'View Memo'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onCaseSelect(memo.caseNumber)}
                          leftIcon={<Scale className="w-3 h-3" />}
                        >
                          View Case
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Draft Decisions Tab */}
          {activeTab === 'drafts' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Draft Decisions in Review</h3>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {draftsInReview.map((draft) => (
                  <Card key={draft.caseNumber}>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="text-sm font-bold font-mono mb-1">{draft.caseNumber}</div>
                          <div className="text-xs text-slate-500">{draft.claimant}</div>
                          <div className="text-xs text-slate-500 mt-1">Version {draft.version} • Submitted {draft.submittedAt}</div>
                        </div>
                        <Badge variant={draft.status === 'Judge Review' ? 'info' : 'warning'} size="sm">
                          {draft.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Edit3 className="w-3 h-3" />}
                          onClick={() => handleOpenDraftDecision(draft)}
                        >
                          {draft.status === 'Revisions Requested' ? 'Edit Draft' : 'View Draft'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<TrendingUp className="w-3 h-3" />}
                        >
                          Track Changes
                        </Button>
                        {draft.status === 'Revisions Requested' && (
                          <Button
                            size="sm"
                            leftIcon={<Save className="w-3 h-3" />}
                            onClick={() => handleOpenDraftDecision(draft)}
                          >
                            Submit Revisions
                          </Button>
                        )}
                      </div>

                      {draft.status === 'Revisions Requested' && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                            <div className="text-sm text-amber-700">
                              <strong>Judge&apos;s Comments:</strong> Please clarify the standard of review section and add additional case citations for the presumption analysis.
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Legal Research Tab */}
          {activeTab === 'research' && (
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-start gap-4">
                  <BookOpen className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Legal Research Tools</h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Access comprehensive case law, regulations, and precedent decisions for Black Lung, Longshore, and PERM cases.
                    </p>
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        leftIcon={<BookOpen className="w-3 h-3" />}
                        onClick={() => setActiveView('research')}
                      >
                        Open Full Research
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        leftIcon={<CheckCircle className="w-3 h-3" />}
                        onClick={() => setActiveView('research')}
                      >
                        Citation Checker
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Card>
                <div className="p-6 border-b border-slate-200">
                  <h3 className="font-bold text-slate-900">Recent Citation Checks</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {[
                    { caseNumber: '2024-BLA-00038', total: 10, valid: 10, date: '2026-03-10' },
                    { caseNumber: '2025-LHC-00012', total: 8, valid: 8, date: '2026-03-08' },
                    { caseNumber: '2025-PER-00008', total: 12, valid: 11, date: '2026-03-05' },
                  ].map((check) => (
                    <div key={check.caseNumber} className="p-4 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold font-mono">{check.caseNumber}</div>
                        <div className="text-xs text-slate-500">{check.total} citations checked • {check.date}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={check.valid === check.total ? 'success' : 'warning'} size="sm">
                          {check.valid} of {check.total} valid
                        </Badge>
                        <Button variant="ghost" size="sm">View Report</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
