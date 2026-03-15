import React, { useState } from 'react';
import { motion } from 'motion/react';
import PageHeader from '../UI/PageHeader';
import StatCard from '../UI/StatCard';
import StatusBadge from '../UI/StatusBadge';
import EmptyState from '../UI/EmptyState';
import { Card, Badge, Button } from '../UI';
import {
  Inbox, FileCheck, UserCheck, AlertCircle, Clock, CheckCircle,
  Shield, Eye, X, Zap
} from 'lucide-react';

interface DocketClerkWorkspaceProps {
  activeView: string;
  onCaseSelect: (caseNumber: string) => void;
  portalType: 'OALJ' | 'BOARDS';
}

// ─── OALJ Mock Data ──────────────────────────────────────────────────────────
const OALJ_FILINGS = [
  { id: 'F-2026-00142', caseType: 'BLA', claimant: 'John A. Smith',       received: '2026-03-10', channel: 'Electronic', aiScore: 92, status: 'Awaiting Review', caseNumber: '2026-BLA-00142' },
  { id: 'F-2026-00143', caseType: 'LHC', claimant: 'Maria Garcia',         received: '2026-03-10', channel: 'Mail',       aiScore: 67, status: 'Deficient',       caseNumber: '2026-LHC-00143' },
  { id: 'F-2026-00144', caseType: 'BLA', claimant: 'Robert T. Johnson',    received: '2026-03-11', channel: 'Electronic', aiScore: 95, status: 'Processed',       caseNumber: '2026-BLA-00130' },
  { id: 'F-2026-00145', caseType: 'LHC', claimant: 'Patricia M. Lee',      received: '2026-03-11', channel: 'Electronic', aiScore: 89, status: 'Awaiting Review', caseNumber: '2026-LHC-00145' },
  { id: 'F-2026-00146', caseType: 'PER', claimant: 'David K. Williams',    received: '2026-03-12', channel: 'Mail',       aiScore: 91, status: 'In Progress',     caseNumber: '2026-PER-00146' },
];
const OALJ_UNASSIGNED = [
  { docketNumber: '2026-BLA-00142', type: 'BLA', claimant: 'John A. Smith',      filedDate: '2026-03-10' },
  { docketNumber: '2026-LHC-00143', type: 'LHC', claimant: 'Maria Garcia',        filedDate: '2026-03-10' },
  { docketNumber: '2026-BLA-00145', type: 'BLA', claimant: 'Patricia M. Lee',     filedDate: '2026-03-11' },
  { docketNumber: '2026-PER-00146', type: 'PER', claimant: 'David K. Williams',   filedDate: '2026-03-12' },
  { docketNumber: '2026-LHC-00147', type: 'LHC', claimant: 'James R. Brown',      filedDate: '2026-03-12' },
];
const OALJ_ALL_CASES = [
  { docketNumber: '2026-BLA-00142', type: 'BLA', claimant: 'John A. Smith',         judge: 'Hon. A. Martinez', status: 'Docketed', phase: 'Pre-Hearing',   filedDate: '2026-03-10' },
  { docketNumber: '2026-LHC-00143', type: 'LHC', claimant: 'Maria Garcia',           judge: 'Hon. S. Chen',     status: 'Assigned',  phase: 'Pre-Hearing',   filedDate: '2026-03-10' },
  { docketNumber: '2026-BLA-00130', type: 'BLA', claimant: 'Robert T. Johnson',      judge: 'Hon. A. Martinez', status: 'Active',    phase: 'Hearing',       filedDate: '2026-02-15' },
  { docketNumber: '2026-LHC-00125', type: 'LHC', claimant: 'Susan K. Adams',         judge: 'Hon. J. Thompson', status: 'Active',    phase: 'Decision',      filedDate: '2026-01-20' },
  { docketNumber: '2025-BLA-00891', type: 'BLA', claimant: 'William H. Carter',      judge: 'Hon. S. Chen',     status: 'Decided',   phase: 'Post-Decision', filedDate: '2025-09-14' },
  { docketNumber: '2026-PER-00146', type: 'PER', claimant: 'David K. Williams',      judge: 'Unassigned',       status: 'Pending',   phase: 'Intake',        filedDate: '2026-03-12' },
  { docketNumber: '2026-BLA-00138', type: 'BLA', claimant: 'Nancy E. Miller',        judge: 'Hon. J. Thompson', status: 'Active',    phase: 'Pre-Hearing',   filedDate: '2026-03-01' },
  { docketNumber: '2026-LHC-00140', type: 'LHC', claimant: 'Christopher R. Taylor', judge: 'Hon. A. Martinez', status: 'Pending',   phase: 'Intake',        filedDate: '2026-03-05' },
];
const OALJ_JUDGES = ['Hon. A. Martinez', 'Hon. S. Chen', 'Hon. J. Thompson', 'Hon. R. Williams'];

