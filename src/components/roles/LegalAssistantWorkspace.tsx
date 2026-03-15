import React from 'react';
import PageHeader from '../UI/PageHeader';
import StatCard from '../UI/StatCard';
import StatusBadge from '../UI/StatusBadge';
import EmptyState from '../UI/EmptyState';
import { Card } from '../UI';
import { Calendar, FileText, FileAudio, Scale, Eye } from 'lucide-react';

interface LegalAssistantWorkspaceProps {
  activeView: string;
  onCaseSelect: (caseNumber: string) => void;
}

const tableHeaderClass = 'px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider';
const tableCellClass = 'px-4 py-3 text-sm';

const hearingsToSchedule = [
  { docketNumber: '2026-BLA-00142', claimant: 'John A. Smith', judge: 'Hon. A. Martinez', type: 'BLA', status: 'Pending', requestDate: '2026-03-10' },
  { docketNumber: '2026-LHC-00143', claimant: 'Maria Garcia', judge: 'Hon. S. Chen', type: 'LHC', status: 'Pending', requestDate: '2026-03-10' },
  { docketNumber: '2026-BLA-00138', claimant: 'Nancy E. Miller', judge: 'Hon. J. Thompson', type: 'BLA', status: 'Scheduled', requestDate: '2026-03-01' },
  { docketNumber: '2026-LHC-00135', claimant: 'Daniel J. Moore', judge: 'Hon. J. Thompson', type: 'LHC', status: 'Scheduled', requestDate: '2026-02-25' },
  { docketNumber: '2026-BLA-00130', claimant: 'Robert T. Johnson', judge: 'Hon. A. Martinez', type: 'BLA', status: 'Completed', requestDate: '2026-02-15' },
];

const transcripts = [
  { docketNumber: '2026-BLA-00130', hearingDate: '2026-03-05', reporter: 'J. Williams', status: 'Completed', receivedDate: '2026-03-12' },
  { docketNumber: '2025-BLA-00891', hearingDate: '2026-02-20', reporter: 'M. Davis', status: 'In Progress', receivedDate: null },
  { docketNumber: '2025-BLA-00870', hearingDate: '2026-01-15', reporter: 'J. Williams', status: 'Completed', receivedDate: '2026-01-22' },
  { docketNumber: '2026-LHC-00125', hearingDate: '2026-03-10', reporter: 'K. Brown', status: 'Pending', receivedDate: null },
];

const judgeCases = [
  { docketNumber: '2026-BLA-00142', type: 'BLA', claimant: 'John A. Smith', status: 'Active', phase: 'Pre-Hearing', deadline: '2026-12-10' },
  { docketNumber: '2026-BLA-00130', type: 'BLA', claimant: 'Robert T. Johnson', status: 'Active', phase: 'Hearing', deadline: '2026-11-15' },
  { docketNumber: '2026-LHC-00140', type: 'LHC', claimant: 'Christopher R. Taylor', status: 'Pending', phase: 'Intake', deadline: '2026-12-05' },
  { docketNumber: '2025-BLA-00891', type: 'BLA', claimant: 'William H. Carter', status: 'Decided', phase: 'Post-Decision', deadline: '2026-06-14' },
];

