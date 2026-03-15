import React from 'react';
import PageHeader from '../UI/PageHeader';
import StatCard from '../UI/StatCard';
import StatusBadge from '../UI/StatusBadge';
import EmptyState from '../UI/EmptyState';
import { Card } from '../UI';
import { Inbox, FileCheck, UserCheck, AlertCircle, Clock, CheckCircle } from 'lucide-react';

interface DocketClerkWorkspaceProps {
  activeView: string;
  onCaseSelect: (caseNumber: string) => void;
}

// Mock data
const filings = [
  { id: 'F-2026-00142', caseType: 'BLA', claimant: 'John A. Smith', received: '2026-03-10', channel: 'Electronic', aiScore: 92, status: 'Awaiting Review' },
  { id: 'F-2026-00143', caseType: 'LHC', claimant: 'Maria Garcia', received: '2026-03-10', channel: 'Mail', aiScore: 67, status: 'Deficient' },
  { id: 'F-2026-00144', caseType: 'BLA', claimant: 'Robert T. Johnson', received: '2026-03-11', channel: 'Electronic', aiScore: 95, status: 'Processed' },
  { id: 'F-2026-00145', caseType: 'LHC', claimant: 'Patricia M. Lee', received: '2026-03-11', channel: 'Electronic', aiScore: 89, status: 'Awaiting Review' },
  { id: 'F-2026-00146', caseType: 'BLA', claimant: 'David K. Williams', received: '2026-03-12', channel: 'Mail', aiScore: 91, status: 'In Progress' },
];

const unassignedCases = [
  { docketNumber: '2026-BLA-00142', type: 'BLA', claimant: 'John A. Smith', filedDate: '2026-03-10' },
  { docketNumber: '2026-LHC-00143', type: 'LHC', claimant: 'Maria Garcia', filedDate: '2026-03-10' },
  { docketNumber: '2026-BLA-00145', type: 'BLA', claimant: 'Patricia M. Lee', filedDate: '2026-03-11' },
  { docketNumber: '2026-BLA-00146', type: 'BLA', claimant: 'David K. Williams', filedDate: '2026-03-12' },
  { docketNumber: '2026-LHC-00147', type: 'LHC', claimant: 'James R. Brown', filedDate: '2026-03-12' },
  { docketNumber: '2026-BLA-00148', type: 'BLA', claimant: 'Linda P. Davis', filedDate: '2026-03-13' },
  { docketNumber: '2026-LHC-00149', type: 'LHC', claimant: 'Michael T. Wilson', filedDate: '2026-03-13' },
];

const allCases = [
  { docketNumber: '2026-BLA-00142', type: 'BLA', claimant: 'John A. Smith', judge: 'Hon. A. Martinez', status: 'Docketed', phase: 'Pre-Hearing', filedDate: '2026-03-10' },
  { docketNumber: '2026-LHC-00143', type: 'LHC', claimant: 'Maria Garcia', judge: 'Hon. S. Chen', status: 'Assigned', phase: 'Pre-Hearing', filedDate: '2026-03-10' },
  { docketNumber: '2026-BLA-00130', type: 'BLA', claimant: 'Robert T. Johnson', judge: 'Hon. A. Martinez', status: 'Active', phase: 'Hearing', filedDate: '2026-02-15' },
  { docketNumber: '2026-LHC-00125', type: 'LHC', claimant: 'Susan K. Adams', judge: 'Hon. J. Thompson', status: 'Active', phase: 'Decision', filedDate: '2026-01-20' },
  { docketNumber: '2025-BLA-00891', type: 'BLA', claimant: 'William H. Carter', judge: 'Hon. S. Chen', status: 'Decided', phase: 'Post-Decision', filedDate: '2025-09-14' },
  { docketNumber: '2026-BLA-00138', type: 'BLA', claimant: 'Nancy E. Miller', judge: 'Hon. J. Thompson', status: 'Active', phase: 'Pre-Hearing', filedDate: '2026-03-01' },
  { docketNumber: '2026-LHC-00140', type: 'LHC', claimant: 'Christopher R. Taylor', judge: 'Hon. A. Martinez', status: 'Pending', phase: 'Intake', filedDate: '2026-03-05' },
  { docketNumber: '2025-BLA-00870', type: 'BLA', claimant: 'Karen L. White', judge: 'Hon. S. Chen', status: 'Decided', phase: 'Post-Decision', filedDate: '2025-08-20' },
  { docketNumber: '2026-LHC-00135', type: 'LHC', claimant: 'Daniel J. Moore', judge: 'Hon. J. Thompson', status: 'Active', phase: 'Hearing', filedDate: '2026-02-25' },
  { docketNumber: '2026-BLA-00150', type: 'BLA', claimant: 'Jennifer A. Harris', judge: 'Unassigned', status: 'Pending', phase: 'Intake', filedDate: '2026-03-14' },
];

const tableHeaderClass = 'px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider';
const tableCellClass = 'px-4 py-3 text-sm';