// ─── Boards Mock Data ─────────────────────────────────────────────────────────
const BOARDS_FILINGS = [
  { id: 'A-2026-00201', caseType: 'BRB',  claimant: 'James T. Morrison',    received: '2026-03-10', channel: 'Electronic', aiScore: 94, status: 'Awaiting Review', caseNumber: '2026-BRB-00201' },
  { id: 'A-2026-00202', caseType: 'ARB',  claimant: 'Global Mining Corp.',   received: '2026-03-10', channel: 'Electronic', aiScore: 88, status: 'Awaiting Review', caseNumber: '2026-ARB-00202' },
  { id: 'A-2026-00203', caseType: 'ECAB', claimant: 'Sarah L. Nguyen',       received: '2026-03-11', channel: 'Mail',       aiScore: 72, status: 'Deficient',       caseNumber: '2026-ECAB-00203' },
  { id: 'A-2026-00204', caseType: 'BRB',  claimant: 'Harbor Freight Inc.',   received: '2026-03-11', channel: 'Electronic', aiScore: 96, status: 'Processed',       caseNumber: '2026-BRB-00204' },
  { id: 'A-2026-00205', caseType: 'ARB',  claimant: 'TechStart Solutions',   received: '2026-03-12', channel: 'Electronic', aiScore: 85, status: 'In Progress',     caseNumber: '2026-ARB-00205' },
];
const BOARDS_UNASSIGNED = [
  { docketNumber: '2026-BRB-00201',  type: 'BRB',  claimant: 'James T. Morrison',  filedDate: '2026-03-10' },
  { docketNumber: '2026-ARB-00202',  type: 'ARB',  claimant: 'Global Mining Corp.', filedDate: '2026-03-10' },
  { docketNumber: '2026-ECAB-00203', type: 'ECAB', claimant: 'Sarah L. Nguyen',     filedDate: '2026-03-11' },
  { docketNumber: '2026-ARB-00205',  type: 'ARB',  claimant: 'TechStart Solutions', filedDate: '2026-03-12' },
];
const BOARDS_ALL_CASES = [
  { docketNumber: '2026-BRB-00201',  type: 'BRB',  claimant: 'James T. Morrison',      judge: 'Hon. R. Burke', status: 'Docketed', phase: 'Briefing',      filedDate: '2026-03-10' },
  { docketNumber: '2026-ARB-00202',  type: 'ARB',  claimant: 'Global Mining Corp.',     judge: 'Hon. L. Davis', status: 'Assigned',  phase: 'Briefing',      filedDate: '2026-03-10' },
  { docketNumber: '2026-ECAB-00203', type: 'ECAB', claimant: 'Sarah L. Nguyen',         judge: 'Hon. M. Park',  status: 'Pending',   phase: 'Intake',        filedDate: '2026-03-11' },
  { docketNumber: '2026-BRB-00204',  type: 'BRB',  claimant: 'Harbor Freight Inc.',     judge: 'Hon. R. Burke', status: 'Active',    phase: 'Review',        filedDate: '2026-03-11' },
  { docketNumber: '2026-ARB-00205',  type: 'ARB',  claimant: 'TechStart Solutions',     judge: 'Unassigned',    status: 'Pending',   phase: 'Intake',        filedDate: '2026-03-12' },
  { docketNumber: '2025-ECAB-00180', type: 'ECAB', claimant: 'Federal Workers Union',   judge: 'Hon. M. Park',  status: 'Decided',   phase: 'Post-Decision', filedDate: '2025-08-15' },
];
const BOARDS_MEMBERS = ['Hon. R. Burke (BRB)', 'Hon. L. Davis (ARB)', 'Hon. M. Park (ECAB)', 'Hon. K. Singh (BRB)'];

