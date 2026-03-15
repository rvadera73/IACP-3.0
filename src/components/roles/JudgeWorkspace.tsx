import React, { useState } from 'react';
import { motion } from 'motion/react';
import PageHeader from '../UI/PageHeader';
import StatCard from '../UI/StatCard';
import StatusBadge from '../UI/StatusBadge';
import { Card, Badge, Button } from '../UI';
import DraftDecisionEditor from '../editors/DraftDecisionEditor';
import {
  AlertTriangle, Briefcase, Video, FileText, PenTool,
  Edit3, Eye, X, MessageSquare, CheckCircle2
} from 'lucide-react';

// Signature icon doesn't exist in lucide-react, use PenTool instead
const SignatureIcon = PenTool;

interface JudgeWorkspaceProps {
  activeView: string;
  onCaseSelect: (caseNumber: string) => void;
  portalType: 'OALJ' | 'BOARDS';
}

// ─── OALJ Mock Data ───────────────────────────────────────────────────────────
const OALJ_MY_CASES = [
  { docketNumber: '2025-BLA-00820', type: 'BLA', claimant: 'Thomas R. Evans',    status: 'Active', phase: 'Decision',     daysElapsed: 255, deadline: '2026-04-01' },
  { docketNumber: '2025-BLA-00835', type: 'BLA', claimant: 'Harold J. King',     status: 'Active', phase: 'Decision',     daysElapsed: 240, deadline: '2026-04-16' },
  { docketNumber: '2025-LHC-00780', type: 'LHC', claimant: 'Margaret P. Scott',  status: 'Active', phase: 'Post-Hearing', daysElapsed: 280, deadline: '2026-03-05' },
  { docketNumber: '2026-BLA-00130', type: 'BLA', claimant: 'Robert T. Johnson',  status: 'Active', phase: 'Hearing',      daysElapsed: 120, deadline: '2026-07-15' },
  { docketNumber: '2026-LHC-00125', type: 'LHC', claimant: 'Susan K. Adams',     status: 'Active', phase: 'Decision',     daysElapsed: 180, deadline: '2026-06-20' },
  { docketNumber: '2026-BLA-00142', type: 'BLA', claimant: 'John A. Smith',      status: 'Active', phase: 'Pre-Hearing',  daysElapsed: 5,   deadline: '2026-12-10' },
];
const OALJ_HEARINGS = [
  { date: '2026-03-18', time: '10:00 AM', docketNumber: '2026-BLA-00130', claimant: 'Robert T. Johnson', type: 'Evidentiary Hearing',    location: 'Washington, DC' },
  { date: '2026-03-20', time: '2:00 PM',  docketNumber: '2026-LHC-00143', claimant: 'Maria Garcia',       type: 'Video Conference',       location: 'Remote' },
  { date: '2026-03-25', time: '9:30 AM',  docketNumber: '2026-BLA-00138', claimant: 'Nancy E. Miller',    type: 'Evidentiary Hearing',    location: 'Pittsburgh, PA' },
  { date: '2026-04-01', time: '11:00 AM', docketNumber: '2026-BLA-00142', claimant: 'John A. Smith',      type: 'Pre-Hearing Conference', location: 'Washington, DC' },
];
const OALJ_DRAFTS = [
  { docketNumber: '2025-BLA-00820', claimant: 'Thomas R. Evans',  draftDate: '2026-03-10', version: 'v2', status: 'Under Review' },
  { docketNumber: '2025-BLA-00835', claimant: 'Harold J. King',   draftDate: '2026-03-08', version: 'v1', status: 'Draft' },
  { docketNumber: '2026-LHC-00125', claimant: 'Susan K. Adams',   draftDate: '2026-03-12', version: 'v3', status: 'Final Review' },
];
const OALJ_SIGN = [
  { docketNumber: '2025-LHC-00780', claimant: 'Margaret P. Scott', type: 'Decision & Order',       preparedBy: 'AA J. Rodriguez', preparedDate: '2026-03-14' },
  { docketNumber: '2025-BLA-00891', claimant: 'William H. Carter', type: 'Order Granting Benefits', preparedBy: 'AA M. Patel',     preparedDate: '2026-03-13' },
];