export default function DocketClerkWorkspace({ activeView, onCaseSelect }: DocketClerkWorkspaceProps) {
  if (activeView === 'inbox') {
    return (
      <div className="space-y-6">
        <PageHeader title="Filing Inbox" subtitle="Incoming filings awaiting review and docketing" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Awaiting Review" value={12} accentColor="blue" icon={<Inbox className="w-6 h-6" />} />
          <StatCard label="Deficient" value={3} accentColor="red" icon={<AlertCircle className="w-6 h-6" />} />
          <StatCard label="Processed Today" value={28} accentColor="green" icon={<CheckCircle className="w-6 h-6" />} />
        </div>
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className={tableHeaderClass}>Filing ID</th>
                <th className={tableHeaderClass}>Type</th>
                <th className={tableHeaderClass}>Claimant</th>
                <th className={tableHeaderClass}>Received</th>
                <th className={tableHeaderClass}>Channel</th>
                <th className={tableHeaderClass}>AI Score</th>
                <th className={tableHeaderClass}>Status</th>
                <th className={tableHeaderClass}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filings.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                  <td className={`${tableCellClass} font-medium text-slate-800`}>{f.id}</td>
                  <td className={`${tableCellClass} text-slate-500`}>{f.caseType}</td>
                  <td className={`${tableCellClass} text-slate-800`}>{f.claimant}</td>
                  <td className={`${tableCellClass} text-slate-500`}>{f.received}</td>
                  <td className={`${tableCellClass} text-slate-500`}>{f.channel}</td>
                  <td className={tableCellClass}>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${f.aiScore >= 90 ? 'bg-green-500' : f.aiScore >= 80 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${f.aiScore}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{f.aiScore}%</span>
                    </div>
                  </td>
                  <td className={tableCellClass}><StatusBadge status={f.status} size="sm" /></td>
                  <td className={tableCellClass}>
                    <div className="flex gap-1">
                      <button className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded hover:bg-blue-100 font-medium">Docket</button>
                      <button className="text-xs bg-slate-50 text-slate-600 px-2.5 py-1 rounded hover:bg-slate-100">View</button>
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

  if (activeView === 'docketing') {
    return (
      <div className="space-y-6">
        <PageHeader title="Docketing" subtitle="AI-assisted validation and docket number assignment" />
        <Card className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-50 rounded-lg">
              <FileCheck className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-slate-800">AI Validation Panel</h3>
              <p className="text-sm text-slate-500">Select a filing from the Inbox to begin automated validation and docketing</p>
            </div>
          </div>
          <EmptyState
            icon={<Clock className="w-12 h-12" />}
            title="No filing selected"
            description="Select a filing from the Inbox tab to begin docketing"
          />
        </Card>
      </div>
    );
  }

  if (activeView === 'assignment') {
    return (
      <div className="space-y-6">
        <PageHeader title="Judge Assignment" subtitle="Route docketed cases to judges using smart assignment" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard label="Unassigned Cases" value={7} accentColor="amber" icon={<UserCheck className="w-6 h-6" />} />
          <StatCard label="Assigned Today" value={4} accentColor="green" icon={<CheckCircle className="w-6 h-6" />} />
        </div>
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className={tableHeaderClass}>Docket Number</th>
                <th className={tableHeaderClass}>Type</th>
                <th className={tableHeaderClass}>Claimant</th>
                <th className={tableHeaderClass}>Filed Date</th>
                <th className={tableHeaderClass}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {unassignedCases.map((c) => (
                <tr key={c.docketNumber} className="hover:bg-slate-50 transition-colors">
                  <td className={`${tableCellClass} font-medium text-blue-700 cursor-pointer`} onClick={() => onCaseSelect(c.docketNumber)}>{c.docketNumber}</td>
                  <td className={`${tableCellClass} text-slate-500`}>{c.type}</td>
                  <td className={`${tableCellClass} text-slate-800`}>{c.claimant}</td>
                  <td className={`${tableCellClass} text-slate-500`}>{c.filedDate}</td>
                  <td className={tableCellClass}>
                    <button className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded hover:bg-blue-100 font-medium">Assign Judge</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    );
  }

  if (activeView === 'all-cases') {
    return (
      <div className="space-y-6">
        <PageHeader title="All Cases" subtitle="Browse and search all docketed cases" />
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by docket number, claimant, or judge..."
            className="w-full pl-4 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className={tableHeaderClass}>Docket Number</th>
                <th className={tableHeaderClass}>Type</th>
                <th className={tableHeaderClass}>Claimant</th>
                <th className={tableHeaderClass}>Judge</th>
                <th className={tableHeaderClass}>Status</th>
                <th className={tableHeaderClass}>Phase</th>
                <th className={tableHeaderClass}>Filed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allCases.map((c) => (
                <tr
                  key={c.docketNumber}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => onCaseSelect(c.docketNumber)}
                >
                  <td className={`${tableCellClass} font-medium text-blue-700`}>{c.docketNumber}</td>
                  <td className={`${tableCellClass} text-slate-500`}>{c.type}</td>
                  <td className={`${tableCellClass} text-slate-800`}>{c.claimant}</td>
                  <td className={`${tableCellClass} text-slate-500`}>{c.judge}</td>
                  <td className={tableCellClass}><StatusBadge status={c.status} size="sm" /></td>
                  <td className={`${tableCellClass} text-slate-500`}>{c.phase}</td>
                  <td className={`${tableCellClass} text-slate-500`}>{c.filedDate}</td>
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
        <EmptyState
          icon={<FileCheck className="w-12 h-12" />}
          title="No case selected"
          description="Select a case from All Cases or click View on any filing to open the full case record"
        />
      </Card>
    </div>
  );
}