// ─── AI Validation ────────────────────────────────────────────────────────────
function getAIValidation(aiScore: number) {
  return [
    { check: 'Identity Match',        passed: aiScore > 70, detail: aiScore > 70 ? 'Claimant identity verified against SSA records'               : 'Identity could not be confirmed — manual review required'          },
    { check: 'Timeliness Check',      passed: aiScore > 60, detail: aiScore > 60 ? 'Filing received within statutory deadline'                     : 'Filing may be untimely — check statute of limitations'             },
    { check: 'Redaction Scan',        passed: aiScore > 80, detail: aiScore > 80 ? 'No unredacted PII detected in filing'                          : 'Possible unredacted SSN detected — review before docketing'        },
    { check: 'Deficiency Detection',  passed: aiScore > 75, detail: aiScore > 75 ? 'All required fields and attachments present'                   : 'Missing: Medical evidence certification (Form CM-981)'             },
  ];
}

const thClass = 'px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider';
const tdClass = 'px-4 py-3 text-sm';

export default function DocketClerkWorkspace({ activeView, onCaseSelect, portalType }: DocketClerkWorkspaceProps) {
  const [selectedFiling, setSelectedFiling] = useState<any | null>(null);
  const [docketConfirmed, setDocketConfirmed] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignCase, setAssignCase] = useState<any | null>(null);
  const [selectedJudge, setSelectedJudge] = useState('');

  const isBoards = portalType === 'BOARDS';
  const filings         = isBoards ? BOARDS_FILINGS       : OALJ_FILINGS;
  const unassignedCases = isBoards ? BOARDS_UNASSIGNED    : OALJ_UNASSIGNED;
  const allCases        = isBoards ? BOARDS_ALL_CASES     : OALJ_ALL_CASES;
  const judges          = isBoards ? BOARDS_MEMBERS       : OALJ_JUDGES;
  const entityLabel     = isBoards ? 'Appeal'             : 'Case';
  const assigneeLabel   = isBoards ? 'Panel Member'       : 'Judge';
  const claimantLabel   = isBoards ? 'Appellant'          : 'Claimant';

  // ── Inbox ──────────────────────────────────────────────────────────────────
  if (activeView === 'inbox') {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Filing Inbox"
          subtitle={`Incoming ${isBoards ? 'appeals' : 'filings'} awaiting review and docketing`}
          badge={isBoards ? 'BOARDS' : 'OALJ'}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Awaiting Review"  value={filings.filter(f => f.status === 'Awaiting Review').length} accentColor="blue"  icon={<Inbox className="w-6 h-6" />} />
          <StatCard label="Deficient"        value={filings.filter(f => f.status === 'Deficient').length}       accentColor="red"   icon={<AlertCircle className="w-6 h-6" />} />
          <StatCard label="Processed Today"  value={filings.filter(f => f.status === 'Processed').length}       accentColor="green" icon={<CheckCircle className="w-6 h-6" />} />
        </div>

        <Card className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className={thClass}>Filing ID</th>
                <th className={thClass}>Type</th>
                <th className={thClass}>{claimantLabel}</th>
                <th className={thClass}>Received</th>
                <th className={thClass}>Channel</th>
                <th className={thClass}>AI Score</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filings.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                  <td className={`${tdClass} font-mono font-medium text-slate-800`}>{f.id}</td>
                  <td className={tdClass}><Badge variant="info" size="sm">{f.caseType}</Badge></td>
                  <td className={`${tdClass} text-slate-800`}>{f.claimant}</td>
                  <td className={`${tdClass} text-slate-500`}>{f.received}</td>
                  <td className={`${tdClass} text-slate-500`}>{f.channel}</td>
                  <td className={tdClass}>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-200 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${f.aiScore >= 90 ? 'bg-green-500' : f.aiScore >= 80 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${f.aiScore}%` }} />
                      </div>
                      <span className="text-xs text-slate-500">{f.aiScore}%</span>
                    </div>
                  </td>
                  <td className={tdClass}><StatusBadge status={f.status} size="sm" /></td>
                  <td className={tdClass}>
                    <div className="flex gap-1">
                      {f.status !== 'Processed' && (
                        <Button variant="primary" size="sm" leftIcon={<FileCheck className="w-3 h-3" />}
                          onClick={() => { setSelectedFiling(f); setDocketConfirmed(false); }}>
                          Docket
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" leftIcon={<Eye className="w-3 h-3" />}
                        onClick={() => onCaseSelect(f.caseNumber)}>
                        View
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* AI Validation Panel */}
        {selectedFiling && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-2 border-blue-200">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg"><Zap className="w-6 h-6 text-blue-600" /></div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">AI Validation — {selectedFiling.id}</h3>
                    <p className="text-sm text-slate-500">{selectedFiling.claimant} · {selectedFiling.caseType} · Score: {selectedFiling.aiScore}%</p>
                  </div>
                </div>
                <button onClick={() => setSelectedFiling(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                {getAIValidation(selectedFiling.aiScore).map((v, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${v.passed ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
                    {v.passed
                      ? <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      : <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />}
                    <div>
                      <div className={`text-sm font-semibold ${v.passed ? 'text-green-800' : 'text-red-800'}`}>{v.check}</div>
                      <div className={`text-xs mt-0.5 ${v.passed ? 'text-green-600' : 'text-red-600'}`}>{v.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 pb-6 flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  Suggested docket: <span className="font-mono font-bold text-slate-800">{selectedFiling.caseNumber}</span>
                </div>
                {docketConfirmed ? (
                  <Badge variant="success">✓ Docketed Successfully</Badge>
                ) : (
                  <Button leftIcon={<CheckCircle className="w-4 h-4" />} onClick={() => {
                    setDocketConfirmed(true);
                    alert(`✓ Filing ${selectedFiling.id} docketed!\n\nDocket Number: ${selectedFiling.caseNumber}\nCase Type: ${selectedFiling.caseType}\nClaimant: ${selectedFiling.claimant}\n\nNow ready for ${assigneeLabel.toLowerCase()} assignment.`);
                  }}>
                    Confirm & Assign Docket Number
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    );
  }

  // ── Docketing ──────────────────────────────────────────────────────────────
  if (activeView === 'docketing') {
    return (
      <div className="space-y-6">
        <PageHeader title="Docketing" subtitle="AI-assisted validation and docket number assignment" />
        <Card className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-50 rounded-lg"><FileCheck className="w-8 h-8 text-blue-600" /></div>
            <div>
              <h3 className="text-lg font-medium text-slate-800">AI Validation Panel</h3>
              <p className="text-sm text-slate-500">Go to Inbox and click "Docket" on a filing to start AI validation</p>
            </div>
          </div>
          <EmptyState icon={<Clock className="w-12 h-12" />} title="No filing selected" description='Select a filing from the Inbox tab and click "Docket" to begin' />
        </Card>
      </div>
    );
  }

  // ── Assignment ─────────────────────────────────────────────────────────────
  if (activeView === 'assignment') {
    return (
      <div className="space-y-6">
        <PageHeader title={`${assigneeLabel} Assignment`} subtitle={`Route docketed ${isBoards ? 'appeals' : 'cases'} to ${assigneeLabel.toLowerCase()}s`} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard label={`Unassigned ${entityLabel}s`} value={unassignedCases.length} accentColor="amber" icon={<UserCheck className="w-6 h-6" />} />
          <StatCard label="Assigned Today" value={4} accentColor="green" icon={<CheckCircle className="w-6 h-6" />} />
        </div>
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className={thClass}>Docket Number</th>
                <th className={thClass}>Type</th>
                <th className={thClass}>{claimantLabel}</th>
                <th className={thClass}>Filed Date</th>
                <th className={thClass}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {unassignedCases.map((c) => (
                <tr key={c.docketNumber} className="hover:bg-slate-50">
                  <td className={`${tdClass} font-mono font-medium text-blue-700 cursor-pointer`} onClick={() => onCaseSelect(c.docketNumber)}>{c.docketNumber}</td>
                  <td className={tdClass}><Badge variant="info" size="sm">{c.type}</Badge></td>
                  <td className={`${tdClass} text-slate-800`}>{c.claimant}</td>
                  <td className={`${tdClass} text-slate-500`}>{c.filedDate}</td>
                  <td className={tdClass}>
                    <Button variant="primary" size="sm" leftIcon={<UserCheck className="w-3 h-3" />}
                      onClick={() => { setAssignCase(c); setShowAssignModal(true); setSelectedJudge(''); }}>
                      Assign {assigneeLabel}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Assignment Modal */}
        {showAssignModal && assignCase && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">Assign {assigneeLabel}</h3>
                <p className="text-sm text-slate-500 mt-1 font-mono">{assignCase.docketNumber} · {assignCase.claimant}</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Select {assigneeLabel}</label>
                  <select value={selectedJudge} onChange={e => setSelectedJudge(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    <option value="">Choose a {assigneeLabel.toLowerCase()}…</option>
                    {judges.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg flex items-start gap-2">
                  <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700">Smart assignment considers caseload, specialty, office location, and recusal history.</p>
                </div>
              </div>
              <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowAssignModal(false)}>Cancel</Button>
                <Button disabled={!selectedJudge} onClick={() => {
                  alert(`✓ ${entityLabel} Assigned!\n\nDocket: ${assignCase.docketNumber}\n${assigneeLabel}: ${selectedJudge}\n\n• Chambers notified\n• ${entityLabel} added to active queue\n• Assignment logged in case history`);
                  setShowAssignModal(false); setAssignCase(null);
                }}>
                  Confirm Assignment
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  // ── All Cases (default) ────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <PageHeader title={`All ${isBoards ? 'Appeals' : 'Cases'}`} subtitle={`Browse and search all docketed ${isBoards ? 'appeals' : 'cases'}`} />
      <div className="max-w-md">
        <input type="text" placeholder={`Search docket number, ${claimantLabel.toLowerCase()}, ${assigneeLabel.toLowerCase()}…`}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
      </div>
      <Card className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className={thClass}>Docket Number</th>
              <th className={thClass}>Type</th>
              <th className={thClass}>{claimantLabel}</th>
              <th className={thClass}>{assigneeLabel}</th>
              <th className={thClass}>Status</th>
              <th className={thClass}>Phase</th>
              <th className={thClass}>Filed Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {allCases.map((c) => (
              <tr key={c.docketNumber} className="hover:bg-slate-50 cursor-pointer" onClick={() => onCaseSelect(c.docketNumber)}>
                <td className={`${tdClass} font-mono font-medium text-blue-700`}>{c.docketNumber}</td>
                <td className={tdClass}><Badge variant="info" size="sm">{c.type}</Badge></td>
                <td className={`${tdClass} text-slate-800`}>{c.claimant}</td>
                <td className={`${tdClass} text-slate-500`}>{c.judge}</td>
                <td className={tdClass}><StatusBadge status={c.status} size="sm" /></td>
                <td className={`${tdClass} text-slate-500`}>{c.phase}</td>
                <td className={`${tdClass} text-slate-500`}>{c.filedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
