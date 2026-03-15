import React, { useState } from 'react';
import { motion } from 'motion/react';
import PageHeader from '../UI/PageHeader';
import StatCard from '../UI/StatCard';
import StatusBadge from '../UI/StatusBadge';
import { Card, Badge, Button } from '../UI';
import {
  Calendar, FileText, FileAudio, Scale, Mail, AlertTriangle,
  Send, CheckCircle, Eye, X, Bell, Video
} from 'lucide-react';

interface LegalAssistantWorkspaceProps {
  activeView: string;
  onCaseSelect: (caseNumber: string) => void;
  portalType: 'OALJ' | 'BOARDS';
}

// ─── OALJ Mock Data ───────────────────────────────────────────────────────────
const OALJ_HEARINGS_TO_SCHEDULE = [
  { docketNumber: '2026-BLA-00142', claimant: 'John A. Smith',      judge: 'Hon. A. Martinez', type: 'BLA', hearingType: 'Hearing', status: 'Pending',   requestDate: '2026-03-10', proSe: true,
    parties: [
      { name: 'John A. Smith',   role: 'Claimant', represented: false, servicePreference: 'mail',       address: '123 Oak St, Pittsburgh, PA 15201' },
      { name: 'Apex Coal Mining', role: 'Employer', represented: true,  servicePreference: 'electronic', email: 'legal@apexcoal.com', attorney: 'Hansen & Associates' },
    ],
    pendingActions: ['Medical Evidence Due – Mar 20', 'Motion to Compel – Pending'],
  },
  { docketNumber: '2026-LHC-00143', claimant: 'Maria Garcia',        judge: 'Hon. S. Chen',     type: 'LHC', hearingType: 'Pre-Hearing Conference', status: 'Pending',   requestDate: '2026-03-10', proSe: false,
    parties: [
      { name: 'Maria Garcia',      role: 'Claimant', represented: true, servicePreference: 'electronic', email: 'mgarcia@email.com', attorney: 'Legal Aid Society' },
      { name: 'Harbor Freight',    role: 'Employer', represented: true, servicePreference: 'electronic', email: 'legal@harbor.com',  attorney: 'Harbor Legal Dept' },
    ],
    pendingActions: [],
  },
  { docketNumber: '2026-BLA-00138', claimant: 'Nancy E. Miller',     judge: 'Hon. J. Thompson', type: 'BLA', hearingType: 'Hearing', status: 'Scheduled', requestDate: '2026-03-01', proSe: false, parties: [], pendingActions: [] },
  { docketNumber: '2026-LHC-00135', claimant: 'Daniel J. Moore',     judge: 'Hon. J. Thompson', type: 'LHC', hearingType: 'Hearing', status: 'Scheduled', requestDate: '2026-02-25', proSe: false, parties: [], pendingActions: [] },
  { docketNumber: '2026-BLA-00130', claimant: 'Robert T. Johnson',   judge: 'Hon. A. Martinez', type: 'BLA', hearingType: 'Hearing', status: 'Completed', requestDate: '2026-02-15', proSe: false, parties: [], pendingActions: [] },
];
const OALJ_TRANSCRIPTS = [
  { docketNumber: '2026-BLA-00130', hearingDate: '2026-03-05', reporter: 'J. Williams', status: 'Completed',  receivedDate: '2026-03-12' },
  { docketNumber: '2025-BLA-00891', hearingDate: '2026-02-20', reporter: 'M. Davis',    status: 'In Progress', receivedDate: null },
  { docketNumber: '2025-BLA-00870', hearingDate: '2026-01-15', reporter: 'J. Williams', status: 'Completed',  receivedDate: '2026-01-22' },
  { docketNumber: '2026-LHC-00125', hearingDate: '2026-03-10', reporter: 'K. Brown',    status: 'Pending',    receivedDate: null },
];
const OALJ_JUDGE_CASES = [
  { docketNumber: '2026-BLA-00142', type: 'BLA', claimant: 'John A. Smith',        status: 'Active',   phase: 'Pre-Hearing',   deadline: '2026-12-10' },
  { docketNumber: '2026-BLA-00130', type: 'BLA', claimant: 'Robert T. Johnson',    status: 'Active',   phase: 'Hearing',       deadline: '2026-11-15' },
  { docketNumber: '2026-LHC-00140', type: 'LHC', claimant: 'Christopher R. Taylor', status: 'Pending', phase: 'Intake',        deadline: '2026-12-05' },
  { docketNumber: '2025-BLA-00891', type: 'BLA', claimant: 'William H. Carter',    status: 'Decided',  phase: 'Post-Decision', deadline: '2026-06-14' },
];

