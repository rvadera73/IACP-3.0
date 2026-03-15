import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  Edit3,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Scale,
  TrendingUp,
  Save,
  LayoutDashboard,
  BarChart3,
  ShieldCheck,
  ArrowUpRight,
  History,
  Signature,
} from 'lucide-react';
import { Card, Badge, Button } from '../UI';
import AnalyticsDashboard from './AnalyticsDashboard';
import BenchMemoEditor from '../oalj/BenchMemoEditor';
import DraftDecisionEditor from '../oalj/DraftDecisionEditor';
import LegalResearchTools from '../oalj/LegalResearchTools';
import AppellateBriefReview from '../oalj/AppellateBriefReview';
import RemandAffirmanceEditor from '../oalj/RemandAffirmanceEditor';
import { useAuth } from '../../context/AuthContext';
import { DocumentState } from '../../services/documentVersionControl';

interface BoardsAttorneyAdvisorDashboardProps {
  onCaseSelect: (caseId: string) => void;
}

interface Memo {
  caseNumber: string;
  claimant: string;
  panel: string;
  status: string;
  caseType: 'BRB' | 'ARB' | 'ECAB';
}

interface Draft {
  caseNumber: string;
  claimant: string;
  version: number;
  status: string;
  caseType: 'BRB' | 'ARB' | 'ECAB';
}

