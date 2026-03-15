import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X, FileText, Users, Calendar, CheckCircle, AlertCircle, Download,
  Gavel, MessageSquare, Clock, TrendingUp, Search, Pin, Edit3
} from 'lucide-react';
import { Card, Badge, Button } from '../UI';
import TimelineSparkline from './TimelineSparkline';
import AIChatbot from './AIChatbot';

interface UnifiedFolderProps {
  caseId: string;
  userRole: string;
  onClose: () => void;
}

export default function UnifiedFolder({ caseId, userRole, onClose }: UnifiedFolderProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'filings' | 'hearings' | 'drafting'>('overview');

  // Mock case data
  const caseData = {
    docketNumber: '2024-BLA-00042',
    title: 'Martinez v. Apex Coal Mining',
    caseType: 'BLA',
    status: 'Decision Pending',
    phase: 'Decision' as const,
    daysElapsed: 225,
    totalDays: 270,
    urgency: 'High' as const,
    filedAt: '2025-06-15',
    judge: 'Hon. Sarah Jenkins',
    clerk: 'J. Thompson',
    parties: [
      { name: 'Robert Martinez', role: 'Claimant', represented: false, email: 'r.martinez@email.com', phone: '(412) 555-0123' },
      { name: 'Apex Coal Mining', role: 'Employer', represented: true, attorney: 'Hansen & Associates' },
    ],
    hearings: [
      { date: '2025-09-20', type: 'Pre-Hearing Conference', location: 'Room 402', completed: true },
      { date: '2025-11-15', type: 'Evidentiary Hearing', location: 'Room 402', completed: true },
    ],
    filings: [
      { id: 'F1', type: 'Initial Claim', form: 'LS-203', date: '2025-06-15', status: 'Accepted' },
      { id: 'F2', type: 'Motion to Compel', date: '2025-08-20', status: 'Granted' },
      { id: 'F3', type: 'Medical Evidence', date: '2025-10-05', status: 'Admitted' },
    ],
    exhibits: {
      CX: [{ id: 'CX-1', name: 'Pulmonary Function Test', date: '2025-09-01', status: 'Admitted' }],
      EX: [{ id: 'EX-1', name: 'Employment Records', date: '2025-09-15', status: 'Admitted' }],
      DX: [{ id: 'DX-1', name: 'Director Medical Report', date: '2025-10-01', status: 'Under Review' }],
    },
    benchMemo: {
      legalIssue: 'Whether claimant established total disability under 20 C.F.R. § 718.204(b)',
      standardOfReview: 'Substantial evidence',
      recommendedOutcome: 'Award benefits',
      lastUpdated: '2026-03-01',
    },
    draftDecision: {
      version: 3,
      status: 'Under Review',
      lastEdited: '2026-03-10',
      citationCheck: '10/10 valid',
    },
    deadlines: [
      { title: 'Decision Due', date: '2026-03-15', type: 'Statutory', daysRemaining: 4 },
    ],
  };

  // Role-based actions
  const getRoleActions = () => {
    switch (userRole) {
      case 'Docket Clerk':
        return ['Confirm Assignment', 'Send Deficiency', 'Auto-Docket'];
      case 'Legal Assistant':
        return ['Issue Notice of Hearing', 'Add Exhibit', 'Schedule Conference'];
      case 'Judge':
      case 'Administrative Law Judge':
        return ['Sign & Release Decision', 'Seal Document', 'Close Record'];
      case 'Attorney-Advisor':
        return ['Submit Draft to Judge', 'Request Citation Check'];
      default:
        return ['View Case'];
    }
  };

  // AI Findings based on role
  const getAIFinding = () => {
    switch (userRole) {
      case 'Docket Clerk':
        return 'Judge Smith has the lowest load score (42%).';
      case 'Legal Assistant':
        return 'Optimal hearing date found: Oct 12 (14+ days notice).';
      case 'Judge':
      case 'Administrative Law Judge':
        return 'Warning: 48 hours until 270-day BLA deadline.';
      case 'Attorney-Advisor':
        return 'Citation check complete: 10/10 precedents are valid.';
      default:
        return '';
    }
  };

  const aiFinding = getAIFinding();
  const roleActions = getRoleActions();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Common View */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="info">{caseData.caseType}</Badge>
                <Badge variant={caseData.urgency === 'Critical' ? 'error' : caseData.urgency === 'High' ? 'warning' : 'success'}>
                  {caseData.status}
                </Badge>
                {caseData.parties.some(p => !p.represented) && (
                  <Badge variant="warning">⚠️ Pro Se Party</Badge>
                )}
              </div>
              <h2 className="text-2xl font-bold text-slate-900 font-mono">{caseData.docketNumber}</h2>
              <p className="text-sm text-slate-600 mt-1">{caseData.title}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                Export
              </Button>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Timeline & Ticking Clock */}
          <div className="flex items-center gap-6">
            <div className="flex-grow">
              <TimelineSparkline
                phase={caseData.phase}
                daysElapsed={caseData.daysElapsed}
                totalDays={caseData.totalDays}
                urgency={caseData.urgency}
              />
            </div>
            <div className="text-right min-w-[150px]">
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Decision Due</div>
              <div className="text-2xl font-bold text-red-600">{caseData.deadlines[0].daysRemaining} days</div>
              <div className="text-xs text-slate-500">{caseData.deadlines[0].date}</div>
            </div>
          </div>
        </div>

        {/* Three-Panel Layout */}
        <div className="flex-grow overflow-hidden flex">
          {/* Left Panel - Persistent Truth (25%) */}
          <div className="w-1/4 border-r border-slate-200 overflow-y-auto bg-slate-50 p-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Case Information</h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-xs text-slate-500 mb-1">Assigned Judge</div>
                <div className="text-sm font-bold text-slate-900">{caseData.judge}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Law Clerk</div>
                <div className="text-sm font-medium text-slate-900">{caseData.clerk}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Filed</div>
                <div className="text-sm font-medium text-slate-900">{caseData.filedAt}</div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Parties</h3>
              <div className="space-y-3">
                {caseData.parties.map((party, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-bold text-slate-900">{party.name}</div>
                      <Badge variant="info" size="sm">{party.role}</Badge>
                    </div>
                    {party.represented ? (
                      <div className="text-xs text-slate-500">
                        <div>Attorney: {party.attorney}</div>
                      </div>
                    ) : (
                      <div className="text-xs text-amber-600 font-medium">
                        ⚠️ Pro Se (Self-Represented)
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Role-Based Actions */}
            <div className="mt-8">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Actions</h3>
              <div className="space-y-2">
                {roleActions.map((action, idx) => (
                  <Button key={idx} className="w-full justify-start" size="sm">
                    {action}
                  </Button>
                ))}
              </div>
              {aiFinding && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-blue-700 font-medium">{aiFinding}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center Panel - Activity Hub (50%) */}
          <div className="w-1/2 overflow-y-auto p-6">
            {/* Tabs */}
            <div className="flex items-center gap-2 mb-6 border-b border-slate-200">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('filings')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'filings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600'
                }`}
              >
                Filings & Exhibits
              </button>
              <button
                onClick={() => setActiveTab('hearings')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'hearings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600'
                }`}
              >
                Hearings
              </button>
              {(userRole.includes('Judge') || userRole.includes('Attorney')) && (
                <button
                  onClick={() => setActiveTab('drafting')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'drafting' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600'
                  }`}
                >
                  Drafting
                </button>
              )}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <Card>
                  <div className="p-4 border-b border-slate-200">
                    <h3 className="font-bold text-slate-900">Case Summary</h3>
                  </div>
                  <div className="p-4 space-y-3 text-sm">
                    <p className="text-slate-700">
                      Black Lung benefits claim filed by Robert Martinez (Pro Se) against Apex Coal Mining.
                      Claimant alleges total disability due to pneumoconiosis arising from 17 years of underground
                      coal mine employment.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        Record Closed
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Under Submission
                      </span>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="p-4 border-b border-slate-200">
                    <h3 className="font-bold text-slate-900">Upcoming Deadlines</h3>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {caseData.deadlines.map((deadline, idx) => (
                      <div key={idx} className="p-4 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-bold text-slate-900">{deadline.title}</div>
                          <div className="text-xs text-slate-500">{deadline.type}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-red-600">{deadline.daysRemaining} days</div>
                          <div className="text-xs text-slate-500">{deadline.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'filings' && (
              <Card>
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">Filings & Exhibits</h3>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search filings..."
                      className="pl-10 pr-4 py-1.5 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 w-48"
                    />
                  </div>
                </div>
                <div className="divide-y divide-slate-100">
                  {caseData.filings.map((filing) => (
                    <div key={filing.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{filing.type}</div>
                          <div className="text-xs text-slate-500">{filing.form || 'Document'} • {filing.date}</div>
                        </div>
                      </div>
                      <Badge variant="success" size="sm">{filing.status}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'hearings' && (
              <Card>
                <div className="p-4 border-b border-slate-200">
                  <h3 className="font-bold text-slate-900">Hearing History</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {caseData.hearings.map((hearing, idx) => (
                    <div key={idx} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-bold text-slate-900">{hearing.type}</div>
                        <Badge variant={hearing.completed ? 'success' : 'warning'} size="sm">
                          {hearing.completed ? 'Completed' : 'Scheduled'}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-600">{hearing.date} • {hearing.location}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'drafting' && (userRole.includes('Judge') || userRole.includes('Attorney')) && (
              <div className="space-y-6">
                {/* Bench Memo */}
                <Card>
                  <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-slate-400" />
                      Clerk's Bench Memo
                    </h3>
                    <Badge variant="info">Last updated {caseData.benchMemo.lastUpdated}</Badge>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Legal Issue</div>
                      <div className="text-sm text-slate-900">{caseData.benchMemo.legalIssue}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Standard of Review</div>
                      <div className="text-sm text-slate-900">{caseData.benchMemo.standardOfReview}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Recommended Outcome</div>
                      <div className="text-sm font-bold text-emerald-600">{caseData.benchMemo.recommendedOutcome}</div>
                    </div>
                  </div>
                </Card>

                {/* Draft Decision */}
                <Card>
                  <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-slate-400" />
                      Draft Decision (v{caseData.draftDecision.version})
                    </h3>
                    <Badge variant="warning">{caseData.draftDecision.status}</Badge>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Last Edited:</span>
                      <span className="text-sm font-bold text-slate-900">{caseData.draftDecision.lastEdited}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Citation Check:</span>
                      <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        {caseData.draftDecision.citationCheck}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-slate-200 flex gap-2">
                      <Button size="sm">Edit Draft</Button>
                      <Button variant="outline" size="sm">Add Comment</Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* Right Panel - Evidence Lockbox (25%) */}
          <div className="w-1/4 border-l border-slate-200 overflow-y-auto bg-slate-50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Exhibits</h3>
              <div className="relative">
                <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search exhibits..."
                  className="pl-7 pr-2 py-1 bg-white border border-slate-200 rounded text-xs w-full"
                />
              </div>
            </div>

            {/* Claimant Exhibits */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-700">CX (Claimant)</h4>
                <Badge variant="neutral" size="sm">{caseData.exhibits.CX.length}</Badge>
              </div>
              <div className="space-y-2">
                {caseData.exhibits.CX.map((exhibit) => (
                  <div key={exhibit.id} className="p-2 bg-white rounded border border-slate-200 hover:border-blue-300 cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-900">{exhibit.id}</div>
                      <Pin className="w-3 h-3 text-slate-400" />
                    </div>
                    <div className="text-xs text-slate-600 truncate">{exhibit.name}</div>
                    <div className="text-[10px] text-slate-400">{exhibit.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Employer Exhibits */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-700">EX (Employer)</h4>
                <Badge variant="neutral" size="sm">{caseData.exhibits.EX.length}</Badge>
              </div>
              <div className="space-y-2">
                {caseData.exhibits.EX.map((exhibit) => (
                  <div key={exhibit.id} className="p-2 bg-white rounded border border-slate-200 hover:border-blue-300 cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-900">{exhibit.id}</div>
                      <Pin className="w-3 h-3 text-slate-400" />
                    </div>
                    <div className="text-xs text-slate-600 truncate">{exhibit.name}</div>
                    <div className="text-[10px] text-slate-400">{exhibit.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Director Exhibits */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-700">DX (Director)</h4>
                <Badge variant="neutral" size="sm">{caseData.exhibits.DX.length}</Badge>
              </div>
              <div className="space-y-2">
                {caseData.exhibits.DX.map((exhibit) => (
                  <div key={exhibit.id} className="p-2 bg-white rounded border border-slate-200 hover:border-blue-300 cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-900">{exhibit.id}</div>
                      <Pin className="w-3 h-3 text-slate-400" />
                    </div>
                    <div className="text-xs text-slate-600 truncate">{exhibit.name}</div>
                    <div className="text-[10px] text-slate-400">{exhibit.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Chatbot Integration */}
        <AIChatbot caseId={caseId} caseData={caseData} />
      </motion.div>
    </motion.div>
  );
}