// ─── Boards Mock Data ─────────────────────────────────────────────────────────
const BOARDS_HEARINGS_TO_SCHEDULE = [
  { docketNumber: '2026-BRB-00201', claimant: 'James T. Morrison',   judge: 'Hon. R. Burke', type: 'BRB', hearingType: 'Oral Argument', status: 'Pending',   requestDate: '2026-03-10', proSe: false,
    parties: [
      { name: 'James T. Morrison', role: 'Petitioner',  represented: true, servicePreference: 'electronic', email: 'jmorrison@email.com', attorney: 'Morrison Law Group' },
      { name: 'Apex Coal Mining',  role: 'Respondent',  represented: true, servicePreference: 'electronic', email: 'legal@apexcoal.com',  attorney: 'Hansen & Associates' },
    ],
    pendingActions: ['Brief Filing – Due Mar 25'],
  },
  { docketNumber: '2026-ARB-00202', claimant: 'Global Mining Corp.', judge: 'Hon. L. Davis', type: 'ARB', hearingType: 'Oral Argument', status: 'Pending',   requestDate: '2026-03-10', proSe: false, parties: [], pendingActions: [] },
  { docketNumber: '2026-ECAB-00203', claimant: 'Sarah L. Nguyen',    judge: 'Hon. M. Park',  type: 'ECAB', hearingType: 'Conference', status: 'Scheduled', requestDate: '2026-03-01', proSe: false, parties: [], pendingActions: [] },
];
const BOARDS_TRANSCRIPTS = [
  { docketNumber: '2026-BRB-00201', hearingDate: '2026-03-10', reporter: 'J. Williams', status: 'Pending',    receivedDate: null },
  { docketNumber: '2025-ECAB-00089', hearingDate: '2026-02-20', reporter: 'M. Davis',   status: 'Completed',  receivedDate: '2026-03-01' },
  { docketNumber: '2025-ARB-00180', hearingDate: '2026-01-15', reporter: 'K. Brown',   status: 'In Progress', receivedDate: null },
];
const BOARDS_PANEL_CASES = [
  { docketNumber: '2026-BRB-00201',  type: 'BRB',  claimant: 'James T. Morrison',    status: 'Active',   phase: 'Briefing',      deadline: '2026-12-20' },
  { docketNumber: '2026-ARB-00202',  type: 'ARB',  claimant: 'Global Mining Corp.',  status: 'Active',   phase: 'Review',        deadline: '2026-11-01' },
  { docketNumber: '2025-ECAB-00089', type: 'ECAB', claimant: 'Sandra M. Ellis',      status: 'Active',   phase: 'Decision',      deadline: '2026-09-15' },
  { docketNumber: '2025-BRB-00180',  type: 'BRB',  claimant: 'Coastal Workers',      status: 'Decided',  phase: 'Post-Decision', deadline: '2026-05-01' },
];

const SUGGESTED_DATES = [
  { date: '2026-03-20', time: '10:00 AM', location: 'Room 402, Washington DC',   judge: 'Hon. A. Martinez', courtReporter: 'J. Williams' },
  { date: '2026-03-22', time: '2:00 PM',  location: 'Room 301, Washington DC',   judge: 'Hon. S. Chen',     courtReporter: 'M. Davis' },
  { date: '2026-03-25', time: '9:30 AM',  location: 'Video Conference (Zoom)',   judge: 'Hon. J. Thompson', courtReporter: 'TBD' },
];

const NOTICE_TEMPLATES = [
  { name: 'Notice of Hearing',            desc: 'Standard hearing notification to all parties' },
  { name: 'Notice of Hearing (Pro Se)',    desc: '14-day notice via Certified Mail for self-represented parties' },
  { name: 'Amended Notice of Hearing',    desc: 'Update to previously issued notice' },
  { name: 'Notice of Postponement',       desc: 'Hearing postponement notification' },
  { name: 'Court Reporter Dispatch',      desc: 'Assign court reporter to scheduled hearing' },
  { name: 'Video Conference Setup',       desc: 'Remote hearing logistics and access credentials' },
];

