import React from 'react';
import PageHeader from '../UI/PageHeader';
import StatCard from '../UI/StatCard';
import StatusBadge from '../UI/StatusBadge';
import EmptyState from '../UI/EmptyState';
import { Card } from '../UI';
import { AlertTriangle, Briefcase, Video, FileText, PenTool, Eye } from 'lucide-react';

interface JudgeWorkspaceProps {
  activeView: string;
  onCaseSelect: (caseNumber: string) => void;
}

const tableHeaderClass = 'px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider';
const tableCellClass = 'px-4 py-3 text-sm';

const myCases = [
  { docketNumber: '2025-BLA-00820', type: 'BLA', claimant: 'Thomas R. Evans', status: 'Active', phase: 'Decision', daysElapsed: 255, deadline: '2026-04-01' },
  { docketNumber: '2025-BLA-00835', type: 'BLA', claimant: 'Harold J. King', status: 'Active', phase: 'Decision', daysElapsed: 240, deadline: '2026-04-16' },
  { docketNumber: '2025-LHC-00780', type: 'LHC', claimant: 'Margaret P. Scott', status: 'Active', phase: 'Post-Hearing', daysElapsed: 280, deadline: '2026-03-05' },
  { docketNumber: '2026-BLA-00130', type: 'BLA', claimant: 'Robert T. Johnson', status: 'Active', phase: 'Hearing', daysElapsed: 120, deadline: '2026-07-15' },
  { docketNumber: '2026-LHC-00125', type: 'LHC', claimant: 'Susan K. Adams', status: 'Active', phase: 'Decision', daysElapsed: 180, deadline: '2026-06-20' },
  { docketNumber: '2026-BLA-00142', type: 'BLA', claimant: 'John A. Smith', status: 'Active', phase: 'Pre-Hearing', daysElapsed: 5, deadline: '2026-12-10' },
];

const hearings = [
  { date: '2026-03-18', time: '10:00 AM', docketNumber: '2026-BLA-00130', claimant: 'Robert T. Johnson', type: 'Evidentiary Hearing', location: 'Washington, DC' },
  { date: '2026-03-20', time: '2:00 PM', docketNumber: '2026-LHC-00143', claimant: 'Maria Garcia', type: 'Video Conference', location: 'Remote' },
  { date: '2026-03-25', time: '9:30 AM', docketNumber: '2026-BLA-00138', claimant: 'Nancy E. Miller', type: 'Evidentiary Hearing', location: 'Pittsburgh, PA' },
  { date: '2026-04-01', time: '11:00 AM', docketNumber: '2026-BLA-00142', claimant: 'John A. Smith', type: 'Pre-Hearing Conference', location: 'Washington, DC' },
];

const draftDecisions = [
  { docketNumber: '2025-BLA-00820', claimant: 'Thomas R. Evans', draftDate: '2026-03-10', version: 'v2', status: 'Under Review' },
  { docketNumber: '2025-BLA-00835', claimant: 'Harold J. King', draftDate: '2026-03-08', version: 'v1', status: 'Draft' },
  { docketNumber: '2026-LHC-00125', claimant: 'Susan K. Adams', draftDate: '2026-03-12', version: 'v3', status: 'Final Review' },
];

const readyToSign = [
  { docketNumber: '2025-LHC-00780', claimant: 'Margaret P. Scott', type: 'Decision & Order', preparedBy: 'AA J. Rodriguez', preparedDate: '2026-03-14' },
  { docketNumber: '2025-BLA-00891', claimant: 'William H. Carter', type: 'Order Granting Benefits', preparedBy: 'AA M. Patel', preparedDate: '2026-03-13' },
];