// ─── Boards Mock Data ─────────────────────────────────────────────────────────
const BOARDS_MY_CASES = [
  { docketNumber: '2025-BRB-00410',  type: 'BRB',  claimant: 'Coastal Workers Union', status: 'Active', phase: 'Review',   daysElapsed: 190, deadline: '2026-05-01' },
  { docketNumber: '2025-ARB-00215',  type: 'ARB',  claimant: 'Pacific Shipping Co.',  status: 'Active', phase: 'Decision', daysElapsed: 240, deadline: '2026-04-10' },
  { docketNumber: '2025-ECAB-00089', type: 'ECAB', claimant: 'Sandra M. Ellis',       status: 'Active', phase: 'Review',   daysElapsed: 60,  deadline: '2026-09-15' },
  { docketNumber: '2026-BRB-00201',  type: 'BRB',  claimant: 'James T. Morrison',     status: 'Active', phase: 'Briefing', daysElapsed: 5,   deadline: '2026-12-20' },
  { docketNumber: '2026-ARB-00202',  type: 'ARB',  claimant: 'Global Mining Corp.',   status: 'Active', phase: 'Review',   daysElapsed: 45,  deadline: '2026-11-01' },
];
const BOARDS_HEARINGS = [
  { date: '2026-03-22', time: '10:00 AM', docketNumber: '2025-BRB-00410', claimant: 'Coastal Workers Union', type: 'Oral Argument', location: 'Washington, DC' },
  { date: '2026-03-28', time: '2:00 PM',  docketNumber: '2025-ARB-00215', claimant: 'Pacific Shipping Co.',  type: 'Oral Argument', location: 'Washington, DC' },
  { date: '2026-04-05', time: '11:00 AM', docketNumber: '2026-BRB-00201', claimant: 'James T. Morrison',     type: 'Conference',    location: 'Remote' },
];
const BOARDS_DRAFTS = [
  { docketNumber: '2025-BRB-00410',  claimant: 'Coastal Workers Union', draftDate: '2026-03-08', version: 'v2', status: 'Under Review' },
  { docketNumber: '2025-ARB-00215',  claimant: 'Pacific Shipping Co.',  draftDate: '2026-03-05', version: 'v1', status: 'Draft' },
  { docketNumber: '2026-BRB-00201',  claimant: 'James T. Morrison',     draftDate: '2026-03-12', version: 'v3', status: 'Final Review' },
];
const BOARDS_SIGN = [
  { docketNumber: '2025-ECAB-00089', claimant: 'Sandra M. Ellis',      type: 'Board Decision',      preparedBy: 'AA K. Brown',    preparedDate: '2026-03-14' },
  { docketNumber: '2025-ARB-00215',  claimant: 'Pacific Shipping Co.', type: 'Order Affirming ALJ', preparedBy: 'AA R. Martinez', preparedDate: '2026-03-12' },
];