const thClass = 'px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider';
const tdClass = 'px-4 py-3 text-sm';

export default function LegalAssistantWorkspace({ activeView, onCaseSelect, portalType }: LegalAssistantWorkspaceProps) {
  const [showSchedulerModal, setShowSchedulerModal]       = useState(false);
  const [scheduleCase, setScheduleCase]                   = useState<any | null>(null);
  const [selectedDate, setSelectedDate]                   = useState<any | null>(null);
  const [showNoticePreview, setShowNoticePreview]         = useState(false);
  const [selectedNoticeTemplate, setSelectedNoticeTemplate] = useState('');
  const [selectedNoticeCase, setSelectedNoticeCase]       = useState<any | null>(null);

  const isBoards      = portalType === 'BOARDS';
  const toSchedule    = isBoards ? BOARDS_HEARINGS_TO_SCHEDULE : OALJ_HEARINGS_TO_SCHEDULE;
  const transcripts   = isBoards ? BOARDS_TRANSCRIPTS          : OALJ_TRANSCRIPTS;
  const judgesCases   = isBoards ? BOARDS_PANEL_CASES          : OALJ_JUDGE_CASES;
  const hearingLabel  = isBoards ? 'Oral Argument'             : 'Hearing';
  const judgeLabel    = isBoards ? 'Panel'                     : 'Judge';

  // ── Scheduling ─────────────────────────────────────────────────────────────
  if (activeView === 'scheduling') {
    return (
      <div className="space-y-6">
        <PageHeader title={`${hearingLabel} Scheduling`} subtitle={`Schedule ${hearingLabel.toLowerCase()}s and coordinate logistics`} badge={isBoards ? 'BOARDS' : 'OALJ'} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Pending Schedule"     value={toSchedule.filter(h => h.status === 'Pending').length}   accentColor="amber" icon={<Calendar className="w-6 h-6" />} />
          <StatCard label="Scheduled This Week"  value={toSchedule.filter(h => h.status === 'Scheduled').length} accentColor="blue" />
          <StatCard label="Completed"            value={toSchedule.filter(h => h.status === 'Completed').length} accentColor="green" />
        </div>

        <Card className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className={thClass}>Docket Number</th>
                <th className={thClass}>Claimant</th>
                <th className={thClass}>{judgeLabel}</th>
                <th className={thClass}>Type</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Requested</th>
                <th className={thClass}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {toSchedule.map((h) => (
                <tr key={h.docketNumber} className="hover:bg-slate-50">
                  <td className={`${tdClass} font-mono font-medium text-blue-700 cursor-pointer`} onClick={() => onCaseSelect(h.docketNumber)}>{h.docketNumber}</td>
                  <td className={`${tdClass} text-slate-800`}>{h.claimant}</td>
                  <td className={`${tdClass} text-slate-500`}>{h.judge}</td>
                  <td className={tdClass}><Badge variant="info" size="sm">{h.type}</Badge></td>
                  <td className={tdClass}><StatusBadge status={h.status} size="sm" /></td>
                  <td className={`${tdClass} text-slate-500`}>{h.requestDate}</td>
                  <td className={tdClass}>
                    <div className="flex gap-1">
                      {h.proSe && <Badge variant="warning" size="sm">⚠ Pro Se</Badge>}
                      {h.status === 'Pending' && (
                        <Button variant="primary" size="sm" leftIcon={<Calendar className="w-3 h-3" />}
                          onClick={() => { setScheduleCase(h); setSelectedDate(null); setShowSchedulerModal(true); }}>
                          Schedule
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" leftIcon={<Eye className="w-3 h-3" />}
                        onClick={() => onCaseSelect(h.docketNumber)}>
                        View
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Scheduling Modal */}
        {showSchedulerModal && scheduleCase && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Schedule {hearingLabel}</h3>
                  <p className="text-sm text-slate-500 font-mono">{scheduleCase.docketNumber} · {scheduleCase.claimant}</p>
                </div>
                <button onClick={() => setShowSchedulerModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Pro Se Warning */}
                {scheduleCase.proSe && (
                  <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-amber-900">Pro Se Party Detected</div>
                      <div className="text-sm text-amber-700 mt-1">Minimum 14 days notice required. Notice must be sent via Certified Mail.</div>
                    </div>
                  </div>
                )}

                {/* Pending Actions */}
                {scheduleCase.pendingActions?.length > 0 && (
                  <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-red-900">Pending Actions</div>
                      <ul className="text-sm text-red-700 mt-1 list-disc list-inside">
                        {scheduleCase.pendingActions.map((a: string, i: number) => <li key={i}>{a}</li>)}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Suggested Dates */}
                <div>
                  <h4 className="font-bold text-slate-900 mb-3">Available {hearingLabel} Dates</h4>
                  <div className="space-y-3">
                    {SUGGESTED_DATES.map((s, i) => (
                      <div key={i}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedDate === s ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-blue-300'}`}
                        onClick={() => setSelectedDate(s)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${selectedDate === s ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-600'}`}>{i + 1}</div>
                            <div>
                              <div className="text-sm font-bold text-slate-900">{s.date} at {s.time}</div>
                              <div className="text-xs text-slate-500">{s.location} · {s.judge}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-slate-500">Court Reporter</div>
                            <div className="text-sm font-bold text-slate-900">{s.courtReporter}</div>
                            {i === 0 && <Badge variant="success" size="sm" className="mt-1">Recommended</Badge>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Party Service */}
                {scheduleCase.parties?.length > 0 && (
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-bold text-slate-900 mb-3">Notice Service by Party</h4>
                    <div className="space-y-2">
                      {scheduleCase.parties.map((p: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white rounded border border-slate-200">
                          <div>
                            <div className="text-sm font-bold text-slate-900">{p.name}</div>
                            <div className="text-xs text-slate-500">{p.role} · {p.represented ? p.attorney : 'Pro Se'}</div>
                          </div>
                          <Badge variant={p.servicePreference === 'electronic' ? 'success' : 'neutral'} size="sm">
                            {p.servicePreference === 'electronic' ? <><Mail className="w-3 h-3 mr-1 inline" />Email</> : <><Send className="w-3 h-3 mr-1 inline" />Certified Mail</>}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Notices will be generated automatically for all parties
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setShowSchedulerModal(false)}>Cancel</Button>
                  <Button disabled={!selectedDate} leftIcon={<Calendar className="w-4 h-4" />}
                    onClick={() => {
                      setShowSchedulerModal(false);
                      alert(`✓ ${hearingLabel} Scheduled!\n\nDocket: ${scheduleCase.docketNumber}\nDate: ${selectedDate?.date} at ${selectedDate?.time}\nLocation: ${selectedDate?.location}\nJudge: ${selectedDate?.judge}\nCourt Reporter: ${selectedDate?.courtReporter}\n\nNotices issued to all parties.`);
                    }}>
                    Confirm & Issue Notices
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  // ── Notices ─────────────────────────────────────────────────────────────────
  if (activeView === 'notices') {
    return (
      <div className="space-y-6">
        <PageHeader title="Notices" subtitle="Generate and track Notice of Hearing documents" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {NOTICE_TEMPLATES.map((n, i) => (
            <Card key={i} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-slate-800">{n.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{n.desc}</p>
                </div>
                <Button variant="outline" size="sm" leftIcon={<FileText className="w-3 h-3" />}
                  className="ml-2 flex-shrink-0"
                  onClick={() => { setSelectedNoticeTemplate(n.name); setShowNoticePreview(true); }}>
                  Generate
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Notice Preview Modal */}
        {showNoticePreview && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedNoticeTemplate}</h3>
                  <p className="text-sm text-slate-500">Preview — Draft</p>
                </div>
                <button onClick={() => setShowNoticePreview(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="text-center space-y-1 mb-6">
                  <p className="text-xs text-slate-500 uppercase tracking-widest">United States Department of Labor</p>
                  <h4 className="font-bold text-lg">OFFICE OF ADMINISTRATIVE LAW JUDGES</h4>
                  <h5 className="font-bold text-base uppercase">{selectedNoticeTemplate}</h5>
                </div>
                <div className="space-y-2 text-sm text-slate-700">
                  <p><strong>Case Number:</strong> [Selected Case]</p>
                  <p><strong>Date of Hearing:</strong> [Scheduled Date]</p>
                  <p><strong>Time:</strong> [Scheduled Time]</p>
                  <p><strong>Location:</strong> [Courtroom / Video Conference]</p>
                  <p><strong>Judge:</strong> [Assigned ALJ]</p>
                  <p><strong>Court Reporter:</strong> [Assigned Reporter]</p>
                  <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-blue-700">
                    Notice will be served on all parties per their registered service preferences.
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
                <Button variant="outline" leftIcon={<Mail className="w-4 h-4" />}
                  onClick={() => { setShowNoticePreview(false); alert('Notice sent to all parties.'); }}>
                  Send Notice
                </Button>
                <Button onClick={() => setShowNoticePreview(false)}>Close</Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  // ── Transcripts ──────────────────────────────────────────────────────────────
  if (activeView === 'transcripts') {
    const label = isBoards ? 'Briefs & Record' : 'Transcripts';
    return (
      <div className="space-y-6">
        <PageHeader title={label} subtitle={isBoards ? 'Track briefing schedule and record management' : 'Track hearing transcript receipt and filing'} />
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className={thClass}>Docket Number</th>
                <th className={thClass}>{isBoards ? 'Filing Date' : 'Hearing Date'}</th>
                <th className={thClass}>{isBoards ? 'Filed By' : 'Reporter'}</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Received</th>
                <th className={thClass}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transcripts.map((t) => (
                <tr key={t.docketNumber} className="hover:bg-slate-50">
                  <td className={`${tdClass} font-mono font-medium text-blue-700 cursor-pointer`} onClick={() => onCaseSelect(t.docketNumber)}>{t.docketNumber}</td>
                  <td className={`${tdClass} text-slate-500`}>{t.hearingDate}</td>
                  <td className={`${tdClass} text-slate-500`}>{t.reporter}</td>
                  <td className={tdClass}><StatusBadge status={t.status} size="sm" /></td>
                  <td className={`${tdClass} text-slate-500`}>{t.receivedDate ?? '—'}</td>
                  <td className={tdClass}>
                    {t.status === 'Pending' && (
                      <Button variant="outline" size="sm" leftIcon={<Bell className="w-3 h-3" />}
                        onClick={() => alert(`Request sent for ${t.docketNumber}`)}>
                        Request
                      </Button>
                    )}
                    {t.status === 'Completed' && (
                      <Button variant="ghost" size="sm" leftIcon={<Eye className="w-3 h-3" />}
                        onClick={() => onCaseSelect(t.docketNumber)}>
                        View
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    );
  }

  // ── My Judge's Cases ─────────────────────────────────────────────────────────
  if (activeView === 'my-judges-cases') {
    const title    = isBoards ? "My Panel's Appeals"  : "My Judge's Cases";
    const subtitle = isBoards ? 'Appeals for Hon. R. Burke (BRB Panel)' : 'Cases assigned to Hon. A. Martinez';
    return (
      <div className="space-y-6">
        <PageHeader title={title} subtitle={subtitle} badge={isBoards ? 'BOARDS' : 'OALJ'} />
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className={thClass}>Docket Number</th>
                <th className={thClass}>Type</th>
                <th className={thClass}>Claimant</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Phase</th>
                <th className={thClass}>270-Day Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {judgesCases.map((c) => (
                <tr key={c.docketNumber} className="hover:bg-slate-50 cursor-pointer" onClick={() => onCaseSelect(c.docketNumber)}>
                  <td className={`${tdClass} font-mono font-medium text-blue-700`}>{c.docketNumber}</td>
                  <td className={tdClass}><Badge variant="info" size="sm">{c.type}</Badge></td>
                  <td className={`${tdClass} text-slate-800`}>{c.claimant}</td>
                  <td className={tdClass}><StatusBadge status={c.status} size="sm" /></td>
                  <td className={`${tdClass} text-slate-500`}>{c.phase}</td>
                  <td className={`${tdClass} text-slate-500`}>{c.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    );
  }

  // Default → scheduling
  return null;
}
