import React, { useState } from 'react';
import CasesTable from './CasesTable';
import Badge from './Badge';

interface AllCasesProps {
  onCaseClick?: (caseId: string) => void;
}

const AllCases: React.FC<AllCasesProps> = ({ onCaseClick }) => {
  const [programFilter, setProgramFilter] = useState('All Programs');
  const [phaseFilter, setPhaseFilter] = useState('All Phases');
  const [officeFilter, setOfficeFilter] = useState('All Offices');

  const cases = [
    {
      caseId: 'LCA-2024-00847',
      claimant: 'Patel v. Harbor Freight Inc.',
      subtitle: 'Longshore · New York DO',
      program: 'Longshore',
      programVariant: 'blue' as const,
      phase: 'Pre-Hearing',
      phaseVariant: 'amber' as const,
      judge: 'ALJ Thompson',
      filed: 'Mar 14, 2024',
      slaStatus: 'OK' as const,
      status: 'On Track',
      statusVariant: 'green' as const,
      onClick: () => onCaseClick?.('LCA-2024-00847'),
    },
    {
      caseId: 'BLA-2024-01204',
      claimant: 'Estate of R. Kowalski',
      subtitle: 'Black Lung · Pittsburgh DO',
      program: 'Black Lung',
      programVariant: 'gray' as const,
      phase: 'Intake',
      phaseVariant: 'blue' as const,
      judge: 'Unassigned',
      filed: 'Today',
      slaStatus: 'NEW' as const,
      status: 'Auto-Docketed',
      statusVariant: 'blue' as const,
    },
    {
      caseId: 'DBA-2024-00612',
      claimant: 'Chen v. Pacific Construction LLC',
      subtitle: 'DBA · Los Angeles DO',
      program: 'DBA',
      programVariant: 'amber' as const,
      phase: 'Decision',
      phaseVariant: 'purple' as const,
      judge: 'ALJ Rivera',
      filed: 'Jan 8, 2024',
      slaStatus: 'Overdue' as const,
      status: 'SLA Breach',
      statusVariant: 'red' as const,
    },
    {
      caseId: 'WB-2024-00743',
      claimant: 'Nguyen v. TechCorp Solutions',
      subtitle: 'Whistleblower · National Office',
      program: 'Whistleblower',
      programVariant: 'purple' as const,
      phase: 'Settled',
      phaseVariant: 'green' as const,
      judge: 'ALJ Chen',
      filed: 'Feb 22, 2024',
      slaStatus: 'OK' as const,
      status: 'Settlement',
      statusVariant: 'green' as const,
    },
    {
      caseId: 'LCA-2024-00901',
      claimant: 'Okafor v. Meridian Shipping Co.',
      subtitle: 'Longshore · Baltimore DO',
      program: 'Longshore',
      programVariant: 'blue' as const,
      phase: 'Post-Decision',
      phaseVariant: 'red' as const,
      judge: 'ALJ Park',
      filed: 'Nov 3, 2023',
      slaStatus: 'Warning' as const,
      status: 'Appeal Pending',
      statusVariant: 'amber' as const,
    },
    {
      caseId: 'PERM-2024-00334',
      claimant: 'DataSystems Inc. (Re: V. Patel)',
      subtitle: 'PERM · BALCA · National Office',
      program: 'PERM',
      programVariant: 'gray' as const,
      phase: 'Pre-Hearing',
      phaseVariant: 'amber' as const,
      judge: 'BALCA Panel',
      filed: 'Apr 2, 2024',
      slaStatus: 'OK' as const,
      status: 'On Track',
      statusVariant: 'green' as const,
    },
  ];

  return (
    <div className="screen" id="screen-cases">
      <div className="breadcrumb">OALJ CMS <span className="sep">›</span> <span>All Cases</span></div>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <select
          className="form-select"
          style={{ width: '160px' }}
          value={programFilter}
          onChange={(e) => setProgramFilter(e.target.value)}
        >
          <option>All Programs</option>
          <option>Longshore / DBA</option>
          <option>Black Lung</option>
          <option>PERM / Immigration</option>
          <option>Whistleblower</option>
        </select>
        <select
          className="form-select"
          style={{ width: '160px' }}
          value={phaseFilter}
          onChange={(e) => setPhaseFilter(e.target.value)}
        >
          <option>All Phases</option>
          <option>Intake</option>
          <option>Pre-Hearing</option>
          <option>Hearing</option>
          <option>Decision</option>
          <option>Post-Decision</option>
        </select>
        <select
          className="form-select"
          style={{ width: '160px' }}
          value={officeFilter}
          onChange={(e) => setOfficeFilter(e.target.value)}
        >
          <option>All Offices</option>
          <option>National Office</option>
          <option>New York</option>
          <option>Pittsburgh</option>
          <option>Washington DC</option>
        </select>
        <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }}>
          ⬇ Export
        </button>
      </div>

      <CasesTable cases={cases} />
    </div>
  );
};

export default AllCases;