// ─── SLA Progress Bar ─────────────────────────────────────────────────────────
function SLABar({ daysElapsed, total = 270 }: { daysElapsed: number; total?: number }) {
  const pct   = Math.min((daysElapsed / total) * 100, 100);
  const color = daysElapsed >= 240 ? 'bg-red-500' : daysElapsed >= 200 ? 'bg-amber-500' : 'bg-green-500';
  const text  = daysElapsed >= 240 ? 'text-red-600 font-semibold' : 'text-slate-500';
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 bg-slate-200 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs ${text}`}>{daysElapsed}/{total}</span>
    </div>
  );
}

const thClass = 'px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider';
const tdClass = 'px-4 py-3 text-sm';

export default function JudgeWorkspace({ activeView, onCaseSelect, portalType }: JudgeWorkspaceProps) {
  const [showEditor, setShowEditor]             = useState(false);
  const [showRedlineModal, setShowRedlineModal]  = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<any | null>(null);

  const isBoards       = portalType === 'BOARDS';
  const myCases        = isBoards ? BOARDS_MY_CASES  : OALJ_MY_CASES;
  const hearings       = isBoards ? BOARDS_HEARINGS  : OALJ_HEARINGS;
  const draftDecisions = isBoards ? BOARDS_DRAFTS    : OALJ_DRAFTS;
  const readyToSign    = isBoards ? BOARDS_SIGN      : OALJ_SIGN;
  const roleLabel      = isBoards ? 'Panel Member'   : 'Administrative Law Judge';
  const hearingLabel   = isBoards ? 'Oral Arguments' : 'Hearings';
  const decisionLabel  = isBoards ? 'Opinions'       : 'Decisions';
  const overdueCases   = myCases.filter(c => c.daysElapsed > 270);
  const nearDeadline   = myCases.filter(c => c.daysElapsed >= 240 && c.daysElapsed <= 270);

  // Inline editor overlay
  if (showEditor) {
    return (
      <div className="space-y-4">
        <Button variant="outline" size="sm" onClick={() => setShowEditor(false)}>← Back to {decisionLabel}</Button>
        <DraftDecisionEditor onCaseSelect={onCaseSelect} />
      </div>
    );
  }

  // ── My Cases ───────────────────────────────────────────────────────────────
  if (activeView === 'my-cases') {
    return (
      <div className="space-y-6">
        <PageHeader title="My Cases" subtitle="Active caseload with 270-day statutory deadline tracking" badge={isBoards ? 'BOARDS' : 'OALJ'} />
        {(overdueCases.length > 0 || nearDeadline.length > 0) && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-800">270-Day Deadline Alert</p>
                <p className="text-sm text-red-700 mt-1">
                  {overdueCases.length > 0 && <>{overdueCases.length} case(s) have exceeded the 270-day statutory deadline. </>}
                  {nearDeadline.length  > 0 && <>{nearDeadline.length} case(s) are within 30 days of deadline.</>}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Active Cases"       value={myCases.length}      accentColor="blue"  icon={<Briefcase className="w-6 h-6" />} />
          <StatCard label="Nearing Deadline"   value={nearDeadline.length} accentColor="red"   icon={<AlertTriangle className="w-6 h-6" />} />
          <StatCard label="Decided This Month" value={6}                   accentColor="green" />
        </div>
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className={thClass}>Docket Number</th>
                <th className={thClass}>Type</th>
                <th className={thClass}>Claimant</th>
                <th className={thClass}>Phase</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>270-Day Progress</th>
                <th className={thClass}>Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myCases.map((c) => (
                <tr key={c.docketNumber} className="hover:bg-slate-50 cursor-pointer" onClick={() => onCaseSelect(c.docketNumber)}>
                  <td className={`${tdClass} font-mono font-medium text-blue-700`}>{c.docketNumber}</td>
                  <td className={tdClass}><Badge variant="info" size="sm">{c.type}</Badge></td>
                  <td className={`${tdClass} text-slate-800`}>{c.claimant}</td>
                  <td className={`${tdClass} text-slate-500`}>{c.phase}</td>
                  <td className={tdClass}><StatusBadge status={c.status} size="sm" /></td>
                  <td className={tdClass}><SLABar daysElapsed={c.daysElapsed} /></td>
                  <td className={`${tdClass} text-slate-500`}>{c.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    );
  }

  // ── Hearings ───────────────────────────────────────────────────────────────
  if (activeView === 'hearings') {
    return (
      <div className="space-y-6">
        <PageHeader title={hearingLabel} subtitle={`Upcoming ${hearingLabel.toLowerCase()} schedule`} />
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className={thClass}>Date</th>
                <th className={thClass}>Time</th>
                <th className={thClass}>Docket Number</th>
                <th className={thClass}>Claimant</th>
                <th className={thClass}>Type</th>
                <th className={thClass}>Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {hearings.map((h) => (
                <tr key={h.docketNumber} className="hover:bg-slate-50 cursor-pointer" onClick={() => onCaseSelect(h.docketNumber)}>
                  <td className={`${tdClass} font-semibold text-slate-800`}>{h.date}</td>
                  <td className={`${tdClass} text-slate-500`}>{h.time}</td>
                  <td className={`${tdClass} font-mono font-medium text-blue-700`}>{h.docketNumber}</td>
                  <td className={`${tdClass} text-slate-800`}>{h.claimant}</td>
                  <td className={tdClass}><StatusBadge status={h.type} size="sm" /></td>
                  <td className={`${tdClass} text-slate-500`}>{h.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    );
  }

  // ── Decisions ─────────────────────────────────────────────────────────────
  if (activeView === 'decisions') {
    return (
      <div className="space-y-6">
        <PageHeader title={decisionLabel} subtitle={`Draft ${decisionLabel.toLowerCase()} awaiting review and editing`} />
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className={thClass}>Docket Number</th>
                <th className={thClass}>Claimant</th>
                <th className={thClass}>Draft Date</th>
                <th className={thClass}>Version</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {draftDecisions.map((d) => (
                <tr key={d.docketNumber} className="hover:bg-slate-50">
                  <td className={`${tdClass} font-mono font-medium text-blue-700 cursor-pointer`} onClick={() => onCaseSelect(d.docketNumber)}>{d.docketNumber}</td>
                  <td className={`${tdClass} text-slate-800`}>{d.claimant}</td>
                  <td className={`${tdClass} text-slate-500`}>{d.draftDate}</td>
                  <td className={`${tdClass} text-slate-500`}>{d.version}</td>
                  <td className={tdClass}><StatusBadge status={d.status} size="sm" /></td>
                  <td className={tdClass}>
                    <div className="flex gap-1">
                      <Button variant="primary" size="sm" leftIcon={<Edit3 className="w-3 h-3" />}
                        onClick={() => { setSelectedDecision(d); setShowEditor(true); }}>
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" leftIcon={<FileText className="w-3 h-3" />}
                        onClick={() => { setSelectedDecision(d); setShowRedlineModal(true); }}>
                        Redline
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Redline Modal */}
        {showRedlineModal && selectedDecision && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Redline Review — Draft {selectedDecision.version}</h3>
                  <p className="text-sm text-slate-500 font-mono">{selectedDecision.docketNumber} · {selectedDecision.claimant}</p>
                </div>
                <button onClick={() => setShowRedlineModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="text-sm leading-relaxed space-y-4">
                  <h4 className="font-bold text-base">Decision and Order</h4>
                  <p className="text-slate-700">
                    This case arises under the <span className="bg-yellow-200 px-0.5">Black Lung Benefits Act</span>, 30 U.S.C. § 901 et seq.
                    Claimant alleges total disability due to pneumoconiosis arising from coal mine employment.
                  </p>
                  <h5 className="font-semibold">Findings of Fact:</h5>
                  <ol className="list-decimal list-inside space-y-1 text-slate-700">
                    <li>Claimant worked <span className="bg-red-200 line-through px-0.5">15 years</span> <span className="bg-green-200 px-0.5">17 years</span> in underground coal mines.</li>
                    <li>Medical evidence establishes total disability due to pneumoconiosis.</li>
                    <li><span className="bg-red-200 line-through px-0.5">Employer rebutted the presumption</span> <span className="bg-green-200 px-0.5">Employer failed to rebut the presumption</span> under 30 U.S.C. § 921(c)(4).</li>
                  </ol>
                  <h5 className="font-semibold">Conclusions of Law:</h5>
                  <p className="text-slate-700">Claimant is entitled to benefits under 20 C.F.R. § 718.</p>
                  <h5 className="font-semibold">Order:</h5>
                  <p className="text-slate-700">IT IS ORDERED that benefits be <span className="bg-green-200 font-bold px-0.5">AWARDED</span> to claimant.</p>
                </div>
              </div>
              <div className="p-6 border-t border-slate-200 flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge variant="neutral">Changes: +12 / −3</Badge>
                  <Badge variant="info">Comments: 2</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" leftIcon={<MessageSquare className="w-4 h-4" />}
                    onClick={() => alert('Comment added to draft.')}>
                    Add Comment
                  </Button>
                  <Button variant="outline" leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    onClick={() => { setShowRedlineModal(false); alert('All changes accepted.'); }}>
                    Accept All
                  </Button>
                  <Button leftIcon={<SignatureIcon className="w-4 h-4" />}
                    onClick={() => {
                      setShowRedlineModal(false);
                      alert(`✓ ${isBoards ? 'Opinion' : 'Decision'} Signed & Released!\n\n• Electronically signed by ${roleLabel}\n• Released to docket\n• Mailed to all parties\n• Posted to public record`);
                    }}>
                    Sign & Release
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  // ── Sign & Release ─────────────────────────────────────────────────────────
  if (activeView === 'sign-release') {
    return (
      <div className="space-y-6">
        <PageHeader title="Sign & Release" subtitle={`Finalized ${decisionLabel.toLowerCase()} ready for electronic signature`} />
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className={thClass}>Docket Number</th>
                <th className={thClass}>Claimant</th>
                <th className={thClass}>Document Type</th>
                <th className={thClass}>Prepared By</th>
                <th className={thClass}>Date</th>
                <th className={thClass}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {readyToSign.map((d) => (
                <tr key={d.docketNumber} className="hover:bg-slate-50">
                  <td className={`${tdClass} font-mono font-medium text-blue-700 cursor-pointer`} onClick={() => onCaseSelect(d.docketNumber)}>{d.docketNumber}</td>
                  <td className={`${tdClass} text-slate-800`}>{d.claimant}</td>
                  <td className={`${tdClass} text-slate-500`}>{d.type}</td>
                  <td className={`${tdClass} text-slate-500`}>{d.preparedBy}</td>
                  <td className={`${tdClass} text-slate-500`}>{d.preparedDate}</td>
                  <td className={tdClass}>
                    <div className="flex gap-1">
                      <Button variant="primary" size="sm" leftIcon={<SignatureIcon className="w-3 h-3" />}
                        onClick={() => alert(`✓ ${isBoards ? 'Opinion' : 'Decision'} Signed & Released!\n\nDocket: ${d.docketNumber}\nType: ${d.type}\n\n• Electronically signed\n• Released to docket\n• Mailed to all parties\n• Posted to public record\n• Case closed`)}>
                        Sign & Release
                      </Button>
                      <Button variant="outline" size="sm" leftIcon={<Eye className="w-3 h-3" />}
                        onClick={() => onCaseSelect(d.docketNumber)}>
                        Review
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    );
  }

  return null;
}
