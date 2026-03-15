import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Clock, CheckCircle, AlertCircle, Gavel, TrendingUp, Edit3, Signature, Eye, BarChart3, LayoutDashboard } from 'lucide-react';
import { Card, Badge, Button } from '../UI';
import CasesGallery from '../oalj/CasesGallery';
import AnalyticsDashboard from './AnalyticsDashboard';
import JudgeRedlineView from '../oalj/JudgeRedlineView';
import { MOCK_CASE_FOLDERS } from '../../data/mockDashboardData';
import { useAuth } from '../../context/AuthContext';
import { generateOfficialPDF, downloadPDF } from '../../services/pdfGeneration';

interface OALJJudgeDashboardProps {
  onCaseSelect: (caseId: string) => void;
}

export default function OALJJudgeDashboard({ onCaseSelect }: OALJJudgeDashboardProps) {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'analytics' | 'redline'>('dashboard');
  const [showRedlineModal, setShowRedlineModal] = useState(false);
  const [selectedCaseForRedline, setSelectedCaseForRedline] = useState<any | null>(null);
  const [showJudgeRedlineView, setShowJudgeRedlineView] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);

  const stats = {
    activeCases: 24,
    upcomingHearings: 5,
    decisionsDue: 3,
    motionsPending: 8,
  };

  const decisionsPending = [
    { caseNumber: '2024-BLA-00038', claimant: 'M. Johnson v. Coal Co.', daysPending: 45, priority: 'High', draftVersion: 2 },
    { caseNumber: '2025-LHC-00012', claimant: 'S. Williams v. Port Auth.', daysPending: 30, priority: 'Medium', draftVersion: 1 },
    { caseNumber: '2025-PER-00008', claimant: 'TechCorp v. BALCA', daysPending: 18, priority: 'Medium', draftVersion: 3 },
  ];

  const upcomingHearings = [
    { caseNumber: '2024-BLA-00042', claimant: 'Estate of R. Kowalski', date: 'Mar 20, 2026', time: '10:00 AM', type: 'Hearing' },
    { caseNumber: '2025-LHC-00089', claimant: 'J. Peterson v. Acme', date: 'Mar 25, 2026', time: '2:00 PM', type: 'Pre-Hearing' },
    { caseNumber: '2025-PER-00015', claimant: 'TechCorp v. BALCA', date: 'Apr 10, 2026', time: '11:00 AM', type: 'Hearing' },
  ];

  const handleOpenRedline = (caseData: any) => {
    setSelectedCaseForRedline(caseData);
    setShowRedlineModal(true);
  };

  const handleSignDecision = (caseNumber: string) => {
    alert(`Decision signed and released for ${caseNumber}\n\nThe decision has been:\n✓ Electronically signed\n✓ Released to docket\n✓ Mailed to all parties\n✓ Posted to public record`);
  };

  return (
    <div className="space-y-8">
      {/* 270-Day Deadline Alert */}
      <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <div className="font-bold text-red-900">⚠️ 270-Day Deadline Alerts</div>
            <div className="text-sm text-red-700 mt-1">
              You have <strong>2 cases</strong> approaching the 270-day statutory deadline:
            </div>
            <div className="flex gap-4 mt-2">
              <Badge variant="error">2024-BLA-00038 (45 days overdue)</Badge>
              <Badge variant="error">2025-LHC-00012 (12 days remaining)</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* View Navigation - Always Visible */}
      <div className="flex items-center gap-2 mb-6">
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
          onClick={() => {
            setActiveView('redline');
            setShowJudgeRedlineView(true);
          }}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            activeView === 'redline' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Signature className="w-4 h-4" />
          Judge Redline View
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
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Active Cases</div>
            <FileText className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold">{stats.activeCases}</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Hearings This Month</div>
            <Gavel className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-bold">{stats.upcomingHearings}</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Decisions Due</div>
            <Clock className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-3xl font-bold">{stats.decisionsDue}</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Motions Pending</div>
            <AlertCircle className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold">{stats.motionsPending}</div>
        </Card>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Decisions Pending Draft */}
        <Card>
          <div className="p-6 border-b border-slate-200">
            <h3 className="font-bold text-slate-900">Decisions Pending Draft/Review</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {decisionsPending.map((decision, idx) => (
              <div key={idx} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm font-bold font-mono">{decision.caseNumber}</div>
                    <div className="text-xs text-slate-500">{decision.claimant}</div>
                  </div>
                  <Badge variant={decision.priority === 'High' ? 'error' : 'warning'} size="sm">
                    {decision.priority}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="text-xs text-slate-500">
                    {decision.daysPending} days pending • Draft v{decision.draftVersion}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenRedline(decision)}
                      leftIcon={<Edit3 className="w-3 h-3" />}
                    >
                      Edit Draft
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSignDecision(decision.caseNumber)}
                      leftIcon={<Signature className="w-3 h-3" />}
                    >
                      Sign & Release
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Hearings */}
        <Card>
          <div className="p-6 border-b border-slate-200">
            <h3 className="font-bold text-slate-900">Upcoming Hearings</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {upcomingHearings.map((hearing, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold font-mono">{hearing.caseNumber}</div>
                  <div className="text-xs text-slate-500">{hearing.claimant}</div>
                </div>
                <div className="text-right">
                  <Badge variant="info" size="sm">{hearing.type}</Badge>
                  <div className="text-xs text-slate-500 mt-1">{hearing.date}, {hearing.time}</div>
                  <Button variant="ghost" size="sm" className="mt-1" leftIcon={<Eye className="w-3 h-3" />}>
                    View Case
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* My Cases */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900">My Assigned Cases</h3>
          <Badge variant="neutral">24 cases</Badge>
        </div>
        <CasesGallery
          cases={MOCK_CASE_FOLDERS.slice(0, 4)}
          onCaseClick={onCaseSelect}
        />
      </div>

      {/* Analytics View */}
      {activeView === 'analytics' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <AnalyticsDashboard userRole="Administrative Law Judge" />
        </motion.div>
      )}

      {/* Judge Redline View */}
      {activeView === 'redline' && showJudgeRedlineView && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <JudgeRedlineView
              document={{
                id: 'doc-1',
                caseNumber: '2024-BLA-00042',
                documentType: 'Decision and Order',
                currentVersion: 3,
                versions: [
                  {
                    id: 'v1',
                    versionNumber: 1,
                    content: 'Initial draft by Attorney-Advisor...',
                    author: 'J. Smith',
                    authorRole: 'OALJ Attorney-Advisor',
                    createdAt: '2026-03-01T09:00:00Z',
                    status: 'draft',
                    isLocked: false,
                  },
                  {
                    id: 'v2',
                    versionNumber: 2,
                    content: 'Revised draft with findings...',
                    author: 'J. Smith',
                    authorRole: 'OALJ Attorney-Advisor',
                    createdAt: '2026-03-05T14:30:00Z',
                    status: 'under_review',
                    isLocked: true,
                  },
                  {
                    id: 'v3',
                    versionNumber: 3,
                    content: 'Final draft with judge edits...',
                    author: 'Hon. Sarah Jenkins',
                    authorRole: 'Administrative Law Judge',
                    createdAt: '2026-03-08T16:45:00Z',
                    status: 'final',
                    isLocked: false,
                  },
                ],
                isLocked: false,
                lastSaved: '2026-03-08T16:45:00Z',
              }}
              caseNumber="2024-BLA-00042"
              caseType="BLA"
              userRole={user?.role || 'Administrative Law Judge'}
              onAcceptChanges={(changes) => {
                console.log('Accepted changes:', changes);
              }}
              onRejectChanges={(changes) => {
                console.log('Rejected changes:', changes);
              }}
              onAddDispositionNotes={(notes) => {
                console.log('Disposition notes:', notes);
              }}
              onSignAndRelease={(signature) => {
                console.log('Signed with:', signature);
                // Generate PDF
                generateOfficialPDF({
                  caseNumber: '2024-BLA-00042',
                  caseType: 'BLA',
                  claimant: 'Estate of R. Kowalski',
                  employer: 'Pittsburgh Coal Co.',
                  judgeName: user?.name || 'Hon. Sarah Jenkins',
                  decisionDate: new Date().toLocaleDateString(),
                  decisionType: 'Decision and Order',
                  content: 'Decision content...',
                  findings: ['Finding 1', 'Finding 2'],
                  conclusions: ['Conclusion 1', 'Conclusion 2'],
                  order: 'Claimant is AWARDED benefits.',
                  appealRights: true,
                }).then(({ pdfUrl, filename }) => {
                  downloadPDF(pdfUrl, filename);
                });
              }}
            />
          </Card>
        </motion.div>
      )}

      {/* Redline Modal */}
      {showRedlineModal && selectedCaseForRedline && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Redline Mode - Decision Draft</h3>
                <p className="text-sm text-slate-600">{selectedCaseForRedline.caseNumber} • Draft v{selectedCaseForRedline.draftVersion}</p>
              </div>
              <button onClick={() => setShowRedlineModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <AlertCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-grow p-6 overflow-y-auto">
              <div className="prose max-w-none">
                <h4 className="text-lg font-bold mb-4">Decision and Order</h4>
                <p className="text-slate-700 leading-relaxed">
                  This case arises under the <span className="bg-yellow-200">Black Lung Benefits Act</span>. 
                  Claimant alleges total disability due to pneumoconiosis arising from coal mine employment.
                </p>
                <h5 className="font-bold mt-4 mb-2">Findings of Fact:</h5>
                <p className="text-slate-700 leading-relaxed">
                  1. Claimant worked <span className="bg-green-200 line-through">15 years</span> <span className="bg-green-200">17 years</span> in underground coal mines.<br/>
                  2. Medical evidence establishes total disability.<br/>
                  3. <span className="bg-red-200 line-through">Employer rebutted presumption</span> <span className="bg-green-200">Employer failed to rebut presumption</span>.
                </p>
                <h5 className="font-bold mt-4 mb-2">Conclusions of Law:</h5>
                <p className="text-slate-700 leading-relaxed">
                  Claimant is entitled to benefits under 20 C.F.R. § 718.
                </p>
                <h5 className="font-bold mt-4 mb-2">Order:</h5>
                <p className="text-slate-700 leading-relaxed">
                  <span className="bg-yellow-200">AWARD</span> benefits.
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-between">
              <div className="flex gap-2">
                <Badge variant="neutral">Changes: +12 / -3</Badge>
                <Badge variant="info">Comments: 2</Badge>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">Add Comment</Button>
                <Button leftIcon={<Signature className="w-4 h-4" />} onClick={() => { setShowRedlineModal(false); handleSignDecision(selectedCaseForRedline.caseNumber); }}>
                  Sign & Release
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