export default function BoardsAttorneyAdvisorDashboard({ onCaseSelect }: BoardsAttorneyAdvisorDashboardProps) {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'analytics' | 'brief-review' | 'panel-order' | 'memo-editor' | 'decision-editor' | 'research'>('dashboard');
  const [activeTab, setActiveTab] = useState<'memos' | 'drafts' | 'research'>('memos');
  const [selectedCaseForEditor, setSelectedCaseForEditor] = useState<any | null>(null);

  const userDivision = user?.division || 'BRB';

  const stats = {
    activeMemos: 5,
    draftsInReview: 3,
    citationsChecked: 28,
    submissionsPending: 2,
  };

  const activeMemos: Memo[] = [
    { caseNumber: `${userDivision} No. 24-0123`, claimant: 'Williams v. Black Diamond', panel: 'Panel A', status: 'In Progress', caseType: userDivision as 'BRB' | 'ARB' | 'ECAB' },
    { caseNumber: `${userDivision} No. 24-0456`, claimant: 'Garcia v. Logistics', panel: 'Panel B', status: 'Draft Complete', caseType: userDivision as 'BRB' | 'ARB' | 'ECAB' },
  ];

  const draftsInReview: Draft[] = [
    { caseNumber: `${userDivision} No. 24-0789`, claimant: 'Thompson v. Federal Express', version: 2, status: 'Board Review', caseType: userDivision as 'BRB' | 'ARB' | 'ECAB' },
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
    alert('Bench Memo submitted to Board!\n\n✓ Version tracked\n✓ Board notified\n✓ Citation check attached');
    setActiveView('dashboard');
    setSelectedCaseForEditor(null);
  };

  const handleSubmitDecision = () => {
    alert('Draft Decision submitted for Review!\n\n✓ Version saved\n✓ Ready for Board review');
    setActiveView('dashboard');
    setSelectedCaseForEditor(null);
  };

  const getDivisionIcon = (division: string) => {
    switch (division) {
      case 'BRB': return <ShieldCheck className="w-4 h-4" />;
      case 'ARB': return <ArrowUpRight className="w-4 h-4" />;
      case 'ECAB': return <History className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getDivisionColor = (division: string) => {
    switch (division) {
      case 'BRB': return 'border-l-amber-500';
      case 'ARB': return 'border-l-blue-500';
      case 'ECAB': return 'border-l-emerald-500';
      default: return 'border-l-slate-500';
    }
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
          onClick={() => setActiveView('brief-review')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            activeView === 'brief-review' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Brief Review
        </button>
        <button
          onClick={() => setActiveView('panel-order')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            activeView === 'panel-order' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Signature className="w-4 h-4" />
          Panel Order
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
            caseType={selectedCaseForEditor.caseType || userDivision as 'BRB' | 'ARB' | 'ECAB'}
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
            caseType={selectedCaseForEditor.caseType || userDivision as 'BRB' | 'ARB' | 'ECAB'}
            caseStatus={selectedCaseForEditor.status || 'Active'}
            userRole="Board Attorney-Advisor"
            onSubmitForRelease={handleSubmitDecision}
          />
        </motion.div>
      )}

      {/* Legal Research View */}
      {activeView === 'research' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <LegalResearchTools caseType={userDivision as 'BRB' | 'ARB' | 'ECAB'} userRole="Board Attorney-Advisor" />
        </motion.div>
      )}

      {/* Brief Review Editor View */}
      {activeView === 'brief-review' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <AppellateBriefReview
              caseNumber={`${userDivision} No. 24-0123`}
              boardType={userDivision as 'BRB' | 'ARB' | 'ECAB'}
              caseStatus="Briefing"
              briefType="petition"
              onSubmitAnalysis={() => setActiveView('dashboard')}
            />
          </Card>
        </motion.div>
      )}

      {/* Panel Order Editor View */}
      {activeView === 'panel-order' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <RemandAffirmanceEditor
              caseNumber={`${userDivision} No. 24-0123`}
              boardType={userDivision as 'BRB' | 'ARB' | 'ECAB'}
              caseStatus="Under Decision"
              panelMembers={[
                userDivision === 'BRB' ? 'Chair Member 1' :
                userDivision === 'ARB' ? 'Chair Member 2' : 'Chair Member 3',
                'Member 2',
                'Member 3'
              ]}
              onSubmitForCirculation={() => setActiveView('dashboard')}
            />
          </Card>
        </motion.div>
      )}

      {/* Analytics View */}
      {activeView === 'analytics' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <AnalyticsDashboard userRole={`Board Attorney-Advisor - ${userDivision}`} />
        </motion.div>
      )}

      {/* Dashboard View */}
      {activeView === 'dashboard' && (
        <div className="space-y-6">
          {/* Division Banner */}
          <div className={`p-4 rounded-xl border-l-4 ${getDivisionColor(userDivision)}`}>
            <div className="flex items-center gap-3">
              {getDivisionIcon(userDivision)}
              <div>
                <div className="font-bold text-slate-900">{userDivision} Attorney-Advisor</div>
                <div className="text-sm text-slate-600">Legal research and bench memo preparation</div>
              </div>
            </div>
          </div>

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
                <Save className="w-5 h-5 text-purple-500" />
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
                <h3 className="font-bold text-slate-900">Active Bench Memos - {userDivision}</h3>
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
                          <div className="text-xs text-slate-500 mt-1">Panel: {memo.panel}</div>
                        </div>
                        <Badge variant={memo.status === 'Draft Complete' ? 'info' : 'warning'} size="sm">
                          {memo.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" leftIcon={<Edit3 className="w-3 h-3" />} onClick={() => handleOpenBenchMemo(memo)}>
                          {memo.status === 'In Progress' ? 'Continue Editing' : 'View Memo'}
                        </Button>
                        <Button variant="outline" size="sm" leftIcon={<Scale className="w-3 h-3" />} onClick={() => onCaseSelect(memo.caseNumber)}>
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
                          <div className="text-xs text-slate-500 mt-1">Version {draft.version}</div>
                        </div>
                        <Badge variant="info" size="sm">{draft.status}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" leftIcon={<Edit3 className="w-3 h-3" />} onClick={() => handleOpenDraftDecision(draft)}>
                          View Draft
                        </Button>
                        <Button variant="outline" size="sm" leftIcon={<TrendingUp className="w-3 h-3" />}>
                          Track Changes
                        </Button>
                      </div>
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
                      Access {userDivision} precedent decisions, regulations, and case law.
                    </p>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" leftIcon={<BookOpen className="w-3 h-3" />}>
                        Search Case Law
                      </Button>
                      <Button variant="outline" size="sm" leftIcon={<Scale className="w-3 h-3" />}>
                        View Regulations
                      </Button>
                      <Button variant="outline" size="sm" leftIcon={<CheckCircle className="w-3 h-3" />}>
                        Citation Checker
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Card>
                <div className="p-6 border-b border-slate-200">
                  <h3 className="font-bold text-slate-900">{userDivision} Precedent Decisions</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {[
                    { caseNumber: `${userDivision} No. 23-0456`, title: 'Key Precedent', citations: 15, date: '2025-11-15' },
                    { caseNumber: `${userDivision} No. 23-0123`, title: 'Leading Case', citations: 28, date: '2025-08-20' },
                  ].map((caseItem) => (
                    <div key={caseItem.caseNumber} className="p-4 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold">{caseItem.title}</div>
                        <div className="text-xs text-slate-500">{caseItem.caseNumber} • {caseItem.date}</div>
                      </div>
                      <Badge variant="info" size="sm">{caseItem.citations} citations</Badge>
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
