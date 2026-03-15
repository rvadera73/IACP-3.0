import React from 'react';
import PageHeader from '../UI/PageHeader';
import StatCard from '../UI/StatCard';
import StatusBadge from '../UI/StatusBadge';
import EmptyState from '../UI/EmptyState';
import { Card } from '../UI';
import BenchMemoEditor from '../editors/BenchMemoEditor';
import DraftDecisionEditor from '../editors/DraftDecisionEditor';
import LegalResearchTools from '../editors/LegalResearchTools';
import { Briefcase, Eye } from 'lucide-react';

interface AttorneyAdvisorWorkspaceProps {
  activeView: string;
  onCaseSelect: (caseNumber: string) => void;
}

const tableHeaderClass = 'px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider';
const tableCellClass = 'px-4 py-3 text-sm';

const myCases = [
  { docketNumber: '2026-BLA-00130', type: 'BLA', claimant: 'Robert T. Johnson', judge: 'Hon. A. Martinez', status: 'Active', deadline: '2026-11-15' },
  { docketNumber: '2026-LHC-00125', type: 'LHC', claimant: 'Susan K. Adams', judge: 'Hon. J. Thompson', status: 'Pending Review', deadline: '2026-10-20' },
  { docketNumber: '2026-BLA-00138', type: 'BLA', claimant: 'Nancy E. Miller', judge: 'Hon. J. Thompson', status: 'Active', deadline: '2026-12-01' },
  { docketNumber: '2025-BLA-00891', type: 'BLA', claimant: 'William H. Carter', judge: 'Hon. S. Chen', status: 'Completed', deadline: '2026-06-14' },
  { docketNumber: '2026-LHC-00135', type: 'LHC', claimant: 'Daniel J. Moore', judge: 'Hon. J. Thompson', status: 'Active', deadline: '2026-11-25' },
  { docketNumber: '2026-BLA-00142', type: 'BLA', claimant: 'John A. Smith', judge: 'Hon. A. Martinez', status: 'Active', deadline: '2026-12-10' },
  { docketNumber: '2026-LHC-00143', type: 'LHC', claimant: 'Maria Garcia', judge: 'Hon. S. Chen', status: 'Pending Review', deadline: '2026-12-10' },
  { docketNumber: '2025-BLA-00870', type: 'BLA', claimant: 'Karen L. White', judge: 'Hon. S. Chen', status: 'Completed', deadline: '2026-05-20' },
];

export default function AttorneyAdvisorWorkspace({ activeView, onCaseSelect }: AttorneyAdvisorWorkspaceProps) {

  if (activeView === 'my-cases') {
    return (
      <div className="space-y-6">
        <PageHeader title="My Cases" subtitle="Cases assigned for bench memo and draft decision preparation" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Active Cases" value={8} accentColor="blue" icon={<Briefcase className="w-6 h-6" />} />
          <StatCard label="Pending Review" value={3} accentColor="amber" />
          <StatCard label="Completed" value={15} accentColor="green" />
        </div>
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className={tableHeaderClass}>Docket #</th>
                <th className={tableHeaderClass}>Type</th>
                <th className={tableHeaderClass}>Claimant</th>
                <th className={tableHeaderClass}>Judge</th>
                <th className={tableHeaderClass}>Status</th>
                <th className={tableHeaderClass}>Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myCases.map((c) => (
                <tr key={c.docketNumber} className="hover:bg-slate-50 cursor-pointer" onClick={() => onCaseSelect(c.docketNumber)}>
                  <td className={`${tableCellClass} font-medium text-blue-700`}>{c.docketNumber}</td>
                  <td className={`${tableCellClass} text-slate-500`}>{c.type}</td>
                  <td className={`${tableCellClass} text-slate-800`}>{c.claimant}</td>
                  <td className={`${tableCellClass} text-slate-500`}>{c.judge}</td>
                  <td className={tableCellClass}><StatusBadge status={c.status} size="sm" /></td>
                  <td className={`${tableCellClass} text-slate-500`}>{c.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    );
  }

  if (activeView === 'bench-memo') {
    return <BenchMemoEditor onCaseSelect={onCaseSelect} />;
  }

  if (activeView === 'draft-decision') {
    return <DraftDecisionEditor onCaseSelect={onCaseSelect} />;
  }

  if (activeView === 'research') {
    return <LegalResearchTools onInsertCitation={(c) => console.log('Insert citation:', c)} />;
  }

  // case-viewer
  return (
    <div className="space-y-6">
      <PageHeader title="Case Viewer" subtitle="Select a case to view its full record" />
      <Card className="p-8">
        <EmptyState icon={<Eye className="w-12 h-12" />} title="No case selected" description="Select a case from My Cases to view the full case record" />
      </Card>
    </div>
  );
}