export default function LegalAssistantWorkspace({ activeView, onCaseSelect }: LegalAssistantWorkspaceProps) {
  if (activeView === 'scheduling') {
    return (
      <div className="space-y-6">
        <PageHeader title="Hearing Scheduling" subtitle="Schedule hearings and coordinate logistics" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Pending Schedule" value={5} accentColor="amber" icon={<Calendar className="w-6 h-6" />} />
          <StatCard label="Scheduled This Week" value={3} accentColor="blue" />
          <StatCard label="Completed" value={12} accentColor="green" />
        </div>
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className={tableHeaderClass}>Docket Number</th>
                <th className={tableHeaderClass}>Claimant</th>
                <th className={tableHeaderClass}>Judge</th>
                <th className={tableHeaderClass}>Type</th>
                <th className={tableHeaderClass}>Status</th>
                <th className={tableHeaderClass}>Requested</th>
                <th className={tableHeaderClass}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {hearingsToSchedule.map((h) => (
                <tr key={h.docketNumber} className="hover:bg-slate-50">
                  <td className={`${tableCellClass} font-medium text-blue-700 cursor-pointer`} onClick={() => onCaseSelect(h.docketNumber)}>{h.docketNumber}</td>
                  <td className={`${tableCellClass} text-slate-800`}>{h.claimant}</td>
                  <td className={`${tableCellClass} text-slate-500`}>{h.judge}</td>
                  <td className={`${tableCellClass} text-slate-500`}>{h.type}</td>
                  <td className={tableCellClass}><StatusBadge status={h.status} size="sm" /></td>
                  <td className={`${tableCellClass} text-slate-500`}>{h.requestDate}</td>
                  <td className={tableCellClass}>
                    {h.status === 'Pending' && (
                      <button className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded hover:bg-blue-100 font-medium">Schedule</button>
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

  if (activeView === 'notices') {
    return (
      <div className="space-y-6">
        <PageHeader title="Notices" subtitle="Generate and track Notice of Hearing documents" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Notice of Hearing', desc: 'Standard hearing notification to all parties' },
            { name: 'Notice of Hearing (Pro Se)', desc: '14-day notice via Certified Mail for self-represented' },
            { name: 'Amended Notice', desc: 'Update to previously issued notice' },
            { name: 'Postponement Notice', desc: 'Hearing postponement notification' },
            { name: 'Court Reporter Dispatch', desc: 'Assign court reporter to scheduled hearing' },
            { name: 'Video Conference Setup', desc: 'Remote hearing logistics and access details' },
          ].map((n, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-slate-800">{n.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{n.desc}</p>
                </div>
                <button className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 flex-shrink-0">
                  <FileText className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (activeView === 'transcripts') {
    return (
      <div className="space-y-6">
        <PageHeader title="Transcripts" subtitle="Track hearing transcript receipt and filing" />
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className={tableHeaderClass}>Docket Number</th>
                <th className={tableHeaderClass}>Hearing Date</th>
                <th className={tableHeaderClass}>Reporter</th>
                <th className={tableHeaderClass}>Status</th>
                <th className={tableHeaderClass}>Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transcripts.map((t) => (
                <tr key={t.docketNumber} className="hover:bg-slate-50">
                  <td className={`${tableCellClass} font-medium text-blue-700 cursor-pointer`} onClick={() => onCaseSelect(t.docketNumber)}>{t.docketNumber}</td>
                  <td className={`${tableCellClass} text-slate-500`}>{t.hearingDate}</td>
                  <td className={`${tableCellClass} text-slate-500`}>{t.reporter}</td>
                  <td className={tableCellClass}><StatusBadge status={t.status} size="sm" /></td>
                  <td className={`${tableCellClass} text-slate-500`}>{t.receivedDate || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    );
  }

  if (activeView === 'my-judges-cases') {
    return (
      <div className="space-y-6">
        <PageHeader title="My Judge's Cases" subtitle="Cases assigned to Hon. A. Martinez" badge="OALJ" />
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className={tableHeaderClass}>Docket Number</th>
                <th className={tableHeaderClass}>Type</th>
                <th className={tableHeaderClass}>Claimant</th>
                <th className={tableHeaderClass}>Status</th>
                <th className={tableHeaderClass}>Phase</th>
                <th className={tableHeaderClass}>270-Day Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {judgeCases.map((c) => (
                <tr key={c.docketNumber} className="hover:bg-slate-50 cursor-pointer" onClick={() => onCaseSelect(c.docketNumber)}>
                  <td className={`${tableCellClass} font-medium text-blue-700`}>{c.docketNumber}</td>
                  <td className={`${tableCellClass} text-slate-500`}>{c.type}</td>
                  <td className={`${tableCellClass} text-slate-800`}>{c.claimant}</td>
                  <td className={tableCellClass}><StatusBadge status={c.status} size="sm" /></td>
                  <td className={`${tableCellClass} text-slate-500`}>{c.phase}</td>
                  <td className={`${tableCellClass} text-slate-500`}>{c.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    );
  }

  // case-viewer
  return (
    <div className="space-y-6">
      <PageHeader title="Case Viewer" subtitle="Select a case to view its full record" />
      <Card className="p-8">
        <EmptyState icon={<Eye className="w-12 h-12" />} title="No case selected" description="Select a case from any view to open the full case record" />
      </Card>
    </div>
  );
}