function SLABar({ daysElapsed, total = 270 }: { daysElapsed: number; total?: number }) {
  const pct = Math.min((daysElapsed / total) * 100, 100);
  const color = daysElapsed >= 240 ? 'bg-red-500' : daysElapsed >= 200 ? 'bg-amber-500' : 'bg-green-500';
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 bg-slate-200 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs ${daysElapsed >= 240 ? 'text-red-600 font-medium' : 'text-slate-500'}`}>{daysElapsed}/{total}</span>
    </div>
  );
}

export default function JudgeWorkspace({ activeView, onCaseSelect }: JudgeWorkspaceProps) {
  const overdueCases = myCases.filter(c => c.daysElapsed > 270);
  const nearingDeadline = myCases.filter(c => c.daysElapsed >= 240 && c.daysElapsed <= 270);

  if (activeView === 'my-cases') {
    return (
      <div className="space-y-6">
        <PageHeader title="My Cases" subtitle="Active caseload with 270-day statutory deadline tracking" />
        {(overdueCases.length > 0 || nearingDeadline.length > 0) && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">270-Day Deadline Alert</p>
                <p className="text-sm text-red-700 mt-1">
                  {overdueCases.length > 0 && <>{overdueCases.length} case(s) have exceeded the 270-day statutory deadline. </>}
                  {nearingDeadline.length > 0 && <>{nearingDeadline.length} case(s) are within 30 days of deadline.</>}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Active Cases" value={24} accentColor="blue" icon={<Briefcase className="w-6 h-6" />} />
          <StatCard label="Nearing Deadline" value={4} accentColor="red" icon={<AlertTriangle className="w-6 h-6" />} />
          <StatCard label="Decided This Month" value={6} accentColor="green" />
        </div>
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className={tableHeaderClass}>Docket Number</th>
                <th className={tableHeaderClass}>Type</th>
                <th className={tableHeaderClass}>Claimant</th>
                <th className={tableHeaderClass}>Phase</th>
                <th className={tableHeaderClass}>Status</th>
                <th className={tableHeaderClass}>270-Day Progress</th>
                <th className={tableHeaderClass}>Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myCases.map((c) => (
                <tr key={c.docketNumber} className="hover:bg-slate-50 cursor-pointer" onClick={() => onCaseSelect(c.docketNumber)}>
                  <td className={`${tableCellClass} font-medium text-blue-700`}>{c.docketNumber}</td>
                  <td className={`${tableCellClass} text-slate-500`}>{c.type}</td>
                  <td className={`${tableCellClass} text-slate-800`}>{c.claimant}</td>
                  <td className={`${tableCellClass} text-slate-500`}>{c.phase}</td>
                  <td className={tableCellClass}><StatusBadge status={c.status} size="sm" /></td>
                  <td className={tableCellClass}><SLABar daysElapsed={c.daysElapsed} /></td>
                  <td className={`${tableCellClass} text-slate-500`}>{c.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    );
  }

  if (activeView === 'hearings') {
    return (
      <div className="space-y-6">
        <PageHeader title="Hearings" subtitle="Upcoming hearing schedule" />
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className={tableHeaderClass}>Date</th>
                <th className={tableHeaderClass}>Time</th>
                <th className={tableHeaderClass}>Docket Number</th>
                <th className={tableHeaderClass}>Claimant</th>
                <th className={tableHeaderClass}>Type</th>
                <th className={tableHeaderClass}>Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {hearings.map((h) => (
                <tr key={h.docketNumber} className="hover:bg-slate-50 cursor-pointer" onClick={() => onCaseSelect(h.docketNumber)}>
                  <td className={`${tableCellClass} font-medium text-slate-800`}>{h.date}</td>
                  <td className={`${tableCellClass} text-slate-500`}>{h.time}</td>
                  <td className={`${tableCellClass} font-medium text-blue-700`}>{h.docketNumber}</td>
                  <td className={`${tableCellClass} text-slate-800`}>{h.claimant}</td>
                  <td className={tableCellClass}><StatusBadge status={h.type} size="sm" /></td>
                  <td className={`${tableCellClass} text-slate-500`}>{h.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    );
  }

  if (activeView === 'decisions') {
    return (
      <div className="space-y-6">
        <PageHeader title="Decisions" subtitle="Draft decisions awaiting review and editing" />
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className={tableHeaderClass}>Docket Number</th>
                <th className={tableHeaderClass}>Claimant</th>
                <th className={tableHeaderClass}>Draft Date</th>
                <th className={tableHeaderClass}>Version</th>
                <th className={tableHeaderClass}>Status</th>
                <th className={tableHeaderClass}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {draftDecisions.map((d) => (
                <tr key={d.docketNumber} className="hover:bg-slate-50">
                  <td className={`${tableCellClass} font-medium text-blue-700 cursor-pointer`} onClick={() => onCaseSelect(d.docketNumber)}>{d.docketNumber}</td>
                  <td className={`${tableCellClass} text-slate-800`}>{d.claimant}</td>
                  <td className={`${tableCellClass} text-slate-500`}>{d.draftDate}</td>
                  <td className={`${tableCellClass} text-slate-500`}>{d.version}</td>
                  <td className={tableCellClass}><StatusBadge status={d.status} size="sm" /></td>
                  <td className={tableCellClass}>
                    <div className="flex gap-1">
                      <button className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded hover:bg-blue-100 font-medium">Edit</button>
                      <button className="text-xs bg-slate-50 text-slate-600 px-2.5 py-1 rounded hover:bg-slate-100">Redline</button>
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

  if (activeView === 'sign-release') {
    return (
      <div className="space-y-6">
        <PageHeader title="Sign & Release" subtitle="Finalized decisions ready for electronic signature" />
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className={tableHeaderClass}>Docket Number</th>
                <th className={tableHeaderClass}>Claimant</th>
                <th className={tableHeaderClass}>Document Type</th>
                <th className={tableHeaderClass}>Prepared By</th>
                <th className={tableHeaderClass}>Date</th>
                <th className={tableHeaderClass}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {readyToSign.map((d) => (
                <tr key={d.docketNumber} className="hover:bg-slate-50">
                  <td className={`${tableCellClass} font-medium text-blue-700 cursor-pointer`} onClick={() => onCaseSelect(d.docketNumber)}>{d.docketNumber}</td>
                  <td className={`${tableCellClass} text-slate-800`}>{d.claimant}</td>
                  <td className={`${tableCellClass} text-slate-500`}>{d.type}</td>
                  <td className={`${tableCellClass} text-slate-500`}>{d.preparedBy}</td>
                  <td className={`${tableCellClass} text-slate-500`}>{d.preparedDate}</td>
                  <td className={tableCellClass}>
                    <div className="flex gap-1">
                      <button className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded hover:bg-green-100 font-medium">Sign & Release</button>
                      <button className="text-xs bg-slate-50 text-slate-600 px-2.5 py-1 rounded hover:bg-slate-100">Review</button>
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

  // case-viewer
  return (
    <div className="space-y-6">
      <PageHeader title="Case Viewer" subtitle="Select a case to view its full record" />
      <Card className="p-8">
        <EmptyState icon={<Eye className="w-12 h-12" />} title="No case selected" description="Select a case from My Cases or any view to open the full case record" />
      </Card>
    </div>
  );
}
